import vtecxapi from 'vtecxapi' 

const body = []
const header = ['顧客コード','配送サービス名', '集荷出荷区分', '出荷日', '原票番号','サイズ','地域帯名','取扱県','個数','配送料']

const shipping_yearmonth = vtecxapi.getQueryString('shipping_yearmonth')  //201801
const billto_code = vtecxapi.getQueryString('billto_code')  // 0000124
const delivery_company = vtecxapi.getQueryString('delivery_company')  //YH or ECO

body.push(header)
const billto = vtecxapi.getEntry('/billto/' + billto_code)

let billing_closing_date = 0
if ((billto.feed.entry)&&billto.feed.entry[0].billto.billing_closing_date) {
	billing_closing_date = billto.feed.entry[0].billto.billing_closing_date
}

const customer = vtecxapi.getFeed('/customer/?billto.billto_code=' + billto_code)
const customer_code = customer.feed.entry.map((entry) => { return entry.customer.customer_code})

customer_code.map((customer_code) => { 

	let billing_data = vtecxapi.getFeed('/billing_data/' + shipping_yearmonth + customer_code + '_'+delivery_company+'*',true)
	if (billing_data.feed.entry) {
		if (billing_closing_date === '1') {
			const lastyearmonth = getLastMonth(shipping_yearmonth)
			const billing_data_prev = vtecxapi.getFeed('/billing_data/' + lastyearmonth + customer_code + '_' + delivery_company + '*', true)
			const d0 = new Date(lastyearmonth.slice(0,4),parseInt(lastyearmonth.slice(-2))-1,'21').getTime()
			const d1 = new Date(shipping_yearmonth.slice(0,4),parseInt(shipping_yearmonth.slice(-2))-1,'20').getTime()
			billing_data.feed.entry = billing_data_prev.feed.entry ? billing_data_prev.feed.entry.concat(billing_data.feed.entry) : billing_data.feed.entry        
				.filter((entry) => {
					if (entry) {
						const d2 = new Date(entry.billing_data.shipping_date).getTime()
						return ((d2>=d0)&&(d2<=d1)) 
					}
				})
		}

		billing_data.feed.entry.map((entry) => {
			const shipment_class = entry.billing_data.shipment_class==='0' ? '出荷' : '集荷' 
			const record = ['"'+entry.billing_data.customer_code+'"', entry.billing_data.shipment_service_service_name, shipment_class,entry.billing_data.shipping_date,entry.billing_data.tracking_number,entry.billing_data.size,entry.billing_data.zone_name,entry.billing_data.prefecture,entry.billing_data.quantity,entry.billing_data.delivery_charge]
			body.push(record)
		}
		)
	}
})

vtecxapi.doResponseCsv(body,'billing_'+billto_code+'_'+delivery_company+'_'+shipping_yearmonth+'.csv')

function getLastMonth(shipping_yearmonth) {
	const d = new Date(parseInt(shipping_yearmonth.slice(0, 4)), parseInt(shipping_yearmonth.slice(-2)) - 1, '1')
	d.setDate(0)
	return d.getFullYear()+('0'+(d.getMonth()+1)).slice(-2) 
}