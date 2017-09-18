import reflexcontext from 'reflexcontext' 

const headers = reflexcontext.getHeaders()
const uid = reflexcontext.uid()

let user_agent = headers.filter((entry) => { if (entry.name === 'User-Agent') { return true } else return false })
	.map((entry) =>  { return { 'user_agent': entry.value }  })
let log = { 'feed': { 'entry': [{title:''}] } }

log.feed.entry[0].title = JSON.stringify(user_agent)

try {
	reflexcontext.post(log, '/' + uid + '/group/userinfo')
	const rxid = reflexcontext.RXID()
	reflexcontext.sendMessage(200,'_uid='+uid+'&_RXID='+rxid)
} catch (e)
{
	reflexcontext.sendMessage(400,'userinfo is not registered.')    
}
