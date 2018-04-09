import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'

const uri = vtecxapi.getQueryString('code')
let list = vtecxapi.getFeed(uri + '/list')
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

	const quotation_code = vtecxapi.getQueryString('quotation_code')
	const quotation = vtecxapi.getEntry('/quotation/' + quotation_code).feed.entry[0]

	// 月次と旬次データセット
	if (isMonthly) {
		for (let i = 0, ii = monthly_data.feed.entry.length; i < ii; ++i) {
			list.feed.entry.push(monthly_data.feed.entry[i])
		}
	}

	const getKey = (_internal_work) => {
		const type = _internal_work.work_type
		let key = _internal_work.work_type
		if (type === '0' || type === '4' || type === '5') {
			if (type === '5') {
				key += _internal_work.period
			}
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

	// 作業内容を見積書の順番に整列する
	const arrangementList = () => {
		const getQuotationKey = (_obj) => {
			let key = ''
			if (_obj.item_code) {
				key += '3'
				key += _obj.item_code
			} else if (_obj.item_name) {
				if (_obj.unit_name && _obj.unit_name.indexOf('月') !== -1) {
					key += '4'
				} else if (_obj.unit_name && _obj.unit_name.indexOf('期') !== -1) {
					key += '5'
					key += _obj.period
				} else {
					key += '0'
				}
				key += _obj.item_name
				key += _obj.unit_name
				key += _obj.unit
			}
			return key
		}
		let cash = {}
		let cashIndex = 0
		if (quotation.item_details && quotation.item_details.length) {
			quotation.item_details.map((_item_details) => {
				const key = getQuotationKey(_item_details)
				cash[key] = JSON.parse(JSON.stringify(cashIndex))
				cashIndex++
			})
		}
		if (quotation.packing_items && quotation.packing_items.length) {
			quotation.packing_items.map((_packing_items) => {
				const key = getQuotationKey(_packing_items)
				cash[key] = JSON.parse(JSON.stringify(cashIndex))
				cashIndex++
			})
		}

		let array = new Array(cashIndex)
		let array_other = []
		list.feed.entry.map((_entry) => {
			const key = getKey(_entry.internal_work)
			const index = cash[key]
			if (index === 0 || index) {
				array[index] = _entry
			} else {
				array_other.push(_entry)
			}
		})

		array_other.sort((a, b) => {
			if (a.internal_work && b.internal_work && a.internal_work.shipment_service_code && b.internal_work.shipment_service_code) {
				const a_index = a.internal_work.shipment_service_code.toString().toLowerCase()
				const b_index = b.internal_work.shipment_service_code.toString().toLowerCase()
				if( a_index < b_index ) return -1
				if( a_index > b_index ) return 1
			}
			return 0
		})

		let new_array = []
		array.map((_array) => {
			if (_array !== null) {
				new_array.push(_array)
			}
		})
		new_array = new_array.concat(array_other)
		return new_array
	}

	list.feed.entry = arrangementList()

	if (isData) {

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
				if (type !== '4' && type !== '5') {
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
