import reflexcontext from 'reflexcontext' 
import { CommonGetFlag } from './common'

const uri = reflexcontext.getQueryString('code')
const approval_data = reflexcontext.getFeed(uri + '/data?internal_work.approval_status=1')
const isApproval = CommonGetFlag(approval_data)

if (isApproval) {
	let cash = {}
	let array = []
	for (let i = 0, ii = approval_data.feed.entry.length; i < ii; ++i) {
		const entry = approval_data.feed.entry[i]
		const cashname = 'no_' + entry.internal_work.working_day
		if (!cash[cashname]) {
			cash[cashname] = true
			array.push(entry.internal_work.working_day)
		}
	}
	array.sort((a,b)=>{
		if( a < b ) return -1
		if( a > b ) return 1
		return 0
	})
	const obj = { feed: { entry: [{title: array.join(',')}] } }
	reflexcontext.doResponse(obj)
} else {
	reflexcontext.sendMessage(204, null)
}
