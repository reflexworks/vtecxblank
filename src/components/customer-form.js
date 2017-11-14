/* @flow */
import React from 'react'
import axios from 'axios'
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
	CommonFilterBox,
	CommonTable,
} from './common'

import {
	BilltoAddModal,
	BilltoEditModal,
} from './quotation-modal'

export default class CustomerForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.customer = this.entry.customer || {}
		this.entry.customer.sales_staff = this.entry.customer.sales_staff || []
		this.entry.customer.working_staff = this.entry.customer.working_staff || []
		this.entry.contact_information = this.entry.contact_information || {}
		this.entry.billto = this.entry.billto || {}

		this.master = {
			billtoList: []
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setState({ isDisabled: true })
		this.setBilltoMasterData()
		this.setStaffMasterData()

	}

	/**
	 * 請求先取得処理
	 */
	setBilltoMasterData(_billto) {
		axios({
			url: '/d/billto?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.billtoList = response.data.feed.entry
				this.billtoList = this.master.billtoList.map((obj) => {
					return {
						label: obj.billto.billto_name,
						value: obj.billto.billto_code,
						data: obj
					}
				})
				if (_billto) this.entry.billto = _billto
				if (this.entry.billto.billto_code) {
					for (let i = 0, ii = this.billtoList.length; i < ii; ++i) {
						if (this.entry.billto.billto_code === this.billtoList[i].value) {
							this.billto = this.billtoList[i].data
							break
						}
					}
				}

				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}

	addBillto(_data) {
		const obj = _data.feed.entry[0].billto
		this.billtoList.push({
			label: obj.billto_name,
			value: obj.billto_code,
			data: obj
		})
		this.entry.billto = obj
		this.forceUpdate()
		this.setState({ showBilltoAddModal: false })
	}

	/**
	 * 担当者取得処理
	 */
	setStaffMasterData() {
		axios({
			url: '/d/staff?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			this.setState({ isDisabled: false })

			if (response.status !== 204) {

				this.master.staffList = response.data.feed.entry
				this.staffList = this.master.staffList.map((obj) => {
					return {
						label: obj.staff.staff_name,
						value: obj.staff.staff_name,
						data: obj
					}
				})
				if (this.entry.staff.staff_name) {
					for (let i = 0, ii = this.staffList.length; i < ii; ++i) {
						if (this.entry.staff.staff_name === this.staffList[i].value) {
							this.staff = this.staffList[i].data
						}
					}
				}

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
	changeBillto(_data) {
		if (_data) {
			this.entry.billto = _data.data.billto
			this.entry.billto.billto_name = _data.value
			this.billto = _data.data
		} else {
			this.entry.billto = {}
			this.billto = {}
		}
		this.forceUpdate()
	}

	/**
	 * スタッフ変更処理
	 * @param {*} _data 
	 */
	changeStaff(_data, key) {
		this.sales_staff = null
		
		let isDuplicate = false
		for (let i = 0, ii = this.entry.customer[key].length; i < ii; ++i) {
			if (_data.value === this.entry.customer[key][i].content) {
				isDuplicate = true
				break
			}
		}
		if (!isDuplicate) {
			this.entry.customer[key].push({ content: _data.value })
		}

		this.forceUpdate()
	}
	onSelect() {
		
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="顧客情報" eventKey="1" bsStyle="info" defaultExpanded={true}>

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
							size="sm"
						/>

						<CommonInputText
							controlLabel="市区郡長村"
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

					<BilltoAddModal isShow={this.state.showBilltoAddModal} close={() => this.setState({ showBilltoAddModal: false })} add={(data) => this.addBillto(data)} />
					<BilltoEditModal isShow={this.state.showBilltoEditModal} close={() => this.setState({ showBilltoEditModal: false })} data={this.billto} />
					<Panel collapsible header="請求先情報" eventKey="2" bsStyle="info" defaultExpanded={true}>
						<CommonFilterBox
							controlLabel="請求先"
							name="billto.billto_name"
							value={this.entry.billto.billto_name}
							options={this.billtoList}
							add={() => this.setState({ showBilltoAddModal: true })}
							edit={() => this.setState({ showBilltoEditModal: true })}
							onChange={(data) => this.changeBillto(data)}
						/>
						{ this.entry.billto.billto_name && 
							<CommonInputText
								controlLabel="請求先コード"
								name="billto.billto_code"
								type="text"
								value={this.entry.billto.billto_code}
								readonly
							/>
						}
					</Panel>

					<Panel collapsible header="担当情報" eventKey="3" bsStyle="info" defaultExpanded={true}>
						<CommonFilterBox
							controlLabel="営業担当選択"
							name=""
							value={this.sales_staff}
							options={this.staffList}
							add={() => this.setState({ showStaffAddModal: true })}
							onChange={(data) => this.changeStaff(data, 'sales_staff')}
						/>
						{ (this.entry.customer.sales_staff && this.entry.customer.sales_staff.length > 0) && 
							<CommonTable
								controlLabel="営業担当一覧"
								name="customer.sales_staff"
								data={this.entry.customer.sales_staff}
								edit={()=>this.onSelect() }
								remove={()=>this.onSelect() }
								header={[{
									field: 'content',title: '担当者名', width: '700px'
								}]}
							/>
						}
						<CommonFilterBox
							controlLabel="作業担当選択"
							name=""
							value={this.working_staff}
							options={this.staffList}
							add={() => this.setState({ showStaffAddModal: true })}
							onChange={(data) => this.changeStaff(data, 'working_staff')}
						/>
						{ (this.entry.customer.working_staff && this.entry.customer.working_staff.length > 0) && 
							<CommonTable
								controlLabel="作業担当一覧"
								name="customer.working_staff"
								data={this.entry.customer.working_staff}
								edit={()=>this.onSelect() }
								remove={()=>this.onSelect() }
								header={[{
									field: 'content',title: '担当者名', width: '700px'
								}]}
							/>
						}
					</Panel>

				</PanelGroup>

			</Form>
		)
	}
}
