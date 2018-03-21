import vtecxapi from 'vtecxapi' 
import { getData } from './get-data-from-user'

const internal_work = getData('internal_work')
if (internal_work) {
	vtecxapi.doResponse(internal_work)
} else {
	vtecxapi.sendMessage(204, null)
}