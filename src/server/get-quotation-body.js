import vtecxapi from 'vtecxapi' 

export function getSortQuotationBody(_quotation_key) {

	if (!_quotation_key) return null

	const quotation = vtecxapi.getEntry('/quotation/' + _quotation_key)
	if (quotation) {

		if (quotation.feed.entry[0].item_details) {
			const item_details = {}
			quotation.feed.entry[0].item_details.map((_item_details) => {
				if (!item_details[_item_details.item_name]) {
					item_details[_item_details.item_name] = []
				}
				item_details[_item_details.item_name].push(_item_details)
			})
			let array = []
			Object.keys(item_details).forEach((_key) => {
				item_details[_key].sort((a, b) => {
					const a_unit_name = a.unit_name.toString().toLowerCase()
					const b_unit_name = b.unit_name.toString().toLowerCase()
					if (a_unit_name < b_unit_name) return -1
					if (a_unit_name > b_unit_name) return 1
					return 0
				})
				array = array.concat(item_details[_key])
			})
			quotation.feed.entry[0].item_details = array
		}

		return quotation
	} else {
		return null
	}
}

const quotation_code = vtecxapi.getQueryString('quotation')
const quotation = getSortQuotationBody(quotation_code)
if (quotation) {
	vtecxapi.doResponse(quotation)
} else {
	vtecxapi.sendMessage(204, null)
}