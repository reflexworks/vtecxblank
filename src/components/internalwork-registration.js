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
	//	CommonRegistrationBtn,
	CommonInputText,
	CommonRadioBtn,
	CommonTable,
	CommonFormGroup,
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
		this.status = '0'
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
			if (this.entry.customer.customer_code) {
				this.getCustomerListFromCustomerCode()
			}
		}
		this.forceUpdate()
	}

	getQuotationList(_input) {
		return axios({
			url: `/d/quotation?f&quotation.quotation_code=*${_input}*`,
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

	getBilltoList(_input) {
		return axios({
			url: `/d/billto?f&billto.billto_name=*${_input}*`,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {
				const optionsList = response.data.feed.entry.map((_obj) => {
					return {
						label: _obj.billto.billto_name,
						value: _obj.billto.billto_code,
						data: _obj
					}
				})
				return { options: optionsList }
			}

		})
	}

	/**
	 * 請求書変更処理
	 * @param {*} _data 
	 */
	changeBillto(_data) {
		this.entry.billto = {}
		this.isPost = false
		if (_data) {
			this.entry.billto = _data.data.billto
			if (this.monthly) {
				this.getCustomerListFromBilltoCode()
			}
		}
		this.forceUpdate()
	}

	getCustomerList(_input) {
		return axios({
			url: `/d/customer?f&customer.customer_name=*${_input}*`,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {
				const optionsList = response.data.feed.entry.map((_obj) => {
					return {
						label: _obj.customer.customer_name,
						value: _obj.customer.customer_code,
						data: _obj
					}
				})
				return { options: optionsList }
			}

		})
	}

	/**
	 * 顧客選択変更処理
	 * @param {*} _data 
	 */
	changeCustomer(_data) {
		this.entry.customer = {}
		this.isPost = false
		if (_data) {
			this.entry.customer = _data.data.customer
			if (this.monthly) {
				this.getCustomerListFromCustomerCode()
			}
		}
		this.forceUpdate()
	}

	getCustomerListFromBilltoCode() {

		this.setState({ isDisabled: true })

		const option = '?billto_code=' + this.entry.billto.billto_code + '&working_yearmonth=' + this.monthly
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
			} else[
				alert('顧客情報が存在しません。')
			]
			this.forceUpdate()

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	getCustomerListFromCustomerCode() {

		this.setState({ isDisabled: true })

		const option = '?customer_code=' + this.entry.customer.customer_code + '&working_yearmonth=' + this.monthly
		axios({
			url: '/s/internalwork-registration' + option,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {
				this.entry.customer = response.data.feed.entry[0].customer
				this.entry.title = response.data.feed.entry[0].title
				this.setCustomerList(response.data.feed.entry)
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
					quotation_key: this.entry.link[0].___href
				}
				const uri = '/internal_work/' + entry.customer.customer_code + '_' + this.monthly.replace('/', '')
				obj.link = [{
					___href: uri,
					___rel: 'self'
				}]
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

	changeStatus(_data) {
		this.status = _data
		this.entry.quotation = {}
		this.entry.billto = {}
		this.entry.customer = {}
		this.isPost = false
		this.forceUpdate()
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

							<CommonRadioBtn
								controlLabel=" "
								name=""
								checked={this.status}
								data={[{
									label: '見積書から作成',
									value: '0',
								}, {
									label: '請求先から作成',
									value: '1',
								}, {
									label: '顧客から作成',
									value: '2',
								}]}
								onChange={(data)=>this.changeStatus(data)}
							/>

							{this.status === '0' &&
								<div>
									<CommonInputText
										controlLabel=" "
										name=""
										type="text"
										value="見積書に紐付けされている請求先から顧客ごとに庫内作業を作成します。"
										readonly
										size="lg"
									/>

									<CommonFilterBox
										controlLabel="見積書検索"
										placeholder="見積書コードで検索"
										name=""
										value={this.entry.quotation.quotation_code}
										onChange={(data) => this.changeQuotation(data)}
										async={(input)=>this.getQuotationList(input)}
									/>

									{this.entry.quotation.quotation_code &&
										<CommonInputText
											controlLabel="選択中の見積書"
											name=""
											type="text"
											value={this.entry.quotation.quotation_code}
											readonly
										/>
									}
								</div>
							}

							{this.status === '1' &&
								<div>
									<CommonInputText
										controlLabel=" "
										name=""
										type="text"
										value="請求先に紐付けされている顧客ごとに庫内作業を作成します。"
										readonly
										size="lg"
									/>

									<CommonFilterBox
										controlLabel="請求先検索"
										placeholder="請求先名で検索"
										name=""
										value={this.entry.billto.billto_name}
										onChange={(data) => this.changeBillto(data)}
										async={(input)=>this.getBilltoList(input)}
									/>

								</div>
							}

							{this.status === '2' &&
								<div>
									<CommonInputText
										controlLabel=" "
										name=""
										type="text"
										value="選択した顧客の庫内作業を作成します。"
										readonly
										size="lg"
									/>

									<CommonFilterBox
										controlLabel="顧客検索"
										placeholder="顧客名で検索"
										name=""
										value={this.entry.customer.customer_name}
										onChange={(data) => this.changeCustomer(data)}
										async={(input)=>this.getCustomerList(input)}
									/>

									{this.entry.customer.customer_code &&
										<div>
											<CommonInputText
												controlLabel="顧客コード"
												name=""
												type="text"
												value={this.entry.customer.customer_code}
												readonly
											/>

											<CommonInputText
												controlLabel="顧客名"
												name=""
												type="text"
												value={this.entry.customer.customer_name}
												readonly
											/>

											<CommonInputText
												controlLabel="庫内作業作成済み"
												name=""
												type="text"
												value={(this.entry.title && this.entry.title === 'create' ? '作成済み' : '未作成')}
												readonly
											/>
										</div>
									}
								</div>
							}

							{((this.status === '0' && this.monthly && this.entry.quotation.quotation_code) || this.status === '1' && this.entry.billto.billto_code) && 
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
											field: 'customer.customer_name', title: '顧客名', width: '200px'
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
