import reflexcontext from 'reflexcontext' 
import { CommonGetFlag } from './common'

const quotation_code = reflexcontext.getQueryString('quotation_code')
let quotation
let customer
if (quotation_code) {
	quotation = reflexcontext.getFeed('/quotation?quotation.quotation_code=' + quotation_code)
	customer = reflexcontext.getFeed('/customer?billto.billto_code=' + quotation.feed.entry[0].billto.billto_code)
}
const isCustomer = CommonGetFlag(customer)

if (isCustomer) {
	const quotation_code = quotation.feed.entry[0].quotation.quotation_code
	let working_yearmonth = reflexcontext.getQueryString('working_yearmonth')
	working_yearmonth = working_yearmonth.replace('/', '')
	let res = {feed: {entry: []}}
	for (let i = 0, ii = customer.feed.entry.length; i < ii; ++i) {
		let entry = customer.feed.entry[i]
		const customer_code = entry.customer.customer_code
		const internalwork = reflexcontext.getEntry('/internal_work/'+ quotation_code + '-' + working_yearmonth + '-' + customer_code)
		const isInternalwork = CommonGetFlag(internalwork)
		if (isInternalwork) {
			entry.title = 'create'
		} else {
			entry.title = 'none'
		}
		res.feed.entry.push(entry)
	}
	reflexcontext.doResponse(res)
} else {
	reflexcontext.sendMessage(204, null)
}
