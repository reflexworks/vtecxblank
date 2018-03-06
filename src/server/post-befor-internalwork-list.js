import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'

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

if (isbefor) {

	const beforLink = beforData.feed.entry[0].link[0].___href
	const beforList = vtecxapi.getFeed(beforLink + '/list')
	const isbeforList = CommonGetFlag(beforList)

	if (isbeforList) {

		let postData = []
		beforList.feed.entry.map((_list_data) => {
			postData.push({
				internal_work: _list_data.internal_work,
			})
		})
		vtecxapi.post({feed:{entry:postData}}, reqData.feed.entry[0].link[0].___href + '/list')
	} else {
		vtecxapi.sendMessage(204, null)
	}
} else {
	vtecxapi.sendMessage(204, null)
}	
