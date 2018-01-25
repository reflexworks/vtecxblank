import reflexcontext from 'reflexcontext' 
import { CommonGetFlag } from './common'
import { getShipmentService } from './get-shipment-service'

const shipment_service = reflexcontext.getFeed('/shipment_service')
const isShipment = CommonGetFlag(shipment_service)

if (isShipment) {

	const customer_code = reflexcontext.getQueryString('customer_code')

	let customer = false
	let delivery_charge

	let uri
	if (customer_code) {
		// 顧客ごとの配送料登録の場合
		uri = '/customer/' + customer_code + '/deliverycharge'
		customer = reflexcontext.getEntry('/customer/'+ customer_code)
		const isCustomer = CommonGetFlag(customer)

		if (isCustomer) {
			delivery_charge = reflexcontext.getEntry(uri)
		} else {
			// 顧客がいない場合
	    	reflexcontext.sendMessage(400, '顧客が存在しません。')
		}
	} else {
    	reflexcontext.sendMessage(400, '不正なURLです。')
	}

	const isDc = CommonGetFlag(delivery_charge)

	let res

	if (isDc) {
		res = delivery_charge
	} else {
		res = getShipmentService(shipment_service.feed)
		if (customer) {
			res.feed.entry[0].link = [{
				___href: uri,
				___rel: 'self'
			}]
		}
	}
	if (customer) {
		res.feed.entry[0].customer = customer.feed.entry[0].customer
	}
	reflexcontext.doResponse(res)

} else {
	reflexcontext.sendMessage(204, null)
}
