/* @flow */
import React from 'react'
import axios from 'axios'
import {
	PageHeader,
	Form,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonTable,
	CommonFilterBox,
	CommonEntry
} from './common'

export default class DeliveryChargeForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry || {}

		this.master = {}
		this.templateList = []

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
			const setOldNew = (_old, _new, _isCreate) => {
				let array = []
				const mes = _isCreate ? '[追加]' : '[変更]'
				if (_old) array.push(<div className="old">[削除] <span>{_old}</span></div>)
				if (_new) array.push(<div className="new">{mes} {_new}</div>)
				return (
					<div>{array}</div>
				)
			}
			const setDisabled = (_value) => {
				return <div className="disabled">{_value}</div>
			}
			const setZone = (_data, _entry, _tableIndex, _code, _is_disable) => {
				let _header = initHeader()
				const is_disable = _is_disable ? true : false
				for (let i = 0, ii = _entry.length; i < ii; ++i) {

					let is_zone_disable = is_disable ? true : false
					const key = _entry[i].zone_code

					let zone_name = _entry[i].zone_name
					if (_entry[i].zone_name_old) {
						zone_name = setOldNew(_entry[i].zone_name_old, zone_name)
					}
					if (_entry[i].is_zone === '1') {
						zone_name = setOldNew(zone_name)
						is_zone_disable = true
					} else {
						is_zone_disable = is_disable ? true : false
					}
					if (_entry[i].is_zone === '2') {
						zone_name = setOldNew(null, zone_name, true)
					}

					if (is_zone_disable === true) {
						_data[key] = setDisabled(_entry[i].price)
					} else {
						_data[key] = _entry[i].price
					}

					_header.push({
						field: key, title: zone_name, width: '60px',
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

				const is_shipment_service = _delivery_charge.is_shipment_service
				const s_code = _delivery_charge.shipment_service_code
				const s_type = _delivery_charge.shipment_service_type

				let s_name = _delivery_charge.shipment_service_name
				let is_shipment_disable = is_shipment_service === '1' ? true : false

				if (_delivery_charge.shipment_service_service_name) {
					s_name = s_name + ' / ' + _delivery_charge.shipment_service_service_name
				}

				if (is_shipment_disable) {
					// 配送業者がマスタから削除されている場合
					s_name = setOldNew(s_name)
				} else if (is_shipment_service === '2') {
					// 配送業者がマスタから新規追加されている場合
					s_name = setOldNew(null, s_name, true)
				} else {
					// 配送業者のマスタ情報が変更されている場合
					if (_delivery_charge.shipment_service_name_old) {
						s_name = setOldNew(_delivery_charge.shipment_service_name_old, s_name)
					}
					if (_delivery_charge.service_name_old || _delivery_charge.service_name_old === '') {
						let ssn = _delivery_charge.shipment_service_service_name
						if (_delivery_charge.shipment_service_name_old) {
							ssn = _delivery_charge.shipment_service_name_old
						}
						let sn
						if (_delivery_charge.service_name_old === '') {
							sn = ssn
						} else {
							sn = ssn + ' / ' + _delivery_charge.service_name_old
						}
						s_name = setOldNew(sn, s_name)
					}
				}

				this.shipment_service[s_code] = []
				for (let dd of _delivery_charge.delivery_charge_details) {

					let is_size_disable = is_shipment_disable ? true : false

					let new_data = {}
					new_data.name = s_name
					new_data.size = dd.size || '-'
					new_data.weight = dd.weight || '-'
					if (dd.is_sizes === '1') {
						new_data.size = setOldNew(new_data.size)
						new_data.weight = setOldNew(new_data.weight)
						is_size_disable = true
					} else {
						is_size_disable = is_shipment_disable ? true : false
					}
					if (dd.is_sizes === '2') {
						new_data.size = setOldNew(null, new_data.size, true)
						new_data.weight = setOldNew(null, new_data.weight, true)
					}
					if (is_size_disable) {
						new_data.price = setDisabled(dd.price)
					} else {
						new_data.price = dd.price || ''
					}
					if (dd.charge_by_zone) {
						const is_zone_disable = is_shipment_disable || is_size_disable ? true : false
						new_data = setZone(new_data, dd.charge_by_zone, tableIndex, s_code, is_zone_disable)
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
						>
							<CommonFilterBox
								placeholder="テンプレート選択"
								name=""
								value={this.template}
								options={this.templateList}
								onChange={(data) => this.changeTemplate(data)}
								style={{float: 'left', width: '200px'}}
								table
							/>
						</CommonTable>
					)
					this.shipmentServiceListType1.push(<hr />)
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
						>
							<CommonFilterBox
								placeholder="テンプレート選択"
								name=""
								value={this.template}
								options={this.templateList}
								onChange={(data) => this.changeTemplate(data)}
								style={{float: 'left', width: '200px'}}
								table
							/>
						</CommonTable>	
					)
					this.shipmentServiceListType2.push(<hr />)
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

	/**
	 * テンプレート変更処理
	 */
	changeTemplate(_data) {

		const setTemplate = (_code) => {

			this.setState({ isDisabled: true })

			axios({
				url: '/s/deliverycharge?template=' + _code,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				this.setState({ isDisabled: false })

				const delivery_charge = response.data.feed.entry[0].delivery_charge
				const remarks = response.data.feed.entry[0].remarks
				this.entry.delivery_charge = delivery_charge
				this.entry.remarks = remarks
				CommonEntry().init(this.entry)
				this.setTable()

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}
		if (_data) {
			if (confirm('入力したものが破棄されます。よろしいでしょうか？')) {
				this.template = _data.value
				const code = _data.data.id.split(',')[0].split('/deliverycharge_template/')[1]
				setTemplate(code)
			} else {
				this.template = null
				this.forceUpdate()
			}
		}
	}

	/**
	 * テンプレート取得処理
	 */
	setTemplateData() {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/deliverycharge_template?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.templateList = response.data.feed.entry
				this.templateList = this.master.templateList.map((obj) => {
					return {
						label: obj.title,
						value: obj.title,
						data: obj
					}
				})

				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setTemplateData()

	}

	render() {

		return (
			<Form className="shipment_service_table" name={this.props.name} horizontal data-submit-form>

				<PageHeader>発払い</PageHeader>
				<div>
					{this.shipmentServiceListType1}
				</div>

				<PageHeader>メール便</PageHeader>
				<div>
					{this.shipmentServiceListType2}
				</div>

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
