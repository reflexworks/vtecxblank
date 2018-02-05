import vtecxapi from 'vtecxapi' 

const items = ['billto_name', 'customer_name', 'customer_name_kana', 'tel', 'fax', 'email', 'zip_code', 'prefecture', 'address1', 'url', 'person_in_charge', 'products', 'is_billto', 'sales_staff', 'working_staff', 'shipper_code_ymta', 'shipper_code_ymtb', 'shipper_code_ymtc', 'shipper_code_ecs1', 'shipper_code_ecs2', 'shipper_code_ecs3','shipper_code_ecs4']
const header = ['請求顧客名', '顧客名', '顧客名(カナ)','電話番号','FAX','メールアドレス','郵便番号','都道府県','市区郡町村','顧客URL','担当者','取扱品','請求先にも登録','営業担当','作業担当','ヤマト荷主コード1(出荷A)','ヤマト荷主コード2(出荷B)','ヤマト荷主コード3(集荷)','エコ配荷主コード1(出荷)','エコ配荷主コード2(出荷)','エコ配荷主コード3(集荷)','エコ配荷主コード4(集荷)']
const parent = 'customer'
const skip = 0
//const encoding = 'SJIS'
const encoding = 'UTF-8'

// CSV取得
const result = vtecxapi.getCsv(header, items, parent, skip, encoding)

let reqdata = {
	'feed': {
		'entry': []
	}
}

result.feed.entry.map( csventry => {

	let customer = getCustomer(csventry)
	let entry = {
		'billto': {
			'billto_code': getBillto_code(csventry),
			'billto_name': csventry.customer.billto_name        
		},
		'contact_information': getContact_information(csventry),
		'customer': customer,
		'link':
		[{ '___rel': 'self', '___href': '/customer/'+ customer.customer_code }]
	}
	reqdata.feed.entry.push(entry)
})
vtecxapi.put(reqdata)



function getBillto_code(csventry) {
	const billto = vtecxapi.getFeed('/billto?f&billto.billto_name=' + csventry.customer.billto_name)
	if (billto.feed.entry) {
		return billto.feed.entry[0].billto.billto_code
	} else {

		const billto_code =('00000000'+vtecxapi.allocids('/billto',1)).slice(-7)
		let reqdata = {
			'feed': {
				'entry': []
			}
		}
		const entry = {
			'billto': {
				'billto_code': billto_code,
				'billto_name': csventry.customer.billto_name        
			},
			'contact_information' : getContact_information(csventry),
			'link':
    		[{ '___rel': 'self', '___href': '/billto/'+ billto_code }]
		}
		reqdata.feed.entry.push(entry)
		vtecxapi.log('billto='+JSON.stringify(reqdata)) 
        
		vtecxapi.put(reqdata)
		return billto_code
	}
}

function getContact_information(csventry) {
	const address = csventry.customer.address1.match(/^([\D^-]*)(\d+.*)$/)
	let address1 = ''
	let address2 = ''
	if (address) {
		address1 = address[1]
		if (address.length > 2) {
			address2 = address[2]
		}
	}    
	const contact_information = {
		'tel': csventry.customer.tel,
		'fax': csventry.customer.fax,
		'email': csventry.customer.email,
		'zip_code': csventry.customer.zip_code,
		'prefecture': csventry.customer.prefecture,
		'address1': address1,
		'address2': address2            
	}
	return contact_information
}


function getCustomer(csventry) {

	const customer = {
		'customer_code': getCustomerCode(csventry),
		'customer_name': csventry.customer.customer_name ? csventry.customer.customer_name : csventry.customer.billto_name,
		'customer_name_kana': csventry.customer.customer_name_kana,
		'url': csventry.customer.url,
		'person_in_charge': csventry.customer.person_in_charge,
		'products': csventry.customer.products,
		'sales_staff': [{'content':csventry.customer.sales_staff}],
		'working_staff': [{ 'content': csventry.customer.working_staff }],
		'shipper': []
	}

	if (csventry.customer.shipper_code_ymta.trim().length>0) {
		let shipper = {
			'shipment_service_code': 'YM',
			'shipment_service_name': 'ヤマト運輸',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ymta,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
	}    
	if (csventry.customer.shipper_code_ymtb.trim().length>0) {
		let shipper = {
			'shipment_service_code': 'YM',
			'shipment_service_name': 'ヤマト運輸',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ymtb,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
	}    
	if (csventry.customer.shipper_code_ymtc.trim().length>0) {
		let shipper = {
			'shipment_service_code': 'YM',
			'shipment_service_name': 'ヤマト運輸',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ymtc,
					'shipment_class': '1'
				}
			]
		}
		customer.shipper.push(shipper)
	}    
	if (csventry.customer.shipper_code_ecs1.trim().length>0) {
		let shipper = {
			'shipment_service_code': 'EC',
			'shipment_service_name': 'エコ配JP',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ecs1,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
	}    
	if (csventry.customer.shipper_code_ecs2.trim().length>0) {
		let shipper = {
			'shipment_service_code': 'EC',
			'shipment_service_name': 'エコ配JP',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ecs2,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
	}    
	if (csventry.customer.shipper_code_ecs3.trim().length>0) {
		let shipper = {
			'shipment_service_code': 'EC',
			'shipment_service_name': 'エコ配JP',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ecs3,
					'shipment_class': '1'
				}
			]
		}
		customer.shipper.push(shipper)
	}    
	if (csventry.customer.shipper_code_ecs4.trim().length>0) {
		let shipper = {
			'shipment_service_code': 'EC',
			'shipment_service_name': 'エコ配JP',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ecs4,
					'shipment_class': '1'
				}
			]
		}
		customer.shipper.push(shipper)
	}    

	return customer
}

function getCustomerCode(csventry) {
	const customer = vtecxapi.getFeed('/customer?f&customer.customer_name=' + csventry.customer.customer_name)
	if (customer.feed.entry) {
		return customer.feed.entry[0].customer.customer_code
	} else {
	    return ('00000000'+vtecxapi.allocids('/customer',1)).slice(-7)
	}
}

