import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'
import { getShipmentService } from './get-shipment-service'
import { getSortShipmentServiceBody } from './get-shipment-service-sort'

const shipment_service = getSortShipmentServiceBody()
const isShipment = CommonGetFlag(shipment_service)

if (isShipment) {

	let res = getShipmentService(shipment_service.feed)
	vtecxapi.doResponse(res)

} else {
	vtecxapi.sendMessage(204, null)
}
