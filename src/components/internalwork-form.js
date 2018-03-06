/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form,
	PanelGroup,
	Panel,
	//	PageHeader,
	Tabs,
	Tab,
	ListGroup,
	ListGroupItem,
	Button,
	Glyphicon,
	Alert
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	//	CommonDatePicker,
	CommonFilterBox,
	//	CommonMonthlySelect,
	CommonFormGroup,	
	CommonTable,
	CommonSelectBox,
	CommonDisplayCalendar,
	CommonLoginUser,
	CommonCheckBox,
	addFigure,
	delFigure
} from './common'

export default class InternalWorkForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.year = null
		this.month = null
		this.date = new Date()
		this.to = {
			year: this.date.getFullYear(),
			month: (this.date.getMonth() + 1) < 10 ? '0' + (this.date.getMonth() + 1) : this.date.getMonth() + 1,
			day: this.date.getDate()
		}
		this.worksDay = 1

		this.entry = this.props.entry || {}
		this.entry.quotation = this.entry.quotation || {}
		this.entry.customer = this.entry.customer || {}
		this.entry.internal_work = this.entry.internal_work || {}

		this.master = {
			shipment_service: []
		}

		this.quotationWorksList = null
		this.quotationWorks = []

		this.packingWorksList = null
		this.packingWorks = []

		this.deliveryList = []
		this.deliveryWorksList = null
		this.deliveryWorks = []
		this.pickupWorksList = null
		this.pickupWorks = []

		// 月次作業
		this.monthlyWorks = []
		// 月次作業（見積明細の一覧データキャッシュ）
		this.monthlyWorksCash = {}

		// 期作業
		this.periodWorks1 = []
		this.periodWorks2 = []
		this.periodWorks3 = []
		// 期作業（見積明細の一覧データキャッシュ）
		this.periodWorksCash1 = {}
		this.periodWorksCash2 = {}
		this.periodWorksCash3 = {}

		this.convert_approval_status = { '0': ' ', '1': '未承認', '2': '承認済' }

		// 未承認の作業日一覧用
		this.isApproval = false
		this.approvalDays = []

		// ログインユーザ情報
		this.loginUser = CommonLoginUser().get()

		// 編集権限の有無
		this.isEdit = this.loginUser.role !== '5'

		// 承認権限者かどうか
		this.isApprovalAuther = this.loginUser.role === '2' || this.loginUser.role === '1'

		// 状況表示用配列
		this.calendar = [[],[],[],[]]
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
		this.isCompleted = this.entry.internal_work.is_completed === '1' ? true : false
		if (this.entry.id) {
			this.getShipmentService()
			this.getApprovalInternalWork()
		}
	}

	/**
	 * 未承認の作業一覧取得処理
	 */
	getApprovalInternalWork() {

		this.setState({ isDisabled: true })

		axios({
			url: '/s/get-approval-internalwork?code='+ this.entry.id.split(',')[0],
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {

			this.setState({ isDisabled: false })

			if (response.status !== 204) {
				const array = response.data.feed.entry[0].title.split(',')
				this.approvalDays = []
				let days = []
				for (let day of array) {
					days.push(day+'日')
				}
				this.approvalDays = <p>{days.join(',')}に未承認の作業があります。</p>
				this.isApproval = true
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})

	}

	/**
	 * 庫内作業詳細取得処理
	 */
	getQuotation() {

		this.setState({ isDisabled: true })

		axios({
			url: '/s/get-latest-quotation?quotation_code='+ this.entry.quotation.quotation_code,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {

			const entry = response.data.feed.entry[0]
			this.quotation_code = entry.quotation.quotation_code + '-' + entry.quotation.quotation_code_sub
			this.setMasterList(entry.item_details, entry.packing_items)

			this.getInternalWork()
			this.setState({ isDisabled: false })

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})

	}

	/**
	 * 庫内作業詳細取得処理
	 */
	getInternalWork() {

		this.setState({ isDisabled: true })

		axios({
			url: '/s/get-internalwork?code='+ this.entry.id.split(',')[0] + '&day=' + this.worksDay + '&quotation_code=' + this.quotation_code,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {

			this.setState({ isDisabled: false })

			this.quotationWorks = []
			this.deliveryWorks = []
			this.pickupWorks = []
			this.packingWorks = []
			for (let entry of response.data.feed.entry) {
				const internal_work = entry.internal_work
				let key
				let obj
				if (internal_work.work_type === '4') {
					key = 'monthlyWorks'
					obj = {
						item_name: internal_work.item_details_name,
						unit_name: internal_work.item_details_unit_name,
						quantity: internal_work.quantity ? internal_work.quantity : '',
						unit: internal_work.item_details_unit,
						unit_price: internal_work.unit_price,
						remarks: internal_work.remarks,
						staff_name: internal_work.staff_name,
						approval_status: internal_work.approval_status,
						data: entry
					}
					const index = this.monthlyWorksCash[this.getCashKey(internal_work.work_type, obj)]
					if (index || index === 0) {
						this[key][index] = obj
					} else {
						this[key].push(obj)
					}
				} else if (internal_work.work_type === '5') {
					key = 'periodWorks' + internal_work.period
					obj = {
						item_name: internal_work.item_details_name,
						unit_name: internal_work.item_details_unit_name,
						quantity: internal_work.quantity ? internal_work.quantity : '',
						unit: internal_work.item_details_unit,
						unit_price: internal_work.unit_price,
						remarks: internal_work.remarks,
						staff_name: internal_work.staff_name,
						approval_status: internal_work.approval_status,
						data: entry
					}
					const index = this['periodWorksCash' + internal_work.period][this.getCashKey(internal_work.work_type, obj, internal_work.period)]
					if (index || index === 0) {
						this[key][index] = obj
					} else {
						this[key].push(obj)
					}
				} else {
					const setApprovalStatusBtn = (_key) => {
						let approval_status_btn = ''
						if (internal_work.approval_status === '1' && this.isApprovalAuther) {
							approval_status_btn = this.setApprovalStatusBtn(_key, this[key].length, entry)
						}
						return approval_status_btn
					}
					if (internal_work.work_type === '0') {
						key = 'quotationWorks'
						const approval_status_btn = setApprovalStatusBtn(key)
						obj = {
							item_name: internal_work.item_details_name,
							unit_name: internal_work.item_details_unit_name,
							quantity: internal_work.quantity ? internal_work.quantity : '',
							unit: internal_work.item_details_unit,
							unit_price: internal_work.unit_price,
							remarks: internal_work.remarks,
							staff_name: internal_work.staff_name,
							approval_status: internal_work.approval_status,
							approval_status_btn: approval_status_btn,
							data: entry
						}
					}
					if (internal_work.work_type === '1') {
						key = 'deliveryWorks'
						const approval_status_btn = setApprovalStatusBtn(key)
						obj = {
							name: this.setShipmentServicetName(
								internal_work.shipment_service_name,
								internal_work.shipment_service_type,
								internal_work.shipment_service_service_name,
								internal_work.shipment_service_size,
								internal_work.shipment_service_weight),
							quantity: internal_work.quantity ? internal_work.quantity : '',
							staff_name: internal_work.staff_name,
							approval_status: internal_work.approval_status,
							approval_status_btn: approval_status_btn,
							data: entry
						}
					}
					if (internal_work.work_type === '2') {
						key = 'pickupWorks'
						const approval_status_btn = setApprovalStatusBtn(key)
						obj = {
							name: this.setShipmentServicetName(
								internal_work.shipment_service_name,
								internal_work.shipment_service_type,
								internal_work.shipment_service_service_name,
								internal_work.shipment_service_size,
								internal_work.shipment_service_weight),
							quantity: internal_work.quantity ? internal_work.quantity : '',
							staff_name: internal_work.staff_name,
							approval_status: internal_work.approval_status,
							approval_status_btn: approval_status_btn,
							data: entry
						}
					}
					if (internal_work.work_type === '3') {
						key = 'packingWorks'
						const approval_status_btn = setApprovalStatusBtn(key)
						obj = {
							item_code: internal_work.packing_item_code,
							item_name: internal_work.packing_item_name,
							quantity: internal_work.quantity ? internal_work.quantity : '',
							staff_name: internal_work.staff_name,
							approval_status: internal_work.approval_status,
							approval_status_btn: approval_status_btn,
							data: entry
						}
					}
					this[key].push(obj)
				}
			}
			this.forceUpdate()

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})

	}

	/**
	 * 配送業者取得処理
	 */
	getShipmentService() {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/shipment_service?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {

			this.setState({ isDisabled: false })

			if (response.status === 204) {
				alert('配送業者が1件も登録されていません。')
			} else {

				this.master.shipment_service = this.setShipmentService(response.data.feed.entry)
				this.getQuotation()

			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})

	}

	setShipmentServicetName = (_name, _type, _service_name, _size, _weight) => {
		let array = []
		if (_name) array.push(_name)
		if (_service_name) {
			array.push(_service_name)
		} else {
			array.push((_type === '1') ? '宅配便' : 'メール便')
		}
		if (_size) array.push(_size)
		if (_weight) array.push(_weight)
		return array.join(' / ')
	}
	setShipmentService(entrys) {
		let shipment_service = []
		for (let entry of entrys) {
			const code = entry.shipment_service.code
			const name = entry.shipment_service.name
			const type = entry.shipment_service.type
			const service_name = entry.shipment_service.service_name
			const sizes = entry.shipment_service.sizes
			if (sizes && name !== 'ヤマト運輸') {
				for (let size of sizes) {
					shipment_service.push({
						name: this.setShipmentServicetName(name, type, service_name, size.size, size.weight),
						internal_work: {
							shipment_service_code: code,
							shipment_service_name: name,
							shipment_service_type: type,
							shipment_service_service_name: service_name,
							shipment_service_size: size.size,
							shipment_service_weight: size.weight
						}
					})
				}
			} else {
				shipment_service.push({
					name: this.setShipmentServicetName(name, type, service_name),
					internal_work: {
						shipment_service_code: code,
						shipment_service_name: name,
						shipment_service_type: type,
						shipment_service_service_name: service_name
					}
				})
			}
		}
		return shipment_service
	}

	days = () => {
		const getMonthDays = () => {  
			return new Date(this.year, this.month, 0).getDate() + 1
		}
		let array = []
		for (let i = 1, ii = getMonthDays(); i < ii; ++i) {
			array.push({ label: (i < 10 ? '0' + i : i), value: i })
		}
		return array
	}

	getCashKey = (_type, _value, _period) => {
		let key = _type
		key += _value.item_name
		key += _value.unit_name
		key += _value.unit
		if (_period) {
			key += _period
		}
		return key
	}

	setMasterList(_item_details, _packing_item) {
		const setOptions = (_label, _value, _data) => {
			return { label: _label, value: _value, data: _data }
		}
		const setQuotationWorks = ()=>{
			let array = []
			this.monthlyWorks = []
			let monthlyWorksIndex = 0
			let periodWorksIndex = 0
			this.quotationCash = []
			if (_item_details) {
				_item_details.map((_value) => {
					if (_value.unit_name && _value.unit_name.indexOf('月') !== -1) {
						const cashkey = this.getCashKey('4', _value)
						this.monthlyWorksCash[cashkey] = monthlyWorksIndex
						this.monthlyWorks.push({
							item_name: _value.item_name,
							unit_name: _value.unit_name,
							quantity: '',
							unit: _value.unit,
							unit_price: _value.unit_price,
							remarks: _value.remarks,
							data: {
								internal_work: {
									work_type: '4',
									item_details_name: _value.item_name,
									item_details_unit_name: _value.unit_name,
									item_details_unit: _value.unit,
									unit_price: _value.unit_price,
									remarks: _value.remarks,
								}
							}
						})
						monthlyWorksIndex++
						this.quotationCash[cashkey] = _value
					} else if (_value.unit_name && _value.unit_name.indexOf('期') !== -1) {
						for (let i = 1, ii = 4; i < ii; ++i) {
							const cashkey = this.getCashKey('5', _value, i)
							if (periodWorksIndex === 0) {
								this['periodWorks' + i] = []
								this['periodWorksCash' + i] = {}
							}
							this['periodWorksCash' + i][cashkey] = periodWorksIndex
							this['periodWorks' + i].push({
								item_name: _value.item_name,
								unit_name: _value.unit_name,
								quantity: '',
								unit: _value.unit,
								unit_price: _value.unit_price,
								remarks: _value.remarks,
								data: {
									internal_work: {
										work_type: '5',
										item_details_name: _value.item_name,
										item_details_unit_name: _value.unit_name,
										item_details_unit: _value.unit,
										unit_price: _value.unit_price,
										remarks: _value.remarks,
										period: i + ''
									}
								}
							})
							this.quotationCash[cashkey] = _value
						}
						periodWorksIndex++
					} else {
						let obj = {}
						obj.item_name = _value.item_name
						obj.unit_name = _value.unit_name
						obj.unit = _value.unit
						obj.unit_price = _value.unit_price,
						obj.remarks = _value.remarks,
						obj.internal_work = {
							work_type: '0',
							item_details_name: _value.item_name,
							item_details_unit_name: _value.unit_name,
							item_details_unit: _value.unit,
							unit_price: _value.unit_price,
							remarks: _value.remarks,
						}
						const key_name = obj.item_name + ' / ' + obj.unit_name + ' / ' + obj.unit
						array.push(setOptions(key_name, key_name, obj))
						this.quotationCash[this.getCashKey('0', _value)] = _value
					}
				})
			}
			return array
		}
		const setDeliveryWorks = (_type) => {

			let array = []
			const list = JSON.parse(JSON.stringify(this.deliveryList))
			list.map((_value) => {
				let obj = {}
				obj.name = _value.name
				obj.internal_work = _value.internal_work
				obj.internal_work.work_type = _type
				array.push(setOptions(obj.name, obj.name, obj))
			})
			return array
		}
		const setPackingWorks = (_key)=>{
			let array = []
			if (_packing_item) {
				_packing_item.map((_value) => {
					let obj = {}
					obj.item_code = _value.item_code
					obj.item_name = _value.item_name
					obj.internal_work = {
						work_type: '3',
						packing_item_code: _value.item_code,
						packing_item_name: _value.item_name
					}
					array.push(setOptions(obj[_key], obj[_key], obj))
				})
			}
			return array
		}
		this.quotationWorksList = setQuotationWorks()
		this.deliveryList = this.master.shipment_service
		this.deliveryWorksList = setDeliveryWorks('1')
		this.pickupWorksList = setDeliveryWorks('2')
		this.packingWorksCodeList = setPackingWorks('item_code')
		this.packingWorksNameList = setPackingWorks('item_name')
		this.working_date = this.entry.internal_work.working_yearmonth
		if (this.working_date) {
			this.year = this.working_date.split('/')[0]
			this.month = this.working_date.split('/')[1]
			this.worksDay = this.working_date === this.to.year + '/' + this.to.month ? this.to.day : 1
			this.isToDay = this.setIsToDay()
		}
		this.forceUpdate()
	}

	selectTab(_activeKey) {
		// _activeKey = 4 // 月次入力/期次入力
		// _activeKey = 6 // 日次作業入力
		// _activeKey = 0 // 見積作業状況
		// _activeKey = 1 // 発送作業状況
		// _activeKey = 2 // 集荷作業状況
		// _activeKey = 3 // 資材梱包作業状況
		if (_activeKey < 4) {
			// 作業状況取得
			this.getWorksCalendar(_activeKey)
		}
	}

	getWorksCalendar(_activeKey) {

		this.setState({ isDisabled: true })

		axios({
			url: '/s/get-internalwork-calendar?internal_work=' + this.entry.link[0].___href + '&work_type=' + _activeKey,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {

			this.setState({ isDisabled: false })
			if (response.status !== 204) {
				const getCalendar = (_entrys) => {
					let array = []
					for (let i = 0, ii = _entrys.length; i < ii; ++i) {
						const entry = _entrys[i]
						const data = JSON.parse(entry.summary)
						array.push(
							<div>
								<CommonFormGroup controlLabel={entry.title} size="lg">
									<CommonDisplayCalendar year={this.year} month={this.month} data={data} />
								</CommonFormGroup>
								<hr />
							</div>
						)
					}
					return array
				}
				this.calendar[_activeKey] = getCalendar(response.data.feed.entry)
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	/**
	 * 日次作業項目の追加
	 * @param {*} _key 
	 * @param {*} _data 
	 */
	addList(_key, _data) {

		// 同じ項目は追加しない
		const checkList = this[_key]
		let duplicate = false
		const getKey = (_internal_work) => {
			const type = _internal_work.work_type
			let key = _internal_work.work_type
			if (type === '0' || type === '4' || type === '5') {
				key += _internal_work.item_details_name
				key += _internal_work.item_details_unit_name
				key += _internal_work.item_details_unit
			}
			if (type === '1' || type === '2') {
				key += _internal_work.shipment_service_code
				key += _internal_work.shipment_service_name
				key += _internal_work.shipment_service_name_service_name || ''
				key += _internal_work.shipment_service_size || ''
				key += _internal_work.shipment_service_weight || ''
			}
			if (type === '3') key += _internal_work.packing_item_code
			return key
		}
		for (let i = 0, ii = checkList.length; i < ii; ++i) {
			const checkKey = getKey(checkList[i].data.internal_work)
			const thisKey = getKey(_data.data.internal_work)
			if (checkKey === thisKey) {
				duplicate = true
				break
			}
		}

		if (!duplicate) {
			this.postInternalWork(_key, _data)
		}
	}

	postInternalWork(_key, _data) {

		this.setState({ isDisabled: true })

		let obj = {
			feed: {
				entry: [{
					internal_work: {

					}
				}]
			}
		}
		// 見積作業の場合
		const iw = _data.data.internal_work
		if (_key === 'quotationWorks') {
			obj.feed.entry[0].internal_work = {
				work_type: '0',
				item_details_name: iw.item_details_name,
				item_details_unit_name: iw.item_details_unit_name,
				item_details_unit: iw.item_details_unit,
				unit_price: iw.unit_price,
				remarks: iw.remarks
			}
		}
		// 発送作業の場合
		if (_key === 'deliveryWorks') {
			obj.feed.entry[0].internal_work = {
				work_type: '1',
				shipment_service_code: iw.shipment_service_code,
				shipment_service_name: iw.shipment_service_name,
				shipment_service_type: iw.shipment_service_type,
				shipment_service_service_name: iw.shipment_service_service_name,
				shipment_service_size: iw.shipment_service_size,
				shipment_service_weight: iw.shipment_service_weight
			}
		}
		// 集荷作業の場合
		if (_key === 'pickupWorks') {
			const iw = _data.data.internal_work
			obj.feed.entry[0].internal_work = {
				work_type: '2',
				shipment_service_code: iw.shipment_service_code,
				shipment_service_name: iw.shipment_service_name,
				shipment_service_type: iw.shipment_service_type,
				shipment_service_service_name: iw.shipment_service_service_name,
				shipment_service_size: iw.shipment_service_size,
				shipment_service_weight: iw.shipment_service_weight
			}
		}
		// 資材作業の場合
		if (_key === 'packingWorks') {
			obj.feed.entry[0].internal_work = {
				work_type: '3',
				packing_item_code: iw.packing_item_code,
				packing_item_name: iw.packing_item_name
			}
		}
		axios({
			url: '/d' + this.entry.link[0].___href + '/list',
			method: 'post',
			data: obj,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then(() => {

			this.setState({ isDisabled: false })

			_data.data.quantity = ''
			_data.data.approval_status = ''
			_data.data.approval_status_btn = ''
			_data.data.data = obj.feed.entry[0]
			this[_key].push(_data.data)
			this.forceUpdate()

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	/**
	 * 日次作業項目の編集
	 * @param {*} _key 
	 * @param {*} _data 
	 * @param {*} _index 
	 */
	editList(_key, _data, _index) {
		this[_key][_index].quantity = _data
		this.forceUpdate()
	}

	forcusList(_key, _data, _index) {
		if (_key === 'monthlyWorks' || _key.indexOf('periodWorks') !== -1) {
			const entry = this[_key][_index].data
			if (entry.internal_work.item_details_unit === '円') {
				_data = delFigure(_data)
				this[_key][_index].quantity = _data
				this.forceUpdate()
			}
		}
	}

	blurList(_key, _data, _index) {
		const updateInternalWork = (_entry, _isCreate) => {
			const obj = {feed: {entry: [_entry]}}
			axios({
				url: '/d' + this.entry.id.split(',')[0] + '/data',
				method: _isCreate ? 'post' : 'put',
				data: obj,
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				this.setState({ isDisabled: false })

				if (_isCreate) {
					const key = response.data.feed.title
					this[_key][_index].data.id = response.data.feed.title + ',1'
					this[_key][_index].data.link = [{
						___href: key,
						___rel: 'self'
					}]
				} else {
					const ids = this[_key][_index].data.id.split(',')
					const id = ids[0]
					const revision = parseInt(ids[1]) + 1
					this[_key][_index].data.id = id + ',' + revision
				}
				this[_key][_index].data.internal_work = _entry.internal_work

				if (_entry.internal_work.unit_price) {
					this[_key][_index].unit_price = _entry.internal_work.unit_price
				}
				if (_entry.internal_work.remarks) {
					this[_key][_index].remarks = _entry.internal_work.remarks
				}
				this[_key][_index].quantity = _entry.internal_work.quantity
				this[_key][_index].approval_status = _entry.internal_work.approval_status
				this[_key][_index].staff_name = _entry.internal_work.staff_name

				if (_entry.internal_work.approval_status === '1' && this.isApprovalAuther) {
					this[_key][_index].approval_status_btn = this.setApprovalStatusBtn(_key, _index, _entry)
				}

				this.forceUpdate()

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}
		const getKey = (_internal_work) => {
			let key = _internal_work.work_type
			key += _internal_work.item_details_name
			key += _internal_work.item_details_unit_name
			key += _internal_work.item_details_unit
			if (_internal_work.period) {
				key += _internal_work.period
			}
			return key
		}
		const entry = this[_key][_index].data
		if (_key === 'monthlyWorks' || _key.indexOf('periodWorks') !== -1) {
			if (entry.internal_work.item_details_unit === '円') {
				_data = addFigure(_data)
			}
		}
		if (!_data && entry.internal_work.quantity) {
			// 個数が元々入力されていて、かつ変更値が空の場合
			// 空白を元の値に戻す
			this[_key][_index].quantity = entry.internal_work.quantity
			this.forceUpdate()
		} else if (!_data || _data && entry.internal_work.quantity === _data) {
			// 入力値に変更なし
			this[_key][_index].quantity = _data
			this.forceUpdate()
		} else if (_data && !entry.internal_work.quantity){
			// 新規入力
			let obj = {
				internal_work: entry.internal_work
			}
			if (obj.internal_work.work_type === '0'
				|| obj.internal_work.work_type === '4'
				|| obj.internal_work.work_type === '5') {
				const cashData = this.quotationCash[getKey(obj.internal_work)]
				if (!obj.internal_work.unit_price && cashData.unit_price) {
					obj.internal_work.unit_price = cashData.unit_price
				}
				if (!obj.internal_work.remarks && cashData.remarks) {
					obj.internal_work.remarks = cashData.remarks
				}
			}
			if (obj.internal_work.work_type !== '4' && obj.internal_work.work_type !== '5') {
				if (this.isToDay) {
					obj.internal_work.approval_status = '0'
				} else {
					obj.internal_work.approval_status = '1'
				}
				obj.internal_work.working_day = this.worksDay + ''
			}
			obj.internal_work.quantity = _data
			obj.internal_work.staff_name = this.loginUser.staff_name
			updateInternalWork(obj, true)
		} else {
			// 入力値更新
			if (entry.internal_work.work_type === '0'
				|| entry.internal_work.work_type === '4'
				|| entry.internal_work.work_type === '5') {
				const cashData = this.quotationCash[getKey(entry.internal_work)]

				if (!entry.internal_work.unit_price && cashData.unit_price) {
					entry.internal_work.unit_price = cashData.unit_price
				}
				if (!entry.internal_work.remarks && cashData.remarks) {
					entry.internal_work.remarks = cashData.remarks
				}
			}
			if (entry.internal_work.work_type !== '4' && entry.internal_work.work_type !== '5') {
				if (!this.isToDay) {
					entry.internal_work.approval_status = '1'
				}
			}
			entry.internal_work.quantity = _data
			entry.internal_work.staff_name = this.loginUser.staff_name
			updateInternalWork(entry)
		}
	}
	
	/**
	 * 承認するボタン
	 */
	setApprovalStatusBtn(_key, _index, _entry) {
		const doApproval = (__entry) => {
			__entry.internal_work.approval_status = '2'
			const obj = { 'feed': { 'entry': [__entry] } }
			axios({
				url: '/d/',
				method: 'put',
				data: obj,
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {

				this.setState({ isDisabled: false })

				const ids = this[_key][_index].data.id.split(',')
				const id = ids[0]
				const revision = parseInt(ids[1]) + 1
				this[_key][_index].data.id = id + ',' + revision
				this[_key][_index].data.internal_work.approval_status = __entry.internal_work.approval_status
				this[_key][_index].approval_status = __entry.internal_work.approval_status
				this[_key][_index].approval_status_btn = ''
				this.forceUpdate()

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}
		return (
			<Button
				bsSize="small" bsStyle="success"
				onClick={() => doApproval(_entry)}>
				<Glyphicon glyph="ok" /> 承認する
			</Button>
		)
	}

	/**
	 * 日次作業項目の削除
	 * @param {*} _key 
	 * @param {*} _index 
	 */
	removeList(_key, _index) {
		const doDelete = () => {
			const targetEntry = this[_key][_index].data
			axios({
				url: '/s/delete-internalwork?internal_work=' + this.entry.link[0].___href,
				method: 'post',
				data: {feed:{entry: [targetEntry]}},
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				this.setState({ isDisabled: false })
				if (response.data.feed.title) {
					alert(response.data.feed.title)
				} else {
					let array = []
					for (let i = 0, ii = this[_key].length; i < ii; ++i) {
						if (i !== _index) array.push(this[_key][i])
					}
					this[_key] = array
					this.forceUpdate()
				}

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}
		if (confirm('この作業を削除するためには以下の条件が必要です。\n\n　・全日の個数が0個または未入力である\n　・承認済みのデータである\n\n削除を実行してよろしいでしょうか？')) {
			doDelete()
		}
	}

	/**
	 * remarksにRemarksModalのフォームで入力した物を追加する
	 */
	addRemarks(obj) {
		if (!this.entry.remarks) {
			this.entry.remarks = []
		}
		this.entry.remarks.push(obj)
		this.setState({showRemarksModal:false})
	}
	closeRemarks() {
		this.setState({showRemarksModal:false})
	}

	/**
	 * 入力日が当日かどうかの判定
	 */
	setIsToDay() {
		return this.year + this.month + this.worksDay === this.to.year + this.to.month + this.to.day ? true : false
	}

	changeDays(_data) {
		this.worksDay = _data
		this.isToDay = this.setIsToDay()
		this.getInternalWork()
	}

	/**
	 * 庫内作業完了フラグ
	 * @param {*} _value 
	 */
	onCompleted(_value) {

		this.entry.internal_work.is_completed = _value ? '1' : '0'
		this.isCompleted = this.entry.internal_work.is_completed === '1' ? true : false

		axios({
			url: '/d/',
			method: 'put',
			data: {feed:{entry: [this.entry]}},
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then(() => {

			const revision = parseInt(this.entry.id.split(',')[1]) + 1
			this.entry.id = this.entry.id.split(',')[0] + ',' + revision

			this.setState({ isDisabled: false })

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<CommonInputText
					controlLabel="作業対象見積書"
					name=""
					type="text"
					value={this.quotation_code}
					readonly
				/>

				{ this.isEdit &&
					<CommonCheckBox
						controlLabel="庫内作業入力完了"
						label="完了"
						value={this.isCompleted}
						onChange={(value) => this.onCompleted(value)}
					/>
				}

				{ !this.isEdit &&
					<CommonInputText
						controlLabel="庫内作業入力完了"
						name=""
						type="text"
						value={this.isCompleted ? '完了' : '未完了'}
						readonly
					/>
				}

				{this.isApproval &&
					<Alert bsStyle="warning">
						{this.approvalDays}
					</Alert>
				}

				<Tabs defaultActiveKey={4} id="uncontrolled-tab-example" onSelect={(activeKey)=>this.selectTab(activeKey)}>

					<Tab eventKey={4} title="月次入力 / 期次入力">

						<PanelGroup defaultActiveKey="1">
							<Panel collapsible header="月次作業情報" eventKey="2" bsStyle="info" defaultExpanded={true}>
								<CommonTable
									name="monthlyWorks"
									data={this.monthlyWorks}
									header={[{
										field: 'item_name',title: '作業内容', width: '300px'
									}, {
										field: 'unit_name',title: '単位名称', width: '100px'
									}, {
										field: 'quantity', title: '入力値', width: '100px',
										input: !this.isEdit ? false : {
											onChange: (data, rowindex) => { this.editList('monthlyWorks', data, rowindex) },
											onBlur: (data, rowindex) => { this.blurList('monthlyWorks', data, rowindex) },
											onForcus: (data, rowindex) => { this.forcusList('monthlyWorks', data, rowindex) }
										}
									}, {
										field: 'unit',title: '単位', width: '100px'
									}, {
										field: 'unit_price',title: '単価', width: '70px'
									}, {
										field: 'remarks',title: '備考', width: '200px'
									}, {
										field: 'staff_name',title: '入力者', width: '100px'
									}]}
									fixed
								/>
							</Panel>
							<Panel collapsible header="期次作業情報" eventKey="2" bsStyle="info" defaultExpanded={true}>
								<h4>1期（1日〜10日）</h4>
								<CommonTable
									name="periodWorks1"
									data={this.periodWorks1}
									header={[{
										field: 'item_name',title: '作業内容', width: '300px'
									}, {
										field: 'unit_name',title: '単位名称', width: '100px'
									}, {
										field: 'quantity', title: '入力値', width: '100px',
										input: !this.isEdit ? false : {
											onChange: (data, rowindex) => { this.editList('periodWorks1', data, rowindex) },
											onBlur: (data, rowindex) => { this.blurList('periodWorks1', data, rowindex) },
											onForcus: (data, rowindex) => { this.forcusList('periodWorks1', data, rowindex) }
										}
									}, {
										field: 'unit',title: '単位', width: '100px'
									}, {
										field: 'unit_price',title: '単価', width: '70px'
									}, {
										field: 'remarks',title: '備考', width: '200px'
									}, {
										field: 'staff_name',title: '入力者', width: '100px'
									}]}
									fixed
								/>
								<h4>2期（11日〜20日）</h4>
								<CommonTable
									name="periodWorks2"
									data={this.periodWorks2}
									header={[{
										field: 'item_name',title: '作業内容', width: '300px'
									}, {
										field: 'unit_name',title: '単位名称', width: '100px'
									}, {
										field: 'quantity', title: '入力値', width: '100px',
										input: !this.isEdit ? false : {
											onChange: (data, rowindex) => { this.editList('periodWorks2', data, rowindex) },
											onBlur: (data, rowindex) => { this.blurList('periodWorks2', data, rowindex) },
											onForcus: (data, rowindex) => { this.forcusList('periodWorks2', data, rowindex) }
										}
									}, {
										field: 'unit',title: '単位', width: '100px'
									}, {
										field: 'unit_price',title: '単価', width: '70px'
									}, {
										field: 'remarks',title: '備考', width: '200px'
									}, {
										field: 'staff_name',title: '入力者', width: '100px'
									}]}
									fixed
								/>
								<h4>3期（21日〜末日）</h4>
								<CommonTable
									name="periodWorks3"
									data={this.periodWorks3}
									header={[{
										field: 'item_name',title: '作業内容', width: '300px'
									}, {
										field: 'unit_name',title: '単位名称', width: '100px'
									}, {
										field: 'quantity', title: '入力値', width: '100px',
										input: !this.isEdit ? false : {
											onChange: (data, rowindex) => { this.editList('periodWorks3', data, rowindex) },
											onBlur: (data, rowindex) => { this.blurList('periodWorks3', data, rowindex) },
											onForcus: (data, rowindex) => { this.forcusList('periodWorks3', data, rowindex) }
										}
									}, {
										field: 'unit',title: '単位', width: '100px'
									}, {
										field: 'unit_price',title: '単価', width: '70px'
									}, {
										field: 'remarks',title: '備考', width: '200px'
									}, {
										field: 'staff_name',title: '入力者', width: '100px'
									}]}
									fixed
								/>
							</Panel>
						</PanelGroup>
					</Tab>

					<Tab eventKey={6} title="日次作業入力">

						<ListGroup>
							<ListGroupItem>
								<div style={{ float: 'left', 'padding-top': '5px', 'padding-right': '10px'}}>作業日：{this.working_date}/</div>
								<CommonSelectBox
									pure
									bsSize="sm"
									options={this.days()}
									value={this.worksDay}
									style={{ float: 'left', width: '80px' }}
									onChange={(data) => this.changeDays(data)}
								/>
								<div style={{ clear: 'both' }}></div>
							</ListGroupItem>
						</ListGroup>
						<div style={{'padding-left': '20px', 'padding-right': '20px'}}>
							<CommonTable
								controlLabel=""
								name="quotationWorks"
								data={this.quotationWorks}
								header={[{
									field: 'item_name',title: '作業内容', width: '200px'
								}, {
									field: 'unit_name',title: '単位名称', width: '130px'
								}, {
									field: 'quantity', title: '個数', width: '50px',
									input: !this.isEdit ? false : {
										onChange: (data, rowindex) => { this.editList('quotationWorks', data, rowindex) },
										onBlur: (data, rowindex) => { this.blurList('quotationWorks', data, rowindex) }
									}
								}, {
									field: 'unit',title: '単位', width: '50px'
								}, {
									field: 'unit_price',title: '単価', width: '70px'
	    						}, {
	    							field: 'remarks',title: '備考', width: '200px'
								}, {
									field: 'staff_name', title: '入力者', width: '100px'
								}, {
    								field: 'approval_status', title: '承認ステータス', width: '90px', convert: this.convert_approval_status
								}, {
									field: 'approval_status_btn', title: '', width: '100px'
								}]}
								remove={(data, i) => this.removeList('quotationWorks', i)}
								fixed
    						>
								{this.isEdit &&
								<CommonFilterBox
									placeholder="見積作業選択"
									name=""
									value={this.selectQuotationWorks}
									options={this.quotationWorksList}
									onChange={(data) => this.addList('quotationWorks', data)}
									style={{ float: 'left', width: '400px' }}
									table
								/>
								}
							</CommonTable>
						</div>

						<hr />

						<CommonTable
							controlLabel="発送作業"
    						name="deliveryWorks"
    						data={this.deliveryWorks}
    						header={[{
    							field: 'name',title: '配送業者', width: '400px'
    						}, {
    							field: 'quantity', title: '個数', width: '50px',
								input: !this.isEdit ? false : {
									onChange: (data, rowindex)=>{this.editList('deliveryWorks', data, rowindex)},
									onBlur: (data, rowindex) => { this.blurList('deliveryWorks', data, rowindex) }
								}
    						}, {
    							field: 'staff_name', title: '入力者', width: '100px'
    						}, {
    							field: 'approval_status', title: '承認ステータス', width: '100px', convert: this.convert_approval_status
							}, {
								field: 'approval_status_btn', title: '', width: '100px'
    						}]}
							remove={(data, i)=>this.removeList('deliveryWorks', i)}
							fixed
    					>
							{this.isEdit &&
								<CommonFilterBox
									placeholder="配送業者選択"
									name=""
									value={this.selectDeliveryWorks}
									options={this.deliveryWorksList}
									onChange={(data) => this.addList('deliveryWorks', data)}
									style={{ float: 'left', width: '400px' }}
									table
								/>
							}	
						</CommonTable>

						<hr />

						<CommonTable
							controlLabel="集荷作業"
    						name="pickupWorks"
    						data={this.pickupWorks}
    						header={[{
    							field: 'name',title: '配送業者', width: '400px'
    						}, {
    							field: 'quantity', title: '個数', width: '50px',
								input: !this.isEdit ? false : {
									onChange: (data, rowindex)=>{this.editList('pickupWorks', data, rowindex)},
									onBlur: (data, rowindex) => { this.blurList('pickupWorks', data, rowindex) }
								}
    						}, {
    							field: 'staff_name', title: '入力者', width: '100px'
    						}, {
    							field: 'approval_status', title: '承認ステータス', width: '100px', convert: this.convert_approval_status
							}, {
								field: 'approval_status_btn', title: '', width: '100px'
    						}]}
							remove={(data, i)=>this.removeList('pickupWorks', i)}
							fixed
    					>
							{this.isEdit &&
								<CommonFilterBox
									placeholder="配送業者選択"
									name=""
									value={this.selectPickupWorks}
									options={this.pickupWorksList}
									onChange={(data) => this.addList('pickupWorks', data)}
									style={{ float: 'left', width: '400px' }}
									table
								/>
							}	
						</CommonTable>

						<hr />

						<CommonTable
							controlLabel="資材梱包作業"
    						name="packingWorks"
    						data={this.packingWorks}
    						header={[{
								field: 'item_code',title: '品番', width: '100px'
							}, {
								field: 'item_name', title: '商品名称', width: '300px'
    						}, {
    							field: 'quantity', title: '個数', width: '50px',
								input: !this.isEdit ? false : {
									onChange: (data, rowindex)=>{this.editList('packingWorks', data, rowindex)},
									onBlur: (data, rowindex) => { this.blurList('packingWorks', data, rowindex) }
								}
    						}, {
    							field: 'staff_name', title: '入力者', width: '100px'
    						}, {
    							field: 'approval_status', title: '承認ステータス', width: '100px', convert: this.convert_approval_status
							}, {
								field: 'approval_status_btn', title: '', width: '100px'
    						}]}
							remove={(data, i)=>this.removeList('packingWorks', i)}
							fixed
						>
							{this.isEdit && 
								<CommonFilterBox
									placeholder="品番で選択"
									name=""
									value={this.selectPackingWorks}
									options={this.packingWorksCodeList}
									onChange={(data) => this.addList('packingWorks', data)}
									style={{float: 'left', width: '200px'}}
									table
								/>
							}
							{this.isEdit && 
								<CommonFilterBox
									placeholder="商品名称で選択"
									name=""
									value={this.selectPackingWorks}
									options={this.packingWorksNameList}
									onChange={(data) => this.addList('packingWorks', data)}
									style={{float: 'left', width: '400px'}}
									table
								/>
							}
						</CommonTable>

						<hr />

					</Tab>

					<Tab eventKey={0} title="見積作業状況">
						{this.calendar[0]}
					</Tab>

					<Tab eventKey={1} title="発送作業状況">
						{this.calendar[1]}
					</Tab>

					<Tab eventKey={2} title="集荷作業状況">
						{this.calendar[2]}
					</Tab>

					<Tab eventKey={3} title="資材梱包作業状況">
						{this.calendar[3]}
					</Tab>

				</Tabs>	
				
			</Form>
		)
	}
}