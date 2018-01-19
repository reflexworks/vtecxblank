import reflexcontext from 'reflexcontext' 
import { CommonGetFlag } from './common'

const billto_code = reflexcontext.getQueryString('billto_code')
const customer_code = reflexcontext.getQueryString('customer_code')
let customer
if (billto_code) {
	customer = reflexcontext.getFeed('/customer?billto.billto_code=' + billto_code)
} else if (customer_code) {
	customer = reflexcontext.getFeed('/customer?customer.customer_code=' + customer_code)
}
const isCustomer = CommonGetFlag(customer)

if (isCustomer) {
	let working_yearmonth = reflexcontext.getQueryString('working_yearmonth')
	working_yearmonth = working_yearmonth.replace('/', '')
	let res = {feed: {entry: []}}
	for (let i = 0, ii = customer.feed.entry.length; i < ii; ++i) {
		let entry = customer.feed.entry[i]
		const customer_code = entry.customer.customer_code
		const internalwork = reflexcontext.getEntry('/internal_work/' + customer_code + '_' + working_yearmonth)
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
