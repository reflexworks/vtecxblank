import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'
import { getCustomer } from './get-data-from-user'

const quotation_code = vtecxapi.getQueryString('quotation_code')
let quotation
let customer
if (quotation_code) {
	quotation = vtecxapi.getFeed('/quotation?quotation.quotation_code=' + quotation_code)
	customer = getCustomer('?billto.billto_code=' + quotation.feed.entry[0].billto.billto_code)
}

if (customer) {
	const quotation_code = quotation.feed.entry[0].quotation.quotation_code
	let working_yearmonth = vtecxapi.getQueryString('working_yearmonth')
	working_yearmonth = working_yearmonth.replace('/', '')
	let res = {feed: {entry: []}}
	for (let i = 0, ii = customer.length; i < ii; ++i) {
		let entry = customer[i]
		const customer_code = entry.customer.customer_code
		const internalwork = vtecxapi.getEntry('/internal_work/'+ quotation_code + '-' + working_yearmonth + '-' + customer_code)
		const isInternalwork = CommonGetFlag(internalwork)
		if (isInternalwork) {
			entry.title = 'create'
		} else {
			entry.title = 'none'
		}
		res.feed.entry.push(entry)
	}
	vtecxapi.doResponse(res)
} else {
	vtecxapi.sendMessage(204, null)
}
