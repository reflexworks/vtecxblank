/* @flow */
import React from 'react'
import {
	PageHeader,
	Form,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonTable, CommonInputText,
} from './common'

export default class DeliveryChargeTemplateForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry || {}

		this.init()
	}

	init() {
		// データキャッシュ
		this.shipment_service = {}
		// 発払い
		this.shipmentServiceListType1 = []
		// メール便
		this.shipmentServiceListType2 = []
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
		this.setTable()
	}

	/**
	 * 配送料テーブル作成処理
	 */
	setTable() {

		this.init()

		if (this.entry.delivery_charge) {

			let header = {}
			const initHeader = () => {
				return [{
					field: 'name', title: '配送業者', width: '200px'
				}, {
					field: 'size', title: 'サイズ', width: '80px'
				}, {
					field: 'weight', title: '重量', width: '80px'
				}]
			}
			const setZone = (_data, _entry, _tableIndex, _code) => {
				let _header = initHeader()
				for (let i = 0, ii = _entry.length; i < ii; ++i) {
					const key = _entry[i].zone_code
					_data[key] = _entry[i].price
					_header.push({
						field: key, title: _entry[i].zone_name, width: '60px',
						entitiykey: 'delivery_charge['+ _tableIndex +'].delivery_charge_details{}.charge_by_zone['+ i +'].price',
						input: {
							onChange: (data, rowindex)=>{this.changeShipmentServiceListType(_code, key, data, rowindex)}
						}
					})
				}
				if (!header[_code]) header[_code] = _header
				return _data
			}
			let tableIndex = 0
			const newData = (_delivery_charge) => {
				const s_code = _delivery_charge.shipment_service_code
				const s_type = _delivery_charge.shipment_service_type
				let s_name = _delivery_charge.shipment_service_name
				if (_delivery_charge.service_name) {
					s_name = s_name + ' / ' + _delivery_charge.service_name
				}

				this.shipment_service[s_code] = []
				for (let dd of _delivery_charge.delivery_charge_details) {

					let new_data = {}
					new_data.name = s_name
					new_data.size = dd.size || '-'
					new_data.weight = dd.weight || '-'
					new_data.price = dd.price || ''
					if (dd.charge_by_zone) {
						new_data = setZone(new_data, dd.charge_by_zone, tableIndex, s_code)
					}
					this.shipment_service[s_code].push(new_data)
					s_name = ''

				}
				if (s_type === '1') {
					// 発払い
					this.shipmentServiceListType1.push(
						<CommonTable
							name=""
							data={this.shipment_service[s_code]}
							header={header[s_code]}
						/>
					)
				} else {
					// メール便
					let _header = initHeader()
					_header.push({
						field: 'price', title: '配送料', width: '60px',
						entitiykey: 'delivery_charge['+ tableIndex +'].delivery_charge_details{}.price',
						input: {
							onChange: (data, rowindex)=>{this.changeShipmentServiceListType(s_code, 'price', data, rowindex)}
						}
					})
					_header.push({
						field: 'other', title: '', width: '600px'
					})
					this.shipmentServiceListType2.push(
						<CommonTable
							name=""
							data={this.shipment_service[s_code]}
							header={_header}
						/>
					)
				}

			}
			const list = this.entry.delivery_charge
			for (let i = 0, ii = list.length; i < ii; ++i) {
				newData(list[i])
				tableIndex++
			}
			this.forceUpdate()
		}

	}

	changeShipmentServiceListType(_key, _item, _data, _rowindex) {
		this.shipment_service[_key][_rowindex][_item] = _data
		this.forceUpdate()
	}

	addNotes() {
		this.entry.remarks.push({content: ''})
		this.forceUpdate()
	}

	changeNotes(_data, _rowindex) {
		this.entry.remarks[_rowindex] = {content: _data}
		this.forceUpdate()
	}

	removeNotes(_data, _index) {
		let array = []
		for (let i = 0, ii = this.entry.remarks.length; i < ii; ++i) {
			if (i !== _index) array.push(this.entry.remarks[i])
		}
		this.entry.remarks = array
		this.forceUpdate()
	}

	render() {

		return (
			<Form className="shipment_service_table" name={this.props.name} horizontal data-submit-form>

				<CommonInputText
					controlLabel="テンプレート名"
					name="title"
					type="text"
					placeholder=""
					value={this.entry.title}
					entitiykey="title"
				/>
				<hr />
				
				<PageHeader>発払い</PageHeader>
				<div>
					{this.shipmentServiceListType1}
				</div>

				<hr />

				<PageHeader>メール便</PageHeader>
				<div>
					{this.shipmentServiceListType2}
				</div>

				<hr />

				<PageHeader>記事</PageHeader>
				<CommonTable
					name=""
					data={this.entry.remarks}
					header={[{
						field: 'content', title: '内容', width: '1000px',
						entitiykey:'remarks{}.content',
						input: {
							onChange: (data, rowindex)=>{this.changeNotes(data, rowindex)}
						}
					}]}
					add={()=>this.addNotes()}
					remove={(data, i)=>this.removeNotes(data, i)}
				/>

			</Form>
		)
	}
}
