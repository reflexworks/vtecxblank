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
	CommonRadioBtn,
	CommonDatePicker,
	CommonPrefecture,
	CommonInputText,
	CommonSelectBox
} from './common'

export default class CustomerForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.customer = this.entry.customer || {}
		this.entry.account_info = this.entry.account_info ||  {}

		this.forceUpdate()
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
						{!this.entry.customer.customer_number &&
							<FormGroup className="hide">
								<FormControl name="customer.customer_number" type="text" value="${_addids}" />
								<FormControl name="link" data-rel="self" type="text" value="/customer/${_addids}" />
							</FormGroup>
						}

						{/* 更新の場合 */}
						{this.entry.customer.customer_number &&
							<CommonInputText
								controlLabel="顧客コード"
								name="customer.customer_number"
								type="text"
								placeholder="顧客コード"
								value={this.entry.customer.customer_number}
								readonly="true"
							/>
						}

						<CommonRadioBtn
							controlLabel="顧客区分"
							name="customer.corporate_type"
							checked={this.entry.customer.corporate_type}
							data={[{
								label: '個人',
								value: '1'
							}, {
								label: '法人',
								value: '2'
							}]}
						/>

						<CommonInputText
							controlLabel="顧客名(漢字)姓、名"
							name="customer.customer_name"
							type="text"
							placeholder="顧客名（漢字）姓、名"
							value={this.entry.customer.customer_name}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="顧客名（カナ）"
							name="customer.customer_name_kana"
							type="text"
							placeholder="顧客名（カナ）"
							value={this.entry.customer.customer_name_kana}
							validate="number"
							required
						/>

						<CommonInputText
							controlLabel="電話１"
							name="customer.customer_tel1"
							type="text"
							placeholder="電話１"
							value={this.entry.customer.customer_tel1}
							size="sm"
						/>

						<CommonInputText
							controlLabel="電話２"
							name="customer.customer_tel2"
							type="text"
							placeholder="電話２"
							value={this.entry.customer.customer_tel2}
							size="sm"
						/>
						
						<CommonInputText
							controlLabel="FAX"
							name="customer.customer_fax"
							type="text"
							placeholder="FAX"
							value={this.entry.customer.customer_fax}
							size="sm"
						/>
						
						<CommonInputText
							controlLabel="部署名"
							name="customer.department_name"
							type="text"
							placeholder="部署名"
							value={this.entry.customer.department_name}
							size="sm"
						/>

						<CommonInputText
							controlLabel="担当者"
							name="customer.customer_staff"
							type="text"
							placeholder="担当者"
							value={this.entry.customer.customer_staff}
						/>

						<CommonInputText
							controlLabel="担当社員"
							name="customer.person_in_charge"
							type="text"
							placeholder="担当社員"
							value={this.entry.customer.person_in_charge}
						/>
					
						<CommonInputText
							controlLabel="生年月日"
							name="customer.birthday_year"
							type="text"
							placeholder="年"
							value={this.entry.customer.birthday_year}
							size="sm"
						/>
						<CommonInputText
							controlLabel=""
							name="customer.birthday_month"
							type="text"
							placeholder="月"
							value={this.entry.customer.birthday_month}
							size="sm"
						/>
						<CommonInputText
							controlLabel=""
							name="customer.birthday_day"
							type="text"
							placeholder="日"
							value={this.entry.customer.birthday_day}
							size="sm"
						/>

						<CommonRadioBtn
							controlLabel="性別"
							name="customer.sex"
							checked={this.entry.customer.sex}
							data={[{
								label: '男',
								value: 'sex_man'
							}, {
								label: '女',
								value: 'sex_woman'
							}]}
						/>

						<CommonInputText
							controlLabel="メールアドレス１"
							name="customer.email_address1"
							type="email"
							placeholder="メールアドレス１"
							value={this.entry.customer.email_address1}
						/>

						<CommonInputText
							controlLabel="メールアドレス２"
							name="customer.email_address2"
							type="email"
							placeholder="メールアドレス２"
							value={this.entry.customer.email_address2}
						/>

						<CommonInputText
							controlLabel="郵便番号"
							name="customer.zip_code"
							type="text"
							placeholder="郵便番号"
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
							controlLabel="住所（市区町村）"
							name="customer.address1"
							type="text"
							placeholder="住所(市区町村)"
							value={this.entry.customer.address1}
						/>

						<CommonInputText
							controlLabel="建物名、部屋番号"
							name="customer.address2"
							type="text"
							placeholder="建物名、部屋番号"
							value={this.entry.customer.address2}
						/>
					
						<CommonInputText
							controlLabel="親顧客コード"
							name="customer.parent_customer_number"
							type="text"
							placeholder="親顧客コード"
							value={this.entry.customer.parent_customer_number}
						/>
						
					</Panel>
					
					<Panel collapsible header="請求情報" eventKey="2" bsStyle="info" defaultExpanded="true">
					
						<CommonDatePicker
							controlLabel="請求締日"
							selected={this.entry.account_info.billing_closing_date}
							name="account_info.billing_closing_date"
						/>

						<CommonDatePicker
							controlLabel="支払日"
							selected={this.entry.account_info.date_of_payment}
							name="account_info.date_of_payment"
						/>


						<CommonSelectBox
							controlLabel="支払月区分"
							size="sm"
							name="account_info.payment_month"
							value={this.entry.account_info.payment_month}
							options={[{
								label: '当月',
								value: '0'
							}, {
								label: '翌月',
								value: '1'
							}, {
								label: '翌々月',
								value: '2'
							}]}
						/>

						<CommonSelectBox
							controlLabel="支払方法"
							size="sm"
							name="account_info.payment_method"
							value={this.entry.account_info.payment_method}
							options={[{
								label: '集金',
								value: '2'
							}, {
								label: '振込',
								value: '3'
							}, {
								label: '分割払い',
								value: '4'
							}, {
								label: 'その他',
								value: '9'
							}]}
						/>

						<CommonInputText
							controlLabel="口座区分"
							name="account_info.account_class"
							type="text"
							placeholder="口座区分(1:管理)"
							value={this.entry.account_info.account_class}
						/>

						<CommonInputText
							controlLabel="店名＋口座番号"
							name="account_info.account_number"
							type="text"
							placeholder="店名＋口座番号"
							value={this.entry.account_info.account_number}
						/>
						
					</Panel>	
				</PanelGroup>		

			</Form>
		)
	}
}
