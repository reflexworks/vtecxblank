import vtecxapi from 'vtecxapi' 

const items = ['billing_yearmonth', 'integrated_shipper_code', 'shipper_code', 'order_code', 'tracking_number', 'shipping_date', 'shipping_status', 'billing_item', 'delivery_area', 'set_count', 'quantity', 'cache_on_delivery', 'delivery_charge_org', 'cod_fee', 'stamp_duty', 'tax_class','print_date','printer_id','shipper_company_name','shipper_zip','shipper_address1','shipper_address2','shipper_address3','shipper_department','person_in_charge','tel','shipping_company','shipping_zip','shipping_address1','shipping_address2','shipping_address3','shipping_department','shipping_person_in_charge','shipping_tel','remarks1','remarks2','remarks3','remarks4','article1','article2','article3','article4']
const header = ['請求年月','統合荷主コード','荷主コード','受注番号','問合せ番号','対象日付','貨物ステータス','請求項目','配送エリア','注文セット数','注文部数','代引き金額','請求金額','代引き手数料','印紙税','税込み区分','印刷日','印刷者ID','ご依頼主会社名','ご依頼主郵便番号','ご依頼主住所1','ご依頼主住所2','ご依頼主建物名','ご依頼主部署名','ご依頼主担当者名','ご依頼主電話番号','お届先会社名','お届先郵便番号','お届先住所1','お届先住所2','お届先建物名','お届先部署名','お届先担当者名','お届先電話番号','お届先備考1','お届先備考2','お届先備考3','お届先備考4','下段記事1','下段記事2','下段記事3','下段記事4']
const parent = 'billing'
const skip = 0
const encoding = 'UTF-8'

let shipment_class   		// 出荷(0)or集荷(1)、見つかった荷主コードによって
let customer_code   		// 見つかった荷主コードによって
let shipment_service = null
let shipment_service_code 

// CSV取得
const billingcsv = vtecxapi.getCsv(header, items, parent, skip, encoding)
const customer_all = vtecxapi.getFeed('/customer',true)

//vtecxapi.log('size='+size)
const result = { 'feed': { 'entry': [] } }

billingcsv.feed.entry.map((entry) => {

	try {
		const billing_data = getBillingData(entry)
		result.feed.entry.push(billing_data)

	} catch (e) {
		vtecxapi.sendMessage(400, e)
	}
})	

// datastoreを更新
vtecxapi.put(result,true)


