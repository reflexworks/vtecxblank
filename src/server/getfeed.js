import vtecxapi from 'vtecxapi' 

const feed = vtecxapi.getFeed('/customer')
vtecxapi.doResponse(feed) 
