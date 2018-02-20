import vtecxapi from 'vtecxapi' 

const items = ['tensyo_code', 'customer_code', 'shipper_code', 'shipping_date', 'tracking_number', 'delivery_class1', 'delivery_class2', 'size', 'quantity', 'prefecture', 'city', 'delivery_charge_org_total', 'delivery_charge_org', 'advance_payment', 'insurance_fee', 'consumption_tax']
const header = ['店所コード','お客様コード','分類コード','受付日','原票No.','商品区分1','商品区分2','サイズ','個数','扱店都道府県','扱店市区町村','運賃合計','運賃','立替金','保険料','消費税']
const parent = 'billing'
const skip = 0
//const encoding = 'SJIS'
const encoding = 'UTF-8'

// CSV取得
const result = vtecxapi.getCsv(header, items, parent, skip, encoding)
//vtecxapi.log(JSON.stringify(result))

const shipment_class = '0'  // 出荷
const shipment_service_code = 'YH' // ヤマト運輸
//const shipment_service_type = 0 // 発払

const shipper_code = result.feed.entry[0].billing.shipper_code
const size = result.feed.entry[0].billing.size
const prefecture = result.feed.entry[0].billing.prefecture
const shipment_service = vtecxapi.getEntry('/shipment_service/YH')
const customer_all = vtecxapi.getFeed('/customer',true)

//vtecxapi.log('size='+size)

try {
	const charge_by_zone = getChargeByZone(shipment_service,shipment_service_code,size,prefecture,customer_all,shipper_code,shipment_class)
	vtecxapi.log(JSON.stringify(charge_by_zone))
} catch (e) {
	vtecxapi.sendError(400,e)
}

//vtecxapi.log('customer_code='+customer[0].customer.customer_code)

/*
 shipment_service_code
 shipment_service_type 
 shipment_service_service_name 
 shipment_class
 shipper_code
 shipping_date
 tracking_number
 delivery_class1
 delivery_class2
 size
 quantity
 prefecture
 city
 delivery_charge
 */

function getChargeByZone(shipment_service,shipment_service_code,size,prefecture,customer_all,shipper_code,shipment_class) {

	const delivery_charge_all = getDeliverycharge(customer_all,shipment_service_code, shipper_code, shipment_class)

	if (!delivery_charge_all) throw 'deliverycharge is not found.'
	// shipment_service_codeからdelivery_chargeを取得
	const delivery_charge = delivery_charge_all.feed.entry[0].delivery_charge.filter((delivery_charge) => {
		return delivery_charge.shipment_service_code === shipment_service_code
	})

	if (delivery_charge.length === 0) throw 'deliverycharge of '+shipment_service_code+' is not found.'
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

	if (zone.length===0) throw 'zone of '+prefecture+' is not defined.'
	//	vtecxapi.log('zone_name=' + zone[0].zone_name)			

	if (delivery_charge_details.length === 0) throw 'delivery_charge_details of '+size+' size is not found.'
	// zone_nameからcharge_by_zoneを取得
	const charge_by_zone = delivery_charge_details[0].charge_by_zone.filter((charge_by_zone) => {
		return charge_by_zone.zone_name === zone[0].zone_name
	})

	return charge_by_zone
	
}

function getDeliverycharge(customer_all,shipment_service_code,shipper_code,shipment_class) {
	// 荷主コード(分類コード)からcustomerを検索
	const customer = customer_all.feed.entry.filter((entry) => {
		if (entry.customer.shipper&&entry.customer.shipper.length>0) {
			const result1 = entry.customer.shipper.filter((shipper) => {
				if (shipper.shipment_service_code !== shipment_service_code) {
					return false
				}
				const result2 = shipper.shipper_info.filter((shipper_info) => { 
					if ((shipper_info.shipper_code === shipper_code)&&
					(shipper_info.shipment_class === shipment_class))
						return true				
				})
				return result2.length>0
			})
			return result1.length>0
		}
	})
	if (customer.length===0) throw 'customer code of shipper_code "'+shipper_code+'" is not found.'
	return vtecxapi.getEntry('/customer/' + customer[0].customer.customer_code + '/deliverycharge')	
}
