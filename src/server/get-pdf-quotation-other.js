import vtecxapi from 'vtecxapi' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { DeliveryCharge } from './get-pdf-deliverycharge'
import { PackingItems } from './get-pdf-packingitem'

const quotation_code = vtecxapi.getQueryString('quotation_code')
const quotation_code_sub = vtecxapi.getQueryString('quotation_code_sub')
const getQuotation = () => {
	const data = vtecxapi.getEntry('/quotation/' + quotation_code + '-' + quotation_code_sub)
	const entry = data.feed.entry[0]
	return entry
}

let entry = getQuotation()

let pageData = {
	pageList: {
		page:[]
	}
}
const element = () => {

	const getStartPage = (_end_page) => {
		return _end_page + 1
	}
	const deliverycharge = DeliveryCharge(1, entry)
	const deliverycharge_size = deliverycharge.size
	const packingitems = PackingItems(getStartPage(deliverycharge_size), entry)
	let packingitem_size = 0
	if (packingitems) {
		packingitem_size = packingitems.size
	}

	const total_size = deliverycharge_size + packingitem_size
	for (let i = 0, ii = total_size; i < ii; ++i) {
		pageData.pageList.page.push({word: ''})
	}

	return (
		<html>
			<body>
				{deliverycharge.html}
				{packingitems && packingitems.html}
			</body>
		</html>
	)	
}

let html = ReactDOMServer.renderToStaticMarkup(element())
/*
const file_name = () => {
	const preview = vtecxapi.getQueryString('preview')
	if (preview === '') {
		return 'preview-other-' + quotation_code + '-' + quotation_code_sub + '.pdf'
	} else {
		return 'quotation-other-' + quotation_code + '-' + quotation_code_sub + '.pdf'
	}
}

// PDF出力
vtecxapi.toPdf(pageData, html, file_name())
*/
vtecxapi.toPdf(pageData, html, null)
