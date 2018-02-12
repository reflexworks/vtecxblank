import vtecxapi from 'vtecxapi' 

const feed = vtecxapi.getFeed('/registration')
vtecxapi.doResponse(feed) 


