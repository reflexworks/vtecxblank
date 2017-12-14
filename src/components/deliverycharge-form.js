/* @flow */
import React from 'react'
import axios from 'axios'
import {
	PageHeader,
	Form,
	PanelGroup,
	Panel
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
//	CommonPrefecture,
	CommonInputText,
	//CommonSelectBox,
	CommonFilterBox,
	CommonTable
} from './common'

export default class QuotationForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 発払い
		this.shipmentServiceListType1 = []
		// メール便
		this.shipmentServiceListType2 = []

		// 備考
		this.notes = [
			{ content:'エコ配JPは、土日祝日は対応不可となります。'},
			{ content:'離島の別途料金につきましては、ヤマト宅急便はかかりません。'},
			{ content:'荷物の運送につきましては、業務提携会社に準じます。'},
			{ content:'コレクト（代金引換）手数料は、1万円以下全国一律300円（税別）、3万円以下全国400円（税別）、10万円以下全国一律（税別）を請求させて頂きます。'}
		]
	
		this.entry = this.props.entry
		this.entry.customer = this.entry.customer || {}

	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

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
				const serArea = (_data) => {
					for (let i = 1, ii = 14; i < ii; ++i) {
						_data['area' + i] = ''
					}
					return _data
				}
				const newData = (_data) => {
					const type = _data.type
					if (_data.sizes) {
						for (let i = 0, ii = _data.sizes.length; i < ii; ++i) {
							let new_data = {}
							if (i === 0) {
								new_data.name = _data.name
								if (_data.service_name) new_data.name = new_data.name + ' / ' + _data.service_name
							}
							new_data.size = _data.sizes[i].size || '-'
							new_data.weight = _data.sizes[i].weight || '-'
							new_data = serArea(new_data)
							this['shipmentServiceListType' + type].push(new_data)
						}
					} else {
						let new_data = {}
						if (_data.service_name) new_data.name = _data.name + ' / ' + _data.service_name
						new_data.size = '-'
						new_data.weight = '-'
						new_data = serArea(new_data)
						this['shipmentServiceListType' + type].push(new_data)
					}
				}
				const list = response.data.feed.entry
				for (let i = 0, ii = list.length; i < ii; ++i) {
					newData(list[i].shipment_service)
				}
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}

	changeShipmentServiceListType(_key, _item, _data, _rowindex) {
		this['shipmentServiceListType' + _key][_rowindex][_item] = _data
		this.forceUpdate()
	}

	addNotes() {
		this.notes.push({content: ''})
		this.forceUpdate()
	}

	changeNotes(_data, _rowindex) {
		this.notes[_rowindex] = {content: _data}
		this.forceUpdate()
	}

	removeNotes(_data, _index) {
		let array = []
		for (let i = 0, ii = this.notes.length; i < ii; ++i) {
			if (i !== _index) array.push(this.notes[i])
		}
		this.notes = array
		this.forceUpdate()
	}

	render() {

		return (
			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">
					<Panel collapsible header="顧客情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						<CommonInputText
							controlLabel="顧客コード"
							name="customer.customer_code"
							type="text"
							placeholder="顧客コード"
							value={this.entry.customer.customer_code}
						/>

						<CommonFilterBox
							controlLabel="顧客名"
							name="customer.customer_name"
							value={this.entry.customer.customer_name}
							options={[{
								label: '顧客A',
								value: '00001'
							}, {
								label: '顧客B',
								value: '00002'
							}]}
						/>

					</Panel>
					<Panel collapsible header="配送料" eventKey="2" bsStyle="info" defaultExpanded="true">
						
						<PageHeader>発払い</PageHeader>
						<CommonTable
							name=""
							data={this.shipmentServiceListType1}
							header={[{
								field: 'name', title: '配送業者', width: '150px'
							}, {
								field: 'size', title: 'サイズ', width: '70px'
							}, {
								field: 'weight', title: '重量', width: '50px'
							}, {
								field: 'area1', title: '南九州', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area1', data, rowindex)}
								}
							}, {
								field: 'area2', title: '北九州', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area2', data, rowindex)}
								}
							}, {
								field: 'area3', title: '四国', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area3', data, rowindex)}
								}
							}, {
								field: 'area4', title: '中国', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area4', data, rowindex)}
								}
							}, {
								field: 'area5', title: '関西', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area5', data, rowindex)}
								}
							}, {
								field: 'area6', title: '北陸', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area6', data, rowindex)}
								}
							}, {
								field: 'area7', title: '東海', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area7', data, rowindex)}
								}
							}, {
								field: 'area8', title: '信越', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area8', data, rowindex)}
								}
							}, {
								field: 'area9', title: '関東', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area9', data, rowindex)}
								}
							}, {
								field: 'area10', title: '南東北', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area10', data, rowindex)}
								}
							}, {
								field: 'area11', title: '北東北', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area11', data, rowindex)}
								}
							}, {
								field: 'area12', title: '北海道', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area12', data, rowindex)}
								}
							}, {
								field: 'area13', title: '沖縄', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('1', 'area13', data, rowindex)}
								}
							}]}
						/>

						<hr />

						<PageHeader>メール便</PageHeader>
						<CommonTable
							name=""
							data={this.shipmentServiceListType2}
							header={[{
								field: 'name', title: '配送業者', width: '150px'
							}, {
								field: 'size', title: 'サイズ', width: '70px'
							}, {
								field: 'weight', title: '重量', width: '60px'
							}, {
								field: 'area1', title: '配送料', width: '40px',
								input: {
									onChange: (data, rowindex)=>{this.changeShipmentServiceListType('2', 'area1', data, rowindex)}
								}
							}, {
								field: 'other', title: '', width: '650px'
							}]}
						/>

						<hr />

						<PageHeader>記事</PageHeader>
						<CommonTable
							name=""
							data={this.notes}
							header={[{
								field: 'content', title: '内容', width: '1000px',
								input: {
									onChange: (data, rowindex)=>{this.changeNotes(data, rowindex)}
								}
							}]}
							add={()=>this.addNotes()}
							remove={(data, i)=>this.removeNotes(data, i)}
						/>
					
					</Panel>
				        
				</PanelGroup>
			
			</Form>
		)
	}
}
