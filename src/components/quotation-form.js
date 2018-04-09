/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form,
	Tabs,
	Tab,
	Glyphicon,
	Button,
	FormGroup,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	BillfromAddModal,
	BillfromEditModal,
} from './billfrom-modal'

import {
	CommonInputText,
	CommonTable,
	CommonFilterBox,
	CommonPrefecture,
} from './common'

import {
	DeliveryChargeModal,
	BasicConditionModal,
	PackingItemModal,
} from './quotation-modal'

export default class QuotationForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			showBillfromAddModal: false,
			showBillfromEditModal: false,
		}

		this.entry = this.props.entry
		this.entry.quotation = this.entry.quotation || {}
		this.entry.basic_condition = this.entry.basic_condition || []
		this.entry.packing_items = this.entry.packing_items || []
		this.entry.billto = this.entry.billto || {}
		this.entry.item_details = this.entry.item_details || []
		this.entry.remarks = this.entry.remarks || []
		this.entry.billfrom = this.entry.billfrom || {}
		this.entry.billfrom.payee = this.entry.billfrom.payee || []
		this.entry.contact_information = this.entry.contact_information || {}
		this.selectItemDetails = null

		this.master = {
			typeList: [],
			packingItemTemplateList: [],
			billfromList: [],
		}
		this.originTypeList = [[],[],[],[],[]]
		this.typeList = [[], [], [], [], []]
		this.remarksList = []

		this.modal = {
			basic_condition: { data: {} },
			item_details: { data: {} },
			remarks: { data: {} },
			packing_items: { data: {} }
		}

	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {

		this.entry = newProps.entry
		if (this.entry.quotation.status === '0') {
			this.status = '未発行'
			this.isDisabled = false
		} else if (this.entry.quotation.status === '1'){
			this.status = '発行済'
			this.isDisabled = true
		}

		// 前の枝番情報
		this.befor = newProps.befor
		if (this.befor) {
			this.setBeforQuotation()
		}

		if (this.entry.item_details && this.entry.item_details.length) {
			let array = { unit: [], remarks: [] }
			const options = (_value) => {
				return _value && _value !== '' ? [{value: _value, label: _value}] : []
			}
			for (let i = 0, ii = this.entry.item_details.length; i < ii; ++i) {
				const item_details = this.entry.item_details[i]
				array.unit[i] = options(item_details.unit)
				array.remarks[i] = options(item_details.remarks)
			}
			this.typeList[2] = array.unit
			this.typeList[4] = array.remarks
		}
		
		this.setBillfromMasterData()
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {
		this.setTypeaheadMasterData()
		this.setPackingItemTemplateData()
	}

	/**
	 * 前の枝番情報は変更・削除できない処理
	 * 基本条件と備考は庫内作業に影響がないため変更できるものとする
	 */
	setBeforQuotation() {
		if (this.befor.item_details) {
			const cash_item_details = {}
			this.befor.item_details.map((_obj) => {
				const key = _obj.item_name + _obj.unit_name
				cash_item_details[key] = true
			})
			this.entry.item_details = this.entry.item_details.map((_obj) => {
				const key = _obj.item_name + _obj.unit_name
				if (cash_item_details[key]) {
					_obj.item_name = <div className="__is_readonly">{_obj.item_name}</div>
					_obj.unit_name = <div className="__is_readonly">{_obj.unit_name}</div>
					_obj.is_remove = false
				}
				return _obj
			})
		}
		if (this.befor.packing_items) {
			const cash_packing_items = {}
			this.befor.packing_items.map((_obj) => {
				cash_packing_items[_obj.item_code] = true
			})
			this.entry.packing_items = this.entry.packing_items.map((_obj) => {
				if (cash_packing_items[_obj.item_code]) {
					_obj.is_remove = false
				}
				return _obj
			})
		}
	}

	/**
	 *  請求元リストを作成する
	 */
	setBillfromMasterData(_billfrom) {
		this.setState({ isDisabled: true })

		axios({
			url: '/d/billfrom?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			if (response.status !== 204) {

				this.master.billfromList = response.data.feed.entry
				this.billfromList = this.master.billfromList.map((obj) => {
					return {
						label: obj.billfrom.billfrom_name,
						value: obj.billfrom.billfrom_code,
						data: obj
					}
				})

				//全てのbillfrom.payeeを見て、支店名と口座名義が無かったら登録や更新は行わずに追加。
				this.billfromList.map((billfromList) => {
					if (billfromList.data.billfrom.payee) {
						billfromList.data.billfrom.payee = billfromList.data.billfrom.payee.map((oldPayee) => {
							if (oldPayee.bank_info && !oldPayee.branch_office && !oldPayee.account_name) {
								let newPayee = {
									'bank_info': oldPayee.bank_info,
									'account_type': oldPayee.account_type,
									'account_number': oldPayee.account_number,
									'branch_office': '',
									'account_name': '',
								}
								return (newPayee)
							} else {
								return (oldPayee)
							}
						})
					}	
				})
				
				if (_billfrom) this.entry.billfrom = _billfrom
				if (this.entry.billfrom.billfrom_code) {
					for (let i = 0, ii = this.billfromList.length; i < ii; ++i) {
						if (this.entry.billfrom.billfrom_code === this.billfromList[i].value) {
							this.billfrom = this.billfromList[i].data
							this.entry.billfrom = this.billfrom.billfrom
							this.entry.contact_information = this.billfrom.contact_information							
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
	/**
	 * 請求元リストの変更
	 */
	changeBillfrom(_data) {
		if (_data) {
			this.entry.billfrom = _data.data.billfrom
			this.entry.contact_information = _data.data.contact_information
			this.billfrom = _data.data
		} else {
			this.entry.billfrom = {}
			this.entry.contact_information = {}
			this.billfrom = {}
		}
		this.forceUpdate()
	}
	setBillfromData(_data, _modal) {
		this.setBillfromMasterData(_data.feed.entry[0].billfrom)
		if (_modal === 'add') {
			this.setState({ showBillfromAddModal: false })
		} else {
			this.setState({ showBillfromEditModal: false })
		}
	}

	/**
	 * 資材テンプレート取得処理
	 */
	setPackingItemTemplateData() {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/packing_item_template?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.packingItemTemplateList = response.data.feed.entry
				this.packingItemTemplateList = this.master.packingItemTemplateList.map((obj) => {
					return {
						label: obj.title,
						value: obj.title,
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
	 * 入力保管取得処理
	 */
	setTypeaheadMasterData() {

		this.setState({ isDisabled: true })

		this.cashTypeAhead = {}

		axios({
			url: '/d/type_ahead?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.typeList = response.data.feed.entry
				response.data.feed.entry.map((obj) => {
					const type = parseInt(obj.type_ahead.type)
					if (type !== 2 && type !== 4) {
						const res = {
							label: obj.type_ahead.value,
							value: obj.type_ahead.value,
						}
						this.typeList[type].push(res)
						this.originTypeList[type].push(res)

						if (!this.cashTypeAhead[type]) this.cashTypeAhead[type] = {}
						if (!obj.type_aheads) obj.type_aheads = []
						this.cashTypeAhead[type][obj.type_ahead.value] = obj
					}

					return obj
				})

				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})

	}

	clickTypeahead(_celIndex, _rowindex) {

		let itemName
		if (_celIndex === 0) itemName = 'item_name'
		if (_celIndex === 1) itemName = 'unit_name'
		if (_celIndex === 2) itemName = 'unit'
		if (_celIndex === 3) itemName = 'unit_price'
		if (_celIndex === 4) itemName = 'remarks'

		const targetRowData = this.entry.item_details[_rowindex]
		const targetValue = targetRowData[itemName]

		// 自身に値がない場合
		if (!targetValue || targetValue === '') return false 

		let isPut = true

		let item_name = targetRowData.item_name
		let unit = targetRowData.unit
		let remarks = targetRowData.remarks

		if (itemName === 'item_name') item_name = targetValue
		if (itemName === 'unit') unit = targetValue
		if (itemName === 'remarks') remarks = targetValue

		if (item_name && Object.prototype.toString.call(item_name) === '[object Object]') {
			item_name = item_name.props.children
		}

		const cashData = this.cashTypeAhead[0][item_name]

		if (cashData) {
			// 「単位」「備考」に値がある場合は、
			// 「項目」に紐付いてるかチェックする
			let isUnit = unit ? false : true
			let isRemarks = remarks ? false : true
			cashData.type_aheads.map((_obj) => {
				if (unit && _obj.type === '2' && _obj.value === unit) {
					isUnit = true
				}
				if (remarks && _obj.type === '4' && _obj.value === remarks) {
					isRemarks = true
				}
			})
			if (isUnit && isRemarks) {
				isPut = false
			}
			if (unit && !isUnit) {
				cashData.type_aheads.push({
					value: unit,
					type: '2'
				})
			}
			if (remarks && !isRemarks) {
				cashData.type_aheads.push({
					value: remarks,
					type: '4'
				})
			}

			// 自身に紐付かれていなかったら紐付けてput処理する
			if (isPut) {
				this.cashTypeAhead[0][item_name] = cashData
				this.putTypeList(item_name, _rowindex)
			} else {
				if (itemName === 'unit' || itemName === 'remarks') {
					this.setTypeList(cashData, _rowindex)
					this.forceUpdate()
				}
			}

		}

	}

	putTypeList(_item_name, _rowindex) {

		this.setTypeList(this.cashTypeAhead[0][_item_name], _rowindex)
		const feed = {
			feed: {
				entry: [this.cashTypeAhead[0][_item_name]]
			}
		}
		this.setState({ isDisabled: true })
		axios({
			url: '/d/',
			method: 'put',
			data: feed,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then(() => {
			const ids = this.cashTypeAhead[0][_item_name].id.split(',')
			const rev = parseInt(ids[1]) + 1
			this.cashTypeAhead[0][_item_name].id = ids[0] + ',' + rev
			this.setState({ isDisabled: false })
		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	setTypeList(_cashData, _rowindex) {
		let array = {
			unit: [],
			remarks: []
		}
		if (this.typeList[2] && this.typeList[2][_rowindex]) {
			array.unit = JSON.parse(JSON.stringify(this.typeList[2][_rowindex]))
			array.remarks = JSON.parse(JSON.stringify(this.typeList[4][_rowindex]))
		}
		array.unit = []
		array.remarks = []
		_cashData.type_aheads.map((_obj) => {
			const type = parseInt(_obj.type)
			let type_name
			if (type === 2) {
				type_name = 'unit'
			} else if (type === 4) {
				type_name = 'remarks'
			}
			array[type_name].push({
				value: _obj.value,
				label: _obj.value
			})
		})
		this.typeList[2][_rowindex] = JSON.parse(JSON.stringify(array.unit))
		this.originTypeList[2][_rowindex] = JSON.parse(JSON.stringify(array.unit))
		this.typeList[4][_rowindex] = JSON.parse(JSON.stringify(array.remarks))
		this.originTypeList[4][_rowindex] = JSON.parse(JSON.stringify(array.remarks))
	}

	changeTypeahead(_data, _celIndex, _rowindex) {
		if (_celIndex !== 3) {
			if (_celIndex === 2 || _celIndex === 4) {
				if (!this.typeList[_celIndex][_rowindex] || this.typeList[_celIndex][_rowindex].length !== this.originTypeList[_celIndex][_rowindex].length) {
					const item_name = this.entry.item_details[_rowindex].item_name
					if (item_name) {
						this.cashTypeAhead[0][item_name].type_aheads.push({
							value: _data.value,
							type: '' + _celIndex
						})
						this.putTypeList(item_name, _rowindex)

					} else {
						alert('項目を選択してください。')
						if (this.typeList[_celIndex]) {
							this.typeList[_celIndex][_rowindex] = []
							this.originTypeList[_celIndex][_rowindex] = []
						}
						this.forceUpdate()
						return false
					}
				}
			} else {
				if (this.typeList[_celIndex].length !== this.originTypeList[_celIndex].length) {
					this.originTypeList[_celIndex].push(_data)
					const feed = {
						feed: {
							entry: [{
								type_ahead: {
									type: '' + _celIndex,
									value: _data.value
								}
							}]
						}
					}
					axios({
						url: '/d/type_ahead',
						method: 'post',
						data: feed,
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						}
					}).then(() => {
					}).catch((error) => {
						this.setState({ isDisabled: false, isError: error })
					})
				}
			}
		}

		let itemName
		if (_celIndex === 0) itemName = 'item_name'
		if (_celIndex === 1) itemName = 'unit_name'
		if (_celIndex === 2) itemName = 'unit'
		if (_celIndex === 3) itemName = 'unit_price'
		if (_celIndex === 4) itemName = 'remarks'
		if (itemName) {
			if (itemName === 'item_name' || itemName === 'unit_name' || itemName === 'unit') {

				if (itemName === 'item_name') {
					this.setTypeList(this.cashTypeAhead[0][_data.value], _rowindex)
					if (_data.value !== this.entry.item_details[_rowindex].item_name) {
						this.entry.item_details[_rowindex].unit = null
						this.entry.item_details[_rowindex].remarks = null
					}
				}

				// 明細項目の項目名と単位名称が一致しているものは登録させない処理
				const target = this.entry.item_details[_rowindex]
				const item_name = itemName === 'item_name' ? _data.value : target.item_name
				const unit_name = itemName === 'unit_name' ? _data.value : target.unit_name
				const unit = itemName === 'unit' ? _data.value : target.unit
				if (item_name && unit_name && unit) {
					const check = () => {
						const getValue = (_value) => {
							if (Object.prototype.toString.call(_value) === '[object Object]') {
								if (_value['$$typeof']) {
									return _value.props.children
								} else {
									return _value
								}
							}
							return _value
						}
						let flg = true
						this.entry.item_details.map((_obj) => {
							if (_obj.item_name && _obj.unit_name && _obj.unit) {
								const _item_name = getValue(_obj.item_name)
								const _unit_name = getValue(_obj.unit_name)
								const _unit = getValue(_obj.unit)
								if (item_name + unit_name + unit === _item_name + _unit_name + _unit) {
									flg = false
								}
							}
						})
						return  flg
					}
					if (check()) {
						this.entry.item_details[_rowindex][itemName] = _data ? _data.value : null
					} else {
						this.entry.item_details[_rowindex][itemName] = null
					}
				} else {
					this.entry.item_details[_rowindex][itemName] = _data ? _data.value : null
				}

			} else {
				if (_celIndex === 3) {
					this.entry.item_details[_rowindex][itemName] = _data ? _data : null
				} else {
					this.entry.item_details[_rowindex][itemName] = _data ? _data.value : null
				}
			}
		}
		this.forceUpdate()
	}

	changeRemarks(_data, _rowindex) {
		this.entry.remarks[_rowindex].content = _data.value
		this.forceUpdate()
	}

	getPackingItemList(input) {
		return axios({
			url: `/d/packing_item?f&packing_item.item_code-rg-*${input}*`,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {
				const optionsList = response.data.feed.entry.map((_obj) => {
					return {
						label: _obj.packing_item.item_code,
						value: _obj.packing_item.item_code,
						data: _obj
					}
				})
				return { options: optionsList }
			}

		})
	}

	showAddModal(_key) {
		this.modal[_key].data = {}
		this.modal[_key].type = 'add'
		this.modal[_key].visible = true
		this.forceUpdate()
	}
	showEditModal(_key, _data, _index) {
		this.modal[_key].data = _data
		this.modal[_key].index = _index
		this.modal[_key].type = 'edit'
		this.modal[_key].visible = true
		this.forceUpdate()
	}
	closeModal(_key) {
		this.modal[_key].visible = false
		this.forceUpdate()
	}
	removeList(_key, _index) {
		let array = []
		const oldEntry = this.entry[_key]
		for (let i = 0, ii = oldEntry.length; i < ii; ++i) {
			if (i !== _index) array.push(oldEntry[i])
		}
		this.entry[_key] = array
		this.forceUpdate()
	}
	addList(_key, _data) {
		this.entry[_key].push(_data)
		this.modal[_key].visible = false
		this.forceUpdate()
	}
	updateList(_key, _data) {
		this.entry[_key][this.modal[_key].index] = _data
		this.modal[_key].visible = false
		this.forceUpdate()
	}
	selectList(_key, _data) {
		for (let i = 0, ii = _data.length; i < ii; ++i) {
			this.entry[_key].push(_data[i].packing_item)
		}
		this.modal[_key].visible = false
		this.forceUpdate()
	}

	changePackingItem(_key, _data, _rowindex) {
		this.entry.packing_items[_rowindex][_key] = _data
	}
	changePackingItemTemplate(_data) {
		this.packingItemTemplate = _data ? _data.value : null
		if (_data) {
			if (confirm('設定した資材が破棄されます。よろしいでしょうか？')) {
				this.entry.packing_items = _data.data.packing_items
				this.forceUpdate()
			}
		}
	}

	render() {

		return (

			<div>
				<Form horizontal>

					<CommonInputText
						controlLabel="見積書コード"
						name=""
						type="text"
						value={this.entry.quotation.quotation_code + ' - ' +this.entry.quotation.quotation_code_sub}
						readonly
					/>

					<CommonInputText
						controlLabel="見積月"
						name="quotation.quotation_date"
						type="text"
						value={this.entry.quotation.quotation_date}
						readonly
					/>
					<CommonInputText
						controlLabel="発行ステータス"
						name="quotation.status"
						type="text"
						value={this.status}
						readonly
					/>
					<CommonInputText
						controlLabel="請求先名"
						name="billto.billto_name"
						type="text"
						value={this.entry.billto.billto_name}
						readonly
					/>
					<CommonInputText
						controlLabel="作成者"
						name="creator"
						type="text"
						value={this.entry.creator}
						readonly
					/>
				</Form>

				<Form name={this.props.name} horizontal data-submit-form>

					<div className="hide">
						<CommonInputText
							controlLabel="見積書コード"
							name="quotation.quotation_code"
							type="text"
							value={this.entry.quotation.quotation_code}
						/>
						<CommonInputText
							controlLabel="枝番"
							name="quotation.quotation_code_sub"
							type="text"
							value={this.entry.quotation.quotation_code_sub}
						/>
						<CommonInputText
							controlLabel="見積月"
							name="quotation.quotation_date"
							type="text"
							value={this.entry.quotation.quotation_date}
						/>
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
						<CommonInputText
							controlLabel="発行ステータス"
							name="quotation.status"
							type="text"
							value={this.entry.quotation.status}
							readonly
						/>
					</div>

					<DeliveryChargeModal isShow={this.state.showDeliveryChargeModal} close={() => this.setState({ showDeliveryChargeModal: false })} />
					<BasicConditionModal
						isShow={this.modal.basic_condition.visible}
						close={() => this.closeModal('basic_condition')}
						add={(obj) => this.addList('basic_condition', obj)}
						edit={(obj) => this.updateList('basic_condition', obj)}
						data={this.modal.basic_condition.data}
						type={this.modal.basic_condition.type}
					/>
					<PackingItemModal
						isShow={this.modal.packing_items.visible}
						close={() => this.closeModal('packing_items')}
						add={(obj) => this.addList('packing_items', obj)}
						select={(obj) => this.selectList('packing_items', obj)}
						data={this.modal.packing_items.data}
						type={this.modal.packing_items.type}
					/>
						
					<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

						<Tab eventKey={1} title="見積明細">

							<CommonTable
								name="item_details"
								data={this.entry.item_details}
								header={[{
									field: 'item_name', title: '項目', width: '250px',
									filter: this.isDisabled ? false : {
										options: this.typeList[0],
										onChange: (data, rowindex) => { this.changeTypeahead(data, 0, rowindex) },
										onClick: (rowindex) => { this.clickTypeahead(0, rowindex) }
									}
								}, {
									field: 'unit_name',title: '単位名称', width: '250px',
									filter: this.isDisabled ? false : {
										options: this.typeList[1],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 1, rowindex)}
									}
								}, {
									field: 'unit',title: '単位', width: '100px',
									filter: this.isDisabled ? false : {
										options: this.typeList[2],
										isRow: true,
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 2, rowindex)},
										onClick: (rowindex) => { this.clickTypeahead(2, rowindex) }
									}
								}, {
									field: 'unit_price',title: '単価', width: '100px',
									input: this.isDisabled ? false : {
										onChange: (data, rowindex) => { this.changeTypeahead(data, 3, rowindex) },
										price: true
									}
								}, {
									field: 'remarks',title: '備考', width: '200px',
									filter: this.isDisabled ? false : {
										options: this.typeList[4],
										isRow: true,
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 4, rowindex)},
										onClick: (rowindex) => { this.clickTypeahead(4, rowindex) }
									}
								}]}
								add={this.isDisabled ? false : () => this.addList('item_details', { item_name: '', unit_name: '', unit: '', unit_price: '', remarks: '' })}
								remove={this.isDisabled ? false : (data, index) => this.removeList('item_details', index)}
								fixed
							>
								{ !this.isDisabled && 
									<div style={{float: 'left','font-size': '12px', padding: '7px 10px 0px 20px'}}>
										単位名称に「月」を含めれば月次事項、「期」を含めれば期次事項となります。
									</div>
								}
							</CommonTable>	

						</Tab>

						<Tab eventKey={2} title="基本条件">

							<CommonTable
								name="basic_condition"
								data={this.entry.basic_condition}
								header={[{
									field: 'title',title: '条件名', width: '300px'
								}, {
									field: 'condition', title: '条件内容', width: '800px'
								}]}
								edit={this.isDisabled ? false : (data, index) => this.showEditModal('basic_condition', data, index)}
								add={this.isDisabled ? false : () => this.showAddModal('basic_condition')}
								remove={this.isDisabled ? false : (data, index) => this.removeList('basic_condition', index)}
							/>

						</Tab>

						<Tab eventKey={3} title="備考">

							<CommonTable
								name="remarks"
								data={this.entry.remarks}
								header={[{
									field: 'content', title: '備考', 
									input: this.isDisabled ? false : {
										onChange: (data, rowindex)=>{this.changeRemarks(data, rowindex)}
									}
								}]}
								add={this.isDisabled ? false : () => this.addList('remarks', { content: ''})}
								remove={this.isDisabled ? false : (data, index) => this.removeList('remarks', index)}
								fixed
							/>

						</Tab>

						<Tab eventKey={4} title="梱包資材">
							
							<CommonTable
								name="packing_items"
								data={this.entry.packing_items}
								header={[{
									field: 'item_code',title: '品番', width: '100px'
								}, {
									field: 'regular_price', title: '通常販売価格', width: '100px',
									input: this.isDisabled ? false : {
										onChange: (data, rowindex) => { this.changePackingItem('regular_price', data, rowindex) },
										price: true
									}
								}, {
									field: 'regular_unit_price', title: '通常販売価格・単価', width: '120px',
									input: this.isDisabled ? false : {
										onChange: (data, rowindex)=>{this.changePackingItem('regular_unit_price', data, rowindex)},
										price: true
									}
								}, {
									field: 'special_price', title: '特別販売価格', width: '100px',
									input: this.isDisabled ? false : {
										onChange: (data, rowindex)=>{this.changePackingItem('special_price', data, rowindex)},
										price: true
									}
								}, {
									field: 'special_unit_price', title: '特別販売価格・単価', width: '120px',
									input: this.isDisabled ? false : {
										onChange: (data, rowindex)=>{this.changePackingItem('special_unit_price', data, rowindex)},
										price: true
									}
								}, {
									field: 'item_name', title: '商品名称', width: '200px'
								}, {
									field: 'material', title: '材質', width: '200px'
								}, {
									field: 'category', title: 'カテゴリ', width: '200px'
								}, {
									field: 'size1', title: 'サイズ１', width: '200px'
								}, {
									field: 'size2', title: 'サイズ２', width: '200px'
								}, {
									field: 'notices', title: '特記', width: '200px'
								}, {
									field: 'thickness', title: '厚み', width: '70px'
								}, {
									field: 'inside_width', title: '内寸幅', width: '70px'
								}, {
									field: 'inside_depth', title: '内寸奥行', width: '70px'
								}, {
									field: 'inside_height', title: '内寸高さ', width: '70px'
								}, {
									field: 'outer_width', title: '外寸幅', width: '70px'
								}, {
									field: 'outer_depth', title: '外寸奥行', width: '70px'
								}, {
									field: 'outer_height', title: '外寸高さ', width: '70px'
								}, {
									field: 'outer_total', title: '三辺合計', width: '70px'
								}, {	
									field: 'purchase_price', title: '仕入れ単価', width: '150px'
								}]}
								add={this.isDisabled ? false : () => this.showAddModal('packing_items')}
								remove={this.isDisabled ? false : (data, index) => this.removeList('packing_items', index)}
							>
								{!this.isDisabled && 
									<div>
										<CommonFilterBox
											placeholder="品番から追加"
											name=""
											value={this.selectPackingItem}
											onChange={(data) => this.addList('packing_items', data.data.packing_item)}
											style={{float: 'left', width: '200px'}}
											table
											async={(input)=>this.getPackingItemList(input)}
										/>

										<Button style={{float: 'left'}} bsSize="sm" onClick={() => this.showEditModal('packing_items')}><Glyphicon glyph="search" /></Button>

										<CommonFilterBox
											placeholder="テンプレート選択"
											name=""
											value={this.packingItemTemplate}
											options={this.packingItemTemplateList}
											onChange={(data) => this.changePackingItemTemplate(data)}
											style={{float: 'right', width: '200px'}}
											table
										/>
									</div>
								}
							</CommonTable>
						</Tab>

						<Tab eventKey={5} title="請求元"> 
						
							{/*
							画面に表示
							 名前
							 郵便番号
							 住所（都道府県 + 市区郡町村 + 番地）表示用
							 電話番号
							 口座情報
							
							画面に非表示
							 FAX
							 メールアドレス
							 都道府県
							 市区郡町村
							 番地
							*/}

							{ !this.isDisabled &&
								<CommonFilterBox
									controlLabel="請求元選択"
									name="billfrom.billfrom_code"
									value={this.entry.billfrom.billfrom_code}
									options={this.billfromList}
									add={() => this.setState({ showBillfromAddModal: true })}
									edit={() => this.setState({ showBillfromEditModal: true })}
									onChange={(data) => this.changeBillfrom(data)}
								/>
							}
							{(this.isDisabled && !this.entry.billfrom.billfrom_code) &&
								<div>
									<CommonInputText
										controlLabel=" "
										name=""
										type="text"
										value="請求元を指定せずに発行された見積書です。追加発行から請求元を選択してください。"
										size="lg"
										readonly
									/>
								</div>
							}

							{this.entry.billfrom.billfrom_code &&
								<div>
									<CommonInputText
										controlLabel="請求元名"
										name="billfrom.billfrom_name"
										type="text"
										value={this.entry.billfrom.billfrom_name}
										readonly
									/>
									<CommonInputText
										controlLabel="郵便番号"
										name="contact_information.zip_code"
										type="text"
										placeholder="郵便番号"
										value={this.entry.contact_information.zip_code}
										readonly
									/>
									<CommonInputText
										controlLabel="住所"
										type="text"
										value={this.entry.contact_information.prefecture + this.entry.contact_information.address1 + this.entry.contact_information.address2}
										readonly
									/>
									<CommonInputText
										controlLabel="電話番号"
										name="contact_information.tel"
										type="text"
										placeholder="電話番号"
										value={this.entry.contact_information.tel}
										readonly
									/>
									<CommonTable
										controlLabel="口座情報"
										name="billfrom.payee"
										data={this.entry.billfrom.payee}
										header={[{
											field: 'bank_info', title: '銀行名', width: '30px',
											convert: {
												1: 'みずほ銀行', 2: '三菱東京UFJ銀行', 3: '三井住友銀行', 4: 'りそな銀行', 5: '埼玉りそな銀行',
												6: '楽天銀行',7:'ジャパンネット銀行',8:'巣鴨信用金庫',9:'川口信用金庫',10:'東京都民銀行',11:'群馬銀行',
											}
										}, {
											field: 'branch_office', title: '支店名', width: '30px',
										}, {
											field: 'account_type', title: '口座種類', width: '30px',convert: { 0: '普通' ,1: '当座',}
										}, {
											field: 'account_number', title: '口座番号', width: '30px',
										}, {
											field: 'account_name', title: '口座名義', width: '30px',
										}]}
										noneScroll
										fixed
									/>
								</div>
							}


							{!this.entry.billfrom.billfrom_code &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="billfrom.billfrom_name"
										type="text"
										value=""
										readonly
									/>
								</FormGroup>
							}
							{this.entry.contact_information.fax &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="contact_information.fax"
										type="text"
										value={this.entry.contact_information.fax}
										readonly
									/>
									<CommonInputText
										name="contact_information.email"
										type="text"
										value={this.entry.contact_information.email}
										readonly
									/>
									<CommonPrefecture
										controlLabel="都道府県"
										componentClass="select"
										name="contact_information.prefecture"
										value={this.entry.contact_information.prefecture}
									/>
									<CommonInputText
										name="contact_information.address1"
										type="text"
										value={this.entry.contact_information.address1}
										readonly
									/>
									<CommonInputText
										name="contact_information.address2"
										type="text"
										value={this.entry.contact_information.address2}
										readonly
									/>
								</FormGroup>
							}

						</Tab>
						
					</Tabs>
					<BillfromAddModal isShow={this.state.showBillfromAddModal} close={() => this.setState({ showBillfromAddModal: false })} add={(data) => this.setBillfromData(data, 'add')} />
					<BillfromEditModal isShow={this.state.showBillfromEditModal} close={() => this.setState({ showBillfromEditModal: false })} edit={(data) => this.setBillfromData(data, 'edit')} data={this.billfrom} />
				</Form>
			</div>
		)
	}
}