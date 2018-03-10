import vtecxapi from 'vtecxapi' 

const customer_code = '0000163'
const quotation_code = '0000102'
const working_yearmonth = '2018/01'

try {
	const response = { 'feed': { 'entry': [{ 'item_details': [] }] } }
	response.feed.entry[0].item_details = getItemDetails(customer_code, quotation_code, working_yearmonth)
	vtecxapi.doResponse(response)

} catch (e) {
	vtecxapi.sendMessage(400, e)
}

function getItemDetails(customer_code, quotation_code, working_yearmonth) {
    
	const internal_work = vtecxapi.getFeed('/internal_work?customer.customer_code=' + customer_code + '&quotation.quotation_code=' + quotation_code + '&internal_work.working_yearmonth=' + working_yearmonth)

	let result = []
	if (internal_work.feed.entry) {
		const id = internal_work.feed.entry[0].id.split(',')[0]
		//		if (internal_work.feed.entry[0].internal_work.is_completed==='0') throw '完了がなされていません'
		const internal_work_all = vtecxapi.getFeed(id+'/data')
		if (internal_work_all.feed.entry) {
			// daily
			result = getDaily(internal_work_all)
			// packing_item
			result = result.concat(getPacking_item(internal_work_all))
		}
	}
	return result

}

function getDaily(internal_work_all) {
	const result = []
	const internal_work_daily = internal_work_all.feed.entry.filter((entry) => { 
		return entry.internal_work.work_type === '0'
	})
	internal_work_daily.map((entry) => {
            	return entry.internal_work.item_details_name
	}).filter((x, i, self) => {
            	return self.indexOf(x) === i
	}).map((item_details_name) => { 
		internal_work_daily.map((entry) => {
			if (entry.internal_work.item_details_name === item_details_name) {
				return entry.internal_work.item_details_unit_name
			}
		}).filter((x, i, self) => {
			return self.indexOf(x) === i
		}).filter(Boolean)                      // nullを除去
			.map((item_details_unit_name) => {
				internal_work_daily.map((entry) => {
					if ((entry.internal_work.item_details_name===item_details_name)&&(entry.internal_work.item_details_unit_name===item_details_unit_name))
						return entry.internal_work.item_details_unit
				}).filter((x, i, self) => {
					return self.indexOf(x) === i
				}).filter(Boolean)              // nullを除去
					.map((item_details_unit) => { 
						result.push(getSumRecordDaily(internal_work_daily,item_details_name,item_details_unit_name,item_details_unit,'daily'))
					})
			})
	})
	return result

}

function getPacking_item(internal_work_all) {
	const result = []
	const internal_work_packing_item = internal_work_all.feed.entry.filter((entry) => {
		return entry.internal_work.work_type === '3'
	})
	internal_work_packing_item.map((entry) => {
		return entry.internal_work.packing_item_code
	}).filter((x, i, self) => {
		return self.indexOf(x) === i  
	}).map((packing_item_code) => {        
    	result.push(getSumRecordPacking_item(internal_work_packing_item,packing_item_code,'packing_item'))
	})
	return result
}

function getSumRecordPacking_item(internal_work_packing_item, packing_item_code,category) {
    
	const quantity = internal_work_packing_item.filter((entry) => {
		return (entry.internal_work.packing_item_code===packing_item_code)
	}).reduce((prev,current) => {
		return {
			'internal_work': {
				'quantity': '' + (Number(prev.internal_work.quantity) + Number(current.internal_work.quantity)),
				'unit_price': current.internal_work.special_unit_price,
				'item_name' : current.internal_work.packing_item_name, 
				'item_code' : current.internal_work.packing_item_code
			}
		}
	}, { 'internal_work': { 'quantity': '0' } })

	return {
		'category': category,
		'item_name': quantity.internal_work ? quantity.internal_work.item_name : '',
		'unit_name': quantity.internal_work ? quantity.internal_work.item_code : '',
		'unit': '個',
		'quantity': quantity.internal_work ? quantity.internal_work.quantity : '0',
		'unit_price': quantity.internal_work ? quantity.internal_work.unit_price : '0',
		'remarks': '',
		'is_taxation': '0'
	}

}

function getSumRecordDaily(internal_work_daily,item_details_name,item_details_unit_name,item_details_unit,category){

	const quantity = internal_work_daily.filter((entry) => {
		return ((entry.internal_work.item_details_name===item_details_name)&&(entry.internal_work.item_details_unit_name===item_details_unit_name)&&(entry.internal_work.item_details_unit===item_details_unit))
	}).reduce((prev,current) => {
		return {
			'internal_work': {
				'quantity': '' + (Number(prev.internal_work.quantity) + Number(current.internal_work.quantity)),
				'unit_price': current.internal_work.unit_price,                
				'remarks': current.internal_work.remarks                
			}
		}
	}, { 'internal_work': { 'quantity': '0' } })
    
	return {
		'category': category,
		'item_name': item_details_name,
		'unit_name': item_details_unit_name,
		'unit': item_details_unit,
		'quantity': quantity.internal_work ? quantity.internal_work.quantity : '0',
		'unit_price': quantity.internal_work ? quantity.internal_work.unit_price : '0',
		'remarks': quantity.internal_work ? quantity.internal_work.remarks : '',
		'is_taxation': '0'
	}
}
