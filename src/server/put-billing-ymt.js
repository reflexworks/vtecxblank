import vtecxapi from 'vtecxapi' 
import {getShipmentServiceCode,getChargeByZone,getDeliverycharge,getFullDate,getKey,getChargeOfMail } from './put-billing'

const items = ['tensyo_code', 'customer_code', 'shipper_code', 'shipping_date', 'tracking_number', 'delivery_class1', 'delivery_class2', 'size', 'quantity', 'prefecture', 'city', 'delivery_charge_org_total', 'delivery_charge_org', 'advance_payment', 'insurance_fee', 'consumption_tax']
const header = ['店所コード','お客様コード','分類コード','受付日','原票No.','商品区分1','商品区分2','サイズ','個数','扱店都道府県','扱店市区町村','運賃合計','運賃','立替金','保険料','消費税']
const parent = 'billing'
const skip = 0
const encoding = 'Windows-31J'
// CSV取得
const billingcsv = vtecxapi.getCsv(header, items, parent, skip, encoding)
//vtecxapi.log(JSON.stringify(result))
const customer_all = vtecxapi.getFeed('/customer',true)
const result = { 'feed': { 'entry': [] } }
const error = []

for (let j = 0; j < billingcsv.feed.entry.length; j++) {

	try {
		let billing_data
		const entry = billingcsv.feed.entry[j]
		if (entry.billing.delivery_class1 === '宅急便発払') {
			billing_data = getBillingDataOfHatsu(entry,entry.billing.delivery_class1)			
			result.feed.entry.push(billing_data)
		} else if (entry.billing.delivery_class1 === 'クロネコＤＭ便') {
			billing_data = getBillingDataOfMail(entry,entry.billing.delivery_class1)	// DM便
			result.feed.entry.push(billing_data)
		} else if (entry.billing.delivery_class1 === 'ネコポス') {
			billing_data = getBillingDataOfMail(entry,entry.billing.delivery_class1)	// ネコポス
			result.feed.entry.push(billing_data)
		}

	} catch (e) {
		error.push(e)
		if (error.length>19) break
	}

}

if (error.length > 0) {
	vtecxapi.sendMessage(400, error.join('\n'))
} else {
	if (result.feed.entry.length > 0) {
		// datastoreを更新
		vtecxapi.put(result,true,true,true)	
	} else {
		vtecxapi.sendMessage(400, '更新データはありませんでした')	
	}	
}


function getBillingDataOfHatsu(entry,shipment_service_service_name) {
	let delivery_charge_all = getDeliverycharge(customer_all, entry.billing.shipper_code, shipment_service_service_name)
	const shipment_service_code = getShipmentServiceCode(shipment_service_service_name)
	delivery_charge_all.shipment_service_code = shipment_service_code
	const charge_by_zone = getChargeByZone(delivery_charge_all, customer_all, entry.billing.size, entry.billing.prefecture, shipment_service_service_name)
	const tracking_number = entry.billing.tracking_number.replace(/[^0-9^\\.]/g,'')
	if (!tracking_number || tracking_number.length === 0) throw '正しい原票番号を入れてください'
	const unit_price = charge_by_zone[0].price.replace(/[^0-9^\\.]/g,'')
	if (!unit_price||unit_price.length === 0) {
		throw '配送料マスタが登録されていません。(顧客コード=' + delivery_charge_all.customer_code + ',サービスコード=' + shipment_service_code + ')'
	}

	const billing_data = {
		billing_data: {
			'shipment_service_code': shipment_service_code,
			'shipment_service_type': '1',					// 宅配便
			'customer_code': delivery_charge_all.customer_code,
			'shipment_class': delivery_charge_all.shipment_class,
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
			'delivery_charge': ''+Number(unit_price)*Number(entry.billing.quantity),
			'quantity' : entry.billing.quantity,
			'unit_price': unit_price
		},
		'link': [
			{ '___rel': 'self' , '___href': '/billing_data/' + getKey(delivery_charge_all.customer_code,entry.billing.shipping_date, shipment_service_code,delivery_charge_all.shipment_class,tracking_number) }
		]
	}
	return billing_data
}

function getBillingDataOfMail(entry,shipment_service_service_name) {

	const delivery_charge_all = getDeliverycharge(customer_all, entry.billing.shipper_code,shipment_service_service_name)
	const tracking_number = entry.billing.tracking_number.replace(/[^0-9^\\.]/g, '')
	if (!tracking_number||tracking_number.length===0) throw '正しい原票番号を入れてください'
	const shipment_service_code = getShipmentServiceCode(shipment_service_service_name)
	const unit_price = getChargeOfMail(delivery_charge_all,customer_all,entry.billing.shipper_code,shipment_service_code)	// YM1 is DM便
	const billing_data = {
		billing_data: {
			'shipment_service_code': shipment_service_code,
			'shipment_service_type': '2',		// メール便
			'customer_code': delivery_charge_all.customer_code,
			'shipment_class': delivery_charge_all.shipment_class,
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
			'delivery_charge': ''+Number(unit_price)*Number(entry.billing.quantity),
			'quantity': entry.billing.quantity,
			'unit_price': unit_price
		},
		'link': [
			{ '___rel': 'self' , '___href': '/billing_data/' + getKey(delivery_charge_all.customer_code,entry.billing.shipping_date, shipment_service_code,delivery_charge_all.shipment_class,('00'+tracking_number).slice(-12)) }
		]
	}
	return billing_data
}
