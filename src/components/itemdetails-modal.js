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
 *  itemdetail-form.jsのitem用のモーダル
 */
export class ItemModal extends React.Component {
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
		console.log(obj)
	}

	close() {
		this.props.callbackClose()
	}

	render() {

		return (
			<FormGroup>
				<CommonModal isShow={this.state.isShow} addBtn={(obj) => this.add(obj)}
							 title="明細項目登録" closeBtn={() => this.close()}>
					<Form horizontal>
						<Row>
							<CommonInputText
								controlLabel="項目"   
								name="item_name"
								type="text"
								placeholder="項目"
								size='lg'
							/>
							
							<CommonInputText
								controlLabel="単位名称"   
								name="unit_name"
								type="text"
								placeholder="単位名称"
								size='lg'
							/>
							<CommonInputText
								controlLabel="単位"   
								name="unit"
								type="text"
								placeholder="単位"
								size='lg'
							/>
							<CommonInputText
								controlLabel="数量"   
								name="quantity"
								type="text"
								placeholder="数量"
								size='lg'
							/>
							<CommonInputText
								controlLabel="単価"   
								name="unit_price"
								type="text"
								placeholder="単価"
								size='lg'
							/>
							<CommonInputText
								controlLabel="備考"   
								name="remarks"
								type="text"
								placeholder="備考"
								size='lg'
							/>
							<CommonInputText
								controlLabel="課税対象"   
								name="is_taxation"
								type="text"
								placeholder="課税対象"
								size='lg'
							/>
						</Row>
					</Form>
				</CommonModal>
			</FormGroup>
		)
	}
}
