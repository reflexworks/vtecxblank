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
	CommonInputText,
	CommonFilterBox,
	CommonEntry
} from './common'

export default class DeliveryChargeTemplateForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry || {}
		this.entry.title = ''

		this.isCreate = true

		this.init()
	}

	init() {
		// データキャッシュ
		this.shipment_service = {}
		// 宅配便
		this.shipmentServiceListType1 = []
		// メール便
		this.shipmentServiceListType2 = []
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry || {}
		if (newProps.entry) {
			this.entry.title = this.entry.title || ''
			this.isCreate = false
			this.setTable()
		}
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {
		this.getShipmentServiceList()
	}

	/**
	 * 配送業者一覧取得処理
	 */
	getShipmentServiceList() {

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
				this.shipmentServiceList = []
				const getName = (_shipment_service) => {
					let name = _shipment_service.name
					if (_shipment_service.service_name && _shipment_service.service_name !== '') {
						name = name + ' / ' + _shipment_service.service_name
					}
					return name
				}
				response.data.feed.entry.map((_value) => {
					this.shipmentServiceList.push({
						label: getName(_value.shipment_service),
						value: _value.shipment_service.code,
						data: _value
					})
				})

				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	changeShipmentServiceList(_data) {
		this.shipment_service_name = _data.value
		this.selectShipmentService = _data.data.shipment_service
		this.getDeliveryChargeTemplate()
	}

	/**
	 * 選択した配送業者のテンプレート取得処理
	 */
	getDeliveryChargeTemplate() {

		this.setState({ isDisabled: true })

		let option = '?name=' + this.selectShipmentService.name
		if (this.selectShipmentService.service_name && this.selectShipmentService.service_name !== '') {
			option = option + '&service_name=' + this.selectShipmentService.service_name
		}

		axios({
			url: '/s/deliverycharge-template' + option,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {

			this.setState({ isDisabled: false })

			if (response.status === 204) {
				alert('該当の配送業者が存在しません。')
			} else {
				if (this.entry.title) {
					response.data.feed.entry[0].title = this.entry.title
				}
				const obj = CommonEntry().init(Object.assign(this.entry, response.data.feed.entry[0]))
				this.entry = obj.feed.entry[0]
				this.setTable()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
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
							onChange: (data, rowindex)=>{this.changeShipmentServiceListType(_code, key, data, rowindex)},
							price: true
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
				if (_delivery_charge.shipment_service_service_name) {
					s_name = s_name + ' / ' + _delivery_charge.shipment_service_service_name
				}

				this.shipment_service[s_code] = []
				for (let dd of _delivery_charge.delivery_charge_details) {

					let new_data = {}
					new_data.name = s_name
					new_data.size = dd.size || '-'
					new_data.weight = dd.weight || '-'
					new_data.price = dd.price || ''
					new_data.note = dd.note || ''
					if (dd.charge_by_zone) {
						new_data = setZone(new_data, dd.charge_by_zone, tableIndex, s_code)
					}
					this.shipment_service[s_code].push(new_data)

				}
				const menu = () => {
					return (
						<h4 style={{ float: 'left', 'margin-right': '30px', 'line-height': '10px', 'padding-left': '5px' }}>{s_name}</h4>
					)
				}
				if (s_type === '1') {
					// 宅配便
					if (header[s_code]) {
						this.shipmentServiceListType1.push(
							<CommonTable
								name=""
								data={this.shipment_service[s_code]}
								header={header[s_code]}
							>
								{menu()}
							</CommonTable>
						)
					} else {
						this.shipmentServiceListType1.push(<div>地域帯が設定されていません。</div>)
					}
				} else {
					// メール便
					let _header = initHeader()
					_header.push({
						field: 'price', title: '配送料', width: '60px',
						entitiykey: 'delivery_charge['+ tableIndex +'].delivery_charge_details{}.price',
						input: {
							onChange: (data, rowindex)=>{this.changeShipmentServiceListType(s_code, 'price', data, rowindex)},
							price: true
						}
					})
					_header.push({
						field: 'note', title: '記事', width: '100px',
						entitiykey: 'delivery_charge['+ tableIndex +'].delivery_charge_details{}.note',
						input: {
							onChange: (data, rowindex)=>{this.changeShipmentServiceListType(s_code, 'note', data, rowindex)}
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
							{menu()}
						</CommonTable>	
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

	changeTitle(_data) {
		this.entry.title = _data
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
					onChange={(data) => this.changeTitle(data)}
					entitiykey="title"
				/>

				{this.isCreate && 
					<CommonFilterBox
						controlLabel="配送業者選択"
						name=""
						value={this.shipment_service_name}
						options={this.shipmentServiceList}
						onChange={(data) => this.changeShipmentServiceList(data)}
					/>
				}

				<hr />
				
				{(this.shipmentServiceListType1.length ? true : false) && 
					<div>
						<PageHeader>宅配便</PageHeader>
						<div>
							{this.shipmentServiceListType1}
						</div>
					</div>
				}

				{(this.shipmentServiceListType2.length ? true : false) && 
					<div>
						<PageHeader>メール便</PageHeader>
						<div>
							{this.shipmentServiceListType2}
						</div>
					</div>
				}

			</Form>
		)
	}
}
