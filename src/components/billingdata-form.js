/* @flow */
import React from 'react'
import {
	Form,
	PanelGroup,
	Panel,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonTable,
	CommonInputText,
} from './common'


export default class BillingDataForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.billing_data = this.entry.billing_data || {}

		this.createSampleData()
		this.forceUpdate()
	}

	createSampleData() {
		this.entry.billing_data.total_amount = '21,000円'
		this.sample = [{
			day: '12/1',
			work: '1',
			invoices: '1',
			amount: '1,000',
		}, {
			day: '12/2',
			work: '2',
			invoices: '9',
			amount: '2,000',
			is_error: true,
		}, {
			day: '12/3',
			work: '3',
			invoices: '3',
			amount: '3,000',
		}, {
			day: '12/4',
			work: '4',
			invoices: '4',
			amount: '4,000',
		}, {
			day: '12/5',
			work: '5',
			invoices: '8',
			amount: '5,000',
			is_error: true,
		}, {
			day: '12/6',
			work: '6',
			invoices: '6',
			amount: '6,000',
		}]
		
		this.sample2 = [{
			day: '12/1',
			work: '1',
			weight: '80',
			invoices: '1',
			amount: '1,000',
		}, {
			day: '12/2',
			work: '2',
			weight: '80',
			invoices: '9',
			amount: '2,000',
			is_error: true,
		}, {
			day: '12/3',
			work: '3',
			weight: '80',
			invoices: '3',
			amount: '3,000',
		}, {
			day: '12/4',
			work: '4',
			weight: '80',
			invoices: '4',
			amount: '4,000',
		}, {
			day: '12/5',
			work: '5',
			weight: '80',
			invoices: '8',
			amount: '5,000',
			is_error: true,
		}, {
			day: '12/6',
			work: '6',
			weight: '80',
			invoices: '6',
			amount: '6,000',
		}]
		
		this.sample3 = [{
			day: '12/1',
			work: '1',
			size: '60',
			invoices: '1',
			amount: '1,000',
		}, {
			day: '12/2',
			work: '2',
			size: '60',
			invoices: '9',
			amount: '2,000',
			is_error: true,
		}, {
			day: '12/3',
			work: '3',
			size: '60',
			invoices: '3',
			amount: '3,000',
		}, {
			day: '12/4',
			work: '4',
			size: '60',
			invoices: '4',
			amount: '4,000',
		}, {
			day: '12/5',
			work: '5',
			size: '60',
			invoices: '8',
			amount: '5,000',
			is_error: true,
		}, {
			day: '12/6',
			work: '6',
			size: '60',
			invoices: '6',
			amount: '6,000',
		}]
		
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

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="エコ配JP" eventKey="1" bsStyle="info" defaultExpanded="true">
						
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>
						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>
					
					</Panel>

					<Panel collapsible header="ヤマト運輸(発払)" eventKey="2" bsStyle="info" defaultExpanded="true">
						
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>
						
					</Panel>
					<Panel collapsible header="ヤマト運輸(代引)" eventKey="3" bsStyle="info" defaultExpanded="true">
						
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>
						
					</Panel>
					<Panel collapsible header="ヤマト運輸(DM便)" eventKey="4" bsStyle="info" defaultExpanded="true">
						
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>
						
					</Panel>
					<Panel collapsible header="ヤマト運輸(ネコポス)" eventKey="5" bsStyle="info" defaultExpanded="true">
						
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>
						
						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>
						
					</Panel>

					<Panel collapsible header="佐川急便(発払)" eventKey="6" bsStyle="info" defaultExpanded="true">

						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>

					</Panel>
					<Panel collapsible header="佐川急便(代引)" eventKey="7" bsStyle="info" defaultExpanded="true">

						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>

					</Panel>

					<Panel collapsible header="西濃運輸" eventKey="8" bsStyle="info" defaultExpanded="true">
	
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>

					</Panel>

					<Panel collapsible header="日本郵政(EMS)" eventKey="9" bsStyle="info" defaultExpanded="true">
		
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
						
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>

					</Panel>
					<Panel collapsible header="日本郵政(ゆうパケット)" eventKey="10" bsStyle="info" defaultExpanded="true">
		
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample3}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'size', title: 'サイズ', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>

					</Panel>
					<Panel collapsible header="日本郵政(ゆうメール)" eventKey="11" bsStyle="info" defaultExpanded="true">
		
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample2}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'weight', title: '重量', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>

					</Panel>
					<Panel collapsible header="日本郵政(定形外)" eventKey="12" bsStyle="info" defaultExpanded="true">
		
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample2}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'weight', title: '重量', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>

					</Panel>

					
					<Panel collapsible header="自社配送" eventKey="13" bsStyle="info" defaultExpanded="true">
		
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '発送作業個数', width: '150px'
							}, {
								field: 'invoices', title: '請求個数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

						<CommonInputText
							controlLabel="合計金額"
							name="billingdata.total_amount"
							type="text"
							value={this.entry.billing_data.total_amount}
							readonly
						/>

					</Panel>

				</PanelGroup>		
			</Form>
		)
	}
}