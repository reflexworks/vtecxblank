/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form,
	FormGroup,
	FormControl,
	PanelGroup,
	Panel,
	Checkbox,
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
	CustomerShipperModal,
} from './customershipper-modal'


import {
	BilltoAddModal,
	BilltoEditModal,
	StaffAddModal,
	StaffEditModal,
} from './master-modal'

export default class CustomerForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {customer_copy:false}

		this.entry = this.props.entry
		this.entry.customer = this.entry.customer || {}
		this.entry.customer.sales_staff = this.entry.customer.sales_staff || []
		this.entry.customer.working_staff = this.entry.customer.working_staff || []
		this.entry.contact_information = this.entry.contact_information || {}
		this.entry.customer.shipper = this.entry.customer.shipper || []
		//this.entry.customer.shipper.shipper_info = this.entry.shipper_info || []
		this.entry.billto = this.entry.billto || {}
		this.master = {
			billtoList: []
		}
		this.cash = {
			sales_staff: [],
			working_staff: [],
		}

		this.modal = {
			customer: {
				shipper: { data: {} },
				//shipper_info: { data: {} },
			}
		}
		
	}

	showAddModal() {
		this.modal.customer.shipper.data = {}
		this.modal.customer.shipper.type = 'add'
		this.modal.customer.shipper.visible = true
		this.forceUpdate()
	}
	showEditModal(_data, _index) {
		this.modal.customer.shipper.data = _data
		this.modal.customer.shipper.index = _index
		this.modal.customer.shipper.type = 'edit'
		this.modal.customer.shipper.visible = true
		this.forceUpdate()
	}
	closeModal() {
		this.modal.customer.shipper.visible = false
		this.forceUpdate()
	}
	removeList(_index) {
		let array = []
		for (let i = 0, ii = this.entry.customer.shipper.length; i < ii; ++i) {
			if (i !== _index) array.push(this.entry.customer.shipper[i])
		}
		this.entry.customer.shipper = array
		this.forceUpdate()
	}
	addList(_data) {
		this.entry.customer.shipper.push(_data)
		this.modal.customer.shipper.visible = false
		this.forceUpdate()
	}
	updateList(_data) {
		this.entry.customer.shipper[this.modal.customer.shipper.index] = _data
		this.modal.customer.shipper.visible = false
		this.forceUpdate()
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

		this.setBilltoMasterData()
		this.setStaffMasterData()

	}

	/**
	 * 請求先取得処理
	 */
	setBilltoMasterData(_billto) {

		this.setState({ isDisabled: true })

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

	setBilltoData(_data, _modal) {
		this.setBilltoMasterData(_data.feed.entry[0].billto)
		if (_modal === 'add') {
			this.setState({ showBilltoAddModal: false })
		} else {
			this.setState({ showBilltoEditModal: false })
		}
	}

	/**
	 * 請求先変更処理
	 * @param {*} _data 
	 */
	changeBillto(_data) {
		if (_data) {
			this.entry.billto = _data.data.billto
			this.billto = _data.data
		} else {
			this.entry.billto = {}
			this.billto = {}
		}
		this.forceUpdate()
	}

	/**
	 * 担当者取得処理
	 */
	setStaffMasterData(_entry, _modal) {

		this.setState({ isDisabled: true })

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
				let staffListFromKey = {}
				this.staffList = this.master.staffList.map((obj) => {
					const name = obj.staff.staff_name
					const res = {
						label: name,
						value: name,
						data: obj
					}
					staffListFromKey[obj.staff.staff_name] = res
					return res
				})

				const targetKey = this.typeStaffModal
				if (_entry && _modal === 'add') {
					this.entry.customer[targetKey].push({ content: _entry.staff.staff_name })
				} else if (_entry && _modal === 'edit') {
					this.entry.customer[targetKey][this.typeStaffModalFromIndex] = { content: _entry.staff.staff_name }
				}
				if (this.entry.customer[targetKey]) {
					this.cash[targetKey] = []
					for (let i = 0, ii = this.entry.customer[targetKey].length; i < ii; ++i) {
						this.cash[targetKey].push(staffListFromKey[this.entry.customer[targetKey][i].content])
					}
				}

				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	/**
	 * スタッフ変更処理
	 */
	changeStaff(_data, _key) {
		this.sales_staff = null
		
		let isDuplicate = false
		if (!this.entry.customer[_key]) this.entry.customer[_key] = []
		for (let i = 0, ii = this.entry.customer[_key].length; i < ii; ++i) {
			if (_data.value === this.entry.customer[_key][i].content) {
				isDuplicate = true
				break
			}
		}
		if (!isDuplicate) {
			this.entry.customer[_key].push({ content: _data.value })
			this.cash[_key].push(_data)
		}

		this.forceUpdate()
	}

	setStaffData(_data, _modal) {
		const entry = _data.feed.entry[0]
		this.setStaffMasterData(entry, _modal)
		if (_modal === 'add') {
			this.setState({ showStaffAddModal: false })
		} else {
			this.setState({ showStaffEditModal: false })
		}
	}

	addStaff(_key) {
		this.typeStaffModal = _key
		this.setState({ showStaffAddModal: true })
	}

	editStaff(_index, _key) {
		let targetCash = this.cash[_key]
		if (targetCash[_index]) {
			this.staff = targetCash[_index].data
			this.typeStaffModal = _key
			this.typeStaffModalFromIndex = _index
			this.setState({ showStaffEditModal: true })
		} else {
			this.setStaffMasterData()
			alert('担当者情報の取得中です。もう一度クリックを実行してください。')
		}
	}

	removeStaff(_data, _index, _key) {
		let array = []
		let cash = []
		let targetCash = this.cash[_key]

		let setNewArray = () => {
			for (let i = 0, ii = this.entry.customer[_key].length; i < ii; ++i) {
				if (i !== _index) {
					array.push(this.entry.customer[_key][i])
				}
			}
		}
		let setNewCashArray = () => {
			for (let i = 0, ii = targetCash.length; i < ii; ++i) {
				if (targetCash[i].value !== _data.content) {
					cash.push(targetCash[i])
				}
			}
		}
		setNewArray()
		setNewCashArray()

		this.entry.customer[_key] = array
		this.cash[_key] = cash
		this.forceUpdate()
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
					
						<CommonInputText
							controlLabel="顧客URL"
							name="customer.url"
							type="text"
							placeholder="url"
							value={this.entry.customer.url}
							size="lg"
						/>

						<CommonInputText
							controlLabel="担当者"
							name="customer.person_in_charge"
							type="text"
							placeholder="担当者"
							value={this.entry.customer.person_in_charge}
						/>	

						<CommonInputText
							controlLabel="取扱品"
							name="customer.products"
							type="text"
							placeholder="取扱品"
							value={this.entry.customer.products}
							size="lg"
						/>

						{/*<CommonFilterBox
							controlLabel="集荷出荷区分"
							size="sm"
							name="customer.shipment_class"
							value={this.entry.customer.shipment_class}
							options={[{
								label: '出荷',
								value: '0'
							}, {
								label: '集荷',
								value: '1'
							}, {
								label: '両方',
								value: '2'
							}]}
						/>
						*/}
					
					</Panel>

					<Panel collapsible header="請求先情報" eventKey="2" bsStyle="info" defaultExpanded={true}>
						
						<Checkbox inline value={this.state.customer_copy}
							onClick={()=>{this.setState({customer_copy:!this.state.customer_copy})}}>
							顧客情報と同じにする
						</Checkbox>
						
						<CommonFilterBox
							controlLabel="請求先"
							name=""
							value={this.entry.billto.billto_code}
							options={this.billtoList}
							add={() => this.setState({ showBilltoAddModal: true })}
							//edit={() => this.setState({ showBilltoEditModal: true })}
							onChange={(data) => this.changeBillto(data)}
						/>
						
						{ this.entry.billto.billto_code && 
								<CommonInputText
									controlLabel="請求先コード"
									name="billto.billto_code"
									type="text"
									value={this.entry.billto.billto_code}
									readonly
								/>
						}
						{ this.entry.billto.billto_code && 
								<FormGroup className="hide">
									<CommonInputText
										name="billto.billto_name"
										type="text"
										value={this.entry.billto.billto_name}
									/>
								</FormGroup>
						}
						{ !this.entry.billto.billto_code && 
								<FormGroup className="hide">
									<CommonInputText
										name="billto.billto_name"
										type="text"
										value=""
									/>
								</FormGroup>
						}

					</Panel>

					<Panel collapsible header="担当情報" eventKey="3" bsStyle="info" defaultExpanded={true}>
						<CommonFilterBox
							controlLabel="営業担当"
							name=""
							value={this.sales_staff}
							options={this.staffList}
							add={() => this.addStaff('sales_staff')}
							onChange={(data) => this.changeStaff(data, 'sales_staff')}
						/>
						{ (this.entry.customer.sales_staff && this.entry.customer.sales_staff.length > 0) && 
							<CommonTable
								controlLabel=""
								name="customer.sales_staff"
								data={this.entry.customer.sales_staff}
								edit={(data, index) => this.editStaff(index, 'sales_staff')}
								remove={(data, index)=>this.removeStaff(data, index, 'sales_staff') }
								header={[{
									field: 'content',title: '担当者名', width: '700px'
								}]}
							/>
						}
						<CommonFilterBox
							controlLabel="作業担当"
							name=""
							value={this.working_staff}
							options={this.staffList}
							add={() => this.setState({ showStaffAddModal: true })}
							onChange={(data) => this.changeStaff(data, 'working_staff')}
						/>
						{ (this.entry.customer.working_staff && this.entry.customer.working_staff.length > 0) && 
							<CommonTable
								controlLabel=""
								name="customer.working_staff"
								data={this.entry.customer.working_staff}
								edit={(data, index) => this.editStaff(index, 'working_staff')}
								remove={(data, index)=>this.removeStaff(data, index, 'working_staff') }
								header={[{
									field: 'content',title: '担当者名', width: '700px'
								}]}
							/>
						}
					</Panel>
					
					<Panel collapsible header="配送業者別荷主コード" eventKey="4" bsStyle="info" defaultExpanded={true}>
							
						<CustomerShipperModal
							isShow={this.modal.customer.shipper.visible}
							close={() => this.closeModal()}
							add={(obj) => this.addList(obj)}
							edit={(obj) => this.updateList(obj)}
							data={this.modal.customer.shipper.data}
							type={this.modal.customer.shipper.type}
						/>
						
						<CommonTable	
							name="customer.shipper"
							data={this.entry.customer.shipper}
							header={[{
								field: 'delivery_company', title: '配送業者', width: '100px',
								convert: {
									EC: 'エコ配JP', YM: 'ヤマト', SG: '佐川急便', SN: '西濃', PO: '日本郵政', JI: '自社配送',
									エコ配JP: 'エコ配JP', ヤマト: 'ヤマト', 佐川急便: '佐川急便', 西濃: '西濃', 日本郵政: '日本郵政', 自社配送: '自社配送',
								}
							}, {
								field: 'shipper_info', title: '荷主コード,集荷出荷区分', width: '100px',//convert: {0:'出荷',1:'集荷',2:'両方'}
							//}, {
							//	field: 'shipper_info.shipper_code', title: '荷主コード', width: '100px',
							//},{
							//	field: 'shipper_info.shipment_class', title: '集荷出荷区分', width: '100px',convert: {0:'出荷',1:'集荷',2:'両方'}
							}]}
							edit={(data, index) => this.showEditModal(data, index)}
							add={() => this.showAddModal()}
							remove={(data, index) => this.removeList(index)}
						/>
						{/*
						<CommonTable
							name="customer.shipper.shipper_info"
							data={this.entry.customer.shipper.shipper_info}
							header={[{
								field: 'shipper_code', title: '荷主コード', width: '100px',
							},{
								field: 'shipment_class', title: '集荷出荷区分', width: '100px',//convert: {0:'出荷',1:'集荷',2:'両方'}
							}]}
						/>
						*/}
					</Panel>

					
				</PanelGroup>

				<BilltoAddModal isShow={this.state.showBilltoAddModal} close={() => this.setState({ showBilltoAddModal: false })} add={(data) => this.setBilltoData(data, 'add')} />
				<BilltoEditModal isShow={this.state.showBilltoEditModal} close={() => this.setState({ showBilltoEditModal: false })} edit={(data) => this.setBilltoData(data, 'edit')} data={this.billto} />
				<StaffAddModal isShow={this.state.showStaffAddModal} close={() => this.setState({ showStaffAddModal: false })} add={(data) => this.setStaffData(data, 'add')} />
				<StaffEditModal isShow={this.state.showStaffEditModal} close={() => this.setState({ showStaffEditModal: false })} edit={(data) => this.setStaffData(data, 'edit')} data={this.staff} />

			</Form>
		)
	}
}