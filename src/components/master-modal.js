/* @flow */
import React from 'react'
import type {
	Props,
} from 'demo3.types'

import {
	Form,
	Button,
} from 'react-bootstrap'

import {
	CommonModal,
	CommonInputText,
	CommonTable,
	CommonFilterBox
} from './common'

import BilltoForm from './billto-form'
import StaffForm from './staff-form'
import WarehouseForm from './warehouse-form'

export class BilltoAddModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
		}
		this.formName = 'BilltoAddModal'
		this.url = '/d/billto'
		this.entry = {
			billto: {},
			contact_information: {}
		}
		this.customerEntry = this.props.customerEntry
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.customerEntry = newProps.customerEntry
		this.setState({isShow: newProps.isShow})
	}

	copyCustomerToBillto() {
		console.log(this.customerEntry)
		this.entry.billto.billto_name = this.customerEntry.customer.customer_name
		this.entry.contact_information = this.customerEntry.contact_information
		this.forceUpdate()
	}
	close() {
		this.props.close()
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title="請求先新規登録"
						 closeBtn={() => this.close()} size="lg"
						 addAxiosBtn={{
								 url: this.url,
						 	callback: (data) => this.props.add(data)
						 }}
						 fromName={this.formName}
			>
				<Button onClick={()=>{this.copyCustomerToBillto()}}>
						顧客情報と同じ内容にする
				</Button>
				<br />
				<br/>
				<BilltoForm name={this.formName} entry={this.entry} />
			</CommonModal>
		)
	}
}

export class BilltoEditModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
		}
		this.formName = 'billtoEditModalForm'
		this.url = '/d/billto'
		this.entry = this.props.data || {
			billto: {},
			contact_information: {}
		}
		this.customer = this.props.customer
		this.contact_information = this.props.contact_information
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.data
		this.setState({ isShow: newProps.isShow })
	}

	copyCustomerToBillto() {
		console.log(this.customer)
		this.entry.billto.billto_name = this.customer.customer_name
		this.entry.contact_information = this.contact_information
		this.forceUpdate()
	}

	close() {
		this.props.close()
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title="請求先情報編集"
				closeBtn={() => this.close()}
				editAxiosBtn={{
					url: this.url,
					callback: (data) => this.props.edit(data),
					entry: this.entry
				}}
				fromName={this.formName}
				size="lg">
				<Button onClick={()=>{this.copyCustomerToBillto()}}>
						顧客情報と同じ連絡先にする
				</Button>
				<BilltoForm name={this.formName} entry={this.entry} />
			</CommonModal>
		)
	}
}

export class StaffAddModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow
		}
		this.formName = 'StaffAddModal'
		this.url = '/d/staff'
		this.entry = {
			staff: {}
		}
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.setState({isShow: newProps.isShow})
	}

	close() {
		this.props.close()
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title="担当者新規登録"
				closeBtn={() => this.close()} size="lg"
				addAxiosBtn={{
					url: this.url,
					callback: (data) => this.props.add(data)
				}}
				fromName={this.formName}
				height="410px"
			>
				<StaffForm name={this.formName} entry={this.entry} />
			</CommonModal>
		)
	}
}

export class StaffEditModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
		}
		this.formName = 'StaffEditModal'
		this.url = '/d/staff'
		this.entry = this.props.data || {
			staff: {}
		}
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.data
		this.setState({ isShow: newProps.isShow })
	}

	close() {
		this.props.close()
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title="担当者情報編集"
				closeBtn={() => this.close()}
				editAxiosBtn={{
					url: this.url,
					callback: (data) => this.props.edit(data),
					entry: this.entry
				}}
				fromName={this.formName}
				height="410px"
				size="lg">
				<StaffForm name={this.formName} entry={this.entry} />
			</CommonModal>
		)
	}
}

