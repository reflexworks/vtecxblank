import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'
import { getShipmentService } from './get-shipment-service'

const shipment_service = vtecxapi.getFeed('/shipment_service')
const isShipment = CommonGetFlag(shipment_service)

if (isShipment) {

	let res = getShipmentService(shipment_service.feed)
	vtecxapi.doResponse(res)

} else {
	vtecxapi.sendMessage(204, null)
}
