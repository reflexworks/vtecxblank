import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'

const shipment_service = vtecxapi.getFeed('/shipment_service')
const isShipment = CommonGetFlag(shipment_service)

if (isShipment) {

	const customer_code = vtecxapi.getQueryString('customer_code')
	const template = vtecxapi.getQueryString('template')

	let uri
	let customer = false
	let delivery_charge

	if (customer_code) {
		// 顧客ごとの配送料登録の場合
		uri = '/customer/' + customer_code + '/deliverycharge'
		customer = vtecxapi.getEntry('/customer/' + customer_code)
		const isCustomer = CommonGetFlag(customer)

		if (isCustomer) {
			delivery_charge = vtecxapi.getEntry(uri)
		} else {
			// 顧客がいない場合
	    	vtecxapi.sendMessage(400, '顧客が存在しません。')
		}
	} else if (template) {
		// テンプレート登録の場合
		if (template === 'registration') {
			uri = '/deliverycharge_template'
		} else {
			// テンプレート編集の場合
			uri = '/deliverycharge_template/' + template
			delivery_charge = vtecxapi.getEntry(uri)
		}
	} else {
    	vtecxapi.sendMessage(400, '不正なURLです。')
	}

	const isDc = CommonGetFlag(delivery_charge)

	const setShipmentService = (entry) => {

		const setZone = (_entry) => {
			let array = []
			for (let i = 0, ii = _entry.zone.length; i < ii; ++i) {
				const zone = _entry.zone[i]
				array.push({
					zone_code: zone.zone_code,
					zone_name: zone.zone_name,
					price: '',
					invoice_zones: zone.invoice_zones ? zone.invoice_zones : []
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
					is_sizes: '0',
					price: ''
				}
				if (_entry.zone) obj.charge_by_zone = setZone(_entry)
				array.push(obj)
			}
			return array
		}

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
			// サイズ・重量がない かつ 地域帯がある場合
			delivery_charge_obj.delivery_charge_details.push({
				is_sizes: '0',
				charge_by_zone: setZone(entry)
			})
		} else {
			delivery_charge_obj.delivery_charge_details.push({
				is_sizes: '0',
				price: ''
			})
		}

		return delivery_charge_obj
	}

	let _cashSS
	const cashShipmentService = (_shipment_service) => {
		const cashSizes = (_sizes) => {
			let obj = {}
			if (_sizes) {
				for (let i = 0, ii = _sizes.length; i < ii; ++i) {
					const sizes = _sizes[i]
					const size = sizes.size ? sizes.size : ''
					const weight = sizes.weight ? sizes.weight : ''
					const key = 'sizes_' + size  + ',' + weight
					obj[key] = true
				}
			} else {
				const key = 'sizes_,'
				obj[key] = true
			}
			return obj
		}
		const cashZone = (_zone) => {
			let obj = {}
			for (let i = 0, ii = _zone.length; i < ii; ++i) {
				const zone = _zone[i]
				obj[zone.zone_code] = zone
			}
			return obj
		}
		let obj = {}
		for (let i = 0, ii = _shipment_service.entry.length; i < ii; ++i) {
			const entry = _shipment_service.entry[i]
			if (entry.shipment_service) {
				const code = entry.shipment_service.code
				obj[code] = entry
				obj[code].sizes = cashSizes(entry.shipment_service.sizes)
				if (entry.zone) {
					obj[code].zones = cashZone(entry.zone)
				}
			}
		}
		return obj
	}
	const margeDeliveryCharge = (_entry) => {

		const margeDeliveryChargeDetails = (_delivery_charge_details, _cashData) => {

			const isSizes = (_size, _weight, _cashData) => {
				const size = _size ? _size : ''
				const weight = _weight ? _weight : ''
				const key = 'sizes_' + size + ',' + weight
				const value = _cashData.sizes[key] ? '0' : '1'
				_cashData.sizes[key] = false
				return value
			}
			const margeInvoiceZones = (_invoice_zones, _cashIz) => {
				let array = []
				if (_invoice_zones) {
					for (let i = 0, ii = _invoice_zones.length; i < ii; ++i) {
						const iz = _invoice_zones[i]
						// 請求地域帯名が変更されている場合
						if (iz.invoice_zone !== _cashIz[i].invoice_zone) {
							iz.invoice_zone_old = iz.invoice_zone
							iz.invoice_zone = _cashIz[i].invoice_zone
						}
						array.push(iz)

						_cashIz[i].invoice_zone = null

					}
				}

				// マスタに新規追加された請求地域帯を最後尾に追加する
				if (_cashIz) {
					_cashIz.map((__value) => {
						if (__value) {
							array.push({
								invoice_zone: __value.invoice_zone
							})
						}
					})
				}

				return array
			}

			let _init_charge_by_zone = []
			const margeChargeByZone = (_charge_by_zone, _cashData) => {
				let array = []
				for (let i = 0, ii = _charge_by_zone.length; i < ii; ++i) {
					const cz = _charge_by_zone[i]
					const cashCz = _cashData.zones[cz.zone_code]

					// 地域帯存在チェック
					if (!cashCz) {
						// マスタに該当の地域帯コードが存在しない場合
						cz.is_zone = '1'
					} else {
						// 地域帯名が変更されている場合
						if (cz.zone_name !== cashCz.zone_name) {
							cz.zone_name_old = cz.zone_name
							cz.zone_name = cashCz.zone_name
							cz.is_zone = '0'
						} else {
							cz.is_zone = null
						}
						cz.invoice_zones = margeInvoiceZones(cz.invoice_zones, cashCz.invoice_zones)
						_cashData.zones[cz.zone_code].invoice_zones = cz.invoice_zones
						_cashData.zones[cz.zone_code].is_zone = true
					}

					_init_charge_by_zone.push({
						zone_code: cz.zone_code,
						zone_name: cz.zone_name,
						price: '',
						invoice_zones: cz.invoice_zones
					})

					array.push(cz)

				}

				return array
			}

			let array = []
			for (let i = 0, ii = _delivery_charge_details.length; i < ii; ++i) {
				let dcd = _delivery_charge_details[i]

				// サイズと重量の存在チェック
				dcd.is_sizes = isSizes(dcd.size, dcd.weight, _cashData)

				if (dcd.charge_by_zone) {

					dcd.charge_by_zone = margeChargeByZone(dcd.charge_by_zone, _cashData)

					// マスタに新規追加された地域帯を最後尾に追加する
					Object.keys(_cashData.zones).forEach((__key) => {
						const cz = _cashData.zones[__key]
						if (!cz.is_zone) {
							dcd.charge_by_zone.push({
								is_zone: '2',
								zone_code: cz.zone_code,
								zone_name: cz.zone_name,
								price: '',
								invoice_zones: cz.invoice_zones
							})
						}
					})
				}
				array.push(dcd)
			}

			// マスタに新規追加されたサイズを最後尾に追加する
			Object.keys(_cashData.sizes).forEach((__key) => {
				if (_cashData.sizes[__key] === true) {
					const sizes = __key.split('_')[1]
					const size = sizes.split(',')[0]
					const weight = sizes.split(',')[1]
					array.push({
						size: size && size !== '' ? size : '',
						weight: weight && weight !== '' ? weight : '',
						is_sizes: '2',
						charge_by_zone: _init_charge_by_zone
					})
				}
			})
			return array
		}

		let obj = {
			feed: {
				entry: [{
					delivery_charge: []
				}]
			}
		}
		for (let i = 0, ii = _entry.delivery_charge.length; i < ii; ++i) {

			let entry = _entry.delivery_charge[i]
			const cashData = _cashSS[entry.shipment_service_code]

			if (cashData) {
				// 配送業者名が変更されている場合
				const new_shipment_service_name = cashData.shipment_service.name
				if (entry.shipment_service_name !== new_shipment_service_name) {
					entry.shipment_service_name_old = entry.shipment_service_name
					entry.shipment_service_name = new_shipment_service_name
				} else {
					entry.shipment_service_name_old = null
				}

				// 配送サービス名が変更されている場合
				const new_service_name = cashData.shipment_service.service_name
				if (entry.service_name !== new_service_name) {
					entry.service_name_old = entry.service_name
					entry.service_name = new_service_name
				} else {
					entry.service_name_old = null
				}

				entry.is_shipment_service = null
				entry.delivery_charge_details = margeDeliveryChargeDetails(entry.delivery_charge_details, cashData)

			} else {
				entry.is_shipment_service = '1'
			}

			obj.feed.entry[0].delivery_charge.push(entry)

			_cashSS[entry.shipment_service_code] = false
		}

		// マスタに新規追加された配達業者を最後尾に追加する
		Object.keys(_cashSS).forEach((__key) => {
			const data = _cashSS[__key]
			if (_cashSS[__key] !== false) {
				const delivery_charge = setShipmentService(data)
				delivery_charge.is_shipment_service = '2'
				obj.feed.entry[0].delivery_charge.push(delivery_charge)
			}
		})

		obj.feed.entry[0].id = _entry.id
		obj.feed.entry[0].link = _entry.link
		obj.feed.entry[0].remarks = _entry.remarks
		obj.feed.entry[0].title = _entry.title
		return obj
	}

	let res
	if (isDc) {
		_cashSS = cashShipmentService(shipment_service.feed)
		res = margeDeliveryCharge(delivery_charge.feed.entry[0])
	} else {
		let obj = {
			delivery_charge: []
		}
		for (let i = 0, ii = shipment_service.feed.entry.length; i < ii; ++i) {
			const entry = shipment_service.feed.entry[i]
			obj.delivery_charge.push(setShipmentService(entry))
		}
		res = {feed: { entry: [obj] }}
	}

	if (!isDc && customer) {
		res.feed.entry[0].link = [{
			___href: uri,
			___rel: 'self'
		}]
	}
	if (customer) {
		res.feed.entry[0].customer = customer.feed.entry[0].customer
	}
	vtecxapi.doResponse(res)

} else {
	vtecxapi.sendMessage(204, null)
}
