import vtecxapi from 'vtecxapi' 
import { getBillingdata } from './get-billingdata'
import { getInternalworkdata } from './get-internalwork-data'

const shipping_yearmonth = vtecxapi.getQueryString('shipping_yearmonth')  //201801
const customer_code = vtecxapi.getQueryString('customer_code')  // 0000124
const quotation_code = vtecxapi.getQueryString('quotation_code')  //0000107
const shipment_class = vtecxapi.getQueryString('shipment_class')

try {
	const result = {
		'feed': {
			'entry':[]
		}
	}
	result.feed.entry = result.feed.entry.concat(getCompare(shipping_yearmonth, customer_code))

	vtecxapi.doResponse(result)
	
} catch (e) {
	vtecxapi.sendMessage(400, e)
}

function getCompare(shipping_yearmonth, customer_code) {

	const result = { 'billing_compare': [] }

	const shipment_service = vtecxapi.getFeed('/shipment_service/')
	if (!shipment_service.feed.entry) throw '配送業者マスタが登録されていません'
	shipment_service.feed.entry.map((entry) => {
		const billing_data = getBillingdata(shipping_yearmonth, customer_code, entry.shipment_service.code)
		if (billing_data.billing_data.feed.entry) {
			const internal_work_data = getInternalworkdata(shipping_yearmonth, customer_code, quotation_code)
			const billing_compare = getBillingCompare(internal_work_data, billing_data, shipping_yearmonth, shipment_class, entry.shipment_service.code, entry.shipment_service.name)
			result.billing_compare.push(billing_compare)
		}	
	})

	return result
}

function getBillingCompare(internal_work_data,billing_data,shipping_yearmonth,shipment_class,shipment_service_code,shipment_service_service_name) {

	const result = {
		'shipment_service_code': shipment_service_code,
		'shipment_service_service_name': shipment_service_service_name,
		'shipment_class': shipment_class,
		'record': []
	}

	let dates1 = new Date(shipping_yearmonth.slice(0, 4) + '-' + shipping_yearmonth.slice(-2) + '-01')
	let dates2 = new Date(dates1.getFullYear(), dates1.getMonth()+1 , 0)     // 月末
	if (billing_data.billing_closing_date === '1') {
		dates2 = new Date(dates1.getFullYear(), dates1.getMonth(), 20)
		dates1.setDate(0)            
		dates1 = new Date(dates1.getFullYear(), dates1.getMonth(), 21)
	}
	const dates = getDates(internal_work_data, billing_data.billing_data,shipment_class,shipment_service_code)
	for (let d = dates1; d.getTime() <= dates2.getTime(); d.setDate(d.getDate() + 1)) {
		const date = ''+d.getDate()
		if (dates.indexOf(date) >= 0) {
			const result_billing = getQuantityOfBillingdata(billing_data.billing_data, shipment_class, shipment_service_code, date)
			const result_internalwork = getQuantityOfInternalwork(internal_work_data, shipment_class, shipment_service_code, date)
			const record = {
				'shipping_date' : (d.getMonth()+1) +'/'+ date,
				'internal_work_quantity' : result_internalwork.internal_work.quantity,
				'billing_quantity': result_billing.billing_data.quantity,
				'billing_amount': result_billing.billing_data.delivery_charge
			}
			result.record.push(record)
		}
	}
	return result
}    

function getDates(internal_work_data, billing_data,shipment_class,shipment_service_code) {

	const work_type = shipment_class === '0' ? '1' : '2'
	const dates1 = internal_work_data.feed.entry.map((entry) => {
		if ((entry.internal_work.shipment_service_code === shipment_service_code) && (entry.internal_work.work_type === work_type)) {
			return entry.internal_work.working_day            
		}
	})
	const dates2 = billing_data.feed.entry.map((entry) => {
		if ((entry.billing_data.shipment_service_code === shipment_service_code) && (entry.billing_data.shipment_class === shipment_class)) {
			return ''+ new Date(entry.billing_data.shipping_date).getDate()            
		}
	})
	const dates = dates1.concat(dates2).filter((x, i, self) => {
		return self.indexOf(x) === i
	}).filter(Boolean)

	return dates
}

function getQuantityOfInternalwork(internal_work_data,shipment_class,shipment_service_code,working_day) {

	const work_type = shipment_class === '0' ? '1' : '2'
	const result = internal_work_data.feed.entry.filter((entry) => { 
		return ((entry.internal_work.work_type === work_type)&&(entry.internal_work.shipment_service_code===shipment_service_code)&&(entry.internal_work.working_day===working_day))	// 発送
	}).reduce((prev, current) => { 
		const entry = {
			'internal_work': {
				'quantity': ''+(Number(prev.internal_work.quantity)+Number(current.internal_work.quantity))
			}
		}
		return entry       
	}, { 'internal_work': { 'quantity': '0' } })
	return result
}

function getQuantityOfBillingdata(billing_data, shipment_class,shipment_service_code, working_day) {
    
	const result = billing_data.feed.entry.filter((entry) => {
		const shipping_day = new Date(entry.billing_data.shipping_date).getDate()     
		return ((entry.billing_data.shipment_class === shipment_class) && (entry.billing_data.shipment_service_code === shipment_service_code) && (shipping_day === Number(working_day)))
	}).reduce((prev, current) => { 
		const entry = {
			'billing_data': {
				'delivery_charge': ''+(Number(prev.billing_data.delivery_charge)+Number(current.billing_data.delivery_charge)),
				'quantity': ''+(Number(prev.billing_data.quantity)+Number(current.billing_data.quantity))
			}
		}
		return entry       
	}, { 'billing_data': { 'delivery_charge': '0', 'quantity': '0' } })

	return result

}
