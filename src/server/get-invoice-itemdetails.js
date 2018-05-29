import vtecxapi from 'vtecxapi' 
import { getBillingdata } from './get-billingdata'
import { getInternalworkdata } from './get-internalwork-data'

const customer_code = vtecxapi.getQueryString('customer_code') //0000182 // 0000163
const quotation_code = vtecxapi.getQueryString('quotation_code') //0000107
const working_yearmonth = vtecxapi.getQueryString('working_yearmonth') //2018/01

try {
	const response = { 'feed': { 'entry': [{ 'item_details': [] }] } }
	response.feed.entry[0].item_details = getInvoiceItemDetails(customer_code, quotation_code, working_yearmonth)
	vtecxapi.doResponse(response)

} catch (e) {
	vtecxapi.sendMessage(400, e)
}


export function getInvoiceItemDetails(customer_code, quotation_code, working_yearmonth) {
    
	const shipment_service = vtecxapi.getFeed('/shipment_service',true)
	if (!shipment_service.feed.entry) throw '配送業者マスタが登録されていません'

	let result = []
	const internal_work_all = getInternalworkdata(working_yearmonth,customer_code,quotation_code)
	if (internal_work_all) {
		// daily
		result = getDaily(internal_work_all)
		// packing_item
		result = result.concat(getPacking_item(internal_work_all))
		// monthly
		result = result.concat(getMonthly(internal_work_all))
		// period
		result = result.concat(getPeriod(internal_work_all))
	}

	// shipping
	shipment_service.feed.entry.map((entry) => {
		if (entry.shipment_service.code === 'YH1' || entry.shipment_service.code === 'YH2' || entry.shipment_service.code === 'YH3' || entry.shipment_service.code === 'ECO1' || entry.shipment_service.code === 'ECO2') {
			result = result.concat(getShipping(customer_code, working_yearmonth, entry.shipment_service.code, '0', entry.shipment_service.name + '/' + entry.shipment_service.service_name))    // 出荷
			result = result.concat(getShipping(customer_code, working_yearmonth, entry.shipment_service.code, '1', entry.shipment_service.name+'/'+entry.shipment_service.service_name))    // 集荷			
		}
	})
	return result
}

function getShipping(customer_code, working_yearmonth,shipment_service_code,shipment_class,shipment_service_name) {
	const result = []
	const billing_data = getBillingdata(working_yearmonth.replace('/', ''), customer_code, shipment_service_code, shipment_class).billing_data
	if (billing_data) {
		const summary = billing_data.feed.entry
			.reduce((prev, current) => { 
				const prev_quantity = prev&&prev.billing_data ? Number(prev.billing_data.quantity) : 0			
				const prev_delivery_charge = prev&&prev.billing_data ? Number(prev.billing_data.delivery_charge) : 0			
				const current_quantity = current&&current.billing_data ? Number(current.billing_data.quantity) : 0			
				const current_delivery_charge = current&&current.billing_data ? Number(current.billing_data.delivery_charge) : 0			
				return {
					'billing_data': {
						'delivery_charge': ''+(prev_delivery_charge+current_delivery_charge),
						'quantity': '' + (prev_quantity + current_quantity),
						'unit_price': current&&current.billing_data ? current.billing_data.unit_price : '0'
					}
				}
			}, { 'billing_data': { 'delivery_charge': '0', 'quantity': '0', 'unit_price': '0' } })

		if (summary&&summary.billing_data&&(Number(summary.billing_data.delivery_charge) > 0)) {			
			const record = {
				'category': shipment_class==='0' ? 'shipping':'collecting',
				'item_name': shipment_service_name,
				'unit_name': '',
				'unit': '個',
				'quantity': summary.billing_data.quantity,
				'unit_price': (shipment_service_code==='YH2'||shipment_service_code==='YH3') ? summary.billing_data.unit_price :'個別',
				'remarks': (shipment_service_code==='YH2'||shipment_service_code==='YH3') ? '':'別紙明細',
				'is_taxation': '0',
				'amount': summary.billing_data.delivery_charge 
			}
			result.push(record)
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
			} else return ''
		}).filter((x, i, self) => {
			return self.indexOf(x) === i
		}).map((item_details_unit_name) => {
			internal_work_daily.map((entry) => {
				if ((entry.internal_work.item_details_name === item_details_name) && (entry.internal_work.item_details_unit_name === item_details_unit_name)) {
					return entry.internal_work.item_details_unit						
				}else return ''
			}).filter((x, i, self) => {
				return self.indexOf(x) === i
			})
				.map((item_details_unit) => { 
					const record = getSumRecordDaily(internal_work_daily, item_details_name, item_details_unit_name, item_details_unit) 
					if (record) {
						result.push(record)					
					}
				})
		})
	})
	return result
}

function getMonthly(internal_work_all) {
	const result = []
	const internal_work_monthly = internal_work_all.feed.entry.filter((entry) => {
		return entry.internal_work.work_type === '4'
	})

	internal_work_monthly.map((entry) => {

		const quantity = entry.internal_work ? entry.internal_work.quantity.replace(/[^0-9^\\.]/g,'') : '0'
		const unit_price = entry.internal_work ? entry.internal_work.unit_price.replace(/[^0-9^\\.]/g,'') : '0'

		const amount = Number(quantity)*Number(unit_price)
		if (amount > 0) {
			const record = {
				'category': 'monthly',
				'item_name': entry.internal_work.item_details_name + '/' + entry.internal_work.item_details_unit_name,
				'unit_name': '',
				'unit': entry.internal_work.item_details_unit,
				'quantity': quantity,
				'unit_price': unit_price,
				//				'remarks': entry.internal_work.remarks,
				'remarks': '',
				'is_taxation': '0',
				'amount': '' + amount
			}
			result.push(record)
		}	
	})
	return result
}

