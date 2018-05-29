
import vtecxapi from 'vtecxapi' 

let shipment_service = null
let shipment_service_all = null
let cache = {}
let cache2 = {}

export function getShipmentServiceCode(shipment_service_service_name) {
	if (cache2[shipment_service_service_name]) return cache2[shipment_service_service_name]
	if (!shipment_service_all) {
		shipment_service_all = vtecxapi.getFeed('/shipment_service',true)
		if (!shipment_service_all) throw '配送業者マスタが登録されていません'
	}
	const shipment_service = shipment_service_all.feed.entry.filter((entry) => { 
		return entry.shipment_service.service_name===shipment_service_service_name
	})
	if (shipment_service.length === 0) {
		return null
	} else {
		if (!shipment_service[0].shipment_service.code) throw 'shipment_service.codeが空です。:'+JSON.stringify(shipment_service[0])
		cache2[shipment_service_service_name] = shipment_service[0].shipment_service.code
		return shipment_service[0].shipment_service.code			
	}
}

export function getChargeByZone(delivery_charge_all,customer_all, size, prefecture, shipment_service_service_name, delivery_area) {

	const shipment_service_code = delivery_charge_all.shipment_service_code
	if (!shipment_service) {
		shipment_service = vtecxapi.getEntry('/shipment_service/' + shipment_service_code)
		if (!shipment_service) throw '配送業者マスタが登録されていません(サービスコード=' + shipment_service_code + ')'
	} 
	if (!delivery_charge_all.delivery_charge.feed.entry||!delivery_charge_all.delivery_charge.feed.entry[0].delivery_charge) throw '配送料マスタが登録されていません。(顧客コード=' + delivery_charge_all.customer_code +' サービスコード='+shipment_service_code+')'
	// shipment_service_codeからdelivery_chargeを取得
	const delivery_charge = delivery_charge_all.delivery_charge.feed.entry[0].delivery_charge.filter((delivery_charge) => {
		return delivery_charge.shipment_service_code === shipment_service_code
	})
	if (delivery_charge.length === 0||delivery_charge[0].delivery_charge_details.length === 0) throw '配送料マスタが登録されていません。(顧客コード=' + delivery_charge_all.customer_code +' サービスコード='+shipment_service_code+')'

	// sizeからdelivery_charge_detailsを取得
	const delivery_charge_details = delivery_area ? delivery_charge[0].delivery_charge_details :
		delivery_charge[0].delivery_charge_details.filter((delivery_charge_details) => {
			if (delivery_charge_details&&delivery_charge_details.size) {
				return delivery_charge_details.size.match(/\d+/)[0] === size
			} else {
				return false
			}
		})

	// 県からzoneを検索
	const zone = shipment_service.feed.entry[0].zone.filter((zone) => {
		const invoice_zones = zone.pref_codes.filter((pref_codes) => {
			return pref_codes.pref_code === prefecture
		})
		return invoice_zones.length>0
	 })
	if (zone.length===0) throw prefecture+' の配送エリアが登録されていません。(顧客コード:'+delivery_charge_all.customer_code+')'
	//	vtecxapi.log('zone_name=' + zone[0].zone_name)			

	if (delivery_area) {
		// deliveryareaからzoneを検索
		const invoice_zones = zone[0].invoice_zones.filter((invoice_zones) => {
			return invoice_zones.invoice_zone === delivery_area
		})
		if (invoice_zones.length===0) throw delivery_area+' の配送エリアが登録されていません。(顧客コード:'+delivery_charge_all.customer_code+')'
	} else {
		if (delivery_charge_details.length === 0) 
			throw size + ' サイズの配送料が登録されていません。(顧客コード:' + delivery_charge_all.customer_code + ')'		
	}
	// zone_nameからcharge_by_zoneを取得
	const charge_by_zone = delivery_charge_details[0].charge_by_zone.filter((charge_by_zone) => {
		return charge_by_zone.zone_name === zone[0].zone_name
	})
	if (charge_by_zone.length===0) throw zone[0].zone_name+' の配送料が登録されていません。(顧客コード:'+delivery_charge_all.customer_code+')'
	return charge_by_zone
}

