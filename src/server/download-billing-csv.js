import vtecxapi from 'vtecxapi' 
import { getBillingdata } from './get-billingdata'

const body = []
const header = ['顧客コード','配送サービス名', '集荷出荷区分', '出荷日', '原票番号','サイズ','地域帯名','取扱県','個数','単価','配送料']

const shipping_yearmonth = vtecxapi.getQueryString('shipping_yearmonth')  //201801
const billto_code = vtecxapi.getQueryString('billto_code')  // 0000124
const delivery_company = vtecxapi.getQueryString('delivery_company')  //YH or ECO

body.push(header)

const customer = vtecxapi.getFeed('/customer/?billto.billto_code=' + billto_code)
const customer_code = customer.feed.entry.map((entry) => { return entry.customer.customer_code})

customer_code.map((customer_code) => { 

	let billing_data = null
	if (delivery_company === 'YH') {		
		billing_data = getBillingdata(shipping_yearmonth, customer_code, 'YH1', '0', billto_code).billing_data	
		let billing_data1 = getBillingdata(shipping_yearmonth, customer_code, 'YH1', '1', billto_code).billing_data			
		if (billing_data1) {
			if (billing_data) {
				billing_data.feed.entry = billing_data.feed.entry.concat(billing_data1.feed.entry) 	
			} else {
				billing_data = billing_data1			
			}
		}
		billing_data1 = getBillingdata(shipping_yearmonth, customer_code, 'YH2', '0', billto_code).billing_data
		if (billing_data1) {
			if (billing_data) {
				billing_data.feed.entry = billing_data.feed.entry.concat(billing_data1.feed.entry)
			} else {
				billing_data = billing_data1
			}	
		}
		billing_data1 = getBillingdata(shipping_yearmonth, customer_code, 'YH2', '1', billto_code).billing_data
		if (billing_data1) {
			if (billing_data) {
				billing_data.feed.entry = billing_data.feed.entry.concat(billing_data1.feed.entry)
			} else {
				billing_data = billing_data1
			}	
		}
		billing_data1 = getBillingdata(shipping_yearmonth, customer_code, 'YH3', '0', billto_code).billing_data
		if (billing_data1) {
			if (billing_data) {
				billing_data.feed.entry = billing_data.feed.entry.concat(billing_data1.feed.entry)
			} else {
				billing_data = billing_data1
			}	
		}
		billing_data1 = getBillingdata(shipping_yearmonth, customer_code, 'YH3', '1', billto_code).billing_data
		if (billing_data1) {
			if (billing_data) {
				billing_data.feed.entry = billing_data.feed.entry.concat(billing_data1.feed.entry)
			} else {
				billing_data = billing_data1
			}	
		}
	}
	if (delivery_company === 'ECO') {
		billing_data = getBillingdata(shipping_yearmonth, customer_code, 'ECO1', '0', billto_code).billing_data	
		let billing_data1 = getBillingdata(shipping_yearmonth, customer_code, 'ECO2', '0',billto_code).billing_data	
		if (billing_data1) {
			if (billing_data) {
				billing_data.feed.entry = billing_data.feed.entry.concat(billing_data1.feed.entry)
			} else {
				billing_data = billing_data1
			}	
		}
		billing_data1 = getBillingdata(shipping_yearmonth, customer_code, 'ECO1', '1',billto_code).billing_data	
		if (billing_data1) {
			if (billing_data) {
				billing_data.feed.entry = billing_data.feed.entry.concat(billing_data1.feed.entry)
			} else {
				billing_data = billing_data1
			}	
		}
		billing_data1 = getBillingdata(shipping_yearmonth, customer_code, 'ECO2', '1',billto_code).billing_data	
		if (billing_data1) {
			if (billing_data) {
				billing_data.feed.entry = billing_data.feed.entry.concat(billing_data1.feed.entry)
			} else {
				billing_data = billing_data1
			}	
		}
	}
	if (billing_data) {
		billing_data.feed.entry.map((entry) => {
			if (entry && entry.billing_data&&entry.billing_data.shipment_class) {	// 登録時に不具合によりnullで登録されることがある
				const shipment_class = entry.billing_data.shipment_class === '0' ? '出荷' : '集荷'
				const record = ['"' + entry.billing_data.customer_code + '"', entry.billing_data.shipment_service_service_name, shipment_class, entry.billing_data.shipping_date, entry.billing_data.tracking_number, entry.billing_data.size, entry.billing_data.zone_name, entry.billing_data.prefecture, entry.billing_data.quantity, entry.billing_data.unit_price, entry.billing_data.delivery_charge]
				body.push(record)
			}	
		}
		)		
	}
})

vtecxapi.doResponseCsv(body,'billing_'+billto_code+'_'+delivery_company+'_'+shipping_yearmonth+'.csv')
