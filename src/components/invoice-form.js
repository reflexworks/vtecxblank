/* @flow */
import React from 'react'
import {
	//PageHeader,
	Form,
	PanelGroup,
	Panel,
	//Col,
	//Tabs,
	//Tab,
	//Table
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
//	CommonPrefecture,
	CommonInputText,
	//	CommonSelectBox,
	//CommonFilterBox,
	CommonTable
} from './common'

export default class InvoiceForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		//this.entry.customer = this.entry.customer || {}
		//this.entry.work = this.entry.work || []
		//this.entry.item_details = this.entry.item_details || []
		//this.entry.manifesto = this.entry.manifesto || []

		this.sampleData()
	}

	sampleData() {

		this.entry.item_details = [{
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

	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	onSelect() {
	}

	render() {

		return (


			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="請求書情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						<CommonInputText
							controlLabel="合計請求金額"
							type="text"
							placeholder="合計請求金額"
							value={this.entry.invoice.total_amount}
							readonly='true'
						/>

												
						<CommonTable
							//name="item_details"
							data={this.entry.item_details}
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
						
						{/*}

							<CommonInputText
								controlLabel="小計金額"
								type="text"
								placeholder="小計金額"
								value={this.entry.invoice.subtotal}
							/>
							<CommonInputText
								controlLabel="消費税"
								type="text"
								placeholder="消費税"
								value={this.entry.invoice.comsumption_tax}
							/>
							<CommonInputText
								controlLabel="EMS"
								type="text"
								placeholder="EMS"
								value={this.entry.invoice.ems}
							/>
							<CommonInputText
								controlLabel="立替金"
								type="text"
								placeholder="立替金"
								value={this.entry.invoice.advance_payment}
							/>
							<CommonInputText
								controlLabel="購入,弁済代"
								type="text"
								placeholder="小計金額"
								value={this.entry.invoice.payment_cost}
							
							/>
						*/}
					</Panel>

					<Panel collapsible header="備考情報" eventKey="2" bsStyle="info" defaultExpanded={false}>

						<CommonTable
							//name="remarks"
							data={this.entry.remarks}
							edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
							header={[{
								field: 'content',title: '備考'
							}]}
						/>

					</Panel>
						
				</PanelGroup>

			</Form>
		)
	}
}
