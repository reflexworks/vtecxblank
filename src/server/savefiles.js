import vtecxapi from 'vtecxapi' 

const param = new Object()
param.picture1 = vtecxapi.getQueryString('key1')
param.picture2 = vtecxapi.getQueryString('key2')

vtecxapi.saveFiles(param)
