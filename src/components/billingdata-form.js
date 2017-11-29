/* @flow */
import React from 'react'
import {
	Form,
	PanelGroup,
	Panel,
	//Checkbox,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonTable, //CommonRadioBtn,
	//CommonSelectBox,
	//CommonFilterBox,
} from './common'


export default class BillingDataForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.billing_data = this.entry.billing_data || {}

		this.sampleDataCreate()
		this.forceUpdate()
	}

	sampleDataCreate() {
		this.sample = [{
			day: '12/1',
			work: '1',
			invoices: '1',
			amount: '1,000',
			approval_status: '承認',
		}, {
			day: '12/2',
			work: '2',
			invoices: '2',
			amount: '2,000',
			approval_status: '未承認',
		}, {
			day: '12/3',
			work: '3',
			invoices: '3',
			amount: '3,000',
			approval_status: '承認',
		}, {
			day: '12/4',
			work: '4',
			invoices: '4',
			amount: '4,000',
			approval_status: '未承認',
		}, {
			day: '12/5',
			work: '5',
			invoices: '5',
			amount: '5,000',
			approval_status: '承認',
		}, {
			day: '12/6',
			work: '6',
			invoices: '6',
			amount: '6,000',
			approval_status: '未承認',
		}]
		
		this.approval = ['承認','未承認']
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

						{/*<CommonFilterBox
							//controlLabel="ロール"
							size="sm"
							//name="staff.role"
							//value={this.entry.staff.role}
							options={[{
								label: '未承認',
								value: '1'
							}, {
								label: '承認',
								value: '2'
							}]}
							//onChange={(value) => this.changedRole(value)}
						/>
						*/}
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>
					
					</Panel>
					<Panel collapsible header="ヤマト運輸(発払)" eventKey="2" bsStyle="info" defaultExpanded="true">
						
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>
						
					</Panel>
					<Panel collapsible header="ヤマト運輸(代引)" eventKey="3" bsStyle="info" defaultExpanded="true">
						
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>
						
					</Panel>
					<Panel collapsible header="ヤマト運輸(DM便)" eventKey="4" bsStyle="info" defaultExpanded="true">
						
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>
						
					</Panel>
					<Panel collapsible header="ヤマト運輸(ネコポス)" eventKey="5" bsStyle="info" defaultExpanded="true">
						
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>
						
					</Panel>

					<Panel collapsible header="佐川急便(発払)" eventKey="6" bsStyle="info" defaultExpanded="true">

						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

					</Panel>
					<Panel collapsible header="佐川急便(代引)" eventKey="7" bsStyle="info" defaultExpanded="true">

						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

					</Panel>
					<Panel collapsible header="西濃運輸" eventKey="8" bsStyle="info" defaultExpanded="true">
	
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

					</Panel>
					<Panel collapsible header="日本郵政(EMS)" eventKey="9" bsStyle="info" defaultExpanded="true">
		
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

					</Panel>
					<Panel collapsible header="日本郵政(ゆうパック)" eventKey="10" bsStyle="info" defaultExpanded="true">
		
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

					</Panel>

					<Panel collapsible header="日本郵政(ゆうメール)" eventKey="11" bsStyle="info" defaultExpanded="true">
		
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

					</Panel>


					<Panel collapsible header="自社配送" eventKey="12" bsStyle="info" defaultExpanded="true">
		
						<CommonTable
							//name="quotation.basic_condition"
							data={this.sample}
							header={[{
								field: 'day',title: '日付', width: '50px'
							}, {
								field: 'work', title: '作業件数', width: '150px'
							}, {
								field: 'invoices', title: '請求件数', width: '150px'
							}, {
								field: 'amount', title: '請求金額', width: '300px'
							}, {
								field: 'approval_status', title: '承認ステータス', width: '200px',
			
							}]}
							//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
							//add={() => this.showAddModal('basic_condition')}
							//remove={(data, index) => this.removeList('basic_condition', index)}
						/>

					</Panel>

				</PanelGroup>		
			</Form>
		)
	}
}