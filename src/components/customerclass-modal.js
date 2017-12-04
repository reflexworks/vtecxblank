/* @flow */
import React from 'react'
import {
	Form
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
		if (newProps.data.delivery_company === 'ヤマト' || newProps.data.delivery_company === 'YN') {
			this.delivery_company = 'YN'
		} else if (newProps.data.delivery_company === '西濃' || newProps.data.delivery_company === 'SN') {
			this.delivery_company = 'SN'
		} else if(newProps.data.delivery_company === 'エコ配JP' || newProps.data.delivery_company === 'EC'){
			this.delivery_company = 'EC'
		} else {
			this.delivery_company = ''
		}
		this.classcode = newProps.data.classcode
		this.forceUpdate()
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
		this.props.add(_obj)
	}

	edit(_obj) {
		this.props.edit(_obj)
	}

	render() {

		return (


			<CommonModal isShow={this.state.isShow} title={this.getTitle()} closeBtn={() => this.close()}
				addBtn={this.state.type === 'add' ? (obj) => this.add(obj) : false}
				editBtn={this.state.type === 'edit' ? (obj) => this.edit(obj) : false}
				height="180px"
			>
				<Form name="CustomerClassModal" horizontal>
					<CommonFilterBox
						controlLabel="配送業者"
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
				</Form>
			</CommonModal>
		)
	}
}