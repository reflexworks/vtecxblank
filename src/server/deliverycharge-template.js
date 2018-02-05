import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'
import { getShipmentService } from './get-shipment-service'

const name = vtecxapi.getQueryString('name')
let option = '?shipment_service.name=' + name
const service_name = vtecxapi.getQueryString('service_name')
if (service_name) {
	option = option + '&shipment_service.service_name=' + service_name
}
const shipment_service = vtecxapi.getFeed('/shipment_service' + option)
const isShipment = CommonGetFlag(shipment_service)

if (isShipment) {

	let res = getShipmentService(shipment_service.feed)
	res.feed.entry[0].shipment_service = shipment_service.feed.entry[0].shipment_service

	vtecxapi.doResponse(res)

} else {
	vtecxapi.sendMessage(204, null)
}
