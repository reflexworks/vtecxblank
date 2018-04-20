import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'
import { getQuotationLast } from './get-latest-quotation'

let reqData = vtecxapi.getRequest()
const customer_code = reqData.feed.entry[0].customer.customer_code

const getBeforYearmonth = () => {
	const working_yearmonth = reqData.feed.entry[0].internal_work.working_yearmonth
	let year = parseInt(working_yearmonth.split('/')[0])
	let month = parseInt(working_yearmonth.split('/')[1]) - 1
	if (month === 0) {
		year = year - 1
		month = 12
	}
	if (month < 10) month = '0' + month
	return year + '/' + month
}

const befor_yearmonth = getBeforYearmonth()
const beforData = vtecxapi.getFeed('/internal_work?customer.customer_code=' + customer_code + '&internal_work.working_yearmonth=' + befor_yearmonth)
const isbefor = CommonGetFlag(beforData)

const postItemDetails = () => {
	const quotation = getQuotationLast(reqData.feed.entry[0].quotation.quotation_code)

	let self_count = 0
	if (quotation.feed.entry[0].item_details && quotation.feed.entry[0].item_details.length) {
		let postData = []
		quotation.feed.entry[0].item_details.map((_item_details) => {
			if (_item_details.unit_name.indexOf('月') === -1 && _item_details.unit_name.indexOf('期') === -1) {
				const internal_work = {
					internal_work: {
						item_details_name: _item_details.item_name,
						item_details_unit: _item_details.unit,
						item_details_unit_name: _item_details.unit_name,
						remarks: _item_details.remarks,
						unit_price: _item_details.unit_price,
						work_type: '0'
					},
					link: [{
						___href: reqData.feed.entry[0].link[0].___href + '/list/quotation_' + self_count,
						___rel: 'self'
					}]
				}
				postData.push(internal_work)
				self_count++
			}
		})
		if (quotation.feed.entry[0].packing_items && quotation.feed.entry[0].packing_items.length) {
			quotation.feed.entry[0].packing_items.map((_packing_item) => {
				const internal_work = {
					internal_work: {
						packing_item_code: _packing_item.item_code,
						packing_item_name: _packing_item.item_name,
						special_unit_price: _packing_item.special_unit_price,
						work_type: '3'
					},
					link: [{
						___href: reqData.feed.entry[0].link[0].___href + '/list/quotation_' + self_count,
						___rel: 'self'
					}]
				}
				postData.push(internal_work)
				self_count++
			})
		}
		if (postData.length) {
			vtecxapi.put({ feed: { entry: postData } }, true)
		} else[
			vtecxapi.sendMessage(204, null)
		]
	} else {
		vtecxapi.sendMessage(204, null)
	}
}
if (isbefor) {

	const beforLink = beforData.feed.entry[0].link[0].___href
	const beforList = vtecxapi.getFeed(beforLink + '/list')
	const isbeforList = CommonGetFlag(beforList)

	if (isbeforList) {

		let postData = []
		let self_count = 0
		beforList.feed.entry.map((_list_data) => {
			postData.push({
				internal_work: _list_data.internal_work,
				link: [{
					___href: reqData.feed.entry[0].link[0].___href + '/list/befor_' + self_count,
					___rel: 'self'
				}]
			})
			self_count++
		})
		vtecxapi.put({feed:{entry:postData}}, true)
	} else {
		postItemDetails()
	}
} else {
	postItemDetails()
}
