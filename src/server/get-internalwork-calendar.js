import vtecxapi from 'vtecxapi'
import { CommonGetFlag } from './common'

const key_list = [
	['item_details_name', 'item_details_unit_name'],
	['shipment_service_code','shipment_service_name','shipment_service_service_name','shipment_service_size','shipment_service_weight'],
	['shipment_service_code','shipment_service_name','shipment_service_service_name','shipment_service_size','shipment_service_weight'],
	['packing_item_code', 'packing_item_name']
]
const getKey = (_internal_work) => {
	const key = parseInt(_internal_work.work_type)
	let array = []
	key_list[key].map((_key) => {
		if (_internal_work[_key]) {
			array.push(_internal_work[_key])
		}
	})
	return array.join(' / ')
}
const internal_work_url = vtecxapi.getQueryString('internal_work')
const work_type = vtecxapi.getQueryString('work_type')

const internal_work_data = vtecxapi.getFeed(internal_work_url + '/data?internal_work.work_type=' + work_type, true)
const isData = CommonGetFlag(internal_work_data)

const getCalendarList = (_origin_data) => {
	let calendarList = {}
	for (let i = 0, ii = _origin_data.feed.entry.length; i < ii; ++i) {
		const entry = _origin_data.feed.entry[i]
		const working_day = entry.internal_work.working_day ? parseInt(entry.internal_work.working_day) : null
		const quantity = entry.internal_work.quantity ? parseInt(entry.internal_work.quantity) : null
		const key = getKey(entry.internal_work)
		if (!calendarList[key]) calendarList[key] = new Array(31)
		if (working_day) {
			if (!calendarList[key][working_day]) calendarList[key][working_day] = 0
			if (quantity) {
				calendarList[key][working_day] = calendarList[key][working_day] + quantity
			}
		}
	}
	let entrys = []
	Object.keys(calendarList).forEach((_key) => {
		entrys.push({
			title: _key,
			summary: JSON.stringify(calendarList[_key])
		})
	})
	vtecxapi.doResponse({feed: {entry: entrys}})
}
if (isData) {
	getCalendarList(internal_work_data)
} else {
	const internal_work_list = vtecxapi.getFeed(internal_work_url + '/list?internal_work.work_type=' + work_type, true)
	const isList = CommonGetFlag(internal_work_list)
	if (isList) {
		getCalendarList(internal_work_list)
	} else {
		vtecxapi.sendMessage(204, null)
	}
}
