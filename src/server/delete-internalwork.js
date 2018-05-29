import vtecxapi from 'vtecxapi'
import { CommonGetFlag } from './common'

const req = vtecxapi.getRequest()
const internal_work_code = vtecxapi.getQueryString('internal_work')
const entry = req.feed.entry[0]
const internal_work = entry.internal_work
const work_type = parseInt(internal_work.work_type)
const list = [
	['item_details_name', 'item_details_unit_name', 'item_details_unit'],
	['shipment_service_code','shipment_service_name','shipment_service_service_name','shipment_service_size','shipment_service_type','shipment_service_weight'],
	['shipment_service_code','shipment_service_name','shipment_service_service_name','shipment_service_size','shipment_service_type','shipment_service_weight'],
	['packing_item_code']
]
const getOption = () => {
	let option = 'internal_work.work_type=' + internal_work.work_type

	const setValue = () => {
		for (let i = 0, ii = list[work_type].length; i < ii; ++i) {
			const _key = list[work_type][i]
			if (internal_work[_key]) {
				option += '&internal_work.' + _key + '=' + internal_work[_key]
			} else {
				option += ''
			}
		}
	}
	setValue(list)
	return option
}
const option = '?f&' + getOption()

const doDelete = () => {
	const urlList = [
		internal_work_code + '/list' + option,
		internal_work_code + '/data' + option
	]
	const getEntry = () => {
		let array = []
		urlList.map((_url) => {
			const deleteWorks = vtecxapi.getFeed(_url,true)
			const isDeleteWorks = CommonGetFlag(deleteWorks)
			if (isDeleteWorks) {
				const _entry = deleteWorks.feed.entry[0]
				vtecxapi.deleteFolder(_entry.link[0].___href)
				array.push(_entry)
			}
		})
		return array
	}
	const deleteWorks = getEntry()
	vtecxapi.doResponse({feed:{entry:deleteWorks}})
}

const url = internal_work_code + '/data'
const targetWorks = vtecxapi.getFeed(url + option,true)
const isTargetWorks = CommonGetFlag(targetWorks)
if (isTargetWorks) {
	let isDelete = true
	let working_day
	let isApproval = false
	for (let i = 0, ii = targetWorks.feed.entry.length; i < ii; ++i) {
		const _entry = targetWorks.feed.entry[i]
		if (_entry.internal_work.quantity && _entry.internal_work.quantity !== '0') {
			isDelete = false
			working_day = _entry.internal_work.working_day
			break
		} else if (_entry.internal_work.approval_status === '1') {
			isDelete = false
			working_day = _entry.internal_work.working_day
			isApproval = true
			break
		}
	}
	if (isDelete) {
		doDelete()
	} else if (isApproval) {
		vtecxapi.doResponse({ feed: { title: working_day + '日に未承認のデータがあります。' } })
	} else {
		vtecxapi.doResponse({ feed: { title: working_day + '日に入力済みのデータがあります。' } })
	}
} else {
	doDelete()
}

