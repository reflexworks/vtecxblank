import vtecxapi from 'vtecxapi' 

let temp = vtecxapi.getFeed('/customer', true)
let result = { feed : { entry : []}}

temp.feed.entry.map(entry => {
	const key = entry.id.split(',')[0]
	const deliverycharge = vtecxapi.getEntry(key + '/deliverycharge')
	if (deliverycharge.feed.entry) {
		deliverycharge.feed.entry[0].id = null
		deliverycharge.feed.entry[0].author = null
		deliverycharge.feed.entry[0].published = null
		deliverycharge.feed.entry[0].updated = null
		result.feed.entry.push(deliverycharge.feed.entry[0])
	}
	
})

vtecxapi.doResponse(result) 


