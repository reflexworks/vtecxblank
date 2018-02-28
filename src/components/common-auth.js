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

	_role = '1'
	if (!_role) {
		return list
	} else {

		let authList
		// 上長
		if (_role === '2') {

			authList = {
				CustomerRegistration: true,
				CustomerUpdate: true,
				CustomerList: true,
				DeliveryChargeRegistration: true,

				InquiryRegistration: true,
				InquiryList: true,
				InquiryUpdate: true,

				QuotationRegistration: true,
				QuotationList: true,
				QuotationUpdate: true,

				InternalWorkRegistration: true,
				InternalWorkUpdate: true,
				InternalWorkList: true
			}

		}

		// 作業員
		if (_role === '3') {
			authList = {
				CustomerList: true,
				DeliveryChargeRegistration: true,

				InquiryRegistration: true,
				InquiryList: true,
				InquiryUpdate: true,

				InternalWorkRegistration: true,
				InternalWorkUpdate: true,
				InternalWorkList: true,
			}

		}

		// 営業
		if (_role === '4') {
			authList = {
				CustomerRegistration: true,
				CustomerUpdate: true,
				CustomerList: true,
				DeliveryChargeRegistration: true,

				StaffRegistration: true,
				StaffList: true,
				StaffUpdate: true,

				PackingItemRegistration: true,
				PackingItemList: true,
				PackingItemUpdate: true,
				PackingItemTemplateRegistration: true,
				PackingItemTemplateList: true,
				PackingItemTemplateUpdate: true,

				ShipmentServiceRegistration: true,
				ShipmentServiceUpdate: true,
				ShipmentServiceList: true,
				DeliveryChargeTemplateRegistration: true,
				DeliveryChargeTemplateUpdate: true,
				DeliveryChargeTemplateList: true,

				QuotationRegistration: true,
				QuotationList: true,
				QuotationUpdate: true,

				InvoiceList: true,
				InvoiceUpdate: true,
			}
		}

		// 経理
		if (_role === '5') {

			authList = {
				BilltoRegistration: true,
				BilltoList: true,
				BilltoUpdate: true,

				StaffRegistration: true,
				StaffList: true,
				StaffUpdate: true,

				WarehouseRegistration: true,
				WarehouseList: true,
				WarehouseUpdate: true,

				PackingItemRegistration: true,
				PackingItemList: true,
				PackingItemUpdate: true,
				PackingItemTemplateRegistration: true,
				PackingItemTemplateList: true,
				PackingItemTemplateUpdate: true,

				ShipmentServiceRegistration: true,
				ShipmentServiceUpdate: true,
				ShipmentServiceList: true,
				DeliveryChargeTemplateRegistration: true,
				DeliveryChargeTemplateUpdate: true,
				DeliveryChargeTemplateList: true,

				QuotationList: true,
				QuotationUpdate: true,

				InternalWorkRegistration: true,
				InternalWorkUpdate: true,
				InternalWorkList: true,

				InvoiceRegistration: true,
				InvoiceList: true,
				InvoiceUpdate: true,
			}

		}

		if (_role === '1') {
			// システム管理者は全ての権限がある
			Object.keys(list).forEach((_key) => {
				list[_key] = true
			})
		} else {
			Object.keys(authList).forEach((_key) => {
				list[_key] = true
			})
		}

		return list
	}
}
