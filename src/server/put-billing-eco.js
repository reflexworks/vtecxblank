import vtecxapi from 'vtecxapi' 
import {getShipmentServiceCode,getDeliverycharge,getChargeByZone,getPrefecture,getFullDate,getKey } from './put-billing'

const items = ['billing_yearmonth', 'integrated_shipper_code', 'shipper_code', 'order_code', 'tracking_number', 'shipping_date', 'shipping_status', 'billing_item', 'delivery_area', 'set_count', 'quantity', 'cache_on_delivery', 'delivery_charge_org', 'cod_fee', 'stamp_duty', 'tax_class','print_date','printer_id','shipper_company_name','shipper_zip','shipper_address1','shipper_address2','shipper_address3','shipper_department','person_in_charge','tel','shipping_company','shipping_zip','shipping_address1','shipping_address2','shipping_address3','shipping_department','shipping_person_in_charge','shipping_tel','remarks1','remarks2','remarks3','remarks4','article1','article2','article3','article4']
const header = ['請求年月','統合荷主コード','荷主コード','受注番号','問合せ番号','対象日付','貨物ステータス','請求項目','配送エリア','注文セット数','注文部数','代引き金額','請求金額','代引き手数料','印紙税','税込み区分','印刷日','印刷者ID','ご依頼主会社名','ご依頼主郵便番号','ご依頼主住所1','ご依頼主住所2','ご依頼主建物名','ご依頼主部署名','ご依頼主担当者名','ご依頼主電話番号','お届先会社名','お届先郵便番号','お届先住所1','お届先住所2','お届先建物名','お届先部署名','お届先担当者名','お届先電話番号','お届先備考1','お届先備考2','お届先備考3','お届先備考4','下段記事1','下段記事2','下段記事3','下段記事4']
const parent = 'billing'
const skip = 0
const encoding = 'Windows-31J'

// CSV取得
const billingcsv = vtecxapi.getCsv(header, items, parent, skip, encoding)
const customer_all = vtecxapi.getFeed('/customer',true)

const result = { 'feed': { 'entry': [] } }

billingcsv.feed.entry.map((entry) => {

	try {
		const billing_data = getBillingData(entry)
		result.feed.entry.push(billing_data)

	} catch (e) {
		vtecxapi.sendMessage(400, e)
	}
})
if (result.feed.entry.length > 0) {
	// datastoreを更新
	vtecxapi.put(result,true)	
} else {
	vtecxapi.sendMessage(400, '更新データはありませんでした')	
}

function getBillingData(entry) {

	const prefecture = getPrefecture(entry.billing.shipping_address1)
	const delivery_charge_all = getDeliverycharge(customer_all, entry.billing.shipper_code, entry.billing.billing_item)
	const shipment_service_code = getShipmentServiceCode(entry.billing.billing_item)
	delivery_charge_all.shipment_service_code = shipment_service_code
	const charge_by_zone = getChargeByZone( delivery_charge_all,customer_all,'',prefecture,entry.billing.billing_item,entry.billing.delivery_area)
	const tracking_number = entry.billing.tracking_number.replace(/[^0-9^\\.]/g,'')
	if (!tracking_number||tracking_number.length===0) throw '正しい原票番号を入れてください'
	const unit_price = charge_by_zone[0].price.replace(/[^0-9^\\.]/g,'')
	if (!unit_price||unit_price.length === 0) {
		throw '配送料マスタが登録されていません。(顧客コード=' + delivery_charge_all.customer_code + ',サービスコード=' + shipment_service_code + ')'
	}

	const billing_data = {
		billing_data: {
			'shipment_service_code': shipment_service_code,
			'shipment_service_type': '1',		// 宅配便
			'customer_code': delivery_charge_all.customer_code,
			'shipment_class': delivery_charge_all.shipment_class,
			'shipper_code': entry.billing.shipper_code,
			'shipping_date': getFullDate(entry.billing.shipping_date),
			'tracking_number': tracking_number,
			'shipment_service_service_name': entry.billing.billing_item,
			'delivery_class': entry.billing.delivery_area,
			'size': '80',
			'prefecture': prefecture,
			'zone_name': charge_by_zone[0].zone_name,
			'city': '',
			'delivery_charge_org_total': entry.billing.delivery_charge_org,
			'delivery_charge': ''+Number(unit_price)*Number(entry.billing.quantity),
			'quantity': entry.billing.quantity,
			'unit_price': unit_price
		},
		'link': [
			{ '___rel': 'self' , '___href': '/billing_data/' + getKey(delivery_charge_all.customer_code,entry.billing.shipping_date, shipment_service_code,delivery_charge_all.shipment_class,tracking_number) }
		]

	}

	return billing_data
}
