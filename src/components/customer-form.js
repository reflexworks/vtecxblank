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
	CustomerShipperModal,
} from './customershipper-modal'

import {
	BilltoAddModal,
	BilltoEditModal,
	StaffAddModal,
	StaffEditModal,
	WarehouseAddModal,
	WarehouseEditModal
} from './master-modal'

export default class CustomerForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.customer = this.entry.customer || {}
		this.entry.customer.sales_staff = this.entry.customer.sales_staff || []
		this.entry.customer.working_staff = this.entry.customer.working_staff || []
		this.entry.contact_information = this.entry.contact_information || {}
		this.entry.customer.shipper = this.entry.customer.shipper || []
		this.entry.billto = this.entry.billto || {}

		this.cash = {
			working_staff: {},
			sales_staff: {}

		}

		this.master = {
			billtoList: [],
			staffList: [],
			warehouseList: []
		}
		this.modal = {
			customer: {
				shipper: { data: {} },
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
		if (!this.entry.customer.shipper) {
			this.entry.customer.shipper = []
		}
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
		this.setWarehouseMasterData(this.entry.customer.warehouse_code)
		this.forceUpdate()
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {
		this.setBilltoMasterData()
		this.setStaffMasterData()
		this.setWarehouseMasterData()
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
	 * 倉庫取得処理
	 */
	setWarehouseMasterData(_warehouse) {

		const setThisWarehouse = () => {
			if (_warehouse) {
				this.entry.customer.warehouse_code = _warehouse
				this.warehouse_name = ''
			}
			if (this.entry.customer.warehouse_code) {
				for (let i = 0, ii = this.warehouseList.length; i < ii; ++i) {
					if (this.entry.customer.warehouse_code === this.warehouseList[i].value) {
						this.warehouse = this.warehouseList[i].data
						this.warehouse_name = this.warehouseList[i].label
						break
					}
				}
			}
		}

		const get = () => {

			this.setState({ isDisabled: true })

			axios({
				url: '/d/warehouse?f',
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {
		
				if (response.status !== 204) {

					this.master.warehouseList = response.data.feed.entry
					this.warehouseList = this.master.warehouseList.map((obj) => {
						return {
							label: obj.warehouse.warehouse_name,
							value: obj.warehouse.warehouse_code,
							data: obj
						}
					})
					setThisWarehouse()

					this.forceUpdate()
				}

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}

		if (!this.warehouseList) {
			get()
		} else {
			setThisWarehouse()
		}

	}

	/**
	 * 倉庫変更処理
	 * @param {*} _data 
	 */
	changeWarehouse(_data) {
		if (_data) {
			this.entry.customer.warehouse_code = _data.value
			this.warehouse_name = _data.label
			this.warehouse = _data.data
		} else {
			this.entry.customer.warehouse_code = false
			this.warehouse_name = ''
			this.warehouse = {}
		}
		this.forceUpdate()
	}

	setWarehouseData(_data, _modal) {
		this.warehouseList = null
		this.setWarehouseMasterData(_data.feed.entry[0].warehouse.warehouse_code)
		if (_modal === 'add') {
			this.setState({ showWarehouseAddModal: false })
		} else {
			this.setState({ showWarehouseEditModal: false })
		}
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
					const email = obj.staff.staff_email
					const res = {
						label: name,
						value: email,
						data: obj
					}
					staffListFromKey[email] = res
					return res
				})

				const targetKey = this.typeStaffModal
				if (_entry && _modal === 'add') {
					this.entry.customer[targetKey].push({
						staff_name: _entry.staff.staff_name,
						staff_email: _entry.staff.staff_email
					})
				} else if (_entry && _modal === 'edit') {
					this.entry.customer[targetKey][this.typeStaffModalFromIndex] = {
						staff_name: _entry.staff.staff_name,
						staff_email: _entry.staff.staff_email
					}
				}
				this.setCash(this.staffList)
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	/**
	 * 担当者データをキャッシュ化し、担当者編集画面で使用する
	 */
	setCash() {
		if (this.master.staffList) {
			for (let staff_master of this.master.staffList) {
				this.cash[staff_master.staff.staff_email] = staff_master
			}
		}
	}

	/**
	 * スタッフ変更処理
	 */
	changeStaff(_data, _key) {
		this.sales_staff = null
		
		let isDuplicate = false
		if (!this.entry.customer[_key]) this.entry.customer[_key] = []
		for (let i = 0, ii = this.entry.customer[_key].length; i < ii; ++i) {
			if (_data.value === this.entry.customer[_key][i].staff_email) {
				isDuplicate = true
				break
			}
		}
		if (!isDuplicate) {
			this.entry.customer[_key].push({
				staff_name: _data.data.staff.staff_name,
				staff_email: _data.data.staff.staff_email
			})
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
		const email = this.entry.customer[_key][_index].staff_email
		this.staff = this.cash[email]
		this.typeStaffModal = _key
		this.typeStaffModalFromIndex = _index
		this.setState({ showStaffEditModal: true })
	}

	removeStaff(_data, _index, _key) {
		let array = []

		for (let i = 0, ii = this.entry.customer[_key].length; i < ii; ++i) {
			if (i !== _index) {
				array.push(this.entry.customer[_key][i])
			}
		}

		this.entry.customer[_key] = array
		this.forceUpdate()
	}

	changeCustomer(_data,_key) {
		this.entry.customer[_key] = _data
		this.forceUpdate()
	}

	changeContactInformation(_data,_key) {
		this.entry.contact_information[_key] = _data
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
							onChange={(data)=> this.changeCustomer(data,'customer_name')}
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
							onChange={(data)=> this.changeCustomer(data,'customer_name_kana')}
						/>
						
						<CommonInputText
							controlLabel="電話番号"
							name="contact_information.tel"
							type="text"
							placeholder="090-1234-5678"
							value={this.entry.contact_information.tel}
							size="sm"
							onChange={(data) => this.changeContactInformation(data,'tel')}
						/>

						<CommonInputText
							controlLabel="FAX"
							name="contact_information.fax"
							type="text"
							placeholder="090-1234-5678"
							value={this.entry.contact_information.fax}
							size="sm"
							onChange={(data) => this.changeContactInformation(data,'fax')}
						/>
						
						<CommonInputText
							controlLabel="メールアドレス"
							name="contact_information.email"
							type="email"
							placeholder="logioffice@gmail.com"
							value={this.entry.contact_information.email}
							onChange={(data) => this.changeContactInformation(data,'email')}
						/>
						
						<CommonInputText
							controlLabel="郵便番号"
							name="contact_information.zip_code"
							type="text"
							placeholder="123-4567"
							value={this.entry.contact_information.zip_code}
							size="sm"
							onChange={(data) => this.changeContactInformation(data,'zip_code')}
						/>

						<CommonPrefecture
							controlLabel="都道府県"
							componentClass="select"
							name="contact_information.prefecture"
							value={this.entry.contact_information.prefecture}
							onChange={(data) => this.changeContactInformation(data,'prefecture')}
						/>

						<CommonInputText
							controlLabel="市区郡町村"
							name="contact_information.address1"
							type="text"
							placeholder="◯◯市××町"
							value={this.entry.contact_information.address1}
							onChange={(data) => this.changeContactInformation(data,'address1')}
						/>

						<CommonInputText
							controlLabel="番地"
							name="contact_information.address2"
							type="text"
							placeholder="1丁目2番地 ◯◯ビル1階"
							value={this.entry.contact_information.address2}
							size="lg"
							onChange={(data) => this.changeContactInformation(data,'address2')}
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
					
					</Panel>

					<Panel collapsible header="請求先情報" eventKey="2" bsStyle="info" defaultExpanded={true}>
						
						<CommonFilterBox
							controlLabel="請求先"
							name=""
							value={this.entry.billto.billto_code}
							options={this.billtoList}
							add={() => this.setState({ showBilltoAddModal: true })}
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
										value={this.entry.billto.billto_name}
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
								controlLabel=" "
								name="customer.sales_staff"
								data={this.entry.customer.sales_staff}
								edit={(data, index) => this.editStaff(index, 'sales_staff')}
								remove={(data, index)=>this.removeStaff(data, index, 'sales_staff') }
								header={[{
									field: 'staff_name',title: '担当者名', width: '200px'
								}, {
									field: 'staff_email',title: 'メールアドレス', width: '500px'
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
								controlLabel=" "
								name="customer.working_staff"
								data={this.entry.customer.working_staff}
								edit={(data, index) => this.editStaff(index, 'working_staff')}
								remove={(data, index)=>this.removeStaff(data, index, 'working_staff') }
								header={[{
									field: 'staff_name',title: '担当者名', width: '200px'
								}, {
									field: 'staff_email',title: 'メールアドレス', width: '500px'
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
								field: 'shipment_service_code', title: '配送業者コード', width: '100px',
								convert: { EC: 'エコ配JP', YM: 'ヤマト運輸'}
							}, {
								field: 'shipper_info', title: '荷主コード / 集荷出荷区分', width: '200px',
								convert: { 0: '集荷', 1: '出荷' }
							}]}
							edit={(data, index) => this.showEditModal(data, index)}
							add={() => this.showAddModal()}
							remove={(data, index) => this.removeList(index)}
						/>
					</Panel>

					<Panel collapsible header="倉庫情報" eventKey="2" bsStyle="info" defaultExpanded={true}>
						
						<CommonFilterBox
							controlLabel="倉庫"
							name=""
							value={this.entry.customer.warehouse_code}
							options={this.warehouseList}
							add={() => this.setState({ showWarehouseAddModal: true })}
							onChange={(data) => this.changeWarehouse(data)}
						/>

						{this.entry.customer.warehouse_code && 
							<CommonInputText
								controlLabel="倉庫コード"
								name="customer.warehouse_code"
								type="text"
								value={this.entry.customer.warehouse_code}
								readonly
							/>
						}

					</Panel>
					
				</PanelGroup>

				<BilltoAddModal customerEntry={this.entry} isShow={this.state.showBilltoAddModal} close={() => this.setState({ showBilltoAddModal: false })} add={(data) => this.setBilltoData(data, 'add')} />
				<BilltoEditModal customer={this.entry.customer} contact_information={this.entry.contact_information} isShow={this.state.showBilltoEditModal} close={() => this.setState({ showBilltoEditModal: false })} edit={(data) => this.setBilltoData(data, 'edit')} data={this.billto} />
				<StaffAddModal isShow={this.state.showStaffAddModal} close={() => this.setState({ showStaffAddModal: false })} add={(data) => this.setStaffData(data, 'add')} />
				<StaffEditModal isShow={this.state.showStaffEditModal} close={() => this.setState({ showStaffEditModal: false })} edit={(data) => this.setStaffData(data, 'edit')} data={this.staff} />
				<WarehouseAddModal isShow={this.state.showWarehouseAddModal} close={() => this.setState({ showWarehouseAddModal: false })} add={(data) => this.setWarehouseData(data, 'add')} />
				<WarehouseEditModal isShow={this.state.showWarehouseEditModal} close={() => this.setState({ showWarehouseEditModal: false })} edit={(data) => this.setWarehouseData(data, 'edit')} data={this.warehouse} />

			</Form>
		)
	}
}