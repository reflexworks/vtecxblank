/* @flow */
import React from 'react'
import type {
	Props,
} from 'demo3.types'

import {
	Form,
} from 'react-bootstrap'

import {
	CommonModal,
	CommonInputText,
	CommonTable,
	CommonFilterBox
} from './common'

import BilltoForm from './billto-form'
import StaffForm from './staff-form'

export class BilltoAddModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow
		}
		this.formName = 'BilltoAddModal'
		this.url = '/d/billto'
		this.entry = {
			billto: {},
			contact_information: {}
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
			<CommonModal isShow={this.state.isShow} title="請求先新規登録"
				closeBtn={() => this.close()} size="lg"
				addAxiosBtn={{
					url: this.url,
					callback: (data) => this.props.add(data)
				}}
				fromName={this.formName}
			>
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
			<CommonModal isShow={this.state.isShow} title="請求先情報編集"
				closeBtn={() => this.close()}
				editAxiosBtn={{
					url: this.url,
					callback: (data) => this.props.edit(data),
					entry: this.entry
				}}
				fromName={this.formName}
				size="lg">
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

	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.zone = newProps.data || {}
		this.zone.pref_codes = this.zone.pref_codes || []
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

	addList(_data) {
		this.zone.pref_codes.push(_data)
		this.forceUpdate()
	}
	removeList(_index) {
		let array = []
		for (let i = 0, ii = this.zone.pref_codes.length; i < ii; ++i) {
			if (i !== _index) array.push(this.zone.pref_codes[i])
		}
		this.zone.pref_codes = array
		this.forceUpdate()
	}
	change(_data, _rowindex) {
		this.zone.pref_codes[_rowindex].pref_code = _data
		this.forceUpdate()
	}

	close() {
		this.props.close()
	}

	edit(_obj) {
		this.props.edit(_obj)
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title="地域帯編集" closeBtn={() => this.close()}
				editBtn={(obj) => this.edit(obj)}
				size="lg"
				height="320px"
			>
				<Form name="ZoneModal" horizontal>

					<CommonInputText
						controlLabel="地域帯名称"
						name="zone_name"
						type="text"
						value={this.zone.zone_name}
						readonly
					/>

					<CommonTable
						controlLabel="所属する都道府県"
						name="pref_codes"
						data={this.zone.pref_codes}
						header={[{
							field: 'pref_code', title: '内容', 
							input: {
								onChange: (data, rowindex)=>{this.change(data, rowindex)}
							}
						}]}
						add={() => this.addList({ pref_code: ''})}
						remove={(data, index) => this.removeList(index)}
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
