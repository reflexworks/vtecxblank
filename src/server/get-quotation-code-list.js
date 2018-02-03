import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'

const quotation_code = vtecxapi.getQueryString('quotation_code')
let quotation
if (quotation_code) {
	const status = vtecxapi.getQueryString('status')
	let option = 'quotation.quotation_code=' + quotation_code
	if (status) {
		option = option + '&quotation.status=' + status
	}
	quotation = vtecxapi.getFeed('/quotation?' + option)
}
const isQuotation = CommonGetFlag(quotation)

if (isQuotation) {
	let res = { feed: { entry: [] } }
	let cash = {}
	for (let i = 0, ii = quotation.feed.entry.length; i < ii; ++i) {
		let entry = quotation.feed.entry[i]
		const code = entry.quotation.quotation_code
		const sub_code = parseInt(entry.quotation.quotation_code_sub)
		if (!cash[code] && cash[code] !== 0) {
			cash[code] = i
			const data = {
				quotation: entry.quotation,
				billto: entry.billto
			}
			res.feed.entry.push(data)
		}
		const targetData = res.feed.entry[cash[code]]
		if (sub_code > parseInt(targetData.quotation.quotation_code_sub)) {
			res.feed.entry[cash[code]].quotation.quotation_code_sub = entry.quotation.quotation_code_sub
		}
	}
	vtecxapi.doResponse(res)
} else {
	vtecxapi.sendMessage(204, null)
}
