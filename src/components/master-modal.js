/* @flow */
import React from 'react'
import type {
	Props,
} from 'demo3.types'
import {
	CommonModal
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
