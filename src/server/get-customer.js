import vtecxapi from 'vtecxapi' 
import { getData } from './get-data-from-user'

const customer = getData('customer')
if (customer) {
	vtecxapi.doResponse(customer)
} else {
	vtecxapi.sendMessage(204, null)
}