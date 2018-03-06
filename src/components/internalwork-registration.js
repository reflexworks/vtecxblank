/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Form,
	Button
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonMonthlySelect,
	CommonFilterBox,
	CommonInputText,
	CommonTable,
	CommonFormGroup,
	CommonLoginUser
} from './common'

export default class InternalWorkRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/internal_work'

		// POSTデータ
		this.postData = {
			feed: {
				entry: []
			}
		}

		// 初期値の設定
		this.entry = {
			internal_work: {},
			quotation: {},
			billto: {},
			customer: {}
		}

		this.master = {
			customerList: []
		}
		this.monthly = null
		this.isPost = false

	}

	setMonthly(_data) {
		this.monthly = null
		this.isPost = false
		if (_data) {
			this.monthly = _data.value
			if (this.entry.billto.billto_code) {
				this.getCustomerListFromBilltoCode()
			}
		}
		this.forceUpdate()
	}

	getQuotationList(_input) {
		return axios({
			url: `/s/get-quotation-code-list?quotation.quotation_code=*${_input}*&quotation.status=1`,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {
				const optionsList = response.data.feed.entry.map((_obj) => {
					return {
						label: _obj.quotation.quotation_code,
						value: _obj.quotation.quotation_code,
						data: _obj
					}
				})
				return { options: optionsList }
			}

		})
	}

	/**
	 * 見積書変更処理
	 * @param {*} _data 
	 */
	changeQuotation(_data) {
		this.entry.quotation = {}
		this.entry.billto = {}
		this.isPost = false
		if (_data) {
			this.entry.quotation = _data.data.quotation
			this.entry.billto = _data.data.billto
			this.entry.link = _data.data.link
			if (this.monthly) {
				this.getCustomerListFromBilltoCode()
			}
		}
		this.forceUpdate()
	}

	getCustomerListFromBilltoCode() {

		this.setState({ isDisabled: true })

		const option = '?quotation_code=' + this.entry.quotation.quotation_code + '&working_yearmonth=' + this.monthly
		axios({
			url: '/s/internalwork-registration' + option,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {
				this.master.customerList = response.data.feed.entry
				this.setCustomerList(response.data.feed.entry)
				this.forceUpdate()
			} else[
				alert('顧客情報が存在しません。')
			]
			this.forceUpdate()

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	setCustomerList(_entrys) {

		this.postData.feed.entry = []
		let isCreate = false
		for (let entry of _entrys) {
			let obj = {}
			if (entry.title !== 'create') {
				isCreate = true
				if (this.entry.quotation.quotation_code) {
					obj.quotation = {
						quotation_code: this.entry.quotation.quotation_code
					}
				}
				obj.customer = {
					customer_code: entry.customer.customer_code,
					customer_name: entry.customer.customer_name
				}
				obj.internal_work = {
					working_yearmonth: this.monthly,
					is_completed: '0'
				}
				const uri = '/internal_work/' + this.entry.quotation.quotation_code + '-' + this.monthly.replace('/', '') + '-' + entry.customer.customer_code
				obj.link = [{
					___href: uri,
					___rel: 'self'
				}]
				obj.creator = CommonLoginUser().get().staff_name
				this.postData.feed.entry.push(obj)
				this.postData.feed.entry.push({
					link : [{
						___href: uri + '/list',
						___rel: 'self'
					}]
				})
				this.postData.feed.entry.push({
					link : [{
						___href: uri + '/data',
						___rel: 'self'
					}]
				})
			}
		}
		if (isCreate) {
			this.isPost = true
		}
	}

	/**
     * 登録処理
     */
	doPost() {

		axios({
			url: '/d/',
			method: 'post',
			data: this.postData,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then(() => {
			alert('登録が完了しました。')
			location.href = '#/InternalWorkList'
		}).then(() => {
		})

	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>庫内作業登録</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Form name="mainForm" horizontal data-submit-form>

							<CommonMonthlySelect
								controlLabel="作業年月"
								name="internal_work.working_yearmonth"
								value={this.entry.internal_work.working_yearmonth}
								onChange={(data)=>this.setMonthly(data)}
							/>

							<CommonInputText
								controlLabel=" "
								name=""
								type="text"
								value="見積書に紐付けされている請求先から顧客ごとに庫内作業を作成します。"
								readonly
								size="lg"
							/>
							<CommonInputText
								controlLabel=" "
								name=""
								type="text"
								value="発行済の見積書を対象に検索します。"
								readonly
								size="lg"
							/>

							<CommonFilterBox
								controlLabel="見積書検索"
								placeholder="見積書コードを入力してください"
								name=""
								value={this.entry.quotation.quotation_code}
								onChange={(data) => this.changeQuotation(data)}
								async={(input)=>this.getQuotationList(input)}
							/>

							{this.entry.quotation.quotation_code &&
								<div>
									<CommonInputText
										controlLabel="選択中の見積書"
										name=""
										type="text"
										value={this.entry.quotation.quotation_code}
										readonly
									/>
									<CommonInputText
										controlLabel="発行済の最新枝番"
										name=""
										type="text"
										value={this.entry.quotation.quotation_code_sub}
										readonly
									/>
								</div>
							}

							{(this.monthly && this.entry.quotation.quotation_code) && 
								<div>
									<CommonInputText
										controlLabel="請求先コード"
										name="billto.billto_code"
										type="text"
										value={this.entry.billto.billto_code}
										readonly
									/>
									<CommonInputText
										controlLabel="請求先名"
										name="billto.billto_name"
										type="text"
										value={this.entry.billto.billto_name}
										readonly
									/>
									<CommonTable
										controlLabel=" "
										name=""
										data={this.master.customerList}
										header={[{
											field: 'customer.customer_code', title: '顧客コード', width: '100px'
										}, {
											field: 'customer.customer_name', title: '顧客名', width: '400px'
										}, {
											field: 'title', title: '庫内作業作成済み', width: '200px', convert: { 'create': '作成済み', 'none': '未作成'}
										}]}
									/>
								</div>
							}
						</Form>
					</Col>
					<CommonFormGroup controlLabel=" ">
						<Button
							bsStyle="primary"
							bsSize="small"
							disabled={!this.isPost}
							onClick={() => this.doPost()}
						>
							新規作成
						</Button>
					</CommonFormGroup>
				</Row>
			</Grid>
		)
	}
}
