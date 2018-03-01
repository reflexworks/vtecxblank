import vtecxapi from 'vtecxapi' 

const items = ['tensyo_code', 'customer_code', 'shipper_code', 'shipping_date', 'tracking_number', 'delivery_class1', 'delivery_class2', 'size', 'quantity', 'prefecture', 'city', 'delivery_charge_org_total', 'delivery_charge_org', 'advance_payment', 'insurance_fee', 'consumption_tax']
const header = ['店所コード','お客様コード','分類コード','受付日','原票No.','商品区分1','商品区分2','サイズ','個数','扱店都道府県','扱店市区町村','運賃合計','運賃','立替金','保険料','消費税']
const parent = 'billing'
const skip = 0
const encoding = 'UTF-8'

// CSV取得
const billingcsv = vtecxapi.getCsv(header, items, parent, skip, encoding)
//vtecxapi.log(JSON.stringify(result))

let shipment_class   		// 出荷(0)or集荷(1)、見つかった荷主コードによって
let customer_code   		// 見つかった荷主コードによって
let shipment_service = null
let shipment_service_code   // 見つかった荷主コードによって
const customer_all = vtecxapi.getFeed('/customer',true)

//vtecxapi.log('size='+size)
const result = { 'feed': { 'entry': [] } }

billingcsv.feed.entry.map((entry) => {

	try {
		let billing_data
		if (entry.billing.delivery_class1 === '宅急便発払') {
			billing_data = getBillingDataOfHatsu(entry,entry.billing.delivery_class1)			
		} else if (entry.billing.delivery_class1 === 'クロネコＤＭ便'){
			billing_data = getBillingDataOfMail(entry,entry.billing.delivery_class1)	// DM便
		} else if (entry.billing.delivery_class1 === 'ネコポス') {
			billing_data = getBillingDataOfMail(entry,entry.billing.delivery_class1)	// ネコポス
		}
		result.feed.entry.push(billing_data)

	} catch (e) {
		vtecxapi.sendMessage(400, e)
	}

})	

// datastoreを更新
vtecxapi.put(result,true)

function getBillingDataOfHatsu(entry,shipment_service_service_name) {

	const charge_by_zone = getChargeByZone( entry.billing.size, entry.billing.prefecture, entry.billing.shipper_code,shipment_service_service_name)
	const tracking_number = entry.billing.tracking_number.replace(/-/g,'')

	const billing_data = {
		billing_data: {
			'shipment_service_code': shipment_service_code,
			'shipment_service_type': '1',					// 宅配便
			'customer_code': customer_code,
			'shipment_class': shipment_class,
			'shipper_code': entry.billing.shipper_code,
			'shipping_date': getFullDate(entry.billing.shipping_date),
			'tracking_number': tracking_number,
			'shipment_service_service_name': entry.billing.delivery_class1,
			'delivery_class': entry.billing.delivery_class2,
			'size': entry.billing.size,
			'prefecture': entry.billing.prefecture,
			'zone_name': charge_by_zone[0].zone_name,
			'city': entry.billing.city,
			'delivery_charge_org_total': entry.billing.delivery_charge_org_total,
			'delivery_charge': charge_by_zone[0].price,
			'quantity' : entry.billing.quantity
		},
		'link': [
			{ '___rel': 'self' , '___href': '/billing_data/' + getKey(entry.billing.shipping_date, tracking_number) }
		]
	}

	return billing_data
}

function getBillingDataOfMail(entry,shipment_service_service_name) {

	getDeliverycharge(customer_all, entry.billing.shipper_code,shipment_service_service_name)
	const tracking_number = entry.billing.tracking_number.replace(/-/g,'')

	const billing_data = {
		billing_data: {
			'shipment_service_code': shipment_service_code,
			'shipment_service_type': '2',		// メール便
			'customer_code': customer_code,
			'shipment_class': shipment_class,
			'shipper_code': entry.billing.shipper_code,
			'shipping_date': getFullDate(entry.billing.shipping_date),
			'tracking_number': tracking_number,
			'shipment_service_service_name': entry.billing.delivery_class1,
			'delivery_class': entry.billing.delivery_class2,
			'size': '',
			'prefecture': '',
			'zone_name': '',
			'city': '',
			'delivery_charge_org_total': entry.billing.delivery_charge_org_total,
			'delivery_charge': getChargeOfMail(entry.billing.shipper_code,shipment_service_code),	// YM1 is DM便
			'quantity' : entry.billing.quantity
		},
		'link': [
			{ '___rel': 'self' , '___href': '/billing_data/' + getKey(entry.billing.shipping_date, ('00'+tracking_number).slice(-12)) }
		]
	}

	return billing_data
}