function getBillingData(entry) {

	const prefecture = getPrefecture(entry.billing.shipping_address1)
	const charge_by_zone = getChargeByZone( prefecture,entry.billing.delivery_area, entry.billing.shipper_code,entry.billing.billing_item)

	const billing_data = {
		billing_data: {
			'shipment_service_code': shipment_service_code,
			'shipment_service_type': '1',		// 宅配便
			'customer_code': customer_code,
			'shipment_class': shipment_class,
			'shipper_code': entry.billing.shipper_code,
			'shipping_date': entry.billing.shipping_date.replace(/\//g,'-'),
			'tracking_number': entry.billing.tracking_number,
			'shipment_service_service_name': entry.billing.billing_item,
			'delivery_class': entry.billing.delivery_area,
			'size': '',
			'prefecture': prefecture,
			'zone_name': charge_by_zone[0].zone_name,
			'city': '',
			'delivery_charge_org_total': entry.billing.delivery_charge_org,
			'delivery_charge': charge_by_zone[0].price,	
			'quantity' : entry.billing.quantity
		},
		'link': [
			{ '___rel': 'self' , '___href': '/billing_data/' + entry.billing.shipping_date.replace(/\//g,'').slice(0,6)+shipment_service_code+'_'+entry.billing.tracking_number }
		]
	}

	return billing_data
}

function getChargeByZone(prefecture,delivery_area,shipper_code,shipment_service_service_name) {

	const delivery_charge_all = getDeliverycharge(customer_all, shipper_code,shipment_service_service_name)

	if (!shipment_service) {
		shipment_service = vtecxapi.getEntry('/shipment_service/' + shipment_service_code)
		if (!shipment_service.feed.entry) throw '配送業者マスタが登録されていません(サービスコード='+shipment_service_code+')'
	} 

	// shipment_service_codeからdelivery_chargeを取得
	const delivery_charge = delivery_charge_all.feed.entry[0].delivery_charge.filter((delivery_charge) => {
		return delivery_charge.shipment_service_code === shipment_service_code
	})
	//	vtecxapi.log('zone_name=' + zone[0].zone_name)			
	if (delivery_charge[0].delivery_charge_details.length === 0) throw '配送料マスタが登録されていません。(サービスコード='+shipment_service_code+')'

	// 県からzoneを検索
	const zone = shipment_service.feed.entry[0].zone.filter((zone) => {
		const pref_codes = zone.pref_codes.filter((pref_codes) => {
			return pref_codes.pref_code === prefecture
		})
		return pref_codes.length>0
	 })
	if (zone.length===0) throw prefecture+' の配送エリアが登録されていません。'

	// deliveryareaからzoneを検索
	const invoice_zones = zone[0].invoice_zones.filter((invoice_zones) => {
		return invoice_zones.invoice_zone === delivery_area
	})
	if (invoice_zones.length===0) throw delivery_area+' の配送エリアが登録されていません。'
	
	// zone_nameからcharge_by_zoneを取得
	const charge_by_zone = delivery_charge[0].delivery_charge_details[0].charge_by_zone.filter((charge_by_zone) => {
		return charge_by_zone.zone_name === zone[0].zone_name
	})
	if (charge_by_zone.length===0) throw zone[0].zone_name+' の配送料が登録されていません。'

	return charge_by_zone
	
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

function getPrefecture(addr) {
	if (addr.indexOf('北海道') >= 0) return '北海道'
	if (addr.indexOf('青森県') >= 0) return '青森県'
	if (addr.indexOf('岩手県') >= 0) return '岩手県'
	if (addr.indexOf('宮城県') >=0) return '宮城県'
	if (addr.indexOf('秋田県') >=0) return '秋田県'
	if (addr.indexOf('山形県') >=0) return '山形県'
	if (addr.indexOf('福島県') >=0) return '福島県'
	if (addr.indexOf('茨城県') >=0) return '茨城県'
	if (addr.indexOf('栃木県') >=0) return '栃木県'
	if (addr.indexOf('群馬県') >=0) return '群馬県'
	if (addr.indexOf('埼玉県') >=0) return '埼玉県'
	if (addr.indexOf('千葉県') >=0) return '千葉県'
	if (addr.indexOf('東京都') >=0) return '東京都'
	if (addr.indexOf('神奈川県') >=0) return '神奈川県'
	if (addr.indexOf('新潟県') >=0) return '新潟県'
	if (addr.indexOf('富山県') >=0) return '富山県'
	if (addr.indexOf('石川県') >=0) return '石川県'
	if (addr.indexOf('福井県') >=0) return '福井県'
	if (addr.indexOf('山梨県') >=0) return '山梨県'
	if (addr.indexOf('長野県') >=0) return '長野県'
	if (addr.indexOf('岐阜県') >=0) return '岐阜県'
	if (addr.indexOf('静岡県') >=0) return '静岡県'
	if (addr.indexOf('愛知県') >=0) return '愛知県'
	if (addr.indexOf('三重県') >=0) return '三重県'
	if (addr.indexOf('滋賀県') >=0) return '滋賀県'
	if (addr.indexOf('京都府') >=0) return '京都府'
	if (addr.indexOf('大阪府') >=0) return '大阪府'
	if (addr.indexOf('兵庫県') >=0) return '兵庫県'
	if (addr.indexOf('奈良県') >=0) return '奈良県'
	if (addr.indexOf('和歌山県') >=0) return '和歌山県'
	if (addr.indexOf('鳥取県') >=0) return '鳥取県'
	if (addr.indexOf('島根県') >=0) return '島根県'
	if (addr.indexOf('岡山県') >=0) return '岡山県'
	if (addr.indexOf('広島県') >=0) return '広島県'
	if (addr.indexOf('山口県') >=0) return '山口県'
	if (addr.indexOf('徳島県') >=0) return '徳島県'
	if (addr.indexOf('香川県') >=0) return '香川県'
	if (addr.indexOf('愛媛県') >=0) return '愛媛県'
	if (addr.indexOf('高知県') >=0) return '高知県'
	if (addr.indexOf('福岡県') >=0) return '福岡県'
	if (addr.indexOf('佐賀県') >=0) return '佐賀県'
	if (addr.indexOf('長崎県') >=0) return '長崎県'
	if (addr.indexOf('熊本県') >=0) return '熊本県'
	if (addr.indexOf('大分県') >=0) return '大分県'
	if (addr.indexOf('宮崎県') >=0) return '宮崎県'
	if (addr.indexOf('鹿児島県') >=0) return '鹿児島県'
	if (addr.indexOf('沖縄県') >=0) return '沖縄県'
	return '該当なし'
}