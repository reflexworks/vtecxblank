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
	ListGroupItem
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
	CommonDisplayCalendar
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

		this.convert_approval_status = { '0': '未承認', '1': '承認中', '2': '承認済み'}

	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
		if (this.entry.id) {
			this.getShipmentService()
		}
	}

	/**
	 * 庫内作業詳細取得処理
	 */
	getQuotation() {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/quotation/'+ this.entry.quotation.quotation_code + '-' + this.entry.quotation.quotation_code_sub,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {

			const entry = response.data.feed.entry[0]
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
			url: '/s/get-internalwork?code='+ this.entry.id.split(',')[0] + '&day=' + this.worksDay,
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
						monthly_name: internal_work.monthly_name,
						monthly_content: internal_work.monthly_content ? internal_work.monthly_content : '',
						unit: internal_work.item_details_unit,
						approval_status: internal_work.approval_status,
						data: entry
					}
					const index = this.monthlyWorksCash[obj.monthly_name]
					if (index || index === 0) {
						this[key][index] = obj
					} else {
						this[key].push(obj)
					}
				} else {
					if (internal_work.work_type === '0') {
						key = 'quotationWorks'
						obj = {
							item_name: internal_work.item_details_name,
							quantity: internal_work.quantity ? internal_work.quantity : '',
							unit: internal_work.item_details_unit,
							approval_status: internal_work.approval_status,
							data: entry
						}
					}
					if (internal_work.work_type === '1') {
						key = 'deliveryWorks'
						obj = {
							name: this.setShipmentServicetName(
								internal_work.shipment_service_name,
								internal_work.shipment_service_type,
								internal_work.shipment_service_service_name,
								internal_work.shipment_service_size,
								internal_work.shipment_service_weight),
							quantity: internal_work.quantity ? internal_work.quantity : '',
							approval_status: internal_work.approval_status,
							data: entry
						}
					}
					if (internal_work.work_type === '2') {
						key = 'pickupWorks'
						obj = {
							name: this.setShipmentServicetName(
								internal_work.shipment_service_name,
								internal_work.shipment_service_type,
								internal_work.shipment_service_service_name,
								internal_work.shipment_service_size,
								internal_work.shipment_service_weight),
							quantity: internal_work.quantity ? internal_work.quantity : '',
							approval_status: internal_work.approval_status,
							data: entry
						}
					}
					if (internal_work.work_type === '3') {
						key = 'packingWorks'
						obj = {
							item_code: internal_work.packing_item_code,
							item_name: internal_work.packing_item_name,
							quantity: internal_work.quantity ? internal_work.quantity : '',
							approval_status: internal_work.approval_status,
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
			array.push((_type === '1') ? '発払い' : 'メール便')
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
		let array = []
		for (let i = 1, ii = 32; i < ii; ++i) {
			array.push({ label: (i < 10 ? '0' + i : i), value: i })
		}
		return array
	}

	setMasterList(_item_details, _packing_item) {
		const setOptions = (_label, _value, _data) => {
			return { label: _label, value: _value, data: _data }
		}
		const setQuotationWorks = ()=>{
			let array = []
			this.monthlyWorks = []
			let monthlyWorksIndex = 0
			if (_item_details) {
				_item_details.map((_value) => {
					if (_value.unit_name === '月') {
						this.monthlyWorksCash[_value.item_name] = monthlyWorksIndex
						this.monthlyWorks.push({
							monthly_name: _value.item_name,
							monthly_content: '',
							unit: _value.unit,
							approval_status: '',
							data: {
								internal_work: {
									work_type: '4',
									monthly_name: _value.item_name,
									item_details_unit: _value.unit
								}
							}
						})
						monthlyWorksIndex++
					} else {
						let obj = {}
						obj.item_name = _value.item_name
						obj.unit = _value.unit
						obj.internal_work = {
							work_type: '0',
							item_details_name: _value.item_name,
							item_details_unit: _value.unit
						}
						array.push(setOptions(obj.item_name, obj.item_name, obj))
					}	
				})
			}
			return array
		}
		const setDeliveryWorks = (_type) => {

			let array = []
			this.deliveryList.map((_value) => {
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
		}
		this.forceUpdate()
	}

	monthlyDeliveryTables = () => {
		let array = []
		for (let i = 0, ii = this.deliveryList.length; i < ii; ++i) {
			array.push(
				<div>
					<CommonFormGroup controlLabel={this.deliveryList[i].name} size="lg">
						<CommonDisplayCalendar year={this.year} month={this.month} />
					</CommonFormGroup>
					<hr />
				</div>
			)
		}
		return array
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
			if (type === '0') key += _internal_work.item_details_name
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
				item_details_unit: iw.item_details_unit
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
		if (_key === 'monthlyWorks') {
			this[_key][_index].monthly_content = _data
		} else {
			this[_key][_index].quantity = _data
		}
		this.forceUpdate()
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
				this[_key][_index].data.internal_work.quantity = _data
				this[_key][_index].data.internal_work.approval_status = _entry.internal_work.approval_status
				this[_key][_index].approval_status = _entry.internal_work.approval_status
				this.forceUpdate()

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}
		const entry = this[_key][_index].data
		if (!_data && entry.internal_work.quantity) {
			// 個数が元々入力されていて、かつ変更値が空の場合
			// 空白を元の値に戻す
			this[_key][_index].quantity = entry.internal_work.quantity
			this.forceUpdate()
		} else if (!_data || _data && entry.internal_work.quantity === _data) {
			// 入力値に変更なし
		} else if (_data && !entry.internal_work.quantity){
			// 新規入力
			let obj = {
				internal_work: entry.internal_work
			}
			obj.internal_work.approval_status = '0'
			if (_key === 'monthlyWorks') {
				obj.internal_work.monthly_content = _data
			} else {
				obj.internal_work.quantity = _data
				obj.internal_work.working_day = this.worksDay + ''
			}
			updateInternalWork(obj, true)
		} else {
			// 入力値更新
			entry.internal_work.approval_status = '1'
			if (_key === 'monthlyWorks') {
				entry.internal_work.monthly_content = _data
			} else {
				entry.internal_work.quantity = _data
			}
			updateInternalWork(entry)
		}
	}
	
	/**
	 * 日次作業項目の削除
	 * @param {*} _key 
	 * @param {*} _index 
	 */
	removeList(_key, _index) {
		let array = []
		const oldEntry = this[_key]
		for (let i = 0, ii = oldEntry.length; i < ii; ++i) {
			if (i !== _index) array.push(oldEntry[i])
		}
		this[_key] = array
		this.forceUpdate()
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

	changeDays(_data) {
		this.worksDay = _data
		this.getInternalWork()
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

					<Tab eventKey={1} title="見積書 / 月次入力">

						<PanelGroup defaultActiveKey="1">
							<Panel collapsible header="作業対象見積書" eventKey="2" bsStyle="info" defaultExpanded={true}>

								<CommonInputText
									controlLabel="作業対象見積書"
									name="quotation.quotation_code"
									type="text"
									value={this.entry.quotation.quotation_code + ' - ' + this.entry.quotation.quotation_code_sub}
									readonly
								/>

							</Panel>

							<Panel collapsible header="月次作業情報" eventKey="2" bsStyle="info" defaultExpanded={true}>
								<CommonTable
									controlLabel=""
									name="monthlyWorks"
									data={this.monthlyWorks}
									header={[{
										field: 'monthly_name',title: '作業内容', width: '300px'
									}, {
										field: 'monthly_content', title: '入力値', width: '50px',
										input: {
											onChange: (data, rowindex) => { this.editList('monthlyWorks', data, rowindex) },
											onBlur: (data, rowindex) => { this.blurList('monthlyWorks', data, rowindex) }
										}
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'approval_status', title: '承認ステータス', width: '300px', convert: this.convert_approval_status
									}]}
								/>
							</Panel>
						</PanelGroup>
					</Tab>

					<Tab eventKey={2} title="日次作業入力">

						<ListGroup>
							<ListGroupItem>
								<div style={{ float: 'left', 'padding-top': '5px', 'padding-right': '10px'}}>作業日：{this.working_date}/</div>
								<CommonSelectBox
									pure
									bsSize="sm"
									options={this.days()}
									value={this.worksDay}
									style={{ float: 'left', width: '50px' }}
									onChange={(data) => this.changeDays(data)}
								/>
								<div style={{ clear: 'both' }}></div>
							</ListGroupItem>
						</ListGroup>

						<CommonTable
							controlLabel="見積作業"
    						name="quotationWorks"
    						data={this.quotationWorks}
    						header={[{
    							field: 'item_name',title: '作業内容', width: '300px'
    						}, {
    							field: 'quantity', title: '個数', width: '50px',
								input: {
									onChange: (data, rowindex) => { this.editList('quotationWorks', data, rowindex) },
									onBlur: (data, rowindex) => { this.blurList('quotationWorks', data, rowindex) }
								}
    						}, {
    							field: 'unit',title: '単位', width: '50px'
    						}, {
    							field: 'approval_status', title: '承認ステータス', width: '300px', convert: this.convert_approval_status
							}]}
							remove={(data, i)=>this.removeList('quotationWorks', i)}
    					>
							<CommonFilterBox
								placeholder="見積作業選択"
								name=""
								value={this.selectQuotationWorks}
								options={this.quotationWorksList}
								onChange={(data) => this.addList('quotationWorks', data)}
								style={{float: 'left', width: '400px'}}
								table
							/>
						</CommonTable>

						<hr />

						<CommonTable
							controlLabel="発送作業"
    						name="deliveryWorks"
    						data={this.deliveryWorks}
    						header={[{
    							field: 'name',title: '配送業者', width: '300px'
    						}, {
    							field: 'quantity', title: '個数', width: '50px',
								input: {
									onChange: (data, rowindex)=>{this.editList('deliveryWorks', data, rowindex)},
									onBlur: (data, rowindex) => { this.blurList('deliveryWorks', data, rowindex) }
								}
    						}, {
    							field: 'approval_status', title: '承認ステータス', width: '350px', convert: this.convert_approval_status
    						}]}
							remove={(data, i)=>this.removeList('deliveryWorks', i)}
    					>
							<CommonFilterBox
								placeholder="配送業者選択"
								name=""
								value={this.selectDeliveryWorks}
								options={this.deliveryWorksList}
								onChange={(data) => this.addList('deliveryWorks', data)}
								style={{float: 'left', width: '400px'}}
								table
							/>
						</CommonTable>

						<hr />

						<CommonTable
							controlLabel="集荷作業"
    						name="pickupWorks"
    						data={this.pickupWorks}
    						header={[{
    							field: 'name',title: '配送業者', width: '300px'
    						}, {
    							field: 'quantity', title: '個数', width: '50px',
								input: {
									onChange: (data, rowindex)=>{this.editList('pickupWorks', data, rowindex)},
									onBlur: (data, rowindex) => { this.blurList('pickupWorks', data, rowindex) }
								}
    						}, {
    							field: 'approval_status', title: '承認ステータス', width: '350px', convert: this.convert_approval_status
    						}]}
							remove={(data, i)=>this.removeList('pickupWorks', i)}
    					>
							<CommonFilterBox
								placeholder="配送業者選択"
								name=""
								value={this.selectPickupWorks}
								options={this.pickupWorksList}
								onChange={(data) => this.addList('pickupWorks', data)}
								style={{float: 'left', width: '400px'}}
								table
							/>
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
								input: {
									onChange: (data, rowindex)=>{this.editList('packingWorks', data, rowindex)},
									onBlur: (data, rowindex) => { this.blurList('packingWorks', data, rowindex) }
								}
    						}, {
    							field: 'approval_status', title: '承認ステータス', width: '200px', convert: this.convert_approval_status
    						}]}
							remove={(data, i)=>this.removeList('packingWorks', i)}
    					>
							<CommonFilterBox
								placeholder="品番で選択"
								name=""
								value={this.selectPackingWorks}
								options={this.packingWorksCodeList}
								onChange={(data) => this.addList('packingWorks', data)}
								style={{float: 'left', width: '200px'}}
								table
							/>
							<CommonFilterBox
								placeholder="商品名称で選択"
								name=""
								value={this.selectPackingWorks}
								options={this.packingWorksNameList}
								onChange={(data) => this.addList('packingWorks', data)}
								style={{float: 'left', width: '400px'}}
								table
							/>
						</CommonTable>

						<hr />

					</Tab>
					<Tab eventKey={3} title="見積作業状況">
							
						<CommonFormGroup controlLabel="日次作業1" size="lg">
							<CommonDisplayCalendar year={this.year} month={this.month} />
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="日次作業2" size="lg">
							<CommonDisplayCalendar year={this.year} month={this.month} />
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="日次作業3" size="lg">
							<CommonDisplayCalendar year={this.year} month={this.month} />
						</CommonFormGroup>
						
						<hr />

						<CommonFormGroup controlLabel="日次作業4" size="lg">
							<CommonDisplayCalendar year={this.year} month={this.month} />
						</CommonFormGroup>
					</Tab>

					<Tab eventKey={4} title="発送作業状況">
						{this.monthlyDeliveryTables()}
					</Tab>

					<Tab eventKey={5} title="集荷作業状況">
						{this.monthlyDeliveryTables()}
					</Tab>

					<Tab eventKey={6} title="資材梱包作業状況">
						
						<CommonFormGroup controlLabel="資材1" size="lg">
							<CommonDisplayCalendar year={this.year} month={this.month} />
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="資材2" size="lg">
							<CommonDisplayCalendar year={this.year} month={this.month} />
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="資材3" size="lg">
							<CommonDisplayCalendar year={this.year} month={this.month} />
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="資材4" size="lg">
							<CommonDisplayCalendar year={this.year} month={this.month} />
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="資材5" size="lg">
							<CommonDisplayCalendar year={this.year} month={this.month} />
						</CommonFormGroup>

					</Tab>

				</Tabs>	
				
			</Form>
		)
	}
}