import vtecxapi from 'vtecxapi' 
const type_ahead = vtecxapi.getFeed('/type_ahead', true)
if (type_ahead) {
	vtecxapi.doResponse(type_ahead)
} else {
	vtecxapi.sendMessage(204, null)
}