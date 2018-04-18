import vtecxapi from 'vtecxapi' 

export function getSortQuotationBody(_quotation_key) {

	if (!_quotation_key) return null

	const quotation = vtecxapi.getEntry('/quotation/' + _quotation_key)
	if (quotation) {

		const item_details = {}
		quotation.feed.entry[0].item_details.map((_item_details) => {
			if (!item_details[_item_details.item_name]) {
				item_details[_item_details.item_name] = []
			}
			item_details[_item_details.item_name].push(_item_details)
		})
		let array = []
		Object.keys(item_details).forEach((_key) => {
			array = array.concat(item_details[_key])
		})
		quotation.feed.entry[0].item_details = array
		return quotation
	} else {
		return null
	}
}

const quotation = getSortQuotationBody(vtecxapi.getQueryString('quotation'))
if (quotation) {
	vtecxapi.doResponse(quotation)
} else {
	vtecxapi.sendMessage(204, null)
}