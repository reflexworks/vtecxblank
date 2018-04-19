import vtecxapi from 'vtecxapi' 

export function getInternalworkdata(working_yearmonth,customer_code,quotation_code) {

	const internal_work = vtecxapi.getFeed('/internal_work?customer.customer_code=' + customer_code + '&quotation.quotation_code=' + quotation_code + '&internal_work.working_yearmonth=' + working_yearmonth)

	if (internal_work) {
		const id = internal_work.feed.entry[0].id.split(',')[0]
		//		if (internal_work.feed.entry[0].internal_work.is_completed==='0') throw '完了がなされていません'
		const internal_work_all = vtecxapi.getFeed(id + '/data')
		return internal_work_all
			
	} else {
		throw '庫内作業が登録されていません(顧客コード=' + customer_code + ',見積書コード=' + quotation_code + ',庫内作業年月=' + working_yearmonth + ')'
	}
}
