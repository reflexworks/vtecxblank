import vtecxapi from 'vtecxapi' 
import {getChargeByZone,getDeliverycharge,getFullDate,getKey,getChargeOfMail } from './put-billing'

const items = ['tensyo_code', 'customer_code', 'shipper_code', 'shipping_date', 'tracking_number', 'delivery_class1', 'delivery_class2', 'size', 'quantity', 'prefecture', 'city', 'delivery_charge_org_total', 'delivery_charge_org', 'advance_payment', 'insurance_fee', 'consumption_tax']
const header = ['店所コード','お客様コード','分類コード','受付日','原票No.','商品区分1','商品区分2','サイズ','個数','扱店都道府県','扱店市区町村','運賃合計','運賃','立替金','保険料','消費税']
const parent = 'billing'
const skip = 0
const encoding = 'UTF-8'

// CSV取得
const billingcsv = vtecxapi.getCsv(header, items, parent, skip, encoding)
//vtecxapi.log(JSON.stringify(result))


const customer_all = vtecxapi.getFeed('/customer',true)
const result = { 'feed': { 'entry': [] } }

billingcsv.feed.entry.map((entry) => {

	try {
		let billing_data
		if (entry.billing.delivery_class1 === '宅急便発払') {
			billing_data = getBillingDataOfHatsu(entry,entry.billing.delivery_class1)			
			result.feed.entry.push(billing_data)
		} else if (entry.billing.delivery_class1 === 'クロネコＤＭ便'){
			billing_data = getBillingDataOfMail(entry,entry.billing.delivery_class1)	// DM便
			result.feed.entry.push(billing_data)
		} else if (entry.billing.delivery_class1 === 'ネコポス') {
			billing_data = getBillingDataOfMail(entry,entry.billing.delivery_class1)	// ネコポス
			result.feed.entry.push(billing_data)
		}

	} catch (e) {
		vtecxapi.sendMessage(400, e)
	}
	
})


// datastoreを更新
vtecxapi.put(result,true)

function getBillingDataOfHatsu(entry,shipment_service_service_name) {

	const delivery_charge_all = getDeliverycharge(customer_all, entry.billing.shipper_code, shipment_service_service_name)
	const charge_by_zone = getChargeByZone(delivery_charge_all, customer_all, entry.billing.size, entry.billing.prefecture, shipment_service_service_name)
	const tracking_number = entry.billing.tracking_number.replace(/-/g,'')

	const billing_data = {
		billing_data: {
			'shipment_service_code': delivery_charge_all.shipment_service_code,
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
			'delivery_charge': charge_by_zone[0].price,
			'quantity' : entry.billing.quantity
		},
		'link': [
			{ '___rel': 'self' , '___href': '/billing_data/' + getKey(delivery_charge_all.customer_code,entry.billing.shipping_date, delivery_charge_all.shipment_service_code,tracking_number) }
		]
	}
	return billing_data
}

function getBillingDataOfMail(entry,shipment_service_service_name) {

	const delivery_charge_all = getDeliverycharge(customer_all, entry.billing.shipper_code,shipment_service_service_name)
	const tracking_number = entry.billing.tracking_number.replace(/-/g, '')

	const billing_data = {
		billing_data: {
			'shipment_service_code': delivery_charge_all.shipment_service_code,
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
			'delivery_charge': getChargeOfMail(delivery_charge_all,customer_all,entry.billing.shipper_code,delivery_charge_all.shipment_service_code),	// YM1 is DM便
			'quantity' : entry.billing.quantity
		},
		'link': [
			{ '___rel': 'self' , '___href': '/billing_data/' + getKey(delivery_charge_all.customer_code,entry.billing.shipping_date, delivery_charge_all.shipment_service_code,('00'+tracking_number).slice(-12)) }
		]
	}
	return billing_data
}