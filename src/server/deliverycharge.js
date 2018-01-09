import reflexcontext from 'reflexcontext' 
import { CommonGetFlag } from './common'

const shipment_service = reflexcontext.getFeed('/shipment_service')
const isShipment = CommonGetFlag(shipment_service)

if (isShipment) {

	const customer_code = reflexcontext.getQueryString('customer_code')
	const template = reflexcontext.getQueryString('template')

	let uri
	let customer = false
	let delivery_charge

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
	} else if (template) {
		// テンプレート登録の場合
		if (template === 'registration') {
			uri = '/deliverycharge_template'
		} else {
			// テンプレート編集の場合
			uri = '/deliverycharge_template/' + template
			delivery_charge = reflexcontext.getEntry(uri)
		}
	} else {
    	reflexcontext.sendMessage(400, '不正なURLです。')
	}

	const isDc = CommonGetFlag(delivery_charge)

	// 登録済みの配送料を検索用にキャッシュ化
	let _cashDc = {}
	const setCashDc = (_dcEntry) => {
		const setZoneCode = (_charge_by_zone) => {
			let cbzObj = {}
			for (let i = 0, ii = _charge_by_zone.length; i < ii; ++i) {
				const charge_by_zone = _charge_by_zone[i]
				cbzObj[charge_by_zone.zone_code] = charge_by_zone.price ? charge_by_zone.price : ''
			}
			return cbzObj
		}
		const setDeliveryChargeDetails = (_delivery_charge_details) => {
			let array = []
			for (let i = 0, ii = _delivery_charge_details.length; i < ii; ++i) {
				let dcdObj = {}
				const dcd = _delivery_charge_details[i]
				dcdObj.price = dcd.price ? dcd.price : ''
				if (dcd.charge_by_zone) {
					dcdObj.zone = setZoneCode(dcd.charge_by_zone)
				}
				array.push(dcdObj)
			}
			return array
		}
		const setDeliveryCompany = (_entry) => {
			let dcObj = {}
			if (_entry.delivery_charge) {
				for (let i = 0, ii = _entry.delivery_charge.length; i < ii; ++i) {
					const dc = _entry.delivery_charge[i]
					dcObj[dc.shipment_service_code] = setDeliveryChargeDetails(dc.delivery_charge_details)
				}
			}
			return dcObj
		}
		let obj = {}
		for (let i = 0, ii = _dcEntry.length; i < ii; ++i) {
			obj = setDeliveryCompany(_dcEntry[i])
		}
		return obj
	}

	const setShipmentService = (_ss) => {
		const getCash = (_code, _index) => {
			return _cashDc[_code] && _cashDc[_code][_index] ? _cashDc[_code][_index] : null
		}
		const setZone = (_entry, _cashData) => {
			let array = []
			for (let i = 0, ii = _entry.zone.length; i < ii; ++i) {
				const zone = _entry.zone[i]
				array.push({
					zone_code: zone.zone_name,
					zone_name: zone.zone_name,
					price: _cashData ? _cashData.zone[zone.zone_name] : ''
				})
			}
			return array
		}
		const setSeizes = (_entry) => {
			let array = []
			for (let i = 0, ii = _entry.shipment_service.sizes.length; i < ii; ++i) {
				const cashData = getCash(_entry.shipment_service.code, i)
				const sizes = _entry.shipment_service.sizes[i]
				let obj = {
					size: sizes.size,
					weight: sizes.weight,
					price: cashData ? cashData.price : ''
				}
				if (_entry.zone) obj.charge_by_zone = setZone(_entry, cashData)
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
				service_name: entry.shipment_service.service_name,
				delivery_charge_details: []
			}

			if (entry.shipment_service.sizes) {
				// サイズ・重量がある場合
				delivery_charge_obj.delivery_charge_details = setSeizes(entry)
			} else if (entry.zone) {
				const cashData = getCash(entry.shipment_service.code, 0)
				// サイズ・重量がない かつ 地域帯がある場合
				delivery_charge_obj.delivery_charge_details.push({
					charge_by_zone: setZone(entry, cashData)
				})
			} else {
				const cashData = getCash(entry.shipment_service.code, 0)
				delivery_charge_obj.delivery_charge_details.push({
					price: cashData ? cashData.price : ''
				})
			}

			obj.delivery_charge.push(delivery_charge_obj)
		}
		array.push(obj)
		return {
			feed: { entry: array }
		}
	}

	if (isDc) _cashDc = setCashDc(delivery_charge.feed.entry)
	const res = setShipmentService(shipment_service.feed)

	if (isDc) {
		res.feed.entry[0].title = delivery_charge.feed.entry[0].title
		res.feed.entry[0].id = delivery_charge.feed.entry[0].id
		res.feed.entry[0].link = delivery_charge.feed.entry[0].link
		res.feed.entry[0].remarks = delivery_charge.feed.entry[0].remarks
	} else {
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
