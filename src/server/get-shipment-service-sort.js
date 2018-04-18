import vtecxapi from 'vtecxapi' 

export function getSortShipmentServiceBody(_shipment_service_code) {

	let shipment_service
	if (_shipment_service_code) {
		shipment_service = vtecxapi.getEntry('/shipment_service/' + _shipment_service_code)
	} else {
		shipment_service = vtecxapi.getFeed('/shipment_service')
	}

	if (shipment_service) {
		const getSortIndex = (_obj, _key) => {
			let size = '0000000'
			if (_obj[_key]) {
				const num = parseInt(_obj[_key].replace(/[^0-9]/g,''))
				size = ('000000' + num).slice(-7)
			}
			return size.toString().toLowerCase()
		}
		const sortSizes = (_sizes) => {
			return _sizes.sort((a, b) => {
				let a_index = a_index + getSortIndex(a, 'size')
				a_index = a_index + getSortIndex(a, 'weight')

				let b_index = b_index + getSortIndex(b, 'size')
				b_index = b_index + getSortIndex(b, 'weight')

				if (a_index < b_index) {
					return -1
				} else if (a_index > b_index) {
					return 1
				}
				return 0
			})
		}
		shipment_service.feed.entry = shipment_service.feed.entry.map((_entry) => {
			if (_entry.shipment_service.sizes) {
				_entry.shipment_service.sizes = sortSizes(_entry.shipment_service.sizes)
			}
			return _entry
		})
		return shipment_service
	} else {
		return null
	}
}

const shipment_service_code = vtecxapi.getQueryString('shipment_service_code')
const shipment_service = getSortShipmentServiceBody(shipment_service_code)
if (shipment_service) {
	vtecxapi.doResponse(shipment_service)
} else {
	vtecxapi.sendMessage(204, null)
}