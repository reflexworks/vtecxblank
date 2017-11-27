/* @flow */
import React from 'react'
import {
//Form
} from 'react-bootstrap'
import type {
	Props,
} from 'demo3.types'
import {
	CommonInputText,
	CommonModal,
	CommonFilterBox
} from './common'

export class CustomerClassModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			data: this.props.data || {},
			isShow: this.props.isShow,
			type: this.props.type
		}
		this.master = {
		}
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.setState({
			isShow: newProps.isShow,
			data: newProps.data || {},
			type: newProps.type
		})
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

	}

	getTitle() {
		return this.state.type === 'add' ? '分類コード追加' : '分類コード編集'
	}

	close() {
		this.props.close()
	}

	add(_obj) {
		this.props.add(_obj.customer_class)
	}

	edit(_obj) {
		this.props.edit(_obj.customer_class)
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title={this.getTitle()} closeBtn={() => this.close()}
				addBtn={this.state.type === 'add' ? (obj) => this.add(obj) : false}
				editBtn={this.state.type === 'edit' ? (obj) => this.edit(obj) : false}
				size="lg"
				height="500px"
			>

				<CommonFilterBox
					controlLabel="入力補完種別"
					size="sm"
					name="delivery_company"
					value={this.delivery_company}
					options={[{
						label: 'ヤマト',
						value: 'YN'
					}, {
						label: '西濃',
						value: 'SN'
					}, {
						label: 'エコ配JP',
						value: 'EC'
					}]}
				/>

				<CommonInputText
					controlLabel="分類コード"   
					name="classcode"
					type="text"
					value={this.classcode}
					placeholder="分類コード"
					size='lg'
				/>	

			</CommonModal>
		)
	}
}