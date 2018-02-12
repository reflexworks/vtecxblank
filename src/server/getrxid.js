import vtecxapi from 'vtecxapi' 

const headers = vtecxapi.getHeaders()
const uid = vtecxapi.uid()

let user_agent = headers.filter((entry) => { if (entry.name === 'User-Agent') { return true } else return false })
	.map((entry) =>  { return { 'user_agent': entry.value }  })
let log = { 'feed': { 'entry': [{title:''}] } }

log.feed.entry[0].title = JSON.stringify(user_agent)

try {
	vtecxapi.post(log, '/' + uid + '/group/userinfo')
	const rxid = vtecxapi.RXID()
	vtecxapi.sendMessage(200,'_uid='+uid+'&_RXID='+rxid)
} catch (e)
{
	vtecxapi.sendMessage(400,'userinfo is not registered.')    
}
