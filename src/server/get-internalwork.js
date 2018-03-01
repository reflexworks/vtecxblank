import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'

const uri = vtecxapi.getQueryString('code')
const list = vtecxapi.getFeed(uri + '/list')
const isList = CommonGetFlag(list)

let monthly_data = vtecxapi.getFeed(uri + '/data?internal_work.work_type=4')
let isMonthly = CommonGetFlag(monthly_data)

const period_data = vtecxapi.getFeed(uri + '/data?internal_work.work_type=5')
const isPeriod = CommonGetFlag(period_data)

// 月次があり、旬次がある場合
if (isMonthly && isPeriod) {
	for (let i = 0, ii = period_data.feed.entry.length; i < ii; ++i) {
		monthly_data.feed.entry.push(period_data.feed.entry[i])
	}
// 月次がなく、旬次がある場合
} else if (isPeriod){
	monthly_data = period_data
	isMonthly = CommonGetFlag(monthly_data)
}

if (isList) {
	const day = vtecxapi.getQueryString('day')
	const data = vtecxapi.getFeed(uri + '/data?internal_work.working_day=' + day)
	const isData = CommonGetFlag(data)

	// 月次と旬次データセット
	if (isMonthly) {
		for (let i = 0, ii = monthly_data.feed.entry.length; i < ii; ++i) {
			list.feed.entry.push(monthly_data.feed.entry[i])
		}
	}
	if (isData) {
		const getKey = (_internal_work) => {
			const type = _internal_work.work_type
			let key = _internal_work.work_type
			if (type === '0' || type === '4' || type === '5') {
				key += _internal_work.item_details_name
				key += _internal_work.item_details_unit_name
				key += _internal_work.item_details_unit
			}
			if (type === '1' || type === '2') {
				key += _internal_work.shipment_service_code
				key += _internal_work.shipment_service_name
				key += _internal_work.shipment_service_name_service_name || ''
				key += _internal_work.shipment_service_size || ''
				key += _internal_work.shipment_service_weight || ''
			}
			if (type === '3') key += _internal_work.packing_item_code
			return key
		}
		const setCash = () => {
			let obj = {}
			for (let i = 0, ii = data.feed.entry.length; i < ii; ++i) {
				const entry = data.feed.entry[i]
				const key = getKey(entry.internal_work)
				obj[key] = entry
			}
			return obj
		}
		const cash = setCash()
		for (let i = 0, ii = list.feed.entry.length; i < ii; ++i) {
			const entry = list.feed.entry[i]
			const type = entry.internal_work.work_type
			const key = getKey(entry.internal_work)
			if (cash[key]) {
				list.feed.entry[i] = cash[key]
			} else {
				if (type !== '4') {
					list.feed.entry[i].id = null
					list.feed.entry[i].link = null
				}
			}
		}
		vtecxapi.doResponse(list)
	} else {
		for (let i = 0, ii = list.feed.entry.length; i < ii; ++i) {
			const entry = list.feed.entry[i]
			const type = entry.internal_work.work_type
			if (type !== '4') {
				list.feed.entry[i].id = null
			}
		}
		vtecxapi.doResponse(list)
	}
} else {
	if (isMonthly) {
		vtecxapi.doResponse(monthly_data)
	} else {
		vtecxapi.sendMessage(204, null)
	}
}
