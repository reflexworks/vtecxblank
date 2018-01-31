import reflexcontext from 'reflexcontext' 
import { CommonGetFlag } from './common'

const quotation_code = reflexcontext.getQueryString('quotation_code')
let quotation
if (quotation_code) {
	quotation = reflexcontext.getFeed('/quotation?quotation.quotation_code=' + quotation_code + '&quotation.status=1')
}
const isQuotation = CommonGetFlag(quotation)

if (isQuotation) {
	let res = { feed: { entry: [] } }
	let befor_sub_code = 0
	let set_index = 0
	for (let i = 0, ii = quotation.feed.entry.length; i < ii; ++i) {
		let entry = quotation.feed.entry[i]
		const sub_code = parseInt(entry.quotation.quotation_code_sub)
		if (sub_code > befor_sub_code) {
			befor_sub_code = sub_code
			set_index = i
		}
	}
	res.feed.entry.push(quotation.feed.entry[set_index])
	reflexcontext.doResponse(res)
} else {
	reflexcontext.sendMessage(204, null)
}
