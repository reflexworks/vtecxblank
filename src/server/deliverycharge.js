import reflexcontext from 'reflexcontext' 
import { CommonGetFlag } from './common'

const shipment_service = reflexcontext.getFeed('/shipment_service')
const isShipment = CommonGetFlag(shipment_service)

if (isShipment) {

	const customer_code = reflexcontext.getQueryString('customer_code')

	let customer = false
	let delivery_charge

	let uri
	if (customer_code) {
		// 顧客ごとの配送料登録の場合
		uri = '/customer/' + customer_code + '/deliverycharge'
		customer = reflexcontext.getEntry('/customer/'+ customer_code)
		const isCustomer = CommonGetFlag(customer)

		if (isCustomer) {
			delivery_charge = reflexcontext.getEntry(uri)
		} else {
			// 顧客がいない場合
	    	reflexcontext.sendMessage(400, '顧客が存在しません。')
		}
	} else {
    	reflexcontext.sendMessage(400, '不正なURLです。')
	}

	const isDc = CommonGetFlag(delivery_charge)

	const setShipmentService = (_ss) => {
		const setZone = (_entry) => {
			let array = []
			for (let i = 0, ii = _entry.zone.length; i < ii; ++i) {
				const zone = _entry.zone[i]
				array.push({
					zone_code: zone.zone_code,
					zone_name: zone.zone_name,
					price: ''
				})
			}
			return array
		}
		const setSeizes = (_entry) => {
			let array = []
			for (let i = 0, ii = _entry.shipment_service.sizes.length; i < ii; ++i) {
				const sizes = _entry.shipment_service.sizes[i]
				let obj = {
					size: sizes.size,
					weight: sizes.weight,
					price: ''
				}
				if (_entry.zone) obj.charge_by_zone = setZone(_entry)
				array.push(obj)
			}
			return array
		}
		let array = []
		let obj = {
			delivery_charge: []
		}
		for (let i = 0, ii = _ss.entry.length; i < ii; ++i) {
			const entry = _ss.entry[i]
			let delivery_charge_obj = {
				shipment_service_name: entry.shipment_service.name,
				shipment_service_code: entry.shipment_service.code,
				shipment_service_type: entry.shipment_service.type,
				shipment_service_service_name: entry.shipment_service.service_name,
				delivery_charge_details: []
			}

			if (entry.shipment_service.sizes) {
				// サイズ・重量がある場合
				delivery_charge_obj.delivery_charge_details = setSeizes(entry)
			} else if (entry.zone) {
				// サイズ・重量がない かつ 地域帯がある場合
				delivery_charge_obj.delivery_charge_details.push({
					charge_by_zone: setZone(entry)
				})
			} else {
				delivery_charge_obj.delivery_charge_details.push({
					price: ''
				})
			}

			obj.delivery_charge.push(delivery_charge_obj)
		}
		array.push(obj)
		return {
			feed: { entry: array }
		}
	}

	let res

	if (isDc) {
		res = delivery_charge
	} else {
		res = setShipmentService(shipment_service.feed)
		if (customer) {
			res.feed.entry[0].link = [{
				___href: uri,
				___rel: 'self'
			}]
		}
	}
	if (customer) {
		res.feed.entry[0].customer = customer.feed.entry[0].customer
	}
	reflexcontext.doResponse(res)

} else {
	reflexcontext.sendMessage(204, null)
}
