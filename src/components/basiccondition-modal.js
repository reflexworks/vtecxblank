/* @flow */

import React from 'react'
import {
	Form,
	Row,
	//Button,
	//Glyphicon,
} from 'react-bootstrap'
import type {
	Props,
} from 'demo3.types'
import {
	CommonInputText,
	CommonModal,
} from './common'

/**
 *  basiccondition-form.jsのbasic用のモーダル
 */
export class BasicModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
			
			row: [1],
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
		this.setState({isShow: false})
	}

	close() {
		this.props.callbackClose()
	}

	render() {

		return (
				
			<CommonModal isShow={this.state.isShow} addBtn={(obj) => this.add(obj)}
							 title="基本条件登録" closeBtn={() => this.close()}>
				<Form horizontal name="BasicModal">
					<Row>
						<CommonInputText
							controlLabel="条件"
							name="content"
							type="text"
							placeholder="内容"
							size='lg'
						/>

					</Row>
				</Form>
			</CommonModal>
		)
	}
}