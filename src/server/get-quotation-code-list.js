import reflexcontext from 'reflexcontext' 
import { CommonGetFlag } from './common'

const quotation_code = reflexcontext.getQueryString('quotation_code')
let quotation
if (quotation_code) {
	const status = reflexcontext.getQueryString('status')
	let option = 'quotation.quotation_code=' + quotation_code
	if (status) {
		option = option + '&quotation.status=' + status
	}
	quotation = reflexcontext.getFeed('/quotation?' + option)
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
	reflexcontext.doResponse(res)
} else {
	reflexcontext.sendMessage(204, null)
}
