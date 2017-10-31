/* @flow */

import React from 'react'
import {
	FormGroup,
	Form,
	Row,
} from 'react-bootstrap'
import type {
	Props,
} from 'demo3.types'
import {
	CommonInputText,
	CommonModal,
} from './common'

/**
 *  work-forms.jsのstorage用のモーダル
 */
export class StorageModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
        
			content:'',
		}
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.setState({isShow: newProps.isShow})
	}

	/**
	* モーダルのフォームで入力した項目を登録
	*/
	add(obj) {
		this.props.callback(obj)
		this.setState({ isShow: false })
	}

	close() {
		this.props.callbackClose()
	}

	render() {

		return (
			<FormGroup>
				<CommonModal isShow={this.state.isShow} addBtn={(obj) => this.add(obj)}
							 title="保管内容登録" closeBtn={() => this.close()}>
					<Form horizontal>
						<Row>
							<CommonInputText
								controlLabel="保管内容"   
								name="content"
								type="text"
								placeholder="保管内容"
								size='lg'
							/>
						</Row>
					</Form>
				</CommonModal>
			</FormGroup>
		)
	}
}

/**
 *  work-forms.jsのpackage_handling用のモーダル
 */
export class Package_handlingModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
        
			content:'',
		}
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.setState({isShow: newProps.isShow})
	}

	/**
	* モーダルのフォームで入力した項目を登録
	*/
	add(obj) {
		this.props.callback(obj)
		this.setState({ isShow: false })
	}

	close() {
		this.props.callbackClose()
	}

	render() {

		return (
			<FormGroup>
				<CommonModal isShow={this.state.isShow} addBtn={(obj) => this.add(obj)}
							 title="荷役情報登録" closeBtn={() => this.close()}>
					<Form horizontal>
						<Row>
							<CommonInputText
								controlLabel="荷役"   
								name="content"
								type="text"
								placeholder="荷役"
								size='lg'
							/>
						</Row>
					</Form>
				</CommonModal>
			</FormGroup>
		)
	}
}

/**
 *  work-forms.jsのshipping_data用のモーダル
 */
export class Shipping_dataModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
        
			content:'',
		}
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.setState({isShow: newProps.isShow})
	}

	/**
	* モーダルのフォームで入力した項目を登録
	*/
	add(obj) {
		this.props.callback(obj)
		this.setState({ isShow: false })
	}

	close() {
		this.props.callbackClose()
	}

	render() {

		return (
			<FormGroup>
				<CommonModal isShow={this.state.isShow} addBtn={(obj) => this.add(obj)}
							 title="出荷データ登録" closeBtn={() => this.close()}>
					<Form horizontal>
						<Row>
							<CommonInputText
								controlLabel="出荷データ"   
								name="content"
								type="text"
								placeholder="出荷データ"
								size='lg'
							/>
						</Row>
					</Form>
				</CommonModal>
			</FormGroup>
		)
	}
}