function getChargeByZone(size,prefecture,shipper_code,shipment_service_service_name) {

	const delivery_charge_all = getDeliverycharge(customer_all, shipper_code,shipment_service_service_name)

	if (!shipment_service) {
		shipment_service = vtecxapi.getEntry('/shipment_service/' + shipment_service_code)
		if (!shipment_service.feed.entry) throw '配送業者マスタが登録されていません(サービスコード='+shipment_service_code+')'
	} 

	// shipment_service_codeからdelivery_chargeを取得
	const delivery_charge = delivery_charge_all.feed.entry[0].delivery_charge.filter((delivery_charge) => {
		return delivery_charge.shipment_service_code === shipment_service_code
	})

	if (delivery_charge.length === 0) throw '配送料マスタが登録されていません。(サービスコード='+shipment_service_code+')'
	// sizeからdelivery_charge_detailsを取得
	const delivery_charge_details = delivery_charge[0].delivery_charge_details.filter((delivery_charge_details) => {
		return delivery_charge_details.size.match(/\d+/)[0] === size
	})

	// 県からzoneを検索
	const zone = shipment_service.feed.entry[0].zone.filter((zone) => {
		const invoice_zones = zone.invoice_zones.filter((invoice_zones) => {
			return invoice_zones.invoice_zone === prefecture
		})
		return invoice_zones.length>0
	 })

	if (zone.length===0) throw prefecture+' の配送エリアが登録されていません。'
	//	vtecxapi.log('zone_name=' + zone[0].zone_name)			

	if (delivery_charge_details.length === 0) throw size+' サイズの配送料が登録されていません。'
	// zone_nameからcharge_by_zoneを取得
	const charge_by_zone = delivery_charge_details[0].charge_by_zone.filter((charge_by_zone) => {
		return charge_by_zone.zone_name === zone[0].zone_name
	})
	if (charge_by_zone.length===0) throw zone[0].zone_name+' の配送料が登録されていません。'

	return charge_by_zone
}

function getChargeOfMail(shipper_code,shipment_service_code,shipment_service_service_name) {

	const delivery_charge_all = getDeliverycharge(customer_all, shipper_code,shipment_service_service_name)

	// shipment_service_codeからdelivery_chargeを取得
	const delivery_charge = delivery_charge_all.feed.entry[0].delivery_charge.filter((delivery_charge) => {
		return delivery_charge.shipment_service_code === shipment_service_code
	})

	if (delivery_charge.length === 0) throw '配送料マスタが登録されていません。(サービスコード='+shipment_service_code+')'

	return delivery_charge[0].delivery_charge_details[0].price
	
}


function getDeliverycharge(customer_all, shipper_code,shipment_service_service_name) {
	// 荷主コード(分類コード)からcustomerを検索
	const customer = customer_all.feed.entry.filter((entry) => {
		if (entry.customer.shipper&&entry.customer.shipper.length>0) {
			const result1 = entry.customer.shipper.filter((shipper) => {
				if (shipper.shipment_service_service_name ===shipment_service_service_name) {
					shipment_service_code = shipper.shipment_service_code
				}
				const result2 = shipper.shipper_info.filter((shipper_info) => { 
					if (shipper_info.shipper_code === shipper_code)
					{
						shipment_class = shipper_info.shipment_class // グローバル変数にセット
						return true				
					}	
				})
				return result2.length>0
			})
			return result1.length>0
		}
	})
	if (customer.length === 0) throw '顧客マスタが登録されていません。(荷主コード=' + shipper_code + ')'
	customer_code = customer[0].customer.customer_code
	const deliverycharge = vtecxapi.getEntry('/customer/' + customer[0].customer.customer_code + '/deliverycharge')	
	if (!deliverycharge.feed.entry) throw '配送料マスタが登録されていません。(顧客コード=' + customer[0].customer.customer_code +')'
	return deliverycharge
}

function getFullDate(datestr) {
	const matches = /^(\d+)月(\d+)日$/.exec(datestr)
	const now = new Date()
	const month = parseInt(matches[1])
	const day = parseInt(matches[2])
	let year = now.getFullYear()

	if (now.getMonth()+1 < month ) {
		year = year - 1
	}
	return year+'-'+month+'-'+day

}

function getKey(datestr, tracking_number) {

	const matches = /^(\d+)月(\d+)日$/.exec(datestr)
	const now = new Date()
	const month = parseInt(matches[1])
	let year = now.getFullYear()

	if (now.getMonth() + 1 < month) {
		year = year - 1
	}
	return year + ('0' + month).slice(-2) + customer_code+'_'+shipment_service_code+'_'+tracking_number
}