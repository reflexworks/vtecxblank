import vtecxapi from 'vtecxapi'
import jsSHA from 'jssha'

const password = 'abc123'
const shaObj = new jsSHA('SHA-256', 'TEXT')
shaObj.update(password)
const hashpass = shaObj.getHash('B64')

let reqdata = {
	'feed': {
		'entry': [{
			'contributor':
			[{ 'uri': 'urn:vte.cx:auth:test12@virtual-tech.net,'+hashpass, 'name': 'nickname' }]
		},{
			'contributor':
			[{ 'uri': 'urn:vte.cx:auth:test13@virtual-tech.net,'+hashpass, 'name': 'nickname' }]
		},{
			'contributor':
			[{ 'uri': 'urn:vte.cx:auth:test14@virtual-tech.net,'+hashpass, 'name': 'nickname' }]
		}
		]
	}
}

const result = vtecxapi.adduserByAdmin(reqdata)
let msg = ''
result.feed.entry.map(entry => { 
	msg += ' user=' + entry.title + ' uid=' + entry.id.match(/\/(\d+),\d+/)[1]
})
vtecxapi.sendError(200,msg)



