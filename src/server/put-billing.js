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

const shipment_class = '0'  // 出荷
const delivery_company_code = 'YM' // ヤマト運輸
//const shipment_service_type = 0 // 発払
//const shipment_service_code = 'YH' // customerのshipment_service_codeは[YM]か[EC]固定

const customer_all = vtecxapi.getFeed('/customer',true)

const shipper_code = result.feed.entry[0].billing.shipper_code

// 荷主コード(分類コード)からcustomerを検索
let customer = customer_all.feed.entry.filter((entry) => {
	if (entry.customer.shipper&&entry.customer.shipper.length>0) {
		const result1 = entry.customer.shipper.filter((shipper) => {
			if (shipper.delivery_company_code !== delivery_company_code) {
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

vtecxapi.log('len='+JSON.stringify(customer))

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


