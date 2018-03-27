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

	let billing_data = getBillingdata(shipping_yearmonth, customer_code, delivery_company, billto_code)	
	if (billing_data.billing_data.feed.entry) {
		billing_data.billing_data.feed.entry.map((entry) => {
			if (entry) {	// 登録時に不具合によりnullで登録されることがある
				const shipment_class = entry.billing_data.shipment_class === '0' ? '出荷' : '集荷'
				const record = ['"' + entry.billing_data.customer_code + '"', entry.billing_data.shipment_service_service_name, shipment_class, entry.billing_data.shipping_date, entry.billing_data.tracking_number, entry.billing_data.size, entry.billing_data.zone_name, entry.billing_data.prefecture, entry.billing_data.quantity, entry.billing_data.unit_price, entry.billing_data.delivery_charge]
				body.push(record)
			}	
		}
		)
	}
})

vtecxapi.doResponseCsv(body,'billing_'+billto_code+'_'+delivery_company+'_'+shipping_yearmonth+'.csv')
