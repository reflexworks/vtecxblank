import vtecxapi from 'vtecxapi' 

const items = ['billto_name', 'customer_name', 'customer_name_kana', 'tel', 'fax', 'email', 'zip_code', 'prefecture', 'address1', 'url', 'person_in_charge', 'products', 'is_billto', 'shipper_code_ymta', 'shipper_code_ymtb', 'shipper_code_ymtc', 'shipper_code_ecs1', 'shipper_code_ecs2', 'shipper_code_ecs3','shipper_code_ecs4','shipment_service_code','warehouse','sales_staff','sales_staff_email','superior','superior_email','working_staff1','working_staff1_email','working_staff2','working_staff2_email','working_staff3','working_staff3_email','working_staff4','working_staff4_email','working_staff5','working_staff5_email','working_staff6','working_staff6_email','working_staff7','working_staff7_email']
const header = ['請求顧客名', '顧客名', '顧客名(カナ)','電話番号','FAX','メールアドレス','郵便番号','都道府県','市区郡町村','顧客URL','担当者','取扱品','請求先にも登録','ヤマト荷主コード1(出荷A)','ヤマト荷主コード2(出荷B)','ヤマト荷主コード3(集荷)','エコ配荷主コード1(出荷)','エコ配荷主コード2(出荷)','エコ配荷主コード3(集荷)','エコ配荷主コード4(集荷)','エコ配配送業者コード','倉庫','営業担当','営業担当メールアドレス','上長','上長メールアドレス','作業担当者1','作業担当者1メールアドレス','作業担当者2','作業担当者2メールアドレス','作業担当者3','作業担当者3メールアドレス','作業担当者4','作業担当者4メールアドレス','作業担当者5','作業担当者5メールアドレス','作業担当者6','作業担当者6メールアドレス','作業担当者7','作業担当者7メールアドレス']
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


registerstaff('システム管理者','logioffice.test@gmail.com',1)

