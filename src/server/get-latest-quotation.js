import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'

export function getQuotationLast(_quotation_code) {
	let quotation
	if (_quotation_code) {
		quotation = vtecxapi.getFeed('/quotation?quotation.quotation_code=' + _quotation_code + '&quotation.status=1')
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
		return res
	} else {
		return null
	}
}

const quotation_code = vtecxapi.getQueryString('quotation_code')
const data = getQuotationLast(quotation_code)
if (data) {
	vtecxapi.doResponse(data)
} else {
	vtecxapi.sendMessage(204, null)
}
