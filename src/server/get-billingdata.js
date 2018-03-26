import vtecxapi from 'vtecxapi' 

export function getBillingdata(shipping_yearmonth,customer_code,shipment_service_code,billto_code) {

	shipping_yearmonth = shipping_yearmonth.replace(/[^0-9^\\.]/g,'')

	let billto
	if (!billto_code) {
		const customer = vtecxapi.getFeed('/customer/?customer.customer_code=' + customer_code)
		const billto_code = customer.feed.entry[0].billto.billto_code
		billto = vtecxapi.getEntry('/billto/' + billto_code)
	} else {
		billto = vtecxapi.getEntry('/billto/' + billto_code)
	}

	let billing_closing_date = 0
	if ((billto.feed.entry)&&billto.feed.entry[0].billto.billing_closing_date) {
		billing_closing_date = billto.feed.entry[0].billto.billing_closing_date
	}

	let billing_data = vtecxapi.getFeed('/billing_data/' + shipping_yearmonth + customer_code + '_' + shipment_service_code + '*', true)

	if (billing_data.feed.entry) {
		if (billing_closing_date === '1') {
			const lastyearmonth = getLastMonth(shipping_yearmonth)
			const billing_data_prev = vtecxapi.getFeed('/billing_data/' + lastyearmonth + customer_code + '_' + shipment_service_code + '*', true)
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

	}
	return { 'billing_data': billing_data, 'billing_closing_date': billing_closing_date }
}

function getLastMonth(shipping_yearmonth) {
	const d = new Date(shipping_yearmonth.slice(0, 4) + '-' + shipping_yearmonth.slice(-2) + '-01')
	d.setDate(0)
	return d.getFullYear()+('0'+(d.getMonth()+1)).slice(-2) 
}