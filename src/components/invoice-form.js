/* @flow */
import React from 'react'
import {
	Form,
	PanelGroup,
	Panel,
	FormGroup,
	FormControl,
	Tabs,
	Tab,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonTable,
	//CommonRadioBtn,
} from './common'

export default class InvoiceForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry

		this.entry = this.props.entry
		this.entry.invoice = this.entry.invoice || {}
		this.entry.invoice.other_quotation = this.entry.invoice.other_quotaton || []
		//this.entry.billto = this.entry.billto || {}
		//this.entry.contact_information = this.entry.contact_information
		//this.entry.item_details = this.entry.item_details || []
		//this.entry.remarks = this.entry.remarks || []
		
		//this.entry.work = this.entry.work || []
		//this.entry.manifesto = this.entry.manifesto || []
		console.log(this.entry)

		this.sampleData()
	}

	sampleData() {
		this.entry.invoice.subtotal = '¥100,000'
		this.entry.invoice.consumption_tax = '¥8,000'
		this.entry.invoice.total_amount = '¥108,000'
		this.entry.sampleDelivery = [{
			work: '西濃運輸',
			quantity: '341',
			unit: '個',
			unit_price: '600',
			cost: '204,600',
			remarks: '',
		}, {
			work: '西濃運輸(沖縄)',
			quantity: '4',
			unit: '個',
			unit_price: '1,600',
			cost: '6,400',
			remarks: '',
		}, {
			work: '西濃運輸(中継料等)',
			quantity: '1',
			unit: '式',
			unit_price: '個別',
			cost: '6,610',
			remarks: '',
		}, {
			work: '西濃運輸(実費)',
			quantity: '1',
			unit: '式',
			unit_price: '個別',
			cost: '2,140',
			remarks: '規格外含',
		}, {
			work: '西濃運輸(サーチャージ)',
			quantity: '1',
			unit: '式',
			unit_price: '個別',
			cost: '5,320',
			remarks: '規格外含',
		}, {
			work: '西濃運輸(代引き手数料)',
			quantity: '1',
			unit: '個',
			unit_price: '300',
			cost: '300',
			remarks: '',
		}, {
			work: '西濃運輸(代引き手数料)',
			quantity: '3',
			unit: '個',
			unit_price: '400',
			cost: '1,200',
			remarks: '',
		}, {
			work: '西濃運輸(代引き手数料)',
			quantity: '0',
			unit: '個',
			unit_price: '600',
			cost: '0',
			remarks: '',
		}, {
			work: '西濃運輸(代引き手数料)',
			quantity: '0',
			unit: '個',
			unit_price: '1000',
			cost: '0',
			remarks: '',
		}]
		
		this.entry.sampleDate = [{
			work: '',
			quantity: '',
			unit: '',
			unit_price: '',
			cost: '',
			remarks: '',
		}]
		
		
		this.entry.sampleMonthly = [{
			company:'',
			quantity: '',
			unit: '',
			unit_price: '',
			cost: '',
			remarks: '',
		}]
		
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	addList(_data) {
		console.log(this.entry.invoice.other_quotation)
		this.entry.invoice.other_quotation.push(_data)
		this.forceUpdate()
	}

	removeList(_index) {
		let array = []
		for (let i = 0, ii = this.entry.invoice.other_quotation.length; i < ii; ++i) {
			if (i !== _index) array.push(this.entry.invoice.other_quotation[i])
		}
		this.entry.invoice.other_quotation = array
		this.forceUpdate()
	}
	
	changeDetails(_data,_rowindex) {
		console.log(this.entry.invoice.other_quotation)
		this.entry.invoice.other_quotation[_rowindex].details = _data
		this.forceUpdate()
	}

	changeCost(_data, _rowindex) {
		console.log(this.entry.invoice.other_quotation)
		this.entry.invoice.other_quotation[_rowindex].cost = _data
		this.forceUpdate()
	}

	onSelect() {
	}

	render() {

		return (


			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="請求書情報" eventKey="1" bsStyle="info" defaultExpanded="true">


						{/* 登録の場合 */}
						{!this.entry.invoice.invoice_code &&
							<FormGroup className="hide">
								<FormControl name="invoice.invoice_code" type="text" value="${_addids}" />
								<FormControl name="link" data-rel="self" type="text" value="/invoice/${_addids}" />
							</FormGroup>
						}

						{/* 更新の場合 */}
						{this.entry.invoice.invoice_code &&
							<CommonInputText
								controlLabel="請求コード"
								name="invoice.invoice_code"
								type="text"
								placeholder="請求コード"
								value={this.entry.invoice.invoice_code}
								readonly="true"
							/>
						}

						<CommonInputText
							controlLabel="見積番号"	
							name='invoice.quotation_code'							
							type="text"
							placeholder="見積番号"
							value={this.entry.invoice.quotation_code}
							readonly='true'
						/>
						
						<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

							<Tab eventKey={1} title="金額">

								<Panel collapsible header="月次情報" eventKey="1" bsStyle="info" defaultExpanded="true">
									<CommonTable
										//name="item_details"
										data={this.entry.sampleMonthly}
										edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
										header={[{
											field: 'work',title: 'ご請求内容(作業内容)', width: '100px'
										}, {
											field: 'quantity',title: '数量', width: '50px'
										}, {
											field: 'unit',title: '単位', width: '50px'
										}, {
											field: 'unit_price',title: '単価', width: '100px'
										}, {
											field: 'cost', title: '金額', width: '500px'
										}, {
											field: 'remarks',title: '備考', width: '500px'	
										}]}
									/>
								</Panel>
								
								<Panel collapsible header="日時作業情報" eventKey="1" bsStyle="info" defaultExpanded="true">
									<CommonTable
									//name="item_details"
										data={this.entry.sampleDate}
										edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
										header={[{
											field: 'work',title: 'ご請求内容(作業内容)', width: '100px'
										}, {
											field: 'quantity',title: '数量', width: '50px'
										}, {
											field: 'unit',title: '単位', width: '50px'
										}, {
											field: 'unit_price',title: '単価', width: '100px'
										}, {
											field: 'cost', title: '金額', width: '500px'
										}, {
											field: 'remarks',title: '備考', width: '500px'	
										}]}
									/>
								</Panel>

								<Panel collapsible header="配送料" eventKey="3" bsStyle="info" defaultExpanded="true">
									<CommonTable
										//name="item_details"
										data={this.entry.sampleDelivery}
										edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
										header={[{
											field: 'work',title: 'ご請求内容(作業内容)', width: '100px'
										}, {
											field: 'quantity',title: '数量', width: '50px'
										}, {
											field: 'unit',title: '単位', width: '50px'
										}, {
											field: 'unit_price',title: '単価', width: '100px'
										}, {
											field: 'cost', title: '金額', width: '500px'
										}, {
											field: 'remarks',title: '備考', width: '500px'	
										}]}
									/>
								</Panel>	
									
								<Panel collapsible header="その他" eventKey="4" bsStyle="info" defaultExpanded="true">
									<CommonTable
									//name="other_quotation"
										data={this.entry.invoice.other_quotation}
										header={[{
											field: 'details', title: '項目', width: '100px',
											input: {
												onChange: (data, rowindex)=>{this.changeDetails(data,rowindex)}
											}
										}, {
											field: 'cost',title: '金額', width: '50px',
											input: {
												onChange: (data, rowindex)=>{this.changeCost(data,rowindex)}
											}
										}]}
										add={() => this.addList({ details: '', cost: ''})}
										remove={(data, index) => this.removeList('other_quotation', index)}
										fixed
									/>
								</Panel>	

							</Tab>

							<Tab eventKey={2} title="振込先"> 
								<CommonInputText
									controlLabel="振込先"
									type="text"
									placeholder="振込先"
									//value={this.entry.invoice.}
									readonly
								/>

							</Tab>
						</Tabs>	
						
						<br/>
						<br/>
						<CommonInputText
							controlLabel="小計金額"
							name="invoice.subtotal"
							type="text"
							placeholder="小計金額"
							value={this.entry.invoice.subtotal}
							readonly
							className="total_amount"
						/>

						<br />
						<br />
						<CommonInputText
							controlLabel="消費税"
							name="invoice.consumption_tax"
							type="text"
							placeholder="消費税"
							value={this.entry.invoice.consumption_tax}
							readonly
							className="total_amount"
						/>
						<br />
						<br />
						<CommonInputText
							controlLabel="合計請求金額"
							name="invoice.total_amount"
							type="text"
							placeholder="合計請求金額"
							value={this.entry.invoice.total_amount}
							readonly='true'
							className="total_amount"
						/>


					</Panel>

				</PanelGroup>

			</Form>
		)
	}
}
