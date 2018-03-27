import vtecxapi from 'vtecxapi' 
import { getInternalworkdata } from './get-internalwork-data'

const body = []
const header = ['顧客コード', '見積書コード', '作業年月','作業日','作業者','作業タイプ','項目1','項目2','項目3','単価','個数']
body.push(header)

const code = vtecxapi.getQueryString('code')  //0000309-201802-0000015

const codes = code.split('-')
if (codes.length > 2) {

	const quotation_code = codes[0]
	const working_yearmonth = codes[1].slice(0,4)+'/'+codes[1].slice(-2)
	const customer_code = codes[2]
	const internal_work_all = getInternalworkdata(working_yearmonth, customer_code, quotation_code)
	
	const internal_work = internal_work_all.feed.entry.filter((entry) => {
		return entry.internal_work.work_type === '4'
	}).concat(
		internal_work_all.feed.entry.filter((entry) => {
			return entry.internal_work.work_type === '5'
		}).sort((entry1,entry2) => { 
			if (entry1.internal_work.period > entry2.internal_work.period) return 1
			else return -1
		})
	).concat(
		internal_work_all.feed.entry.filter((entry) => {
			return entry.internal_work.work_type === '3'
		})
	).concat(
		internal_work_all.feed.entry.filter((entry) => {
			return entry.internal_work.work_type === '1'
		})
	).concat(
		internal_work_all.feed.entry.filter((entry) => {
			return entry.internal_work.work_type === '2'
		})
	).concat(
		internal_work_all.feed.entry.filter((entry) => {
			return entry.internal_work.work_type === '0'
		}).sort((entry1,entry2) => { 
			if (Number(entry1.internal_work.working_day) > Number(entry2.internal_work.working_day)) return 1
			else return -1
		})
	)

	internal_work.map((entry) => {
		let unit_price = entry.internal_work.unit_price || ''
		if (entry.internal_work.work_type === '3') {
			unit_price = entry.internal_work.special_unit_price || ''
		}
		const record = ['"' + customer_code + '"', quotation_code, working_yearmonth, entry.internal_work.working_day, entry.internal_work.staff_name, getWorkType(entry.internal_work.work_type), getItem1(entry.internal_work), getItem2(entry.internal_work), getItem3(entry.internal_work), unit_price.replace(/[^0-9^\\.]/g,''),entry.internal_work.quantity]
		body.push(record)
	}
	)
	vtecxapi.doResponseCsv(body, 'internalwork_' + quotation_code + '_' + working_yearmonth + '_' + customer_code + '.csv')

}

function getItem1(internal_work) {
	//0: 見積作業, 1: 発送作業, 2: 集荷作業, 3: 資材作業, 4: 月次作業, 5: 期次作業
	switch (internal_work.work_type) {
	case '0':
		return internal_work.item_details_name
	case '1':
		return internal_work.shipment_service_service_name
	case '2':
		return internal_work.shipment_service_service_name
	case '3':
		return internal_work.packing_item_name
	case '4':
		return internal_work.item_details_name
	case '5':
		return internal_work.item_details_name
	}
}

function getItem2(internal_work) {
	//0: 見積作業, 1: 発送作業, 2: 集荷作業, 3: 資材作業, 4: 月次作業, 5: 期次作業
	switch (internal_work.work_type) {
	case '0':
		return internal_work.item_details_unit_name
	case '1':
		return internal_work.shipment_service_size
	case '2':
		return internal_work.shipment_service_size
	case '3':
		return internal_work.packing_item_code	
	case '4':
		return internal_work.item_details_unit_name
	case '5':
		return internal_work.item_details_unit_name+'('+internal_work.period+'期)'
	}
}

function getItem3(internal_work) {
	//0: 見積作業, 1: 発送作業, 2: 集荷作業, 3: 資材作業, 4: 月次作業, 5: 期次作業
	switch (internal_work.work_type) {
	case '0':
		return internal_work.item_details_unit
	case '1':
		return internal_work.shipment_service_weight
	case '2':
		return internal_work.shipment_service_weight
	case '3':
		return ''	
	case '4':
		return internal_work.item_details_unit
	case '5':
		return internal_work.item_details_unit	
	}
}

function getWorkType(work_type) {
	//0: 見積作業, 1: 発送作業, 2: 集荷作業, 3: 資材作業, 4: 月次作業, 5: 期次作業
	switch (work_type) {
	case '0':
		return '日次作業'
	case '1':
		return '発送作業'	
	case '2':
		return '集荷作業'	
	case '3':
		return '資材作業'	
	case '4':
		return '月次作業'	
	case '5':
		return '期次作業'	
	}
}