export function getChargeBySizeAndZone(customer_code,shipment_service_code, size, zone_name, delivery_area) {

	const delivery_charge_all = vtecxapi.getEntry('/customer/' + customer_code + '/deliverycharge')	
	if (!delivery_charge_all) throw '配送料マスタが登録されていません。(顧客コード=' + customer_code +')'

	// shipment_service_codeからdelivery_chargeを取得
	const delivery_charge = delivery_charge_all.feed.entry[0].delivery_charge.filter((delivery_charge) => {
		return delivery_charge.shipment_service_code === shipment_service_code
	})

	if (delivery_charge.length === 0||delivery_charge[0].delivery_charge_details.length === 0) throw '配送料マスタが登録されていません。(顧客コード=' + customer_code +',サービスコード='+shipment_service_code+')'

	// sizeからdelivery_charge_detailsを取得
	const delivery_charge_details = delivery_area ? delivery_charge[0].delivery_charge_details :
		delivery_charge[0].delivery_charge_details.filter((delivery_charge_details) => {
			if (delivery_charge_details&&delivery_charge_details.size) {
				return delivery_charge_details.size.match(/\d+/)[0] === size				
			} else {
				return false
			}
		})
	
	// zone_nameからcharge_by_zoneを取得
	const charge_by_zone = delivery_charge_details[0].charge_by_zone.filter((charge_by_zone) => {
		return charge_by_zone.zone_name === zone_name
	})
	if (charge_by_zone.length===0) throw zone_name+' の配送料が登録されていません。'

	return charge_by_zone
}

export function getChargeOfMail(delivery_charge_all,customer_all,shipper_code,shipment_service_code) {

	// shipment_service_codeからdelivery_chargeを取得
	const delivery_charge = delivery_charge_all.delivery_charge.feed.entry[0].delivery_charge.filter((delivery_charge) => {
		return delivery_charge.shipment_service_code === shipment_service_code
	})

	if (delivery_charge.length === 0) throw '配送料マスタが登録されていません。(顧客コード=' + delivery_charge_all.customer_code + ',サービスコード=' + shipment_service_code + ')'
	const price = delivery_charge[0].delivery_charge_details[0].price.replace(/[^0-9^\\.]/g,'')
	if (price && price.length > 0) {
		return price
	} else {
		throw '配送料マスタが登録されていません。(顧客コード=' + delivery_charge_all.customer_code + ',サービスコード=' + shipment_service_code + ')'
	}
		
}

export function getDeliverycharge(customer_all, shipper_code, shipment_service_service_name) {

	if (cache[shipper_code]) return cache[shipper_code]
	else {
		const customer = getCustomerByShipper(customer_all,shipper_code,shipment_service_service_name)
		if (!customer.customer_code) throw '顧客マスタが登録されていません。(荷主コード=' + shipper_code + ')'
		const deliverycharge = vtecxapi.getEntry('/customer/' + customer.customer_code + '/deliverycharge')	
		if (!deliverycharge) throw '配送料マスタが登録されていません。(顧客コード=' + customer.customer_code +')'

		cache[shipper_code] = { 'customer_code': customer.customer_code, 'shipment_class': customer.shipment_class, 'delivery_charge': deliverycharge }
		return cache[shipper_code]
	}

}
export function getCustomerByShipper(customer_all,shipper_code,shipment_service_service_name) {
	// 荷主コード(分類コード)からcustomerを検索
	let customer_code = null
	let shipment_class = null
	customer_all.feed.entry.some((entry) => {
		if (entry&&entry.customer.shipper&&entry.customer.shipper.length>0) {
			entry.customer.shipper.map((shipper) => {
				if (!shipment_service_service_name||shipper.shipment_service_service_name ===shipment_service_service_name) {
					shipper.shipper_info.map((shipper_info) => { 
						if (shipper_info.shipper_code === shipper_code)
						{
							shipment_class = shipper_info.shipment_class 
							customer_code = entry.customer.customer_code
						}	
					})
				}
			})
			if (customer_code) return true
		}
	})
	return {'customer_code':customer_code,'shipment_class':shipment_class}
}

export function getFullDate(datestr) {
	let matches = /^(\d+)月(\d+)日$/.exec(datestr)
	if (matches&&matches.length >= 2) {
		const now = new Date()
		const month = parseInt(matches[1])
		const day = parseInt(matches[2])
		let year = now.getFullYear()

		if (now.getMonth()+1 < month ) {
			year = year - 1
		}
		return year+'-'+month+'-'+day		
	} else {
    	matches = /^(\d+)\/(\d+)\/(\d+).*$/.exec(datestr)
		if (matches&&matches.length > 2) {
			return matches[1]+'-'+matches[2]+'-'+matches[3]		
		} else {
			throw '日時のパースエラーです。正しい日時を入れてください。(入力値=' + datestr + ')'			
		}	
	}
}


