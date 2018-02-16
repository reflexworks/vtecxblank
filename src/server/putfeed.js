import vtecxapi from 'vtecxapi' 

const request = vtecxapi.getRequest()
const result = vtecxapi.put(request, true)
vtecxapi.doResponse(result)