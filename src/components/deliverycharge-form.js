/* @flow */
import React from 'react'
import axios from 'axios'
import {
	PageHeader,
	Form,
	Button,
	Glyphicon,
	Alert
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
		this.template = {}
		this.templateList = {}

		this.masterShipmentService = null

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
		this.entry = newProps.entry
		if (this.entry.customer.customer_code) {
			this.setTemplateList(newProps.templateList)
			this.setTable()
			this.setMasterList()
		}
	}

	setMasterList() {

		this.setState({ isDisabled: true })

		axios({
			url: '/s/get-shipment-service-to-deliverycharge',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {

			this.masterShipmentService = []
			response.data.feed.entry[0].delivery_charge.map((_obj) => {
				const type = _obj.shipment_service_type === '1' ? '宅配便' : 'メール便'
				let name = _obj.shipment_service_name
				if (_obj.shipment_service_service_name) {
					name = name + ' / ' + _obj.shipment_service_service_name
				}
				const option = {
					label: '【 ' + type + ' 】' + name,
					value: _obj.shipment_service_code,
					data: _obj
				}
				this.masterShipmentService.push(option)
			})
			this.setState({ isDisabled: false })

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	addTemplate(_data) {
		if (_data) {
			const code = _data.value
			this.isAdd = true
			if (!this.shipment_service[code]) {
				this.entry.delivery_charge.push(_data.data)
				this.addStatus = 'info'
				this.addMesseage = _data.label + 'を追加しました。'
				this.setTable()
			} else {
				this.addStatus = 'danger'
				this.addMesseage = _data.label + 'は存在します。'
				this.forceUpdate()
			}
		} else {
			this.isAdd = false
			this.forceUpdate()
		}
	}

	setTemplateList(_templateList) {
		if (_templateList) {
			const getOption = (_obj) => {
				return {
					label: _obj.title,
					value: _obj.title,
					data: _obj
				}
			}
			_templateList.map((_obj) => {
				const shipment_service = _obj.shipment_service
				if (shipment_service) {
					const flg = this.templateList[shipment_service.code]
					if (!flg || flg.length === 0) {
						this.templateList[shipment_service.code] = []
					}
					this.templateList[shipment_service.code].push(getOption(_obj))
				}
			})

			this.forceUpdate()
		}
	}

	/**
	 * テンプレート変更処理
	 */
	changeTemplate(_data) {

		if (_data) {
			const shipment_service_code = _data.data.shipment_service.code
			const setTemplate = () => {
				for (let i = 0, ii = this.entry.delivery_charge.length; i < ii; ++i) {
					const delivery_charge = this.entry.delivery_charge[i]
					if (delivery_charge.shipment_service_code === shipment_service_code) {
						this.entry.delivery_charge[i] = JSON.parse(JSON.stringify(_data.data.delivery_charge[0]))
						break
					}
				}
				this.setTable()
				CommonEntry().init(this.entry)
				this.forceUpdate()
			}
			if (confirm('入力したものが破棄されます。よろしいでしょうか？')) {
				this.template[shipment_service_code] = _data.data.title
				setTemplate()
			} else {
				this.template[shipment_service_code] = ''
				this.forceUpdate()
			}
		}
	}

	/**
	 * 配送業者削除処理
	 * @param {*} _code 
	 */
	removeDeliveryCharge(_code) {
		const name = this.shipment_service[_code][0].name
		const remove = () => {
			let array = []
			for (let i = 0, ii = this.entry.delivery_charge.length; i < ii; ++i) {
				const delivery_charge = this.entry.delivery_charge[i]
				if (delivery_charge.shipment_service_code !== _code) {
					array.push(JSON.parse(JSON.stringify(this.entry.delivery_charge[i])))
				}
			}
			this.entry.delivery_charge = array
			this.setTable()
			CommonEntry().init(this.entry)
			this.forceUpdate()
		}
		if (confirm(name + 'を削除します。よろしいでしょうか？')) {
			remove()
		}
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

					let zone_name = _entry[i].zone_name
					_data[key] = _entry[i].price

					_header.push({
						field: key, title: zone_name, width: '60px',
						entitiykey: 'delivery_charge['+ _tableIndex +'].delivery_charge_details{}.charge_by_zone['+ i +'].price',
						input: {
							onChange: (data, rowindex) => { this.changeShipmentServiceListType(_code, key, data, rowindex) },
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
					if (!this.templateList[s_code] || this.templateList[s_code].length === 0) {
						this.templateList[s_code] = []
					}
					this.template[s_code] = ''

				}
				const menu = () => {
					return (
						<div>
							<h4 style={{ float: 'left', 'margin-right': '30px', 'line-height': '10px', 'padding-left': '5px', width: '30%' }}>{s_name}</h4>
							<Button
								bsSize="small"
								bsStyle="danger"
								style={{ float: 'left', 'margin-right': '10px' }}
								onClick={()=>this.removeDeliveryCharge(s_code)}
							><Glyphicon glyph="remove" /></Button>
							<CommonFilterBox
								placeholder="テンプレート選択"
								name=""
								value={this.template[s_code]}
								options={this.templateList[s_code]}
								onChange={(data) => this.changeTemplate(data)}
								style={{float: 'left', width: '200px'}}
								table
							/>
						</div>
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
						this.shipmentServiceListType1.push(
							<div>
								<h4 style={{ float: 'left', 'margin-right': '30px', 'line-height': '10px', 'padding-left': '5px' }}>{s_name}</h4>
								<Button
									bsSize="small"
									bsStyle="danger"
									style={{ float: 'left', 'margin-right': '10px' }}
									onClick={()=>this.removeDeliveryCharge(s_code)}
								><Glyphicon glyph="remove" /></Button>
								<div style={{clear: 'both'}}>地域帯が設定されていません。</div>
							</div>
						)
					}
					this.shipmentServiceListType1.push(<hr />)
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
						field: 'other', title: '', width: '400px'
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

	render() {

		return (
			<Form className="shipment_service_table" name={this.props.name} horizontal data-submit-form>

				<CommonFilterBox
					controlLabel="配送業者追加"
					name=""
					value=""
					options={this.masterShipmentService}
					onChange={(data) => this.addTemplate(data)}
				/>
				{this.isAdd &&
					<Alert bsStyle={this.addStatus}>
						{this.addMesseage}
					</Alert>
				}

				<hr />

				<PageHeader>宅配便</PageHeader>
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
