import reflexcontext from 'reflexcontext' 
import { CommonGetFlag } from './common'

const uri = reflexcontext.getQueryString('code')
const list = reflexcontext.getFeed(uri + '/list')
const isList = CommonGetFlag(list)
const monthly_data = reflexcontext.getFeed(uri + '/data?internal_work.work_type=4')
const isMonthly = CommonGetFlag(monthly_data)

if (isList) {
	const day = reflexcontext.getQueryString('day')
	const data = reflexcontext.getFeed(uri + '/data?internal_work.working_day=' + day)
	const isData = CommonGetFlag(data)
	if (isMonthly) {
		for (let i = 0, ii = monthly_data.feed.entry.length; i < ii; ++i) {
			list.feed.entry.push(monthly_data.feed.entry[i])
		}
	}
	if (isData) {
		const setCash = () => {
			let obj = {}
			for (let i = 0, ii = data.feed.entry.length; i < ii; ++i) {
				const entry = data.feed.entry[i]
				const type = entry.internal_work.work_type
				let key = type
				if (type === '0') key += entry.internal_work.item_details_name
				if (type === '1' || type === '2') {
					key += entry.internal_work.shipment_service_code
					key += entry.internal_work.shipment_service_name
					key += entry.internal_work.shipment_service_name_service_name || ''
					key += entry.internal_work.shipment_service_size || ''
					key += entry.internal_work.shipment_service_weight || ''
				}
				if (type === '3') key += entry.internal_work.packing_item_name
				obj[key] = entry
			}
			return obj
		}
		const cash = setCash()
		for (let i = 0, ii = list.feed.entry.length; i < ii; ++i) {
			const entry = list.feed.entry[i]
			const type = entry.internal_work.work_type
			let key = type
			if (type === '0') key += entry.internal_work.item_details_name
			if (type === '1' || type === '2') {
				key += entry.internal_work.shipment_service_code
				key += entry.internal_work.shipment_service_name
				key += entry.internal_work.shipment_service_name_service_name || ''
				key += entry.internal_work.shipment_service_size || ''
				key += entry.internal_work.shipment_service_weight || ''
			}
			if (type === '3') key += entry.internal_work.packing_item_name
			if (cash[key]) {
				list.feed.entry[i] = cash[key]
			} else {
				if (type !== '4') {
					list.feed.entry[i].id = null
					list.feed.entry[i].link = null
				}
			}
		}
		reflexcontext.doResponse(list)
	} else {
		for (let i = 0, ii = list.feed.entry.length; i < ii; ++i) {
			const entry = list.feed.entry[i]
			const type = entry.internal_work.work_type
			if (type !== '4') {
				list.feed.entry[i].id = null
			}
		}
		reflexcontext.doResponse(list)
	}
} else {
	if (isMonthly) {
		reflexcontext.doResponse(monthly_data)
	} else {
		reflexcontext.sendMessage(204, null)
	}
}
