import vtecxapi from 'vtecxapi' 

const items = ['billto_name', 'customer_name', 'customer_name_kana', 'tel', 'fax', 'email', 'zip_code', 'prefecture', 'address1', 'url', 'person_in_charge', 'products', 'is_billto', 'shipper_code_ymta', 'shipper_code_ymtb', 'shipper_code_ymtc', 'shipper_code_ecs1', 'shipper_code_ecs2', 'shipper_code_ecs3','shipper_code_ecs4','warehouse','sales_staff','sales_staff_email','superior','superior_email','working_staff1','working_staff1_email','working_staff2','working_staff2_email','working_staff3','working_staff3_email','working_staff4','working_staff4_email','working_staff5','working_staff5_email','working_staff6','working_staff6_email','working_staff7','working_staff7_email']
const header = ['請求顧客名', '顧客名', '顧客名(カナ)','電話番号','FAX','メールアドレス','郵便番号','都道府県','市区郡町村','顧客URL','担当者','取扱品','請求先にも登録','ヤマト荷主コード1(出荷A)','ヤマト荷主コード2(出荷B)','ヤマト荷主コード3(集荷)','エコ配荷主コード1(出荷)','エコ配荷主コード2(出荷)','エコ配荷主コード3(集荷)','エコ配荷主コード4(集荷)','倉庫','営業担当','営業担当メールアドレス','上長','上長メールアドレス','作業担当者1','作業担当者1メールアドレス','作業担当者2','作業担当者2メールアドレス','作業担当者3','作業担当者3メールアドレス','作業担当者4','作業担当者4メールアドレス','作業担当者5','作業担当者5メールアドレス','作業担当者6','作業担当者6メールアドレス','作業担当者7','作業担当者7メールアドレス']
const parent = 'customer'
const skip = 0
//const encoding = 'SJIS'
const encoding = 'UTF-8'

// CSV取得
const result = vtecxapi.getCsv(header, items, parent, skip, encoding)
//vtecxapi.log(JSON.stringify(result))

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
	const duplicated = reqdata.feed.entry.filter(e => { return (e.customer.customer_code === entry.customer.customer_code) })
	if (duplicated.length===0) {
		reqdata.feed.entry.push(entry)		
	}
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
		//		vtecxapi.log('billto='+JSON.stringify(reqdata)) 
        
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
		'sales_staff': [{'staff_name':csventry.customer.sales_staff ,'staff_email':csventry.customer.sales_staff_email}],
		'working_staff': [
		],
		'shipper': []
	}

	if (csventry.customer.working_staff1_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff1, 'staff_email': csventry.customer.working_staff1_email }
		customer.working_staff.push(working_staff)
	}
	if (csventry.customer.working_staff2_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff2, 'staff_email': csventry.customer.working_staff2_email }
		customer.working_staff.push(working_staff)
	}
	if (csventry.customer.working_staff3_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff3, 'staff_email': csventry.customer.working_staff3_email }
		customer.working_staff.push(working_staff)
	}
	if (csventry.customer.working_staff4_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff4, 'staff_email': csventry.customer.working_staff4_email }
		customer.working_staff.push(working_staff)
	}
	if (csventry.customer.working_staff5_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff5, 'staff_email': csventry.customer.working_staff5_email }
		customer.working_staff.push(working_staff)
	}
	if (csventry.customer.working_staff6_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff6, 'staff_email': csventry.customer.working_staff6_email }
		customer.working_staff.push(working_staff)
	}
	if (csventry.customer.working_staff7_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff7, 'staff_email': csventry.customer.working_staff7_email }
		customer.working_staff.push(working_staff)
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
	const customer_name = csventry.customer.customer_name ? csventry.customer.customer_name : csventry.customer.billto_name
	const customer = vtecxapi.getFeed('/customer?f&customer.customer_name=' + customer_name)
	if (customer.feed.entry) {
		return customer.feed.entry[0].customer.customer_code
	} else {
	    return ('00000000'+vtecxapi.allocids('/customer',1)).slice(-7)
	}
}

