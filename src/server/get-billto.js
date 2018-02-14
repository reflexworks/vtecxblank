import vtecxapi from 'vtecxapi' 
import { getData } from './get-data-from-user'

const billto = getData('billto')
if (billto) {
	vtecxapi.doResponse(billto)
} else {
	vtecxapi.sendMessage(204, null)
}