import vtecxapi from 'vtecxapi' 

const url = vtecxapi.getQueryString('q')
let temp = vtecxapi.getFeed('/' + url, true)
let result = { feed : { entry : []}}

temp.feed.entry.map(entry => {
	entry.id = null
	entry.author = null
	entry.published = null
	entry.updated = null
	result.feed.entry.push(entry)
})


vtecxapi.doResponse(result) 

