/* @flow */
import React from 'react'
import type {
	Props,
} from 'demo3.types'

import {
//Form,
} from 'react-bootstrap'

import {
	CommonModal,
	//CommonInputText,
	//CommonTable,
	//CommonFilterBox
} from './common'

import BillfromForm from './billfrom-form'

export class BillfromAddModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow
		}
		this.formName = 'BillfromAddModal'
		this.url = '/d/billfrom'
		this.entry = {
			billfrom: {},
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
			<CommonModal isShow={this.state.isShow} title="請求元新規登録"
						 closeBtn={() => this.close()} size="lg"
						 addAxiosBtn={{
						 	url: this.url,
						 	callback: (data) => this.props.add(data)
						 }}
						 fromName={this.formName}
						 height="1000px"
			>
				<BillfromForm name={this.formName} entry={this.entry} />
			</CommonModal>
		)
	}
}

export class BillfromEditModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
		}
		this.formName = 'billfromEditModalForm'
		this.url = '/d/billfrom'
		this.entry = this.props.data || {
			billfrom: {},
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
			<CommonModal isShow={this.state.isShow} title="請求元情報編集"
						 closeBtn={() => this.close()}
						 editAxiosBtn={{
						 url: this.url,
						 	callback: (data) => this.props.edit(data),
						 	entry: this.entry
						 }}
						 fromName={this.formName}
						 size="lg"
						 height="1000px">
				<BillfromForm name={this.formName} entry={this.entry} />
			</CommonModal>
		)
	}
}