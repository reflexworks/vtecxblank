/* @flow */
import React from 'react'
import {
	Form,
	FormGroup,
	FormControl,
	PanelGroup,
	Panel,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonPrefecture,
	CommonInputText,
//	CommonSelectBox
} from './common'

export default class CustomerForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.customer = this.entry.customer || {}
		this.entry.account_info = this.entry.account_info ||  {}

	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="顧客情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						{/* 登録の場合 */}
						{!this.entry.customer.customer_code &&
							<FormGroup className="hide">
								<FormControl name="customer.customer_code" type="text" value="${_addids}" />
								<FormControl name="link" data-rel="self" type="text" value="/customer/${_addids}" />
							</FormGroup>
						}

						{/* 更新の場合 */}
						{this.entry.customer.customer_code &&
							<CommonInputText
								controlLabel="顧客コード"
								name="customer.customer_code"
								type="text"
								placeholder="顧客コード"
								value={this.entry.customer.customer_code}
								readonly="true"
							/>
						}

						<CommonInputText
							controlLabel="顧客名"
							name="customer.customer_name"
							type="text"
							placeholder="株式会社 ◯◯◯"
							value={this.entry.customer.customer_name}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="顧客名(カナ)"
							name="customer.customer_name_kana"
							type="text"
							placeholder="カブシキガイシャ ◯◯◯"
							value={this.entry.customer.customer_name_kana}
							validate="number"
							required
						/>

						<CommonInputText
							controlLabel="電話番号"
							name="customer.customer_tel"
							type="text"
							placeholder="090-1234-5678"
							value={this.entry.customer.customer_tel}
							size="sm"
						/>

						<CommonInputText
							controlLabel="FAX"
							name="customer.customer_fax"
							type="text"
							placeholder="090-1234-5678"
							value={this.entry.customer.customer_fax}
							size="sm"
						/>
						
						<CommonInputText
							controlLabel="メールアドレス"
							name="customer.customer_email"
							type="email"
							placeholder="logioffice@gmail.com"
							value={this.entry.customer.customer_email}
						/>

						<CommonInputText
							controlLabel="郵便番号"
							name="customer.zip_code"
							type="text"
							placeholder="123-4567"
							value={this.entry.customer.zip_code}
							size="sm"
						/>

						<CommonPrefecture
							controlLabel="都道府県"
							componentClass="select"
							name="customer.prefecture"
							value={this.entry.customer.prefecture}
							size="sm"
						/>

						<CommonInputText
							controlLabel="市区郡長村"
							name="customer.address1"
							type="text"
							placeholder="◯◯市××町"
							value={this.entry.customer.address1}
						/>

						<CommonInputText
							controlLabel="番地"
							name="customer.address2"
							type="text"
							placeholder="1丁目2番地 ◯◯ビル1階"
							value={this.entry.customer.address2}
						/>
					
					</Panel>

					<Panel collapsible header="担当情報" eventKey="2" bsStyle="info" defaultExpanded="true">

						<CommonInputText
							controlLabel="担当者"
							name="customer.customer_staff"
							type="text"
							placeholder="担当者"
							value={this.entry.customer.customer_staff}
						/>

					</Panel>

				</PanelGroup>

			</Form>
		)
	}
}