function getPeriod(internal_work_all) {
	const result = []
	const internal_work_period = internal_work_all.feed.entry.filter((entry) => {
		return entry.internal_work.work_type === '5'
	})
    
	internal_work_period.map((entry) => {
            	return entry.internal_work.item_details_name
	}).filter((x, i, self) => {
            	return self.indexOf(x) === i
	}).map((item_details_name) => { 
		internal_work_period.map((entry) => {
			if (entry.internal_work.item_details_name === item_details_name) {
				return entry.internal_work.item_details_unit_name
			}
		}).filter((x, i, self) => {
			return self.indexOf(x) === i
		})
			.map((item_details_unit_name) => {
				internal_work_period.map((entry) => {
					if ((entry.internal_work.item_details_name===item_details_name)&&(entry.internal_work.item_details_unit_name===item_details_unit_name))
						return entry.internal_work.item_details_unit
				}).filter((x, i, self) => {
					return self.indexOf(x) === i
				})
					.map((item_details_unit) => { 
						for (let i = 1; i < 4; i++) {
							let record = getRecordPeriod(internal_work_period, item_details_name, item_details_unit_name, item_details_unit, ''+i)
							if (record) {
								result.push(record)	
							}							
						}
					})
			})
	})
	return result
}

function getRecordPeriod(internal_work_daily,item_details_name,item_details_unit_name,item_details_unit,period){

	const period_record = internal_work_daily.filter((entry) => {
		return ((entry.internal_work.item_details_name===item_details_name)&&(entry.internal_work.item_details_unit_name===item_details_unit_name)&&(entry.internal_work.item_details_unit===item_details_unit)&&(entry.internal_work.period===period))
	})
    
	const quantity = period_record[0].internal_work ? period_record[0].internal_work.quantity.replace(/[^0-9^\\.]/g,'') : '0'
	const unit_price = period_record[0].internal_work ? period_record[0].internal_work.unit_price.replace(/[^0-9^\\.]/g,'') : '0'
    
	const amount = Number(quantity)*Number(unit_price)
	if (amount > 0) {
		return {
			'category': 'period',
			'item_name': item_details_name,
			'unit_name': '',
			'unit': period + '期/' + item_details_unit,
			'quantity': quantity,
			'unit_price': unit_price,
			'remarks': '',
			//			'remarks': period_record[0].internal_work.remarks,
			'is_taxation': '0',
			'amount': '' + amount
		}
	}else return null
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
		const record = getSumRecordPacking_item(internal_work_packing_item, packing_item_code)
		if (record) {
			result.push(record)
		}
	})
	return result
}

function getSumRecordPacking_item(internal_work_packing_item, packing_item_code) {
    
	const entry = internal_work_packing_item.filter((entry) => {
		return (entry.internal_work.packing_item_code===packing_item_code)
	}).reduce((prev,current) => {
		return {
			'internal_work': {
				'quantity': '' + (Number(prev.internal_work.quantity) + Number(current.internal_work.quantity.replace(/[^0-9^\\.]/g,''))),
				'unit_price': current.internal_work.special_unit_price.replace(/[^0-9^\\.]/g,''),
				'item_name' : current.internal_work.packing_item_name, 
				'remarks' : current.internal_work.packing_item_code
			}
		}
	}, { 'internal_work': { 'quantity': '0' } })

	const quantity = entry.internal_work ? entry.internal_work.quantity : '0'
	const unit_price = entry.internal_work ? entry.internal_work.unit_price : '0'

	const amount = Number(quantity)*Number(unit_price)
	if (amount > 0) {
		return {
			'category': 'packing_item',
			'item_name': entry.internal_work ? entry.internal_work.item_name : '',
			'unit_name': '',
			'unit': '個',
			'quantity': quantity,
			'unit_price': unit_price,
			'remarks': entry.internal_work ? entry.internal_work.remarks : '',
			'is_taxation': '0',
			'amount': '' + amount
		}
	}else return null

}

function getSumRecordDaily(internal_work_daily,item_details_name,item_details_unit_name,item_details_unit){

	const entry = internal_work_daily.filter((entry) => {
		return ((entry.internal_work.item_details_name===item_details_name)&&(entry.internal_work.item_details_unit_name===item_details_unit_name)&&(entry.internal_work.item_details_unit===item_details_unit))
	}).reduce((prev,current) => {
		return {
			'internal_work': {
				'quantity': '' + (Number(prev.internal_work.quantity) + Number(current.internal_work.quantity.replace(/[^0-9^\\.]/g,''))),
				'unit_price': current.internal_work.unit_price.replace(/[^0-9^\\.]/g,''),                
				'remarks': current.internal_work.remarks                
			}
		}
	}, { 'internal_work': { 'quantity': '0' } })
	
	const quantity = entry.internal_work ? entry.internal_work.quantity : '0'
	const unit_price = entry.internal_work ? entry.internal_work.unit_price : '0'
	
	const amount = Number(quantity)*Number(unit_price)
	if (amount > 0) {
		return {
			'category': 'daily',
			'item_name': item_details_name + '/' + item_details_unit_name,
			'unit_name': '',
			'unit': item_details_unit,
			'quantity': quantity,
			'unit_price': unit_price,
			//			'remarks': entry.internal_work ? entry.internal_work.remarks : '',
			'remarks': '',
			'is_taxation': '0',
			'amount': '' + amount
		}
	}else return null
}

