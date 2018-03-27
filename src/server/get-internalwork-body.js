import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'
import { getQuotationLast } from './get-latest-quotation'

const code = vtecxapi.getQueryString('code')
let body = vtecxapi.getEntry('/internal_work/' + code)
const isBody = CommonGetFlag(body)

if (isBody) {

	const setCustomer = (_bodyEntry) => {
		const code = _bodyEntry.customer.customer_code
		const data = vtecxapi.getEntry('/customer/' + code)
		return data.feed.entry[0].customer
	}
	const setQuotation = (_bodyEntry) => {
		const code = _bodyEntry.quotation.quotation_code
		const data = getQuotationLast(code)
		return data.feed.entry[0]
	}
	const setBillto = (_quotationEntry) => {
		const code = _quotationEntry.billto.billto_code
		const data = vtecxapi.getEntry('/billto/' + code)
		return data.feed.entry[0].billto
	}
	const quotationData = setQuotation(body.feed.entry[0])

	body.feed.entry[0].customer = setCustomer(body.feed.entry[0])
	body.feed.entry[0].quotation = quotationData.quotation
	body.feed.entry[0].billto = setBillto(quotationData)

	vtecxapi.doResponse(body)
} else {
	vtecxapi.sendMessage(204, null)
}
