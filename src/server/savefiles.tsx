import * as vtecxapi from 'vtecxapi'

interface Param {
    picture1: string
    picture2: string
}

const param: Param = {
	picture1: vtecxapi.getQueryString('key1'),
	picture2: vtecxapi.getQueryString('key2')
}

vtecxapi.saveFiles(param)