export function getKey(customer_code,datestr, shipment_service_code,shipment_class,tracking_number) {

	let matches = /^(\d+)月(\d+)日$/.exec(datestr)
	if (matches && matches.length >= 2) {
		
		const now = new Date()
		const month = parseInt(matches[1])
		let year = now.getFullYear()

		if (now.getMonth() + 1 < month) {
			year = year - 1
		}
		return year + ('0' + month).slice(-2) + customer_code + '_' + shipment_service_code + '_' + shipment_class+'_'+tracking_number
	} else {
		matches = /^(\d+)\/(\d+)\/(\d+).*$/.exec(datestr)
		if (!matches) {
			throw '日時のパースエラーです。正しい日時を入れてください。(入力値=' + datestr + ')'
		}	
		return matches[1] + ('0' + matches[2]).slice(-2) + customer_code + '_' + shipment_service_code + '_' + shipment_class+'_'+tracking_number			
	}	

}

export function getPrefecture(addr) {
	if (addr.indexOf('北海道') >= 0) return '北海道'
	if (addr.indexOf('青森県') >= 0) return '青森県'
	if (addr.indexOf('岩手県') >= 0) return '岩手県'
	if (addr.indexOf('宮城県') >=0) return '宮城県'
	if (addr.indexOf('秋田県') >=0) return '秋田県'
	if (addr.indexOf('山形県') >=0) return '山形県'
	if (addr.indexOf('福島県') >=0) return '福島県'
	if (addr.indexOf('茨城県') >=0) return '茨城県'
	if (addr.indexOf('栃木県') >=0) return '栃木県'
	if (addr.indexOf('群馬県') >=0) return '群馬県'
	if (addr.indexOf('埼玉県') >=0) return '埼玉県'
	if (addr.indexOf('千葉県') >=0) return '千葉県'
	if (addr.indexOf('東京都') >=0) return '東京都'
	if (addr.indexOf('神奈川県') >=0) return '神奈川県'
	if (addr.indexOf('新潟県') >=0) return '新潟県'
	if (addr.indexOf('富山県') >=0) return '富山県'
	if (addr.indexOf('石川県') >=0) return '石川県'
	if (addr.indexOf('福井県') >=0) return '福井県'
	if (addr.indexOf('山梨県') >=0) return '山梨県'
	if (addr.indexOf('長野県') >=0) return '長野県'
	if (addr.indexOf('岐阜県') >=0) return '岐阜県'
	if (addr.indexOf('静岡県') >=0) return '静岡県'
	if (addr.indexOf('愛知県') >=0) return '愛知県'
	if (addr.indexOf('三重県') >=0) return '三重県'
	if (addr.indexOf('滋賀県') >=0) return '滋賀県'
	if (addr.indexOf('京都府') >=0) return '京都府'
	if (addr.indexOf('大阪府') >=0) return '大阪府'
	if (addr.indexOf('兵庫県') >=0) return '兵庫県'
	if (addr.indexOf('奈良県') >=0) return '奈良県'
	if (addr.indexOf('和歌山県') >=0) return '和歌山県'
	if (addr.indexOf('鳥取県') >=0) return '鳥取県'
	if (addr.indexOf('島根県') >=0) return '島根県'
	if (addr.indexOf('岡山県') >=0) return '岡山県'
	if (addr.indexOf('広島県') >=0) return '広島県'
	if (addr.indexOf('山口県') >=0) return '山口県'
	if (addr.indexOf('徳島県') >=0) return '徳島県'
	if (addr.indexOf('香川県') >=0) return '香川県'
	if (addr.indexOf('愛媛県') >=0) return '愛媛県'
	if (addr.indexOf('高知県') >=0) return '高知県'
	if (addr.indexOf('福岡県') >=0) return '福岡県'
	if (addr.indexOf('佐賀県') >=0) return '佐賀県'
	if (addr.indexOf('長崎県') >=0) return '長崎県'
	if (addr.indexOf('熊本県') >=0) return '熊本県'
	if (addr.indexOf('大分県') >=0) return '大分県'
	if (addr.indexOf('宮崎県') >=0) return '宮崎県'
	if (addr.indexOf('鹿児島県') >=0) return '鹿児島県'
	if (addr.indexOf('沖縄県') >=0) return '沖縄県'
	return '該当なし'
}