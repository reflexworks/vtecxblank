import vtecxapi from 'vtecxapi' 
import { getData } from './get-data-from-user'

const inquiry = getData('inquiry')
if (inquiry) {
	vtecxapi.doResponse(inquiry)
} else {
	vtecxapi.sendMessage(204, null)
}