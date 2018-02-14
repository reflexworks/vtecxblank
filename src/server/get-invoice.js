import vtecxapi from 'vtecxapi' 
import { getData } from './get-data-from-user'

const invoice = getData('invoice')
if (invoice) {
	vtecxapi.doResponse(invoice)
} else {
	vtecxapi.sendMessage(204, null)
}