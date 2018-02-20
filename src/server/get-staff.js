import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'

const uid = vtecxapi.uid()
const email = vtecxapi.getEntry('/' + uid).feed.entry[0].title
const staff_data = vtecxapi.getFeed('/staff?staff.staff_email=' + email)
const isStaff = CommonGetFlag(staff_data)

if (isStaff) {
	vtecxapi.doResponse(staff_data)
} else {
	vtecxapi.sendMessage(204, null)
}
