import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'
import { getData } from './get-data-from-user'

const quotation = getData('quotation')
const isQuotation = CommonGetFlag(quotation)

if (isQuotation) {
	let res = { feed: { entry: [] } }
	let cash = {}
	for (let i = 0, ii = quotation.feed.entry.length; i < ii; ++i) {
		let entry = quotation.feed.entry[i]
		let pushIndex = 0
		if (entry.quotation) {
			const code = entry.quotation.quotation_code
			const sub_code = parseInt(entry.quotation.quotation_code_sub)
			const flg_name = 'no_' + code
			if (!cash[flg_name]) {
				cash[flg_name] = 'no_' + pushIndex
				const data = {
					quotation: entry.quotation,
					billto: entry.billto
				}
				res.feed.entry.push(data)
				pushIndex++
			}
			const targetIndex = parseInt(cash[flg_name].replace('no_', ''))
			const targetData = res.feed.entry[targetIndex]
			if (targetData.quotation && sub_code > parseInt(targetData.quotation.quotation_code_sub)) {
				res.feed.entry[targetIndex].quotation.quotation_code_sub = entry.quotation.quotation_code_sub
			}
		}
	}
	if (res.feed.entry.length) {
		vtecxapi.doResponse(res)
	} else {
		vtecxapi.sendMessage(204, null)
	}
} else {
	vtecxapi.sendMessage(204, null)
}
