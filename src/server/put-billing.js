import vtecxapi from 'vtecxapi' 

const items = ['tensyo_code', 'customer_code', 'shipper_code', 'shipping_date', 'tracking_number', 'delivery_class1', 'delivery_class2', 'size', 'quantity', 'prefecture', 'city', 'delivery_charge_org_total', 'delivery_charge_org', 'advance_payment', 'insurance_fee', 'consumption_tax']
const header = ['店所コード','お客様コード','分類コード','受付日','原票No.','商品区分1','商品区分2','サイズ','個数','扱店都道府県','扱店市区町村','運賃合計','運賃','立替金','保険料','消費税']
const parent = 'billing'
const skip = 0
//const encoding = 'SJIS'
const encoding = 'UTF-8'

// CSV取得
const result = vtecxapi.getCsv(header, items, parent, skip, encoding)
vtecxapi.log(JSON.stringify(result))

//const shipment_class = '0'  // 出荷
//const shipment_service_code = 'YH' // ヤマト発払
//const shipment_service_type = 0 // 発払
//const shipment_service_code_customer = 'YM' // customerのshipment_service_codeは[YM]か[EC]固定

//const customer_all = vtecxapi.getFeed('/customer',true)

/*
const customer = customer_all.feed.entry.filter((entry) => {
	return entry.customer.shipper ? {
		if(entry.customer.customer_code === '0000001') {
			entry.customer.shipper.filter((shipper) => {
			}
		}
	} : false

/*
	return entry.customer.shipper ? entry.customer.shipper.filter((shipper) => {
		vtecxapi.log('len='+customer.length)		
		return (shipper.shipment_service_code === shipment_service_code_customer)
		//		&& (shipper.shipper_info.shipment_class == '0')
		//		&& (shipper.shipper_info.shipper_code===result.billing[0].shipper_code)	
		// && (shipper.shipper_info.shipper_code==='200')	
	}).length>0 : false
*/

//vtecxapi.log('len='+customer.length)

/*

	entry.customer.shipper.filter((shipper) => {
		(shipper.shipment_service_code === shipment_service_code_customer)
			&& (shipper.shipper_info.shipment_class === shipment_class)
			&& (shipper.shipper_info.shipper_code===result.billing.shipper_code)	
	})

*/

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

/*
let reqdata = {
	'feed': {
		'entry': []
	}
}

result.feed.entry.map( csventry => {
	reqdata.feed.entry.push(entry)
})
vtecxapi.put(reqdata)
*/


