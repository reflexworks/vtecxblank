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

					<Panel collapsible header="日本郵政(ゆうパケット2cm)" eventKey="10" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(ゆうパケット3cm)" eventKey="11" bsStyle="info" defaultExpanded="true">
		
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

					<Panel collapsible header="日本郵政(ゆうメール250g以内)" eventKey="11" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(ゆうメール500g以内)" eventKey="12" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(ゆうメール700g以内)" eventKey="13" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(ゆうメール1kg以内)" eventKey="14" bsStyle="info" defaultExpanded="true">
		
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

					<Panel collapsible header="日本郵政(定形外 規格内:50g)" eventKey="15" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格内:100g)" eventKey="16" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格内:150g)" eventKey="17" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格内:250g)" eventKey="18" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格内:500g)" eventKey="19" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格内:1000g)" eventKey="20" bsStyle="info" defaultExpanded="true">
		
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

					<Panel collapsible header="日本郵政(定形外 規格外:50g)" eventKey="21" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格外:100g)" eventKey="22" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格外:150g)" eventKey="23" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格外:250kg)" eventKey="24" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格外:500kg)" eventKey="25" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格外:1000kg)" eventKey="26" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格外:2000kg)" eventKey="27" bsStyle="info" defaultExpanded="true">
		
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
					<Panel collapsible header="日本郵政(定形外 規格外:4000kg)" eventKey="28" bsStyle="info" defaultExpanded="true">
		
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

					<Panel collapsible header="自社配送" eventKey="29" bsStyle="info" defaultExpanded="true">
		
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