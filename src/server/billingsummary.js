import vtecxapi from 'vtecxapi' 
import { getChargeBySizeAndZone } from './put-billing'

const shipping_yearmonth = vtecxapi.getQueryString('shipping_yearmonth')  //201801
const billto_code = vtecxapi.getQueryString('billto_code')  // 0000124
const customer_code = vtecxapi.getQueryString('customer_code')  // 0000124
const shipment_service_code = vtecxapi.getQueryString('shipment_service_code')  //YH or ECO
const shipment_class = vtecxapi.getQueryString('shipment_class')  //0:出荷、1:集荷

try {
	const result = getSummary(shipping_yearmonth, billto_code, shipment_service_code, customer_code)

	vtecxapi.doResponse(result)
	
} catch (e) {
	vtecxapi.sendMessage(400, e)
}

export function getSummary(shipping_yearmonth, billto_code, shipment_service_code, _customer_code) {

	const billto = vtecxapi.getEntry('/billto/' + billto_code)

	let billing_closing_date = 0
	if ((billto.feed.entry) && billto.feed.entry[0].billto.billing_closing_date) {
		billing_closing_date = billto.feed.entry[0].billto.billing_closing_date
	}

	const shipment_service = vtecxapi.getEntry('/shipment_service/' + shipment_service_code) // YH1 or ECO1
	if (!shipment_service.feed.entry) throw '配送サービスが登録されていません。(配送サービスコード=' + shipment_service_code + ')'
	const sizes = shipment_service.feed.entry[0].shipment_service.sizes.map((sizes) => {
		return sizes.size.match(/\d+/)[0]
	})
	const zones = shipment_service.feed.entry[0].zone.map((zone) => {
		return zone.zone_name
	})

	let customer
	if (_customer_code) {
		customer = vtecxapi.getEntry('/customer/' + _customer_code)
	} else {
		customer = vtecxapi.getFeed('/customer/?billto.billto_code=' + billto_code)
	}

	const entry = []
	customer.feed.entry.map((_entry) => {

		const result = {
			customer: _entry.customer,
			billing_summary: { record: [] }
		}
		const customer_code = _entry.customer.customer_code
		let billing_data = vtecxapi.getFeed('/billing_data/' + shipping_yearmonth + customer_code + '_' + shipment_service_code + '_*', true)
		billing_data.feed.entry = billing_data.feed.entry ? billing_data.feed.entry.filter((entry) => {
			return entry.billing_data.shipment_class === shipment_class
		}) : billing_data.feed.entry

		if (billing_data.feed.entry&&billing_data.feed.entry.length>0) {
			if (billing_closing_date === '1') {
				const lastyearmonth = getLastMonth(shipping_yearmonth)
				const billing_data_prev = vtecxapi.getFeed('/billing_data/' + lastyearmonth + customer_code + '_' + shipment_service_code + '_*', true)
				billing_data_prev.feed.entry = billing_data_prev.feed.entry.filter((entry) => {
					return entry.billing_data.shipment_class === shipment_class
				})

				const d0 = new Date(lastyearmonth.slice(0, 4), parseInt(lastyearmonth.slice(-2)) - 1, '21').getTime()
				const d1 = new Date(shipping_yearmonth.slice(0, 4), parseInt(shipping_yearmonth.slice(-2)) - 1, '20').getTime()
				billing_data.feed.entry = billing_data_prev.feed.entry ? billing_data_prev.feed.entry.concat(billing_data.feed.entry) : billing_data.feed.entry
					.filter((entry) => {
						if (entry) {
							const d2 = new Date(entry.billing_data.shipping_date).getTime()
							return ((d2 >= d0) && (d2 <= d1))
						}
					})
			}
			sizes.map((size) => { 
				zones.map((zone) => { 
					const entry = billing_data.feed.entry.filter((entry) => { 
						if (shipment_service_code.indexOf('ECO') >= 0) {
							return entry && (entry.billing_data.zone_name === zone)
						} else {
							return entry && (entry.billing_data.zone_name === zone) && (entry.billing_data.size === size)							
						}
					})
					if (entry.length > 0) {
						const subtotal = entry.length * parseInt(entry[0].billing_data.delivery_charge)
						const record = { 'size' : size,'zone_name':zone,'quantity':''+entry.length,'delivery_charge':entry[0].billing_data.delivery_charge,'subtotal':''+subtotal}
						result.billing_summary.record.push(record)						
					} else {
						let delivery_area = null
						if (shipment_service_code.indexOf('ECO')>=0) {
							delivery_area = billing_data.feed.entry[0].billing_data.delivery_class
						}
						const charge_by_zone = getChargeBySizeAndZone(customer_code,billing_data.feed.entry[0].billing_data.shipment_service_code, size, zone, delivery_area)
						const record = { 'size' : size,'zone_name':zone,'quantity':'0','delivery_charge':charge_by_zone[0].price,'subtotal':'0'}
						result.billing_summary.record.push(record)												
					}
				})
			})
		}
		entry.push(result)
	})

	const data = { feed: { entry: entry }}
	return data
}

function getLastMonth(shipping_yearmonth) {
	const d = new Date(parseInt(shipping_yearmonth.slice(0, 4)), parseInt(shipping_yearmonth.slice(-2)) - 1, '1')
	d.setDate(0)
	return d.getFullYear()+('0'+(d.getMonth()+1)).slice(-2) 
}
