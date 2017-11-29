/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form,
	//	PanelGroup,
	//	Panel,
	PageHeader,
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
	CommonSelectBox
} from './common'

export default class InternalWorkForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry || {}
		this.entry.quotation = this.entry.quotation || {}
		this.entry.customer = this.entry.customer || {}
		this.entry.internal_work = this.entry.internal_work || {}

		this.master = {
			customerList: []
		}
		this.customerList = []

		this.quotationWorks = []
		this.deliveryWorks = []
		this.packingyWorks = []
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
	}


	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setCustomerMasterData()

		this.sampleData()
	}

	days = () => {
		let array = []
		for (let i = 1, ii = 32; i < ii; ++i) {
			i = i < 10 ? '0' + i : i
			array.push({ label: i, value: i })
		}
		return array
	}

	sampleData() {
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
				array.push({
					work_record: {
						item_name: '見積作業' + i,
						unit_name: '',
						unit: unit(i),
						quantity: (i === 3 ? '3' : ''),
						status: (i === 3 ? '上長承認中' : '')
					}
				})
			}
			return array
		}
		const setDeliveryWorks = () => {

			let array = []
			for (let i = 0, ii = this.deliveryList.length; i < ii; ++i) {
				array.push({
					shipment_service: {
						name: this.deliveryList[i]
					},
					delivery_charge_amount: {
						delivery_charge: (i === 3 ? '300' : ''),
						quantity: (i === 3 ? '5' : '')
					},
					work_record: {
						status: (i === 3 ? '上長承認中' : '')
					}
				})
			}
			return array
		}
		const setPackingyWorks = ()=>{
			let array = []
			for (let i = 0, ii = 10; i < ii; ++i) {
				array.push({
					manifesto: {
						manifesto_code: 'SH0000' + i + '-01',
						manifesto_name: '資材名称' + i
					},	
					work_record: {
						item_name: '資材梱包作業' + i,
						quantity: (i === 3 ? '3' : ''),
						status: (i === 3 ? '上長承認中' : '')
					}
				})
			}
			return array
		}
		this.quotationWorks = setQuotationWorks()
		this.deliveryWorks = setDeliveryWorks()
		this.packingyWorks = setPackingyWorks()
		this.working_date = '2018/01'
	}

	monthlyTable = () => {
		const halfHead = (start, end) => {
			let array = []
			for (let i = start, ii = end ; i < ii; ++i) {
				array.push(<th>{i+1}</th>)
			}
			if (array.length === 15) array.push(<th></th>)
			return array
		}
		const halfBody = (start, end) => {
			let array = []
			for (let i = start, ii = end ; i < ii; ++i) {
				array.push(<td>{i}</td>)
			}
			if (array.length === 15) array.push(<td></td>)
			return array
		}
		return (
			<table className="monthly-table">
				<thead><tr>{halfHead(0, 16)}</tr></thead>
				<tbody><tr>{halfBody(0, 16)}</tr></tbody>
				<thead><tr>{halfHead(16, 31)}</tr></thead>
				<tbody><tr>{halfBody(16, 31)}</tr></tbody>
			</table>
		)
	}

	monthlyDeliveryTable = () => {
		const halfHead = (start, end) => {
			let array = []
			array.push(<th></th>)
			for (let i = start, ii = end ; i < ii; ++i) {
				array.push(<th>{i+1}</th>)
			}
			if (array.length === 16) array.push(<th></th>)
			return array
		}
		const halfBody = (start, end) => {
			let array = []
			array.push(
				<td className="monthly-table-title">
					<div>梱包数</div>
					<div>配送料金</div>
				</td>
			)
			for (let i = start, ii = end ; i < ii; ++i) {
				array.push(<td>
					<div>{i}</div>
					<div>{i}00</div>
				</td>)
			}
			if (array.length === 16) array.push(<td></td>)
			return array
		}
		return (
			<table className="monthly-table">
				<thead><tr>{halfHead(0, 16)}</tr></thead>
				<tbody><tr>{halfBody(0, 16)}</tr></tbody>
				<thead><tr>{halfHead(16, 31)}</tr></thead>
				<tbody><tr>{halfBody(16, 31)}</tr></tbody>
			</table>
		)
	}

	monthlyDeliveryTables = () => {
		let array = []
		for (let i = 0, ii = this.deliveryList.length; i < ii; ++i) {
			array.push(
				<div>
					<PageHeader>{this.deliveryList[i]}</PageHeader>
					{this.monthlyDeliveryTable()}
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

				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
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
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<CommonFilterBox
					controlLabel="見積書選択"
					name="quotation.quotation_code"
					value={this.entry.quotation.quotation_code}
					options={this.quotationList}
					onChange={(data) => this.changed(data)}
				/>

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
					value={this.entry.customer.customer_name}
					readonly
				/>

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

				<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

					<Tab eventKey={1} title="日次作業入力">

						<ListGroup>
							<ListGroupItem>
								<div style={{ float: 'left', 'padding-top': '5px', 'padding-right': '10px'}}>作業日：{this.working_date}/</div>
								<CommonSelectBox pure bsSize="sm" options={this.days()} value="01" style={{ float: 'left', width: '50px' }} />
								<div style={{ clear: 'both' }}></div>
							</ListGroupItem>
						</ListGroup>

						<PageHeader>見積作業</PageHeader>

    					<CommonTable
    						name="quotationWorks"
    						data={this.quotationWorks}
    						header={[{
    							field: 'work_record.item_name',title: '作業内容', width: '200px'
    						}, {
    							field: 'work_record.quantity', title: '個数', width: '50px',
								input: {
									onChange: (data, rowindex)=>{this.changeQuotationWorks(data, rowindex)}
								}
    						}, {
    							field: 'work_record.unit',title: '単位', width: '50px'
    						}, {
    							field: 'work_record.status', title: '承認ステータス', width: '700px'
    						}]}
    					/>

						<br />
						<PageHeader>発送作業</PageHeader>
    					<CommonTable
    						name="deliveryWorks"
    						data={this.deliveryWorks}
    						header={[{
    							field: 'shipment_service.name',title: '配送業者', width: '200px'
    						}, {
    							field: 'delivery_charge_amount.quantity', title: '個数', width: '50px',
								input: {
									onChange: (data, rowindex)=>{this.changeQuotationWorks(data, rowindex)}
								}
    						}, {
    							field: 'delivery_charge_amount.delivery_charge',title: '配送料', width: '100px',
								input: {
									onChange: (data, rowindex)=>{this.changeQuotationWorks(data, rowindex)}
								}
    						}, {
    							field: 'work_record.status', title: '承認ステータス', width: '700px'
    						}]}
    					/>

						<br />
						<PageHeader>資材梱包作業</PageHeader>
    					<CommonTable
    						name="packingyWorks"
    						data={this.packingyWorks}
    						header={[{
								field: 'manifesto.manifesto_code',title: '品番', width: '100px'
							}, {
								field: 'manifesto.manifesto_name', title: '商品名称', width: '300px'
    						}, {
    							field: 'work_record.quantity', title: '個数', width: '50px',
								input: {
									onChange: (data, rowindex)=>{this.changeQuotationWorks(data, rowindex)}
								}
    						}, {
    							field: 'work_record.status', title: '承認ステータス', width: '600px'
    						}]}
    					/>

					</Tab>
					<Tab eventKey={2} title="見積作業状況">
							
						<CommonFormGroup controlLabel="日次作業1" size="lg">
							{this.monthlyTable()}
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="日次作業2" size="lg">
							{this.monthlyTable()}
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="日次作業3" size="lg">
							{this.monthlyTable()}
						</CommonFormGroup>
						
						<hr />

						<CommonFormGroup controlLabel="日次作業4" size="lg">
							{this.monthlyTable()}
						</CommonFormGroup>
					</Tab>

					<Tab eventKey={3} title="発送作業状況">
						{this.monthlyDeliveryTables()}
					</Tab>

					<Tab eventKey={4} title="資材梱包作業状況">
						
						<CommonFormGroup controlLabel="資材1" size="lg">
							{this.monthlyTable()}
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="資材2" size="lg">
							{this.monthlyTable()}
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="資材3" size="lg">
							{this.monthlyTable()}
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="資材4" size="lg">
							{this.monthlyTable()}
						</CommonFormGroup>

						<hr />

						<CommonFormGroup controlLabel="資材5" size="lg">
							{this.monthlyTable()}
						</CommonFormGroup>

					</Tab>

				</Tabs>	
				
			</Form>
		)
	}
}