result.feed.entry.map( csventry => {
	const customer_name = csventry.customer.customer_name ? csventry.customer.customer_name : csventry.customer.billto_name
	const customer_name_duplicated = reqdata.feed.entry.filter(e => { return (e.customer.customer_name === customer_name) })
	if (customer_name_duplicated.length === 0) {
		let customer = getCustomer(csventry)
		let entry = {
			'billto': {
				'billto_code': getBillto_code(csventry),
				'billto_name': csventry.customer.billto_name
			},
			'contact_information': getContact_information(csventry),
			'customer': customer,
			'link':
				[{ '___rel': 'self', '___href': '/customer/' + customer.customer_code }]
		}
		const duplicated = reqdata.feed.entry.filter(e => { return (e.customer.customer_code === entry.customer.customer_code) })
		if (duplicated.length === 0) {
			reqdata.feed.entry.push(entry)
		}
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
		'warehouse_code': getWarehouseCode(csventry.customer.warehouse),
		'sales_staff': [],
		'working_staff': [],
		'shipper': []
	}

	// 営業担当の登録
	if (csventry.customer.sales_staff_email) {
		const sales_staff = { 'staff_name': csventry.customer.sales_staff, 'staff_email': csventry.customer.sales_staff_email }
		customer.sales_staff.push(sales_staff)
		registerstaff(csventry.customer.sales_staff,csventry.customer.sales_staff_email,4)
	}

	// 上長の登録
	if (csventry.customer.superior_email) {
		registerstaff(csventry.customer.superior,csventry.customer.superior_email,2)
		const superior = { 'staff_name': csventry.customer.superior, 'staff_email': csventry.customer.superior_email }
		customer.sales_staff.push(superior)
		customer.working_staff.push(superior)
	}


	// 作業員の登録
	if (csventry.customer.working_staff1_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff1, 'staff_email': csventry.customer.working_staff1_email }
		customer.working_staff.push(working_staff)
		registerstaff(csventry.customer.working_staff1,csventry.customer.working_staff1_email,3,csventry.customer.superior_email)
	}
	if (csventry.customer.working_staff2_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff2, 'staff_email': csventry.customer.working_staff2_email }
		customer.working_staff.push(working_staff)
		registerstaff(csventry.customer.working_staff2,csventry.customer.working_staff2_email,3,csventry.customer.superior_email)
	}
	if (csventry.customer.working_staff3_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff3, 'staff_email': csventry.customer.working_staff3_email }
		customer.working_staff.push(working_staff)
		registerstaff(csventry.customer.working_staff3,csventry.customer.working_staff3_email,3,csventry.customer.superior_email)
	}
	if (csventry.customer.working_staff4_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff4, 'staff_email': csventry.customer.working_staff4_email }
		customer.working_staff.push(working_staff)
		registerstaff(csventry.customer.working_staff4,csventry.customer.working_staff4_email,3,csventry.customer.superior_email)
	}
	if (csventry.customer.working_staff5_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff5, 'staff_email': csventry.customer.working_staff5_email }
		customer.working_staff.push(working_staff)
		registerstaff(csventry.customer.working_staff5,csventry.customer.working_staff5_email,3,csventry.customer.superior_email)
	}
	if (csventry.customer.working_staff6_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff6, 'staff_email': csventry.customer.working_staff6_email }
		customer.working_staff.push(working_staff)
		registerstaff(csventry.customer.working_staff6,csventry.customer.working_staff6_email,3,csventry.customer.superior_email)
	}
	if (csventry.customer.working_staff7_email) {
		const working_staff = { 'staff_name': csventry.customer.working_staff7, 'staff_email': csventry.customer.working_staff7_email }
		customer.working_staff.push(working_staff)
		registerstaff(csventry.customer.working_staff7,csventry.customer.working_staff7_email,3,csventry.customer.superior_email)
	}

	if (csventry.customer.shipper_code_ymta.trim().length>0) {
		let shipper = {
			'shipment_service_code': 'YH1',
			'shipment_service_service_name': '宅急便発払',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ymta,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
		shipper = {
			'shipment_service_code': 'YH2',
			'shipment_service_service_name': 'クロネコＤＭ便',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ymta,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
		shipper = {
			'shipment_service_code': 'YH3',
			'shipment_service_service_name': 'ネコポス',
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
			'shipment_service_code': 'YH1',
			'shipment_service_service_name': '宅急便発払',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ymtb,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
		shipper = {
			'shipment_service_code': 'YH2',
			'shipment_service_service_name': 'クロネコＤＭ便',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ymtb,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
		shipper = {
			'shipment_service_code': 'YH3',
			'shipment_service_service_name': 'ネコポス',
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
			'shipment_service_code': 'YH1',
			'shipment_service_service_name': '宅急便発払',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ymtc,
					'shipment_class': '1'
				}
			]
		}
		customer.shipper.push(shipper)
		shipper = {
			'shipment_service_code': 'YH2',
			'shipment_service_service_name': 'クロネコＤＭ便',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ymtc,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
		shipper = {
			'shipment_service_code': 'YH3',
			'shipment_service_service_name': 'ネコポス',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ymtc,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
	}    
	if (csventry.customer.shipper_code_ecs1.trim().length>0) {
		let shipper = {
			'shipment_service_code': 'ECO1',
			'shipment_service_service_name': 'エコプラス便',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ecs1,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
		shipper = {
			'shipment_service_code': 'ECO2',
			'shipment_service_service_name': 'コレクト便',
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
			'shipment_service_code': 'ECO1',
			'shipment_service_service_name': 'エコプラス便',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ecs2,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
		shipper = {
			'shipment_service_code': 'ECO2',
			'shipment_service_service_name': 'コレクト便',
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
			'shipment_service_code': 'ECO1',
			'shipment_service_service_name': 'エコプラス便',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ecs3,
					'shipment_class': '1'
				}
			]
		}
		customer.shipper.push(shipper)
		shipper = {
			'shipment_service_code': 'ECO2',
			'shipment_service_service_name': 'コレクト便',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ecs3,
					'shipment_class': '0'
				}
			]
		}
		customer.shipper.push(shipper)
	}    
	if (csventry.customer.shipper_code_ecs4.trim().length>0) {
		let shipper = {
			'shipment_service_code': 'ECO1',
			'shipment_service_service_name': 'エコプラス便',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ecs4,
					'shipment_class': '1'
				}
			]
		}
		customer.shipper.push(shipper)
		shipper = {
			'shipment_service_code': 'ECO2',
			'shipment_service_service_name': 'コレクト便',
			'shipper_info': [
				{
					'shipper_code': csventry.customer.shipper_code_ecs4,
					'shipment_class': '0'
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

function getWarehouseCode(warehouse_name) {
	const warehouse = vtecxapi.getFeed('/warehouse?f&warehouse.warehouse_name=' + warehouse_name)
	if (warehouse.feed.entry) {
		return warehouse.feed.entry[0].warehouse.warehouse_code
	} else {
		return ''
	}
}

function registerstaff(staff_name, staff_email, role, superior_email) {

	let reqdata = {
		'feed': {
			'entry': []
		}
	}
	const entry = {
		'staff': {
			'staff_name': staff_name,
			'staff_email': staff_email,
			'role': ''+role			
		}
	}
	if (superior_email) {
		entry.staff.superior_email = superior_email
	}
	if (isNotRegistered(staff_email)) {
		reqdata.feed.entry.push(entry)
		vtecxapi.post(reqdata,'/staff')
	}

}

function isNotRegistered(staff_email) {
	const warehouse = vtecxapi.getFeed('/staff?f&staff.staff_email=' + staff_email)
	if (warehouse.feed.entry) {
		return false
	} else {
		return true
	}
}
