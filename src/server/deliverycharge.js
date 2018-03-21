import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'
import { getShipmentService } from './get-shipment-service'

const shipment_service = vtecxapi.getFeed('/shipment_service')
const isShipment = CommonGetFlag(shipment_service)

if (isShipment) {

	const customer_code = vtecxapi.getQueryString('customer_code')

	let customer = false
	let delivery_charge

	let uri
	if (customer_code) {
		// 顧客ごとの配送料登録の場合
		uri = '/customer/' + customer_code + '/deliverycharge'
		customer = vtecxapi.getEntry('/customer/'+ customer_code)
		const isCustomer = CommonGetFlag(customer)

		if (isCustomer) {
			delivery_charge = vtecxapi.getEntry(uri)
		} else {
			// 顧客がいない場合
	    	vtecxapi.sendMessage(400, '顧客が存在しません。')
		}
	} else {
    	vtecxapi.sendMessage(400, '不正なURLです。')
	}

	const isDc = CommonGetFlag(delivery_charge)

	let obj

	if (isDc) {
		obj = delivery_charge
	} else {
		obj = getShipmentService(shipment_service.feed)
		if (customer) {
			obj.feed.entry[0].link = [{
				___href: uri,
				___rel: 'self'
			}]
		}
	}
	if (customer) {
		obj.feed.entry[0].customer = customer.feed.entry[0].customer
	}

	/**
	 * 対象のテンプレート情報を取得する
	 * @param {*} _entry 
	 */
	const margeTemplateData = (_entry) => {
		const setTemplate = (_tempalte_entry, _res_entry) => {
			_tempalte_entry.map((_value) => {
				_res_entry.push(_value)
			})
			return _res_entry
		}
		let res = { feed: { entry: [] } }
		res.feed.entry.push(_entry)
		_entry.delivery_charge.map((_value) => {
			const shipment_service_code = _value.shipment_service_code
			const tempalte_data = vtecxapi.getFeed('/deliverycharge_template?shipment_service.code=' + shipment_service_code)
			if (CommonGetFlag(tempalte_data)) {
				res.feed.entry = setTemplate(tempalte_data.feed.entry, res.feed.entry)
			}
		})
		return res
	}
	const res = margeTemplateData(obj.feed.entry[0])
	vtecxapi.doResponse(res)

} else {
	vtecxapi.sendMessage(204, null)
}