export class ZoneModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			isShow: this.props.isShow,
			type: this.props.type
		}
		this.zone = this.props.data || {}
		this.zone.pref_codes = this.zone.pref_codes || []
		this.zone.invoice_zones = this.zone.invoice_zones || []
		this.zoneIndex = 0
		this.setZoneCode()
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.zone = newProps.data || {}
		this.zone.pref_codes = this.zone.pref_codes || []
		this.zone.invoice_zones = this.zone.invoice_zones || []
		this.zoneIndex = newProps.index
		this.setZoneCode()
		this.setState({
			isShow: newProps.isShow,
			type: newProps.type
		})
	}

	setZoneCode() {
		this.zone_code = 'zone_' + this.zoneIndex
	}

	addList(_key, _data) {
		this.zone[_key].push(_data)
		this.forceUpdate()
	}
	removeList(_key, _index) {
		let array = []
		for (let i = 0, ii = this.zone[_key].length; i < ii; ++i) {
			if (i !== _index) array.push(this.zone[_key][i])
		}
		this.zone[_key] = array
		this.forceUpdate()
	}
	change(_parent, _key, _data, _rowindex) {
		this.zone[_parent][_rowindex][_key] = _data
		this.forceUpdate()
	}

	close() {
		this.props.close()
	}

	add(_obj) {
		this.props.add(_obj)
	}

	edit(_obj) {
		this.props.edit(_obj)
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title="地域帯編集" closeBtn={() => this.close()}
				addBtn={!this.props.data ? (obj) => this.add(obj) : false}
				editBtn={this.props.data ? (obj) => this.edit(obj) : false}
				size="lg"
				height="320px"
			>
				<Form name="ZoneModal" horizontal>

					<CommonInputText
						controlLabel="地域帯名称"
						name="zone_name"
						type="text"
						value={this.zone.zone_name}
					/>

					<div className="hide">
						<input type="text" name="zone_code" value={this.zone_code} />
					</div>

					<CommonTable
						controlLabel="請求地域帯"
						name="invoice_zones"
						data={this.zone.invoice_zones}
						header={[{
							field: 'invoice_zone', title: '名称', 
							input: {
								onChange: (data, rowindex)=>{this.change('invoice_zones','invoice_zone', data, rowindex)}
							}
						}]}
						add={() => this.addList('invoice_zones', { invoice_zone: ''})}
						remove={(data, index) => this.removeList('invoice_zones', index)}
						noneScroll
					/>

					<CommonTable
						controlLabel="所属する都道府県"
						name="pref_codes"
						data={this.zone.pref_codes}
						header={[{
							field: 'pref_code', title: '内容', 
							input: {
								onChange: (data, rowindex)=>{this.change('pref_codes', 'pref_code', data, rowindex)}
							}
						}]}
						add={() => this.addList('pref_codes', { pref_code: ''})}
						remove={(data, index) => this.removeList('pref_codes',index)}
						noneScroll
					/>

				</Form>
			</CommonModal>
		)
	}
}

export class ShipmentServiceSizeModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			isShow: this.props.isShow,
			type: this.props.type
		}
		this.sizes = this.props.data || {}
		this.sizeList = this.props.sizeList || null
		this.weightList = this.props.weightList || null

	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.sizes = newProps.data || {}
		this.sizeList = newProps.sizeList || null
		this.weightList = newProps.weightList || null
		this.setState({
			isShow: newProps.isShow,
			type: newProps.type
		})
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

	}

	change(_data, _key) {
		this.sizes[_key] = _data
		this.forceUpdate()
	}

	close() {
		this.props.close()
	}

	add(_obj) {
		this.props.add(_obj.sizes)
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title="サイズと重量の追加" closeBtn={() => this.close()}
				addBtn={(obj) => this.add(obj)}
				size="lg"
				height="320px"
			>
				<Form name="ShipmentServiceSizeModal" horizontal>

					<CommonFilterBox
						controlLabel="サイズ"
						size="sm"
						name="sizes.size"
						value={this.sizes.size}
						options={this.sizeList}
						onChange={(data)=>this.change(data, 'size')}
					/>

					<CommonFilterBox
						controlLabel="重量"
						size="sm"
						name="sizes.weight"
						value={this.sizes.weight}
						options={this.weightList}
						onChange={(data)=>this.change(data, 'weight')}
					/>

				</Form>
			</CommonModal>
		)
	}
}
export class WarehouseAddModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
		}
		this.formName = 'WarehouseAddModal'
		this.url = '/d/warehouse'
		this.entry = {
			warehouse: {}
		}
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.setState({isShow: newProps.isShow})
	}

	close() {
		this.props.close()
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title="倉庫新規登録"
						 closeBtn={() => this.close()} size="lg"
						 addAxiosBtn={{
								 url: this.url,
						 	callback: (data) => this.props.add(data)
						 }}
						 fromName={this.formName}
			>
				<WarehouseForm name={this.formName} entry={this.entry} />
			</CommonModal>
		)
	}
}

export class WarehouseEditModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
		}
		this.formName = 'WarehouseEditModal'
		this.url = '/d/warehouse'
		this.entry = this.props.data || {
			warehouse: {}
		}
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.data
		this.setState({ isShow: newProps.isShow })
	}

	close() {
		this.props.close()
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title="倉庫情報編集"
				closeBtn={() => this.close()}
				editAxiosBtn={{
					url: this.url,
					callback: (data) => this.props.edit(data),
					entry: this.entry
				}}
				fromName={this.formName}
				size="lg">
				<WarehouseForm name={this.formName} entry={this.entry} />
			</CommonModal>
		)
	}
}
