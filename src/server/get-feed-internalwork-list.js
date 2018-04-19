import vtecxapi from 'vtecxapi' 

let temp = vtecxapi.getFeed('/internal_work', true)
let result = { feed : { entry : []}}

temp.feed.entry.map(entry => {
	const key = entry.id.split(',')[0]
	entry.id = null
	entry.author = null
	entry.published = null
	entry.updated = null
	result.feed.entry.push(entry)		
	
	const list = vtecxapi.getEntry(key + '/list')
	if (list) {
		list.feed.entry[0].id = null
		list.feed.entry[0].author = null
		list.feed.entry[0].published = null
		list.feed.entry[0].updated = null
		result.feed.entry.push(list.feed.entry[0])		
	}

	const data = vtecxapi.getEntry(key + '/data')
	if (data) {
		data.feed.entry[0].id = null
		data.feed.entry[0].author = null
		data.feed.entry[0].published = null
		data.feed.entry[0].updated = null
		result.feed.entry.push(data.feed.entry[0])		
	}

	const internal_work_list = vtecxapi.getFeed(key + '/list')
	if (internal_work_list) {
		internal_work_list.feed.entry.map((entry) => {
			entry.id = null
			entry.author = null
			entry.published = null
			entry.updated = null
			result.feed.entry.push(entry)			
		})
	}
	const internal_work_data = vtecxapi.getFeed(key + '/data')
	if (internal_work_data) {
		internal_work_data.feed.entry.map((entry) => {
			entry.id = null
			entry.author = null
			entry.published = null
			entry.updated = null
			result.feed.entry.push(entry)			
		})
	}
	
})

vtecxapi.doResponse(result) 

