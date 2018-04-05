/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form,
	PanelGroup,
	Panel,
	FormGroup,
	FormControl,
	Tabs,
	Tab,
	Button,
	Glyphicon,
	Table,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	BillfromAddModal,
	BillfromEditModal,
} from './billfrom-modal'
import {
	CommonInputText,
	CommonTable,
	CommonRadioBtn,
	CommonFilterBox,
	CommonPrefecture,
	CommonMonthlySelect,
	addFigure,
	delFigure,
	CommonDatePicker,
} from './common'

import moment from 'moment'

export default class InvoiceForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			showBillfromAddModal: false,
			showBillfromEditModal: false,
			selectCustomer: ''
		}
		
		//消費税と合計請求金額
		this.sub_total = 0
		this.ems_total = 0
		this.consumption_tax = 0
		this.total_amount = 0
		
		this.monthly = []
		this.daily = []
		this.period = []
		this.packing_item = []
		this.shipping = []
		this.collecting = []

		this.serviceItem = []
		this.entry = this.props.entry
		this.entry.invoice = this.entry.invoice || {}
		this.entry.invoice.invoice_yearmonth = moment().format('YYYY/MM')
		this.entry.billto = this.entry.billto || {}
		this.entry.billfrom = this.entry.billfrom || {}
		this.entry.billfrom.payee = this.entry.billfrom.payee || []
		this.entry.contact_information = this.entry.contact_information || {}
		this.entry.remarks = this.entry.remarks || []
		this.master = {
			customerList: [],
			billfromList: [],
			internalWorkYearMonthList: [],
		}
		this.shippingData
		this.collectingData

		this.item_details = this.item_details || []
		this.addEntry = this.addEntry || {}
		this.addDetails = []
		this.editEntry = this.editEntry || {}

		this.convert_taxation = { '0': '税抜', '1': '税込' }

		this.cashData = {}

	}
	
	componentWillMount() {
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
		if (newProps.entry) {

			this.isEdit = this.entry.invoice.issue_status === '0' ? true : false

			this.entry.invoice.payment_date = this.entry.invoice.payment_date ? moment(Date.parse(this.entry.invoice.payment_date)) : moment()
			if(this.entry.invoice.working_yearmonth) this.props.changeYearmonth(this.entry.invoice.working_yearmonth)
			if (this.entry.invoice.customer_code) this.props.changeCustomerCode(this.entry.invoice.customer_code)

			//口座情報に口座名義、支店名が無い時の処理
			if(this.entry.billfrom.payee){
				this.entry.billfrom.payee = this.entry.billfrom.payee.map((oldPayee) => {
					if (oldPayee.bank_info && !oldPayee.branch_office && !oldPayee.account_name) {	
						let newPayee = {
							'bank_info': oldPayee.bank_info,
							'account_type': oldPayee.account_type,
							'account_number': oldPayee.account_number,
							'branch_office': '',
							'account_name': '',
						}
						return (newPayee)
					} else {
						return (oldPayee)
					}
				})	
			}
			this.setCustomerMasterData() 
			this.setBillfromMasterData() 
			this.setInternalWorkYearMonthList()

			if (this.entry.invoice.working_yearmonth && this.entry.invoice.customer_code) {

				this.getService(this.entry.invoice.customer_code, this.entry.invoice.working_yearmonth)

				// 簡易明細表示
				this.setBillingSummaryTable()
			}
		}

	}

	getKey(_category, _item_name, _unit) {
		return _category + _item_name + _unit
	}

	/**
	 * サービスで受け取ったitem_detailsを取得後、カテゴリ毎に振り分ける
	 */
	getService(customer_code,working_yearmonth) {
		this.setState({ isDisabled: true })

		this.monthly = []
		this.daily = []
		this.period = []
		this.packing_item = []
		this.shipping = []
		this.collecting = []
		this.serviceItem = []

		axios({
			url: 's/get-invoice-itemdetails?customer_code=' + customer_code +
				 '&quotation_code=' + this.entry.invoice.quotation_code +
				 '&working_yearmonth=' + working_yearmonth,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {

			if (response.status !== 204) {
			
				const serviceData = response.data.feed.entry[0]
				if (serviceData.item_details) {

					for (let i = 0; i < serviceData.item_details.length; ++i) {

						let item_details = serviceData.item_details[i]
						const category = item_details.category
						const item_name = item_details.item_name
						const unit = item_details.unit

						// カンマ差し込み処理
						item_details.quantity = addFigure(item_details.quantity)
						item_details.unit_price = addFigure(item_details.unit_price)
						item_details.amount = addFigure(item_details.amount)
						this[category].push(item_details)

						const key = this.getKey(category, item_name, unit)
						this.cashData[key] = this[category].length - 1
					}
					this.serviceItem = serviceData.item_details

					// 明細表示
					this.setItemDetailsTable()
				}
			} else {
				// 明細表示
				this.setItemDetailsTable()
			}
		}).catch((error) => {
			// 明細表示
			this.setItemDetailsTable()
			this.setState({ isDisabled: false, isError: error })
		})

	}

	/**
	 *  請求元リストを作成する
	 */
	setBillfromMasterData(_billfrom) {
		this.setState({ isDisabled: true })

		axios({
			url: '/d/billfrom?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			if (response.status !== 204) {

				this.master.billfromList = response.data.feed.entry
				this.billfromList = this.master.billfromList.map((obj) => {
					return {
						label: obj.billfrom.billfrom_name,
						value: obj.billfrom.billfrom_code,
						data: obj
					}
				})

				//全てのbillfrom.payeeを見て、支店名と口座名義が無かったら登録や更新は行わずに追加。
				this.billfromList.map((billfromList) => {
					if (billfromList.data.billfrom.payee) {
						billfromList.data.billfrom.payee = billfromList.data.billfrom.payee.map((oldPayee) => {
							if (oldPayee.bank_info && !oldPayee.branch_office && !oldPayee.account_name) {
								let newPayee = {
									'bank_info': oldPayee.bank_info,
									'account_type': oldPayee.account_type,
									'account_number': oldPayee.account_number,
									'branch_office': '',
									'account_name': '',
								}
								return (newPayee)
							} else {
								return (oldPayee)
							}
						})
					}	
				})
				
				if (_billfrom) this.entry.billfrom = _billfrom
				if (this.entry.billfrom.billfrom_code) {
					for (let i = 0, ii = this.billfromList.length; i < ii; ++i) {
						if (this.entry.billfrom.billfrom_code === this.billfromList[i].value) {
							this.billfrom = this.billfromList[i].data
							this.entry.billfrom = this.billfrom.billfrom
							this.entry.contact_information = this.billfrom.contact_information							
							break
						}
					}
				}
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}

	/**
	 * 請求元リストの変更
	 */
	changeBillfrom(_data) {
		if (_data) {
			this.entry.billfrom = _data.data.billfrom
			this.entry.contact_information = _data.data.contact_information
			this.billfrom = _data.data
		} else {
			this.entry.billfrom = {}
			this.entry.contact_information = {}
			this.billfrom = {}
		}
		this.forceUpdate()

	}

	setBillfromData(_data, _modal) {
		this.setBillfromMasterData(_data.feed.entry[0].billfrom)
		if (_modal === 'add') {
			this.setState({ showBillfromAddModal: false })
		} else {
			this.setState({ showBillfromEditModal: false })
		}
	}

	/**
	 * 顧客リストを作成する
	 */
	setCustomerMasterData() {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/customer?f&billto.billto_code=' + this.entry.billto.billto_code,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			if (response.status !== 204) {
				this.master.customerList = response.data.feed.entry
				this.customerList = this.master.customerList.map((obj) => {
					return {
						label: obj.customer.customer_name,
						value: obj.customer.customer_code,
						data: obj
					}
				})
				
				this.forceUpdate()
			}
		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}
	
	/**
	 * 顧客変更処理
	 */
	changeCustomer(_data) {
		if (_data) {
			this.entry.invoice.customer_code = _data.value
			this.customer = _data.data
			if (this.props.changeCustomerCode) {
				this.props.changeCustomerCode(_data.value)
			}
			if (this.entry.invoice.working_yearmonth) {
				this.getService(_data.data.customer.customer_code, this.entry.invoice.working_yearmonth)
				this.getInvoiceData(this.entry.invoice.customer_code,this.entry.invoice.working_yearmonth,this.entry.invoice.quotation_code)
			}
		} else {

			this.props.setReqestData(null, 'item_details')
			this.props.setReqestData(null, 'remarks')
			this.props.setReqestData(null, 'edit')

			this.isItemDetailsTable = false

			this.entry.invoice.customer_code = ''
			this.customer = {}
			if (this.props.changeCustomerCode) {
				this.props.changeCustomerCode('')
			}
		}

		// 簡易明細表示
		this.setBillingSummaryTable()
	}

	getInvoiceData(_customerCode,_workingYearmonth,_quotationCode) {
		
		axios({
			url:'/s/billingcompare?shipping_yearmonth=' + _workingYearmonth + '&customer_code=' + _customerCode + '&quotation_code=' + _quotationCode + '&shipment_class=' + 0,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			if (response.status === 204) {
				this.setState({ isDisabled: false })
			} else if (response.status !== 204) {
				this.shippingData = response.data.feed.entry[0]

				this.shippingData.billing_compare.map((billing_compare) => {
					axios({
						url:'/d/shipment_service?f&shipment_service.code='+billing_compare.shipment_service_code,
						method: 'get',
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						}
					}).then((response) => {
						billing_compare.shipment_service_service_name = billing_compare.shipment_service_service_name + '/' + response.data.feed.entry[0].shipment_service.service_name
					})
					let total_internal_work = 0
					let total_billing = 0
					let total_amount = 0
					billing_compare.record = billing_compare.record.map((record) => {
						//合計用
						total_internal_work = (Number(total_internal_work) + Number(record.internal_work_quantity))
						total_billing = (Number(total_billing) + Number(record.billing_quantity)) 
						total_amount = (Number(total_amount) + Number(record.billing_amount))
						//カンマ差し込み
						record.internal_work_quantity = addFigure(String(record.internal_work_quantity))
						record.billing_quantity = addFigure(String(record.billing_quantity))
						record.billing_amount = '¥' + addFigure(String(record.billing_amount))
						if (record.internal_work_quantity === record.billing_quantity) {
							return(record)
						} else {
							const newArray = {
								'shipping_date': record.shipping_date,
								'internal_work_quantity': record.internal_work_quantity,
								'billing_quantity': record.billing_quantity,
								'billing_amount':record.billing_amount,
								'is_error':true,
							}
							return(newArray)
						}
					})
					const totalArray = {
						'shipping_date': '合計',
						'internal_work_quantity': addFigure(String(total_internal_work)),
						'billing_quantity': addFigure(String(total_billing)),
						'billing_amount': '¥' + addFigure(String(total_amount)),
						'is_total':true,
					}
					billing_compare.record.push(totalArray)	
				})
			}
		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
		
		axios({
			url:'/s/billingcompare?shipping_yearmonth=' + _workingYearmonth + '&customer_code=' + _customerCode + '&quotation_code=' + _quotationCode + '&shipment_class=' + 1,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {

			if (response.status === 204) {
				this.setState({ isDisabled: false })
			} else if (response.status !== 204) {

				this.collectingData = response.data.feed.entry[0]
				this.setBillingDataTable(this.collectingData)
				this.collectingData.billing_compare.map((billing_compare) => {
					axios({
						url:'/d/shipment_service?f&shipment_service.code='+billing_compare.shipment_service_code,
						method: 'get',
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						}
					}).then((response) => {
						billing_compare.shipment_service_service_name = billing_compare.shipment_service_service_name + '/' + response.data.feed.entry[0].shipment_service.service_name
					})
					let total_internal_work = 0
					let total_billing = 0
					let total_amount = 0
					billing_compare.record = billing_compare.record.map((record) => {
						//合計用
						total_internal_work = (Number(total_internal_work) + Number(record.internal_work_quantity))
						total_billing = (Number(total_billing) + Number(record.billing_quantity)) 
						total_amount = (Number(total_amount) + Number(record.billing_amount))
						//カンマ差し込み
						record.internal_work_quantity = addFigure(String(record.internal_work_quantity))
						record.billing_quantity = addFigure(String(record.billing_quantity))
						record.billing_amount = '¥' + addFigure(String(record.billing_amount))
						if (record.internal_work_quantity === record.billing_quantity) {
							return(record)
						} else {
							const newArray = {
								'shipping_date': record.shipping_date,
								'internal_work_quantity': record.internal_work_quantity,
								'billing_quantity': record.billing_quantity,
								'billing_amount':record.billing_amount,
								'is_error':true,
							}
							return(newArray)
						}
					})
					const totalArray = {
						'shipping_date': '合計',
						'internal_work_quantity': addFigure(String(total_internal_work)),
						'billing_quantity': addFigure(String(total_billing)),
						'billing_amount': '¥' + addFigure(String(total_amount)),
						'is_total':true,
					}
					billing_compare.record.push(totalArray)	
				})
			}
		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	setBillingDataTable() {
		
	}
	/**
	 * 庫内作業年月リスト作成
	 */
	setInternalWorkYearMonthList() {
		this.setState({ isDisabled: true })
		if (this.entry.invoice.quotation_code) {
			axios({
				url: '/d/internal_work?f&quotation.quotation_code=' + this.entry.invoice.quotation_code,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {
				if (response.status === 204) {
					this.setState({ isDisabled: false })
					alert('庫内作業データがありません')
				} else if (response.status !== 204) {
					this.master.internalWorkYearMonthList = response.data.feed.entry
				
					//重複したものを削除する
					this.internalWorkYearMonthList = this.master.internalWorkYearMonthList.map((obj) => {
						return obj.internal_work.working_yearmonth
					}).filter((x, i, self) => {
						return self.indexOf(x) === i
					}).map((obj) => {
						return {
							label: obj,
							value: obj,
						}
					})
					this.forceUpdate()

				}
			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}	
	}

	/**
	 * 庫内作業年月変更
	 */
	changeInternalWorkYearMonth(_data) {

		if (_data) {
			this.entry.invoice.working_yearmonth = _data.value
			if(this.props.changeYearmonth){ this.props.changeYearmonth(_data.value)}
			if (this.entry.invoice.customer_code) {
				this.getService(this.entry.invoice.customer_code, _data.value)
			}
			this.forceUpdate()
		} else {

			this.props.setReqestData(null, 'item_details')
			this.props.setReqestData(null, 'remarks')
			this.props.setReqestData(null, 'edit')

			this.isItemDetailsTable = false

			this.entry.invoice.working_yearmonth = null
			if(this.props.changeYearmonth){ this.props.changeYearmonth('')}
		}
		// 簡易明細表示
		this.setBillingSummaryTable()
	}

	setItemDetailsTable() {

		const customer_code = this.entry.invoice.customer_code
		const selectInternalWorkYearMonth = this.entry.invoice.working_yearmonth

		this.addEntry = {
			customer: {
				customer_code: customer_code
			},
			item_details: []
		}
		this.editEntry = {
			invoice: {
				working_yearmonth: selectInternalWorkYearMonth
			},
			customer: {
				customer_code: customer_code
			},
			item_details: []
		}
		this.props.setReqestData(null, 'item_details')
		this.props.setReqestData(null, 'remarks')
		this.props.setReqestData(null, 'edit')

		this.isItemDetailsTable = false

		let count = 0
		const complate = () => {
			if (count === 2) {
				this.isItemDetailsTable = true
				this.changeTotalAmount()
			}
		}
		if (this.entry.invoice.invoice_code) {

			const invoice_code = this.entry.invoice.invoice_code
			const invoice_code_sub = this.entry.invoice.invoice_code_sub
			const key = invoice_code + '-' + invoice_code_sub

			this.addEntry.link = [{
				___href: '/invoice_details/' + key + '/' + this.entry.invoice.customer_code,
				___rel: 'self'
			}]
			const get = (_url) => {
				axios({
					url: '/d' + _url,
					method: 'get',
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					}
				}).then((response) => {

					count++

					if (_url.indexOf('invoice_details') != -1) {
						this.item_details = {}
					}

					this.setState({ isDisabled: false })

					if (response.status !== 204) {

						if (_url.indexOf('invoice_details') != -1) {
							this.addEntry = response.data.feed.entry[0]
							this.item_details = {}
							for (let i = 0; i < this.addEntry.item_details.length; ++i) {
								const details = this.addEntry.item_details[i]
								const category = details.category
								if (!this.item_details[category]) {
									this.item_details[category] = []
								}
								this.item_details[category].push(details)
							}
						}
						if (_url.indexOf('invoice_remarks') != -1) {
							this.editEntry = response.data.feed.entry[0]
							this.editEntry.item_details.map((_item_details) => {
								const category = _item_details.category
								const item_name = _item_details.item_name
								const unit = _item_details.unit
								const key = this.getKey(category, item_name, unit)
								const index = this.cashData[key]
								if (index || index === 0) {
									this[category][index].remarks = _item_details.remarks
								}
								this.forceUpdate()
							})
						}

					}
					complate()

				}).catch((error) => {
					count++
					this.item_details = {}
					this.setState({ isDisabled: false, isError: error })
					complate()
				})
			}
			get('/invoice_details/' + key + '?f&customer.customer_code=' + customer_code)
			get('/invoice_remarks/' + key + '?f&customer.customer_code=' + customer_code + '&invoice.working_yearmonth=' + selectInternalWorkYearMonth)

		} else {
			count = 2
			complate()
		}

	}

	/*
	 * 請求書内の月時作業、日時作業、資材などに項目を追加する
	 */
	addInvoiceList(list, _data) {
		
		if (!this.item_details[list]) {
			this.item_details[list] = []
		}
		this.item_details[list].push(_data)

		this.forceUpdate()
	}

	/**
	 * 請求書内で追加した項目を削除
	 */
	removeInvoiceList(list, _index) {
		let array = []
		for (let i = 0, ii = this.item_details[list].length; i < ii; ++i) {
			if (i !== _index) array.push(this.item_details[list][i])
		}
		this.item_details[list] = array

		this.addEntry.item_details = this.item_details
		this.props.setReqestData(this.addEntry, 'item_details')

		this.changeTotalAmount()
	}

	/**
	 * 請求書内で追加した請求リストの変更処理
	 */
	changeInvoiceList(list, _data, _rowindex, _celindex, _isEdit) {
	
		if (_isEdit) {

			this[list][_rowindex][_celindex] = _data

			const target_data = this[list][_rowindex]
			if (!this.editEntry.id) {
				const key = this.entry.invoice.invoice_code + '-' + this.entry.invoice.invoice_code_sub
				this.editEntry.link = [{
					___href: '/invoice_remarks/' + key + '/' + this.entry.invoice.customer_code,
					___rel: 'self'
				}]
			}

			if (this.editEntry.item_details.length) {
				let index
				for (let i = 0, ii = this.editEntry.item_details.length; i < ii; ++i) {
					const value = this.editEntry.item_details[i]
					if (value.category === target_data.category
						&& value.item_name === target_data.item_name
						&& value.unit === target_data.unit
					) {
						index = i
					}
				}
				if (index && index !== 0) {
					this.editEntry.item_details[index] = target_data
				} else {
					this.editEntry.item_details.push(target_data)
				}
			} else {
				this.editEntry.item_details.push(target_data)
			}
			this.props.setReqestData(this.editEntry, 'edit')
		} else {

			//変更処理
			this.item_details[list][_rowindex][_celindex] = _data

			//数量,単価を変更したら金額を変えて、小計,合計請求金額,消費税も変える
			if (_celindex === 'quantity' || _celindex === 'unit_price') {
				
				let unit_price
				let isMinus
				if (_celindex === 'unit_price') {
					isMinus = _data && String(_data)[0] === '-'
					unit_price = isMinus ? '-' + addFigure(_data) : addFigure(_data)
					this.item_details[list][_rowindex].unit_price = unit_price
				} else {
					unit_price = this.item_details[list][_rowindex].unit_price
					isMinus = unit_price && String(unit_price)[0] === '-'
				}

				unit_price = isMinus ? unit_price.replace('-', '') : unit_price
				unit_price = parseInt(delFigure(unit_price))

				const quantity = parseInt(delFigure(this.item_details[list][_rowindex].quantity))

				const amount = quantity * unit_price
				this.item_details[list][_rowindex].amount = amount || amount === 0 ? amount : ''
				
				//税込なら消費税を足す
				if (this.item_details[list][_rowindex].is_taxation === '1') {
					this.item_details[list][_rowindex].amount += Math.floor(this.item_details[list][_rowindex].amount * 0.08)
				}
				if (this.item_details[list][_rowindex].amount) {
					this.item_details[list][_rowindex].amount = isMinus ? '-' + addFigure(this.item_details[list][_rowindex].amount) : addFigure(this.item_details[list][_rowindex].amount)
				}
			}

			this.changeTotalAmount()
			
			this.addEntry.item_details = this.item_details
			this.props.setReqestData(this.addEntry, 'item_details')
		}

		this.forceUpdate()
	}

	forcusUnitPrice(list, _data, _rowindex) {
		const isMinus = _data && String(_data)[0] === '-'
		this.item_details[list][_rowindex].unit_price = isMinus ? '-' + delFigure(_data) : delFigure(_data)
		this.forceUpdate()
	}

	changeTotalAmount() {

		let allItem = []
		this.serviceItem.map((_value) => {
			allItem.push(_value)
		})
		Object.keys(this.item_details).forEach((_key) => {
			this.item_details[_key].map((_value) => {
				allItem.push(_value)
			})
		})
		let sub_total = 0
		let ems_total = 0

		if (allItem.length) {

			allItem.map((_obj) => {
				const amount = _obj.amount
				if (amount) {
					const isMinus = String(amount)[0] === '-'
					const calculation = (_value, _total) => {
						if (isMinus) {
							return parseInt(_value) - _total
						} else {
							return parseInt(_value) + _total
						}
					}
					const value = delFigure(_obj.amount)
					if (_obj.category === 'ems') {
						ems_total = calculation(value, ems_total)
					} else {
						sub_total = calculation(value, sub_total)
					}
				}
			})
		}

		// 税抜の合計
		this.sub_total = addFigure(sub_total)
		// 消費税
		const consumption_tax = Math.floor(sub_total * 0.08)
		this.consumption_tax = addFigure(consumption_tax)
		// EMS・立替金など
		this.ems_total = addFigure(ems_total)
		// 合計請求金額
		this.total_amount = addFigure(sub_total + consumption_tax + ems_total)

		this.forceUpdate()

	}

	/**
	 * 	備考リストの追加
	 */
	addRemarksList(list,_data) {
		
		if (!this.entry[list]) {
			this.entry[list] = []
		}
		this.entry[list].push(_data)
		this.forceUpdate()
	}

	/**
	 * 	備考リストの削除
	 */
	removeRemarksList(list, _index) {
		let array = []

		for (let i = 0, ii = this.entry[list].length; i < ii; ++i) {
			if (i !== _index) array.push(this.entry[list][i])
		}
		this.entry[list] = array

		this.props.setReqestData(this.entry.remarks, 'remarks')
		this.forceUpdate()
	}

	/**
	 *  備考リストの内容変更
	 */
	changeRemarks(_data, _rowindex) {
		this.entry.remarks[_rowindex].content = _data
		this.props.setReqestData(this.entry.remarks, 'remarks')
		this.forceUpdate()
	}

	changeInvoice(_data, _index) {
		if (_index === 'invoice_yearmonth') {
			this.entry.invoice[_index] = _data ? _data.value : null
		} else {
			this.entry.invoice[_index] = _data
		}
		this.forceUpdate()
	}

	billingDetailsCSVDownLoad(_data) {
		if (this.entry.invoice.working_yearmonth) {
			let searchYearmonth = this.entry.invoice.working_yearmonth.replace(/\//, '')
			let delivery = _data.delivery === 'ヤマト運輸' ? 'YH' : 'ECO'
			location.href = '/s/download-billing-csv?shipping_yearmonth=' + searchYearmonth + '&billto_code=' + this.entry.billto.billto_code + '&delivery_company=' + delivery
		} else {
			alert('庫内作業年月が選択されていません。')
		}
	}

	/**
	 * 簡易明細テーブル表示
	 */
	setBillingSummaryTable() {

		let getCount = 0
		let tables = [null,null,null]

		/**
		 * 明細テーブル描画処理
		 */
		const viewTable = (_pdf_option) => {

			// 合計通信数が2になったら描画処理
			if (getCount === 2) {

				if (tables[1] || tables[2]) {
					const downloadSinglePdf = () => {
						location.href = '/s/get-pdf-billing-summary' + _pdf_option
					}

					tables[0] = (
						<div>
							<Button bsSize="small" onClick={() => downloadSinglePdf()}>
								<Glyphicon glyph="download" /> PDFダウンロード
							</Button>
							<br />
							<br />
						</div>
					)
				}
				this.billingSummaryTable = tables
				this.forceUpdate()
			}
		}

		/**
		 * 明細テーブル生成処理
		 */
		const setSummaryTable = (_record, _tableIndex, _tableName, _pdf_option) => {

			let cash_header = {}
			let header1 = [<th key={0}></th>]
			let header2 = [<td className="center" key={0}>サイズ</td>]
			let is_end_header = false

			let befor_size
			let this_size

			let record_array = []
			let record_array_index = -1

			let sizeTotalData = {}
			let sub_total = {}

			const setSizeTotal = (_index, _size) => {
				record_array[_index].push(
					<td key={record_array[_index].length}>
						{sizeTotalData[_size].quantity}
					</td>
				)
				record_array[_index].push(
					<td key={record_array[_index].length}>
						{addFigure(sizeTotalData[_size].sub_total + '')}
					</td>
				)
			}

			for (let i = 0, ii = _record.length; i < ii; ++i) {

				const record = _record[i]
				this_size = record.size

				if (!sizeTotalData[this_size]) {
					sizeTotalData[this_size] = {
						quantity: 0,
						sub_total: 0
					}
				}
				sizeTotalData[this_size].quantity = sizeTotalData[this_size].quantity + parseInt(record.quantity)
				sizeTotalData[this_size].sub_total = sizeTotalData[this_size].sub_total + parseInt(record.subtotal)

				if (!is_end_header && !cash_header[record.zone_name]) {
					cash_header[record.zone_name] = true
					header1.push(<th colspan="3" key={header1.length}>{record.zone_name}</th>)
					header2.push(<td className="center" key={header2.length}>個数</td>)
					header2.push(<td className="center" key={header2.length}>単価</td>)
					header2.push(<td className="center" key={header2.length}>小計</td>)
				} else if (!is_end_header) {
					is_end_header = true
				}
				if (befor_size !== this_size) {
					record_array_index++
					if (!record_array[record_array_index]) {
						record_array[record_array_index] = []
					}
					record_array[record_array_index].push(
						<td className="center" key={record_array[record_array_index].length}>{this_size}</td>
					)

					const befor_index = parseInt(JSON.stringify(record_array_index)) - 1
					if (befor_index > -1) {
						setSizeTotal(befor_index, befor_size)
					}
					befor_size = record.size

				}
				record_array[record_array_index].push(
					<td key={record_array[record_array_index].length}>
						{record.quantity}
					</td>
				)
				record_array[record_array_index].push(
					<td key={record_array[record_array_index].length}>
						{addFigure(record.delivery_charge)}
					</td>
				)
				record_array[record_array_index].push(
					<td key={record_array[record_array_index].length}>
						{addFigure(record.subtotal)}
					</td>
				)

				if (!sub_total[record.zone_name] && sub_total[record.zone_name] !== 0) {
					sub_total[record.zone_name] = 0
				}
				sub_total[record.zone_name] = sub_total[record.zone_name] + parseInt(record.subtotal)
			}

			setSizeTotal(record_array_index, this_size)

			header1.push(<th key={header1.length}></th>)
			header1.push(<th key={header1.length}>合計</th>)
			header2.push(<td className="center" key={header2.length}>総個数</td>)
			header2.push(<td className="center" key={header2.length}>金額</td>)

			let tr_array = []
			record_array.map((_td) => {
				tr_array.push(<tr>{_td}</tr>)
			})

			let sub_total_td = [<td key={0}>合計</td>]
			Object.keys(sub_total).forEach((_key) => {
				const value = sub_total[_key] + ''
				sub_total_td.push(<td key={sub_total_td.length}></td>)
				sub_total_td.push(<td key={sub_total_td.length}></td>)
				sub_total_td.push(<td key={sub_total_td.length}>{addFigure(value)}</td>)
			})

			let total_sub_quantity = 0
			let total_sub_total = 0
			Object.keys(sizeTotalData).forEach((_key) => {
				const size_data = sizeTotalData[_key]
				total_sub_quantity = total_sub_quantity + size_data.quantity
				total_sub_total = total_sub_total + size_data.sub_total
			})
			sub_total_td.push(<td key={sub_total_td.length}>{total_sub_quantity}</td>)
			sub_total_td.push(<td key={sub_total_td.length}>{addFigure(total_sub_total + '')}</td>)
			tr_array.push(<tr>{sub_total_td}</tr>)

			tables[_tableIndex] = (
				<Panel collapsible header={_tableName} eventKey="2" bsStyle="info" defaultExpanded="true">
					<div className="invoiceDetails-table scroll">
						<Table striped bordered hover>
							<thead>
								<tr>
									{header1}
								</tr>
							</thead>
							<tbody>
								<tr>
									{header2}
								</tr>
								{tr_array}
							</tbody>
						</Table>
					</div>
				</Panel>
			)

			viewTable(_pdf_option)

		}

		/**
		 * 明細データ取得処理
		 */
		const getBillingSummary = (_customer, _shipping_yearmonth, _delivery_company) => {

			const billto_code = this.entry.billto.billto_code

			const option = '?shipping_yearmonth=' + _shipping_yearmonth
				+ '&billto_code=' + billto_code
				+ '&customer_code=' + _customer

			axios({
				url: '/s/billingsummary' + option + '&delivery_company=' + _delivery_company,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				// 合計通信数をカウント
				getCount++

				const record = response.data.feed.entry[0].billing_summary.record
				const tableIndex = _delivery_company === 'YH' ? 2 : 1
				const tableName = _delivery_company === 'YH' ? 'ヤマト運輸発払簡易明細' : 'エコ配JP簡易明細'

				if (record) {
					setSummaryTable(record, tableIndex, tableName, option)
				} else {
					tables[tableIndex] = null
					viewTable(option)
				}

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}

		const customer_code = this.entry.invoice.customer_code
		const selectInternalWorkYearMonth = this.entry.invoice.working_yearmonth

		if (customer_code && selectInternalWorkYearMonth) {

			const shipping_yearmonth = selectInternalWorkYearMonth.replace(/\//, '')
			getBillingSummary(customer_code, shipping_yearmonth, 'YH')
			getBillingSummary(customer_code, shipping_yearmonth, 'ECO')

		} else {

			this.billingSummaryTable = null
			this.forceUpdate()

		}

	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>
												
				{/* 登録の場合 */}
				{!this.entry.invoice.invoice_code &&
					<FormGroup className="hide">
						<FormControl name="invoice.invoice_code" type="text" value="${_addids}" />
						<FormControl name="invoice.invoice_code_sub" type="text" value="01" />
						<FormControl name="invoice.issue_status" type="text" value="0" />
						<FormControl name="link" data-rel="self" type="text" value="/invoice/${_addids}-01" />
					</FormGroup>
				}

				{/* 更新の場合 */}
				{this.entry.invoice.invoice_code &&
					<CommonInputText
						controlLabel="請求番号"
						type="text"
						placeholder="請求番号"
						value={this.entry.invoice.invoice_code + ' - ' + this.entry.invoice.invoice_code_sub}
						readonly
					/>
				}
				{this.entry.invoice.invoice_code &&
					<CommonInputText
						controlLabel="発行ステータス"
						type="text"
						placeholder="請求番号"
						value={this.entry.invoice.issue_status === '0' ? '未発行' : '発行済'}
						readonly
					/>
				}
				{this.entry.invoice.invoice_code &&
					<FormGroup className="hide">
						<FormControl name="invoice.invoice_code" type="text" value={this.entry.invoice.invoice_code} />
						<FormControl name="invoice.invoice_code_sub" type="text" value={this.entry.invoice.invoice_code_sub} />
						<FormControl name="invoice.issue_status" type="text" value={this.entry.invoice.issue_status} />
					</FormGroup>
				}
				
				{ this.isEdit &&
					<CommonMonthlySelect
						controlLabel="請求年月"
						name="invoice.invoice_yearmonth"
						value={this.entry.invoice.invoice_yearmonth}
						onChange={(data)=>this.changeInvoice(data,'invoice_yearmonth')}
					/>
				}
				{ !this.isEdit &&
					<CommonInputText
						controlLabel="請求年月"
						name="invoice.invoice_yearmonth"
						type="text"
						value={this.entry.invoice.invoice_yearmonth}
						readonly
					/>
				}

				<CommonInputText
					controlLabel="請求先名"	
					name='billto.billto_name'							
					type="text"
					placeholder="請求先名"
					value={this.entry.billto.billto_name}
					readonly
				/>

				<FormGroup className="hide">
					<CommonInputText
						controlLabel="請求先コード"	
						name='billto.billto_code'							
						type="text"
						placeholder="請求先コード"
						value={this.entry.billto.billto_code}
						readonly
					/>
				</FormGroup>	

				<CommonInputText
					controlLabel="見積番号"	
					name='invoice.quotation_code'							
					type="text"
					placeholder="見積番号"
					value={this.entry.invoice.quotation_code}
					readonly='true'
				/>

				<CommonDatePicker
					controlLabel="支払日"
					name="invoice.payment_date"
					selected={this.entry.invoice.payment_date}
					onChange={(data) => this.changeInvoice(data,'payment_date')}
				/>

				<CommonRadioBtn 
					controlLabel="入金ステータス"
					name="invoice.deposit_status"
					checked={this.entry.invoice.deposit_status}
					data={[{
						label: '未入金',
						value: '0',
					}, {
						label: '入金済',
						value: '1',
					}]}
					onChange={(data) => this.changeInvoice(data,'deposit_status')}
				/>
				
				<CommonInputText
					controlLabel="作成者"	
					name='creator'							
					type="text"
					placeholder="作成者"
					value={this.entry.creator}
					readonly='true'
				/>

				{ this.isEdit &&
					<CommonFilterBox
						controlLabel="庫内作業年月"
						name="invoice.working_yearmonth"
						value={this.entry.invoice.working_yearmonth}
						options={this.internalWorkYearMonthList}
						onChange={(data) => this.changeInternalWorkYearMonth(data)}
						size='sm'
					/>
				}
				{ !this.isEdit &&
					<CommonInputText
						controlLabel="庫内作業年月"
						name="invoice.working_yearmonth"
						value={this.entry.invoice.working_yearmonth}
						type="text"
						readonly
					/>
				}

				<CommonFilterBox
					controlLabel="顧客選択"
					name="invoice.customer_code"
					value={this.entry.invoice.customer_code}
					options={this.customerList}
					onChange={(data) => this.changeCustomer(data)}
				/>

				<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

					<Tab eventKey={1} title="請求内容">
						{ this.isItemDetailsTable &&

							<PanelGroup defaultActiveKey="1">
								
								<Button bsSize="sm" style={{width:'130px'}} >
									<Glyphicon glyph="download" />CSVダウンロード
								</Button>

								<br />
								<br />
								<Panel collapsible header="月次情報" eventKey="1" bsStyle="info" defaultExpanded="true">
									<CommonTable
										data={this.monthly}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)/単位名称', width: '200px',
										}, {
											field: 'quantity', title: '数量', width: '50px',
										}, {
											field: 'unit', title: '単位', width: '50px',
										}, {
											field: 'unit_price', title: '単価', width: '100px',
										}, {
											field: 'amount', title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '30px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'remarks',true)}
											}
										}]}
										fixed
									/>
									
									<br />
									<br />
									<CommonTable
										data={this.item_details.monthly}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)', width: '300px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'item_name')}
											}
										}, {
											field: 'quantity',title: '数量', width: '50px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'quantity')},
												price:true,
											}
										}, {
											field: 'unit',title: '単位', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'unit')}
											}
										}, {
											field: 'unit_price',title: '単価', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'unit_price')},
												onForcus: (data, rowindex)=>{this.forcusUnitPrice('monthly',data,rowindex)},
											},
										}, {
											field: 'is_taxation', title: '税込/税抜', width: '50px',
											convert: this.convert_taxation
										}, {
											field: 'amount',title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'remarks')}
											}
										}]}
										add={this.isEdit ? () => this.addInvoiceList('monthly', { category:'monthly',item_name: '', quantity: '', unit: '', unit_price: '',amount:'', is_taxation: '0', remarks: '', }) : null}
										remove={this.isEdit ? (data, index) => this.removeInvoiceList('monthly', index) : null}
										fixed
									/>
								</Panel>

								<Panel collapsible header="日次作業情報" eventKey="2" bsStyle="info" defaultExpanded="true">
									<CommonTable
										data={this.daily}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)/単位名称', width: '300px',
										}, {
											field: 'quantity', title: '数量', width: '50px',
										}, {
											field: 'unit', title: '単位', width: '100px',
										}, {
											field: 'unit_price', title: '単価', width: '100px',
										}, {
											field: 'amount', title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'remarks',true)}
											}
										}]}
										fixed
									/>

									<br />
									<br />		
									<CommonTable
										data={this.item_details.daily}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)', width: '300px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'item_name')}
											}
										}, {
											field: 'quantity',title: '数量', width: '50px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'quantity')},
												price:true,
											}
										}, {
											field: 'unit',title: '単位', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'unit')}
											}
										}, {
											field: 'unit_price',title: '単価', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'unit_price')},
												onForcus: (data, rowindex)=>{this.forcusUnitPrice('daily',data,rowindex)},
											},
										}, {
											field: 'is_taxation', title: '税込/税抜', width: '50px',
											convert: this.convert_taxation
										}, {
											field: 'amount',title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'remarks')}
											}
										}]}
										add={this.isEdit ? () => this.addInvoiceList('daily', { category:'daily',item_name: '', quantity: '', unit: '', unit_price: '',amount:'', is_taxation: '0', remarks: '', }) : null}
										remove={this.isEdit ? (data, index) => this.removeInvoiceList('daily', index) : null}
										fixed
									/>
								</Panel>
								
								<Panel collapsible header="期次作業情報" eventKey="3" bsStyle="info" defaultExpanded="true">
									<CommonTable
										data={this.period}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)/単位名称', width: '300px',
										}, {
											field: 'quantity', title: '数量', width: '50px',
										}, {
											field: 'unit', title: '単位', width: '100px',
										}, {
											field: 'unit_price', title: '単価', width: '100px',
										}, {
											field: 'amount', title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('period',data,rowindex,'remarks',true)}
											}
										}]}
										fixed
									/>

									<br />
									<br />
									
									<CommonTable
										data={this.item_details.period}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)', width: '300px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('period',data,rowindex,'item_name')}
											}
										}, {
											field: 'quantity',title: '数量', width: '50px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('period',data,rowindex,'quantity')},
												price:true,
											}
										}, {
											field: 'unit',title: '単位', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('period',data,rowindex,'unit')}
											}
										}, {
											field: 'unit_price',title: '単価', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('period',data,rowindex,'unit_price')},
												onForcus: (data, rowindex)=>{this.forcusUnitPrice('period',data,rowindex)},
											},
										}, {
											field: 'is_taxation', title: '税込/税抜', width: '50px',
											convert: this.convert_taxation
										}, {
											field: 'amount',title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('period',data,rowindex,'remarks')}
											}
										}]}
										add={this.isEdit ? () => this.addInvoiceList('period', { category:'period',item_name: '', quantity: '', unit: '', unit_price: '',amount:'', is_taxation: '0', remarks: '', }) : null}
										remove={this.isEdit ? (data, index) => this.removeInvoiceList('period', index) : null}
										fixed
									/>
								</Panel>

								<Panel collapsible header="資材情報" eventKey="4" bsStyle="info" defaultExpanded="true">
									<CommonTable
										data={this.packing_item}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)/単位名称', width: '300px',
										}, {
											field: 'quantity', title: '数量', width: '50px',
										}, {
											field: 'unit', title: '単位', width: '100px',
										}, {
											field: 'unit_price', title: '単価', width: '100px',
										}, {
											field: 'amount', title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'remarks',true)}
											}
										}]}
										fixed
									/>

									<br />
									<br />
									<CommonTable
										data={this.item_details.packing_item}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)', width: '300px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'item_name')}
											}
										}, {
											field: 'quantity',title: '数量', width: '50px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'quantity')},
												price:true,
											}
										}, {
											field: 'unit',title: '単位', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'unit')}
											}
										}, {
											field: 'unit_price',title: '単価', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'unit_price')},
												onForcus: (data, rowindex)=>{this.forcusUnitPrice('packing_item',data,rowindex)},
											},
										}, {
											field: 'is_taxation', title: '税込/税抜', width: '50px',
											convert: this.convert_taxation
										}, {
											field: 'amount',title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'remarks')}
											}
										}]}
										add={this.isEdit ? () => this.addInvoiceList('packing_item', { category:'packing_item',item_name: '', quantity: '', unit: '', unit_price: '',amount:'', is_taxation: '0', remarks: '', }) : null}
										remove={this.isEdit ? (data, index) => this.removeInvoiceList('packing_item', index) : null}
										fixed
									/>
								</Panel>

								<Panel collapsible header="配送料(出荷)" eventKey="5" bsStyle="info" defaultExpanded="true">
									<CommonTable
										data={this.shipping}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)/単位名称', width: '300px',
										}, {
											field: 'quantity', title: '数量', width: '50px',
										}, {
											field: 'unit', title: '単位', width: '100px',
										}, {
											field: 'unit_price', title: '単価', width: '100px',
										}, {
											field: 'amount', title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('shipping',data,rowindex,'remarks',true)}
											}
										}]}
										fixed
									/>

									<br />
									<br />
									<CommonTable
										data={this.item_details.shipping}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)', width: '300px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('shipping',data,rowindex,'item_name')}
											}
										}, {
											field: 'quantity',title: '数量', width: '50px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('shipping',data,rowindex,'quantity')},
												price:true,
											}
										}, {
											field: 'unit',title: '単位', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('shipping',data,rowindex,'unit')}
											}
										}, {
											field: 'unit_price',title: '単価', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('shipping',data,rowindex,'unit_price')},
												onForcus: (data, rowindex)=>{this.forcusUnitPrice('shipping',data,rowindex)},
											},
										}, {
											field: 'is_taxation', title: '税込/税抜', width: '50px',
											convert: this.convert_taxation
										}, {
											field: 'amount',title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('shipping',data,rowindex,'remarks')}
											}
										}]}
										add={this.isEdit ? () => this.addInvoiceList('shipping', { category:'shipping',item_name: '', quantity: '', unit: '', unit_price: '',amount:'', is_taxation: '0', remarks: '', }) : null}
										remove={this.isEdit ? (data, index) => this.removeInvoiceList('shipping', index) : null}
										fixed
									/>
								</Panel>	
								
								<Panel collapsible header="配送料(集荷)" eventKey="6" bsStyle="info" defaultExpanded="true">
									<CommonTable
										data={this.collecting}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)/単位名称', width: '300px',
										}, {
											field: 'quantity', title: '数量', width: '50px',
										}, {
											field: 'unit', title: '単位', width: '100px',
										}, {
											field: 'unit_price', title: '単価', width: '100px',
										}, {
											field: 'amount', title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('collecting',data,rowindex,'remarks',true)}
											}
										}]}
										fixed
									/>
									<br />
									<br />
									<CommonTable
										data={this.item_details.collecting}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)', width: '300px',
											input: this.isEdit && {
												onBlur: (data, rowindex) => { this.changeInvoiceList('collecting', data, rowindex, 'item_name') }
											}
										}, {
											field: 'quantity', title: '数量', width: '50px',
											input: this.isEdit && {
												onBlur: (data, rowindex) => { this.changeInvoiceList('collecting', data, rowindex, 'quantity') },
												price: true,
											}
										}, {
											field: 'unit', title: '単位', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex) => { this.changeInvoiceList('collecting', data, rowindex, 'unit') }
											}
										}, {
											field: 'unit_price', title: '単価', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex) => { this.changeInvoiceList('collecting', data, rowindex, 'unit_price') },
												onForcus: (data, rowindex) => { this.forcusUnitPrice('collecting', data, rowindex) },
											},
										}, {
											field: 'is_taxation', title: '税込/税抜', width: '50px',
											convert: this.convert_taxation
										}, {
											field: 'amount', title: '金額', width: '100px',
										}, {
											field: 'remarks', title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex) => { this.changeInvoiceList('collecting', data, rowindex, 'remarks') }
											}
										}]}
										add={this.isEdit ? () => this.addInvoiceList('collecting', { category: 'collecting', item_name: '', quantity: '', unit: '', unit_price: '', amount: '1', is_taxation: '0', remarks: '', }) : null}
										remove={this.isEdit ? (data, index) => this.removeInvoiceList('collecting', index) : null}
										fixed
									/>
								</Panel>

								<Panel collapsible header="その他" eventKey="7" bsStyle="info" defaultExpanded="true">
									<CommonTable
										data={this.item_details.others}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)', width: '300px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'item_name')}
											}
										}, {
											field: 'quantity',title: '数量', width: '50px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'quantity')},
												price:true,
											}
										}, {
											field: 'unit',title: '単位', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'unit')}
											}
										}, {
											field: 'unit_price',title: '単価', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'unit_price')},
												onForcus: (data, rowindex)=>{this.forcusUnitPrice('others',data,rowindex)},
											},
										}, {
											field: 'is_taxation', title: '税込/税抜', width: '50px',
											convert: this.convert_taxation
										}, {
											field: 'amount',title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'remarks')}
											}
										}]}
										add={this.isEdit ? () => this.addInvoiceList('others', { category:'others',item_name: '', quantity: '', unit: '', unit_price: '',amount:'', is_taxation: '0', remarks: '', }) : null}
										remove={this.isEdit ? (data, index) => this.removeInvoiceList('others',index) : null}
										fixed
									/>
								</Panel>

								<Panel collapsible header="EMS・立替金など" eventKey="7" bsStyle="info" defaultExpanded="true">
									<CommonTable
										data={this.item_details.ems}
										header={[{
											field: 'item_name', title: 'ご請求内容(作業内容)', width: '300px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('ems',data,rowindex,'item_name')}
											}
										}, {
											field: 'quantity',title: '数量', width: '50px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('ems',data,rowindex,'quantity')},
												price:true,
											}
										}, {
											field: 'unit',title: '単位', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('ems',data,rowindex,'unit')}
											}
										}, {
											field: 'unit_price',title: '単価', width: '100px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('ems',data,rowindex,'unit_price')},
												onForcus: (data, rowindex)=>{this.forcusUnitPrice('ems',data,rowindex)},
											},
										}, {
											field: 'is_taxation', title: '税込/税抜', width: '50px',
											convert: this.convert_taxation
										}, {
											field: 'amount',title: '金額', width: '100px',
										}, {
											field: 'remarks',title: '備考', width: '200px',
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeInvoiceList('ems',data,rowindex,'remarks')}
											}
										}]}
										add={this.isEdit ? () => this.addInvoiceList('ems', { category:'ems',item_name: '', quantity: '', unit: '', unit_price: '',amount:'', is_taxation: '1', remarks: '', }) : null}
										remove={this.isEdit ? (data, index) => this.removeInvoiceList('ems',index) : null}
										fixed
									/>
								</Panel>

								<Panel collapsible header="備考" eventKey="8" bsStyle="info" defaultExpanded="true">
									<CommonTable	
										name="remarks"
										data={this.entry.remarks}
										header={[{
											field: 'content', title: '備考', 
											input: this.isEdit && {
												onBlur: (data, rowindex)=>{this.changeRemarks(data, rowindex)}
											}
										}]}
										add={this.isEdit ? () => this.addRemarksList('remarks', { content: ''}) : null}
										remove={this.isEdit ? (data, index) => this.removeRemarksList('remarks', index) : null}
										fixed
									/>
								</Panel>

								<br />

								<CommonInputText
									controlLabel="小計金額"
									type="text"
									value={this.sub_total}
									readonly
									className="invoice-total_amount"
								/>
								<br/>
								<br/>
								<CommonInputText
									controlLabel="消費税"
									type="text"
									value={this.consumption_tax}
									readonly
									className="invoice-total_amount"
								/>
								<br />
								<br />		
								<CommonInputText
									controlLabel="EMS・立替金など"
									type="text"
									value={this.ems_total}
									readonly
									className="invoice-total_amount"
								/>
								<br/>
								<br/>
								<CommonInputText
									controlLabel="合計請求金額"
									type="text"
									value={this.total_amount}
									readonly='true'
									className="invoice-total_amount"
								/>
								<br />
								<br />

							</PanelGroup>
						}

					</Tab>
					
					<Tab eventKey={2} title="請求明細(簡易)">

						{this.billingSummaryTable}

					</Tab>

					<Tab eventKey={3} title="請求明細(詳細)">
						
						<Panel collapsible header="明細CSVダウンロード" eventKey="3" bsStyle="info" defaultExpanded="true">
							<CommonTable
								data={this.deliveryCSV}
								header={[{
									field: 'btn1', title: 'CSV', width: '10px',
									label: <Glyphicon glyph="download" />,
									onClick: (data) => this.billingDetailsCSVDownLoad(data)
								}, {
									field:'delivery', title:'配送業者',width:'1000px',
								}]}
							/>
						</Panel>

					</Tab>
					
					<Tab eventKey={4} title="請求元"> 
						
						{/*
							画面に表示
							 名前
							 郵便番号
							 住所（都道府県 + 市区郡町村 + 番地）表示用
							 電話番号
							 口座情報
							
							画面に非表示
							 FAX
							 メールアドレス
							 都道府県
							 市区郡町村
							 番地
						*/}

						{ this.isEdit &&
							<CommonFilterBox
								controlLabel="請求元"
								name="billfrom.billfrom_code"
								value={this.entry.billfrom.billfrom_code}
								options={this.billfromList}
								add={() => this.setState({ showBillfromAddModal: true })}
								edit={() => this.setState({ showBillfromEditModal: true })}
								onChange={(data) => this.changeBillfrom(data)}
							/>
						}
						{ !this.isEdit &&
							<CommonInputText
								controlLabel="請求元"
								name="billfrom.billfrom_code"
								value={this.entry.billfrom.billfrom_code}
								type="text"
								readonly
							/>
						}
						{this.entry.billfrom.billfrom_code &&
								<CommonInputText
									controlLabel=" "
									name="billfrom.billfrom_name"
									type="text"
									value={this.entry.billfrom.billfrom_name}
									readonly
								/>
						}						
						{this.entry.billfrom.billfrom_code &&
								<CommonInputText
									controlLabel="郵便番号"
									name="contact_information.zip_code"
									type="text"
									placeholder="郵便番号"
									value={this.entry.contact_information.zip_code}
									readonly
								/>
						}
						{this.entry.billfrom.billfrom_code &&
								<CommonInputText
									controlLabel="住所"
									type="text"
									value={this.entry.contact_information.prefecture + this.entry.contact_information.address1 + this.entry.contact_information.address2}
									readonly
								/>
						}
						{this.entry.billfrom.billfrom_code &&
								<CommonInputText
									controlLabel="電話番号"
									name="contact_information.tel"
									type="text"
									placeholder="電話番号"
									value={this.entry.contact_information.tel}
									readonly
								/>
						}
						{this.entry.billfrom.billfrom_code &&
								<CommonTable
									controlLabel="口座情報"
									name="billfrom.payee"
									data={this.entry.billfrom.payee}
									header={[{
										field: 'bank_info', title: '銀行名', width: '30px',
										convert: {
											1: 'みずほ銀行', 2: '三菱東京UFJ銀行', 3: '三井住友銀行', 4: 'りそな銀行', 5: '埼玉りそな銀行',
											6: '楽天銀行',7:'ジャパンネット銀行',8:'巣鴨信用金庫',9:'川口信用金庫',10:'東京都民銀行',11:'群馬銀行',
										}
									}, {
										field: 'branch_office', title: '支店名', width: '30px',
									}, {
										field: 'account_type', title: '口座種類', width: '30px',convert: { 0: '普通' ,1: '当座',}
									}, {
										field: 'account_number', title: '口座番号', width: '30px',
									}, {
										field: 'account_name', title: '口座名義', width: '30px',
									}]}
									noneScroll
									fixed
								/>
						}

						{this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="contact_information.fax"
										type="text"
										value={this.entry.contact_information.fax}
										readonly
									/>
								</FormGroup>
						}
						{this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="contact_information.email"
										type="text"
										value={this.entry.contact_information.email}
										readonly
									/>
								</FormGroup>
						}
						{this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonPrefecture
										controlLabel="都道府県"
										componentClass="select"
										name="contact_information.prefecture"
										value={this.entry.contact_information.prefecture}
									/>
								</FormGroup>
						}
						{this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="contact_information.address1"
										type="text"
										value={this.entry.contact_information.address1}
										readonly
									/>
								</FormGroup>
						}
						{this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="contact_information.address2"
										type="text"
										value={this.entry.contact_information.address2}
										readonly
									/>
								</FormGroup>
						}
										
						{!this.entry.billfrom.billfrom_code &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="billfrom.billfrom_name"
										type="text"
										readonly
									/>
								</FormGroup>
						}
						{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.zip_code"
										type="text"
										placeholder="郵便番号"
										readonly
									/>
								</FormGroup>
						}
						{!this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonPrefecture
										controlLabel="都道府県"
										componentClass="select"
										name="contact_information.prefecture"
									/>
								</FormGroup>
						}		
						{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.address1"
										type="text"
										readonly
									/>
								</FormGroup>
						}
						{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.address2"
										type="text"
										readonly
									/>
								</FormGroup>
						}
						{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.tel"
										type="text"
										readonly
									/>
								</FormGroup>
						}
						{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.fax"
										type="text"
										readonly
									/>
								</FormGroup>
						}
						{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.email"
										type="text"
										readonly
									/>
								</FormGroup>
						}		
						{!this.entry.billfrom.billfrom_code &&
								<FormGroup className="hide"	>
									<CommonTable
										name="billfrom.payee"
										data={this.entry.billfrom.payee}
										header={[{
											field: 'bank_info', title: '銀行名', width: '30px',
											convert: {
												1: 'みずほ銀行', 2: '三菱東京UFJ銀行', 3: '三井住友銀行', 4: 'りそな銀行', 5: '埼玉りそな銀行',
												6: '楽天銀行',7:'ジャパンネット銀行',8:'巣鴨信用金庫',9:'川口信用金庫',10:'東京都民銀行',11:'群馬銀行',
											}
										}, {
											field: 'branch_office', title: '支店名', width: '30px',
										}, {
											field: 'account_type', title: '口座種類', width: '30px',convert: { 0: '普通' ,1: '当座',}
										}, {
											field: 'account_number', title: '口座番号', width: '30px',
										}, {
											field: 'account_name', title: '口座名義', width: '30px',
										}]}
										noneScroll
										fixed
									/>
								</FormGroup>
						}
	
					</Tab>
					
					<Tab eventKey={5} title="請求データ(発送)">
						{(this.shippingData && this.shippingData.billing_compare) === true &&
							this.shippingData.billing_compare.map((billing_compare, idx) => {
								return(
									<Panel key={idx} collapsible header={billing_compare.shipment_service_service_name} eventKey={idx} bsStyle="info" defaultExpanded="true">
										<CommonTable
											data={billing_compare.record}
											header={[{
												field: 'shipping_date',title: '日付', width: '50px'
											}, {
												field: 'internal_work_quantity', title: '発送作業個数', width: '300px'
											}, {
												field: 'billing_quantity', title: '請求個数', width: '300px'
											}, {
												field: 'billing_amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
											}]}
										/>	

									</Panel>
								)
							})
						}
			
					</Tab>

					<Tab eventKey={6} title="請求データ(集荷)">
						{(this.collectingData && this.collectingData.billing_compare) === true && 
							this.collectingData.billing_compare.map((billing_compare, idx) => {
								return(
									<Panel key={idx} collapsible header={billing_compare.shipment_service_service_name} eventKey={idx} bsStyle="info" defaultExpanded="true">
										<CommonTable
											data={billing_compare.record}
											header={[{
												field: 'shipping_date',title: '日付', width: '50px'
											}, {
												field: 'internal_work_quantity', title: '発送作業個数', width: '300px'
											}, {
												field: 'billing_quantity', title: '請求個数', width: '300px'
											}, {
												field: 'billing_amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
											}]}
										/>	

									</Panel>
								)	
							})
						}
								
					</Tab>

				</Tabs>	
							
				<BillfromAddModal isShow={this.state.showBillfromAddModal} close={() => this.setState({ showBillfromAddModal: false })} add={(data) => this.setBillfromData(data, 'add')} />
				<BillfromEditModal isShow={this.state.showBillfromEditModal} close={() => this.setState({ showBillfromEditModal: false })} edit={(data) => this.setBillfromData(data, 'edit')} data={this.billfrom} />
			</Form>
		)
	}
}
