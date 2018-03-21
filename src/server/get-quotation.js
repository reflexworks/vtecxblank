import vtecxapi from 'vtecxapi' 
import { getData } from './get-data-from-user'

const quotation = getData('quotation')
if (quotation) {
	vtecxapi.doResponse(quotation)
} else {
	vtecxapi.sendMessage(204, null)
}