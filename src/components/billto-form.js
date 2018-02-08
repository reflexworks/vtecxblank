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
	CommonInputText,
	CommonPrefecture,
	CommonDatePicker,
	CommonRadioBtn,
} from './common'

export default class BilltoForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.billto = this.entry.billto || {}
		this.entry.contact_information = this.entry.contact_information || {}

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

					<Panel collapsible header="請求先情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						{/* 登録の場合 */}
						{!this.entry.billto.billto_code &&
							<FormGroup className="hide">
								<FormControl name="billto.billto_code" type="text" value="${_addids}" />
								<FormControl name="link" data-rel="self" type="text" value="/billto/${_addids}" />
							</FormGroup>
						}

						{/* 更新の場合 */}
						{this.entry.billto.billto_code &&
							<CommonInputText
								controlLabel="請求先コード"
								name="billto.billto_code"
								type="text"
								placeholder="請求先コード"
								value={this.entry.billto.billto_code}
								readonly="true"
							/>
						}

						<CommonInputText
							controlLabel="請求先名"
							name="billto.billto_name"
							type="text"
							placeholder="請求先名"
							value={this.entry.billto.billto_name}
							validate="string"
							required
						/>

						<CommonRadioBtn
							controlLabel='請求締切日'	
							name="billto.billing_closing_date"
							checked={this.entry.billto.billing_closing_date}
							data={[{
								label: '月末',
								value: '0',
							}, {
								label: '20日締',
								value: '1',
							}]}
						/>

						<CommonDatePicker
							controlLabel="支払日"
							name="billto.payment_date"
							selected={this.entry.billto.payment_date}
							required
						/>

						<CommonRadioBtn
							controlLabel='日本郵政/請求明細表示'	
							name="billto.post_has_sizeweight"
							checked={this.entry.billto.post_has_sizeweight}
							data={[{
								label: 'サイズ・重量を区別する',
								value: '0',
							}, {
								label: '区別しない',
								value: '1',
							}]}
						/>

						<CommonRadioBtn
							controlLabel="ヤマト/請求明細表示"	
							name="billto.yamato_has_details"
							checked={this.entry.billto.yamato_has_details}
							data={[{
								label: '簡易',
								value: '0',
							}, {
								label: '詳細',
								value: '1',
							}]}
						/>

						<CommonInputText
							controlLabel="電話番号"
							name="contact_information.tel"
							type="text"
							placeholder="090-1234-5678"
							value={this.entry.contact_information.tel}
							size="sm"
						/>

						<CommonInputText
							controlLabel="FAX"
							name="contact_information.fax"
							type="text"
							placeholder="090-1234-5678"
							value={this.entry.contact_information.fax}
							size="sm"
						/>
						
						<CommonInputText
							controlLabel="メールアドレス"
							name="contact_information.email"
							type="email"
							placeholder="logioffice@gmail.com"
							value={this.entry.contact_information.email}
						/>

						<CommonInputText
							controlLabel="郵便番号"
							name="contact_information.zip_code"
							type="text"
							placeholder="123-4567"
							value={this.entry.contact_information.zip_code}
							size="sm"
						/>

						<CommonPrefecture
							controlLabel="都道府県"
							componentClass="select"
							name="contact_information.prefecture"
							value={this.entry.contact_information.prefecture}
						/>

						<CommonInputText
							controlLabel="市区郡町村"
							name="contact_information.address1"
							type="text"
							placeholder="◯◯市××町"
							value={this.entry.contact_information.address1}
						/>

						<CommonInputText
							controlLabel="番地"
							name="contact_information.address2"
							type="text"
							placeholder="1丁目2番地 ◯◯ビル1階"
							value={this.entry.contact_information.address2}
							size="lg"
						/>
					
					</Panel>	
				</PanelGroup>		
			</Form>
		)
	}
}