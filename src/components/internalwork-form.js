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
			customerList: []
		}
		this.customerList = []

		this.quotationWorksList = null
		this.quotationWorks = []

		this.packingWorksList = null
		this.packingWorks = []

		this.deliveryList = [
			'エコ配JP',
			'ヤマト運輸(発払い)',
			'ヤマト運輸(DM便)',
			'ヤマト運輸(ネコポス)',
			'ヤマト運輸(クール)',
			'佐川急便',
			'西濃運輸',
			'EMS',
			'ゆうメール(250g以内)',
			'ゆうメール(500g以内)',
			'ゆうメール(700g以内)',
			'ゆうメール(1kg以内)',
			'ゆうパケット(2cm)',
			'ゆうパケット(3cm)',
			'定形外(規格内：50g)',
			'定形外(規格内：100g)',
			'定形外(規格内：150g)',
			'定形外(規格内：250g)',
			'定形外(規格内：500g)',
			'定形外(規格内：1000g)',
			'定形外(規格外：50g)',
			'定形外(規格外：100g)',
			'定形外(規格外：150g)',
			'定形外(規格外：250g)',
			'定形外(規格外：500g)',
			'定形外(規格外：1000g)',
			'定形外(規格外：2000g)',
			'定形外(規格外：4000g)',
			'自社配送'
		]
		this.deliveryWorksList = null
		this.deliveryWorks = []
		this.pickupWorks = []

	}


	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setCustomerMasterData()

	}

	days = () => {
		let array = []
		for (let i = 1, ii = 32; i < ii; ++i) {
			array.push({ label: (i < 10 ? '0' + i : i), value: i })
		}
		return array
	}

	sampleData() {
		const setOptions = (_label, _value, _data) => {
			return { label: _label, value: _value, data: _data }
		}
		const setQuotationWorks = ()=>{
			let array = []
			const unit = (_index) => {
				let value = ''
				if (_index === 0) value = '1個'
				if (_index === 1) value = '1箱'
				if (_index === 2) value = '20F'
				if (_index === 3) value = '1梱包'
				if (_index === 4) value = '1点'
				return value
			}
			for (let i = 0, ii = 5; i < ii; ++i) {
				const obj = {
					work_record: {
						item_name: '見積作業' + i,
						unit_name: '',
						unit: unit(i),
						quantity: (i === 3 ? '3' : ''),
						status: (i === 3 ? '上長承認中' : '')
					},
					id: 'work_record' + i
				}
				array.push(setOptions(obj.work_record.item_name, obj.work_record.item_name, obj))
			}
			return array
		}
		const setDeliveryWorks = () => {

			let array = []
			for (let i = 0, ii = this.deliveryList.length; i < ii; ++i) {
				const obj = {
					shipment_service: {
						name: this.deliveryList[i]
					},
					work_record: {
						quantity: (i === 3 ? '3' : ''),
						status: (i === 3 ? '上長承認中' : '')
					},
					id: 'delivery_charge_amount' + i
				}
				array.push(setOptions(obj.shipment_service.name, obj.shipment_service.name, obj))
			}
			return array
		}
		const setPackingWorks = (_key)=>{
			let array = []
			for (let i = 0, ii = 10; i < ii; ++i) {
				const obj = {
					packing_item: {
						item_code: 'SH0000' + i + '-01',
						item_name: '資材名称' + i
					},	
					work_record: {
						item_name: '資材梱包作業' + i,
						quantity: (i === 3 ? '3' : ''),
						status: (i === 3 ? '上長承認中' : '')
					},
					id: 'packing_item' + i
				}
				array.push(setOptions(obj.packing_item[_key], obj.packing_item[_key], obj))
			}
			return array
		}
		this.quotationWorksList = setQuotationWorks()
		this.deliveryWorksList = setDeliveryWorks()
		this.packingWorksCodeList = setPackingWorks('item_code')
		this.packingWorksNameList = setPackingWorks('item_name')
		this.year = '2017'
		this.month = '12'
		this.working_date = this.year + '/' + this.month
		this.worksDay = this.working_date === this.to.year + '/' + this.to.month ? this.to.day : 1
	}

	monthlyDeliveryTables = () => {
		let array = []
		for (let i = 0, ii = this.deliveryList.length; i < ii; ++i) {
			array.push(
				<div>
					<CommonFormGroup controlLabel={this.deliveryList[i]} size="lg">
						<CommonDisplayCalendar year={this.year} month={this.month} />
					</CommonFormGroup>
					<hr />
				</div>
			)
		}
		return array
	}

	setCustomerMasterData() {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/customer?f',
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
						value: obj.customer.customer_name,
						data: obj
					}
				})

			}
			this.forceUpdate()

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
		for (let i = 0, ii = checkList.length; i < ii; ++i) {
			if (checkList[i].id === _data.data.id) {
				duplicate = true
				break
			}
		}

		if (duplicate) {
			alert('すでに存在しています。')
		} else {
			this[_key].push(_data.data)
			this.forceUpdate()
		}
	}

	/**
	 * 日次作業項目の編集
	 * @param {*} _key 
	 * @param {*} _data 
	 * @param {*} _index 
	 */
	editList(_key, _data, _index) {
		this[_key][_index].work_record.quantity = _data
		this.forceUpdate()
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

	changed() {
		
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
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
		this.deliveryList = newProps.master.shipment_service
		this.sampleData()
		this.forceUpdate()
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<div className="hide">
					<CommonInputText
						controlLabel="作業年月"
						name="internal_work.working_date"
						type="text"
						value={this.working_date}
						readonly
					/>

					<CommonInputText
						controlLabel="顧客"
						name="customer.customer_name"
						type="text"
						value={this.customer_name}
						readonly
					/>
				</div>

				<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

					<Tab eventKey={1} title="見積書 / 月次入力">

						<PanelGroup defaultActiveKey="1">
							<Panel collapsible header="作業対象見積書" eventKey="2" bsStyle="info" defaultExpanded={true}>
								<CommonFilterBox
									controlLabel="見積書選択"
									name="quotation.quotation_code"
									value={this.entry.quotation.quotation_code}
									options={this.quotationList}
									onChange={(data) => this.changed(data)}
								/>
							</Panel>

							<Panel collapsible header="月次作業情報" eventKey="2" bsStyle="info" defaultExpanded={true}>
								<CommonInputText
									controlLabel="管理基本料"
									name="internal_work.mgmt_basic_fee"
									type="text"
									placeholder="管理基本料"
									value={this.entry.internal_work.mgmt_basic_fee}
								/>

								<CommonInputText
									controlLabel="保管費"
									name="internal_work.custody_fee"
									type="text"
									placeholder="保管費"
									value={this.entry.internal_work.custody_fee}
								/>
							</Panel>
						</PanelGroup>
					</Tab>

					<Tab eventKey={2} title="日次作業入力">

						<ListGroup>
							<ListGroupItem>
								<div style={{ float: 'left', 'padding-top': '5px', 'padding-right': '10px'}}>作業日：{this.working_date}/</div>
								<CommonSelectBox pure bsSize="sm" options={this.days()} value={this.worksDay} style={{ float: 'left', width: '50px' }} />
								<div style={{ clear: 'both' }}></div>
							</ListGroupItem>
						</ListGroup>

						<CommonTable
							controlLabel="見積作業"
    						name="quotationWorks"
    						data={this.quotationWorks}
    						header={[{
    							field: 'work_record.item_name',title: '作業内容', width: '300px'
    						}, {
    							field: 'work_record.quantity', title: '個数', width: '50px',
								input: {
									onChange: (data, rowindex)=>{this.editList('quotationWorks', data, rowindex)}
								}
    						}, {
    							field: 'work_record.unit',title: '単位', width: '50px'
    						}, {
    							field: 'work_record.status', title: '承認ステータス', width: '300px'
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
    							field: 'shipment_service.name',title: '配送業者', width: '300px'
    						}, {
    							field: 'work_record.quantity', title: '個数', width: '50px',
								input: {
									onChange: (data, rowindex)=>{this.editList('deliveryWorks', data, rowindex)}
								}
    						}, {
    							field: 'work_record.status', title: '承認ステータス', width: '350px'
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
    							field: 'shipment_service.name',title: '配送業者', width: '300px'
    						}, {
    							field: 'work_record.quantity', title: '個数', width: '50px',
								input: {
									onChange: (data, rowindex)=>{this.editList('pickupWorks', data, rowindex)}
								}
    						}, {
    							field: 'work_record.status', title: '承認ステータス', width: '350px'
    						}]}
							remove={(data, i)=>this.removeList('pickupWorks', i)}
    					>
							<CommonFilterBox
								placeholder="配送業者選択"
								name=""
								value={this.selectDeliveryWorks}
								options={this.deliveryWorksList}
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
								field: 'packing_item.item_code',title: '品番', width: '100px'
							}, {
								field: 'packing_item.item_name', title: '商品名称', width: '300px'
    						}, {
    							field: 'work_record.quantity', title: '個数', width: '50px',
								input: {
									onChange: (data, rowindex)=>{this.editList('packingWorks', data, rowindex)}
								}
    						}, {
    							field: 'work_record.status', title: '承認ステータス', width: '200px'
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