//import React from 'react'

export function getAuthList(_role) {
	let list = {
		CustomerRegistration: false,
		CustomerList: false,
		CustomerUpdate: false,
		StaffRegistration: false,
		StaffList: false,
		StaffUpdate: false,
		WarehouseRegistration: false,
		WarehouseList: false,
		WarehouseUpdate: false,
		PackingItemRegistration: false,
		PackingItemList: false,
		PackingItemUpdate: false,
		PackingItemTemplateRegistration: false,
		PackingItemTemplateList: false,
		PackingItemTemplateUpdate: false,
		InternalWorkRegistration: false,
		InternalWorkUpdate: false,
		InternalWorkList: false,
		QuotationRegistration: false,
		QuotationList: false,
		QuotationUpdate: false,
		InvoiceRegistration: false,
		InvoiceList: false,
		InvoiceUpdate: false,
		ShipmentServiceRegistration: false,
		ShipmentServiceUpdate: false,
		ShipmentServiceList: false,
		DeliveryChargeRegistration: false,
		DeliveryChargeTemplateRegistration: false,
		DeliveryChargeTemplateUpdate: false,
		DeliveryChargeTemplateList: false,
		BilltoRegistration: false,
		BilltoList: false,
		BilltoUpdate: false,
		TypeAheadRegistration: false,
		TypeAheadList: false,
		TypeAheadUpdate: false,
		BasicConditionRegistration: false,
		BasicConditionList: false,
		BasicConditionUpdate: false,
		BillingDataUpload: false,
		InquiryRegistration: false,
		InquiryList: false,
		InquiryUpdate: false,
		BillfromRegistration: false,
		BillfromList: false,
		BillfromUpdate: false
	}

	if (!_role) {
		return list
	} else {
		if (_role === '1') {
			// システム管理者は全ての権限がある
			Object.keys(list).forEach((_key) => {
				list[_key] = true
			})
		}

		// 上長
		if (_role === '2') {

			list.CustomerRegistration = true
			list.CustomerUpdate = true
			list.CustomerList = true

			list.QuotationRegistration = true
			list.QuotationList = true
			list.QuotationUpdate = true

			list.InternalWorkRegistration = true
			list.InternalWorkUpdate = true
			list.InternalWorkList = true

		}

		// 作業員
		if (_role === '3') {
			list.CustomerList = true

			list.InternalWorkRegistration = true
			list.InternalWorkUpdate = true
			list.InternalWorkList = true

		}

		// 営業
		if (_role === '4') {

			list.CustomerRegistration = true
			list.CustomerUpdate = true
			list.CustomerList = true

			list.StaffRegistration = true
			list.StaffList = true
			list.StaffUpdate = true

			list.WarehouseRegistration = true
			list.WarehouseList = true
			list.WarehouseUpdate = true

			list.QuotationRegistration = true
			list.QuotationList = true
			list.QuotationUpdate = true

			list.InvoiceList = true
			list.InvoiceUpdate = true
		}

		// 経理
		if (_role === '5') {

			list.QuotationList = true
			list.QuotationUpdate = true

			list.InternalWorkRegistration = true
			list.InternalWorkUpdate = true
			list.InternalWorkList = true

			list.InvoiceRegistration = true
			list.InvoiceList = true
			list.InvoiceUpdate = true
		}

		return list
	}
}
