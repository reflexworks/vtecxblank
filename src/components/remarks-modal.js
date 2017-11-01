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
* work-forms.jsのstorage用のモーダル
*/
export class RemarksModal extends React.Component {
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
					title="備考登録" closeBtn={() => this.close()}>
					<Form horizontal>
						<Row>
							<CommonInputText
								controlLabel="内容"
								name="content"
								type="text"
								placeholder="内容"
								size='lg'
							/>
						</Row>
					</Form>
				</CommonModal>
			</FormGroup>
		)
	}
}
