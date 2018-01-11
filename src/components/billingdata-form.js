/* @flow */
import React from 'react'
import {
	Form,
	PanelGroup,
	Panel,
	Tabs,
	Tab,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonTable,
	//CommonInputText,
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
		
		this.ecoJP = [{
			day: '12/1',
			work: '10',
			invoices: '10',
			amount: '¥3,900',
		}, {
			day: '12/2',
			work: '60',
			invoices: '60',
			amount: '¥23,400',
		}, {
			day: '12/3',
			work: '7',
			invoices: '7',
			amount: '¥2,730',
		}, {
			day: '12/4',
			work: '25',
			invoices: '25',
			amount: '¥9,750',
		}, {
			day: '12/5',
			work: '14',
			invoices: '14',
			amount: '¥5,460',			
		}, {
			day: '12/6',
			work: '45',
			invoices: '45',
			amount: '¥17,750',
		}, {
			day: '合計',
			work: '161',
			invoices: '161',
			amount: '¥62,790',
		}]
		

		this.yamatoDep = [{
			day: '12/1',
			work: '4',
			invoices: '4',
			amount: '¥2,000',
		}, {
			day: '12/2',
			work: '6',
			invoices: '6',
			amount: '¥3,000',
		}, {
			day: '12/3',
			work: '10',
			invoices: '10',
			amount: '¥5,000',
		}, {
			day: '12/4',
			work: '30',
			invoices: '30',
			amount: '¥15,000',
		}, {
			day: '12/5',
			work: '25',
			invoices: '25',
			amount: '¥12,500',
		}, {
			day: '12/6',
			work: '22',
			invoices: '22',
			amount: '¥11,000',
		}, {
			day: '合計',
			work: '97',
			invoices: '97',
			amount: '¥48,500',
		}]
		
		this.sagawaDep = [{
			day: '12/1',
			work: '3',
			invoices: '3',
			amount: '¥1,200',
		}, {
			day: '12/2',
			work: '4',
			invoices: '4',
			amount: '¥1,600',
		}, {
			day: '12/3',
			work: '1',
			invoices: '1',
			amount: '¥400',
		}, {
			day: '12/4',
			work: '8',
			invoices: '8',
			amount: '¥3,200',
		}, {
			day: '12/5',
			work: '10',
			invoices: '10',
			amount: '¥4,000',
		}, {
			day: '12/6',
			work: '6',
			invoices: '6',
			amount: '¥2,400',
		}, {
			day: '合計',
			work: '32',
			invoices: '32',
			amount: '¥12,800',
		}]
		
		this.sagawaCash = [{
			day: '12/1',
			work: '41',
			invoices: '40',
			amount: '¥40,000',
			is_error: true,
		}, {
			day: '12/2',
			work: '5',
			invoices: '4',
			amount: '¥4,000',
			is_error: true,
		}, {
			day: '12/3',
			work: '36',
			invoices: '36',
			amount: '¥36,000',
		}, {
			day: '12/4',
			work: '8',
			invoices: '8',
			amount: '¥8,000',
		}, {
			day: '12/5',
			work: '10',
			invoices: '10',
			amount: '¥10,000',
		}, {
			day: '12/6',
			work: '50',
			invoices: '50',
			amount: '¥50,000',
		}, {
			day: '合計',
			work: '150',
			invoices: '148',
			amount: '¥148,000',
			is_error:true,
		}]
		
		this.seinou = [{
			day: '12/1',
			work: '40',
			invoices: '40',
			amount: '¥42,800',
		}, {
			day: '12/2',
			work: '10',
			invoices: '10',
			amount: '¥10,700',
		}, {
			day: '12/3',
			work: '21',
			invoices: '21',
			amount: '¥22,470',
		}, {
			day: '12/4',
			work: '25',
			invoices: '25',
			amount: '¥26,750',
		}, {
			day: '12/5',
			work: '35',
			invoices: '35',
			amount: '¥37,450',			
		}, {
			day: '12/6',
			work: '13',
			invoices: '13',
			amount: '¥13,910',
		}, {
			day: '合計',
			work: '144',
			invoices: '144',
			amount: '¥154,080',
		}]
			
		this.JPpacket = [{
			day: '12/1',
			work: '8',
			invoices: '8',
			amount: '¥1,200',
		}, {
			day: '12/2',
			work: '10',
			invoices: '10',
			amount: '¥1,500',
		}, {
			day: '12/3',
			work: '5',
			invoices: '5',
			amount: '¥750',
		}, {
			day: '12/4',
			work: '30',
			invoices: '30',
			amount: '¥4,500',
		}, {
			day: '12/5',
			work: '28',
			invoices: '28',
			amount: '¥4,200',			
		}, {
			day: '12/6',
			work: '17',
			invoices: '17',
			amount: '¥2,550',
		}, {
			day: '合計',
			work: '98',
			invoices: '98',
			amount: '¥14,700',
		}]

		this.JPmail = [{
			day: '12/1',
			work: '30',
			invoices: '30',
			amount: '¥9,000',
		}, {
			day: '12/2',
			work: '10',
			invoices: '10',
			amount: '¥3,000',
		}, {
			day: '12/3',
			work: '11',
			invoices: '11',
			amount: '¥3,300',
		}, {
			day: '12/4',
			work: '50',
			invoices: '50',
			amount: '¥15,000',
		}, {
			day: '12/5',
			work: '35',
			invoices: '35',
			amount: '¥10,500',			
		}, {
			day: '12/6',
			work: '44',
			invoices: '44',
			amount: '¥13.500',
		}, {
			day: '合計',
			work: '180',
			invoices: '180',
			amount: '¥54,000',
		}]


		this.self = [{
			day: '12/1',
			work: '30',
			invoices: '30',
			amount: '¥9,000',
		}, {
			day: '12/2',
			work: '10',
			invoices: '10',
			amount: '¥3,000',
		}, {
			day: '12/3',
			work: '11',
			invoices: '11',
			amount: '¥3,300',
		}, {
			day: '12/4',
			work: '50',
			invoices: '50',
			amount: '¥15,000',
		}, {
			day: '12/5',
			work: '35',
			invoices: '35',
			amount: '¥10,500',			
		}, {
			day: '12/6',
			work: '44',
			invoices: '44',
			amount: '¥13.500',
		}, {
			day: '合計',
			work: '180',
			invoices: '180',
			amount: '¥54,000',
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


				<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
					<Tab eventKey={1} title="発送">
						<PanelGroup defaultActiveKey="1">

							<Panel collapsible header="エコ配JP" eventKey="1" bsStyle="info" defaultExpanded="true">
						
								<CommonTable
									//name="quotation.basic_condition"
									data={this.ecoJP}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>
					
							</Panel>

							<Panel collapsible header="ヤマト運輸(発払)" eventKey="2" bsStyle="info" defaultExpanded="true">
						
								<CommonTable
									//name="quotation.basic_condition"
									data={this.yamatoDep}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
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
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
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
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
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
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>
						
							</Panel>

							<Panel collapsible header="日本郵政(EMS)" eventKey="6" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
						
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(ゆうパケット)" eventKey="7" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.JPpacket}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(ゆうメール)" eventKey="8" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>

							<Panel collapsible header="日本郵政(定形外 規格内:50g)" eventKey="9" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格内:100g)" eventKey="10" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格内:150g)" eventKey="11" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格内:250g)" eventKey="12" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格内:500g)" eventKey="13" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格内:1000g)" eventKey="14" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>

							<Panel collapsible header="日本郵政(定形外 規格外:50g)" eventKey="15" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格外:100g)" eventKey="16" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格外:150g)" eventKey="17" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格外:250kg)" eventKey="18" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格外:500kg)" eventKey="19" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格外:1000kg)" eventKey="20" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格外:2000kg)" eventKey="21" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>
							<Panel collapsible header="日本郵政(定形外 規格外:4000kg)" eventKey="22" bsStyle="info" defaultExpanded="true">
		
								<CommonTable
									//name="quotation.basic_condition"
									data={this.sample}
									header={[{
										field: 'day',title: '日付', width: '50px'
									}, {
										field: 'work', title: '発送作業個数', width: '300px'
									}, {
										field: 'invoices', title: '請求個数', width: '300px'
									}, {
										field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
									}]}
									//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
									//add={() => this.showAddModal('basic_condition')}
									//remove={(data, index) => this.removeList('basic_condition', index)}
								/>

							</Panel>

						
						</PanelGroup>
					</Tab>
					<Tab eventKey={2} title="集荷">
						<Panel collapsible header="エコ配JP" eventKey="1" bsStyle="info" defaultExpanded="true">
						
							<CommonTable
								//name="quotation.basic_condition"
								data={this.ecoJP}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>
					
						</Panel>

						<Panel collapsible header="ヤマト運輸(発払)" eventKey="2" bsStyle="info" defaultExpanded="true">
						
							<CommonTable
								//name="quotation.basic_condition"
								data={this.yamatoDep}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
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
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
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
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
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
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>
						
						</Panel>

						<Panel collapsible header="日本郵政(EMS)" eventKey="6" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
						
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>

						<Panel collapsible header="日本郵政(ゆうパケット)" eventKey="7" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.JPpacket}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>

						<Panel collapsible header="日本郵政(ゆうメール)" eventKey="8" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>

						<Panel collapsible header="日本郵政(定形外 規格内:50g)" eventKey="9" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格内:100g)" eventKey="10" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格内:150g)" eventKey="11" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格内:250g)" eventKey="12" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格内:500g)" eventKey="13" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格内:1000g)" eventKey="14" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>

						<Panel collapsible header="日本郵政(定形外 規格外:50g)" eventKey="15" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格外:100g)" eventKey="16" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格外:150g)" eventKey="17" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格外:250kg)" eventKey="18" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格外:500kg)" eventKey="19" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格外:1000kg)" eventKey="20" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格外:2000kg)" eventKey="21" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(定形外 規格外:4000kg)" eventKey="22" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								//name="quotation.basic_condition"
								data={this.sample}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
								//edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								//add={() => this.showAddModal('basic_condition')}
								//remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Panel>
					</Tab>		
				</Tabs>
			</Form>
		)
	}
}