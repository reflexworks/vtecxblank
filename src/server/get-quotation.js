import vtecxapi from 'vtecxapi' 
import { getQuotation } from './get-quotation-from-user'

const quotation = getQuotation()
if (quotation) {
	vtecxapi.doResponse(quotation)
} else {
	vtecxapi.sendMessage(204, null)
}