/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form,
	//FormGroup,
	//FormControl,
	PanelGroup,
	Panel,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonTextArea,
	CommonFilterBox,
} from './common'

export default class InquiryForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.customer = this.entry.customer || {}
		this.entry.inquiry = this.entry.inquiry || {}

		this.master = {
			customerList: [],
		}
		this.forceUpdate()
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {
		this.setCustomerMasterData()
	}
	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	setCustomerMasterData() {
		this.setState({ isDisabled: true })
		axios({
			url: '/d/customer?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			
			if (response.status !== 204) {
				this.master.customerList = response.data.feed.entry
				this.customerList = this.master.customerList.map((obj) => {
					return {
						label: obj.customer.customer_name,
						value: obj.customer.customer_name,
						data: obj
					}
				})

				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	/**
	 * 請求先変更処理
	 * @param {*} _data 
	 */
	changeCustomer(_data) {
		if (_data) {
			this.entry.customer.customer_name = _data.label
			this.entry.customer.customer_code = _data.data.customer.customer_code
			this.customer = _data.label
		} else {
			this.entry.customer.customer_name = ''
			this.entry.customer.customer_code = ''
			this.customer = {}
		}
		this.forceUpdate()
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="問い合わせ情報" eventKey="1" bsStyle="info" defaultExpanded="true">
						
						{ !this.entry.published && 
							<CommonFilterBox
								controlLabel="顧客名"
								name="customer.customer_name"
								value={this.entry.customer.customer_name}
								options={this.customerList}
								onChange={(data) => this.changeCustomer(data)}
							/>
						}
						
						{ this.entry.published && 
							<CommonInputText
								controlLabel="顧客名"
								name="customer.customer_name"
								type="text"
								value={this.entry.customer.customer_name}
								readonly
							/>
						}

						{ this.entry.customer.customer_name && 
							<CommonInputText
								controlLabel="顧客コード"
								name="customer.customer_code"
								type="text"
								value={this.entry.customer.customer_code}
								readonly
							/>
						}

						{ this.entry.published && 
							<CommonInputText
								controlLabel="登録日"
								type="text"
								value={this.entry.published}
								readonly
							/>
						}

						{ this.entry.updated && 
							<CommonInputText
								controlLabel="更新日"
								type="text"
								value={this.entry.updated}
								readonly
							/>
						}

						<CommonFilterBox
							controlLabel="ステータス"
							size="sm"
							name="inquiry.inquiry_status"
							value={this.entry.inquiry.inquiry_status}
							options={[{
								label: '問い合わせ',
								value: '1'
							}, {
								label: '確認中',
								value: '2'
							}, {
								label: '返答待ち',
								value: '3'
							}, {
								label: '完了',
								value: '4'	
							}]}
						/>

						<CommonTextArea
							controlLabel="内容"
							name="inquiry.content"
							placeholder="内容"
							value={this.entry.inquiry.content}
							size='lg'
							style={{'height':'300px'}}
						/>	
					
					</Panel>	
				</PanelGroup>		
			</Form>
		)
	}
}