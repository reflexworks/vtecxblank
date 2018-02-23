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

		this.address = ''
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
			this.status = '発行済み'
			this.isDisabled = true
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

				if (_billfrom) this.entry.billfrom = _billfrom
				if (this.entry.billfrom.billfrom_code) {
					for (let i = 0, ii = this.billfromList.length; i < ii; ++i) {
						if (this.entry.billfrom.billfrom_code === this.billfromList[i].value) {
							this.billfrom = this.billfromList[i].data
							this.entry.contact_information = this.billfromList[i].data.contact_information
							if(this.billfromList[i].data.contact_information.prefecture || this.billfromList[i].data.contact_information.address1 ||this.billfromList[i].data.contact_information.address2){
								this.address = this.billfromList[i].data.contact_information.prefecture + this.billfromList[i].data.contact_information.address1 + this.billfromList[i].data.contact_information.address2
							}
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
			this.address = _data.data.contact_information.prefecture + _data.data.contact_information.address1 + _data.data.contact_information.address2
		} else {
			this.entry.billfrom = {}
			this.entry.contact_information = {}
			this.entry.billfrom = {}
			this.entry.contact_information = {}
			this.entry.contact_information.zip_code = ''
			this.entry.contact_information.prefecture = ''
			this.entry.contact_information.address1 = ''
			this.entry.contact_information.address2 = ''
			this.entry.contact_information.tel = ''
			this.entry.contact_information.email = ''
			this.entry.contact_information.fax = ''
			this.billfrom = {}
			this.address=''
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
					const res = {
						label: obj.type_ahead.value,
						value: obj.type_ahead.value,
					}
					this.typeList[type].push(res)
					this.originTypeList[type].push(res)
					return obj
				})

				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}

	changeTypeahead(_data, _celIndex, _rowindex) {
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

		let itemName
		if (_celIndex === 0) itemName = 'item_name'
		if (_celIndex === 1) itemName = 'unit_name'
		if (_celIndex === 2) itemName = 'unit'
		if (_celIndex === 3) itemName = 'unit_price'
		if (_celIndex === 4) itemName = 'remarks'
		if (itemName) this.entry.item_details[_rowindex][itemName] = _data ? _data.value : null
		this.forceUpdate()
	}

	changeRemarks(_data, _rowindex) {
		this.entry.remarks[_rowindex].content = _data.value
		this.forceUpdate()
	}

	getPackingItemList(input) {
		return axios({
			url: `/d/packing_item?f&packing_item.item_code=*${input}*`,
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

	//PDFダウンロード
	printPDF() {		
		location.href = 's/get-pdf-quotation?quotation_code=' + this.entry.quotation.quotation_code + '&quotation_code_sub=' + this.entry.quotation.quotation_code_sub
	}
	
	render() {

		return (

			<div>
				<Form horizontal>

					<Button className="total_amount" onClick={() => this.printPDF()}>
						<Glyphicon glyph="print" />　見積書ダウンロード
					</Button>
		
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
									field: 'item_name', title: '項目', style: { width: '300px' },
									filter: this.isDisabled ? false : {
										options: this.typeList[0],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 0, rowindex)}
									}
								}, {
									field: 'unit_name',title: '単位名称', width: '50px',
									filter: this.isDisabled ? false : {
										options: this.typeList[1],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 1, rowindex)}
									}
								}, {
									field: 'unit',title: '単位', width: '50px',
									filter: this.isDisabled ? false : {
										options: this.typeList[2],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 2, rowindex)}
									}
								}, {
									field: 'unit_price',title: '単価', width: '100px',
									filter: this.isDisabled ? false : {
										options: this.typeList[3],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 3, rowindex)}
									}
								}, {
									field: 'remarks',title: '備考', width: '300px',
									filter: this.isDisabled ? false : {
										options: this.typeList[4],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 4, rowindex)}
									}
								}]}
								add={this.isDisabled ? false : () => this.addList('item_details', { item_name: '', unit_name: '', unit: '', unit_price: '', remarks: '' })}
								remove={this.isDisabled ? false : (data, index) => this.removeList('item_details', index)}
								fixed
							/>

						</Tab>

						<Tab eventKey={2} title="基本条件">

							<CommonTable
								name="basic_condition"
								data={this.entry.basic_condition}
								header={[{
									field: 'title',title: '条件名', width: '300px'
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
										onChange: (data, rowindex)=>{this.changePackingItem('regular_price', data, rowindex)}
									}
								}, {
									field: 'regular_unit_price', title: '通常販売価格・特別', width: '120px',
									input: this.isDisabled ? false : {
										onChange: (data, rowindex)=>{this.changePackingItem('regular_unit_price', data, rowindex)}
									}
								}, {
									field: 'special_price', title: '特別販売価格', width: '100px',
									input: this.isDisabled ? false : {
										onChange: (data, rowindex)=>{this.changePackingItem('special_price', data, rowindex)}
									}
								}, {
									field: 'special_unit_price', title: '特別販売価格・特別', width: '120px',
									input: this.isDisabled ? false : {
										onChange: (data, rowindex)=>{this.changePackingItem('special_unit_price', data, rowindex)}
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

							<CommonFilterBox
								controlLabel="請求元"
								name="billfrom.billfrom_code"
								value={this.entry.billfrom.billfrom_code}
								options={this.billfromList}
								add={() => this.setState({ showBillfromAddModal: true })}
								edit={() => this.setState({ showBillfromEditModal: true })}
								onChange={(data) => this.changeBillfrom(data)}
							/>		
							{this.entry.billfrom.billfrom_code &&
								<CommonInputText
									controlLabel=" "
									name="billfrom.billfrom_name"
									type="text"
									value={this.entry.billfrom.billfrom_name}
									readonly
								/>
							}						
							{this.entry.billfrom.billfrom_code &&
								<CommonInputText
									controlLabel="郵便番号"
									name="contact_information.zip_code"
									type="text"
									placeholder="郵便番号"
									value={this.entry.contact_information.zip_code}
									readonly
								/>
							}
							{this.entry.billfrom.billfrom_code &&
								<CommonInputText
									controlLabel="住所"
									type="text"
									value={this.address}
									readonly
								/>
							}
							{this.entry.billfrom.billfrom_code &&
								<CommonInputText
									controlLabel="電話番号"
									name="contact_information.tel"
									type="text"
									placeholder="電話番号"
									value={this.entry.contact_information.tel}
									readonly
								/>
							}
							{this.entry.billfrom.billfrom_code &&
								<CommonTable
									controlLabel="口座情報"
									name="billfrom.payee"
									data={this.entry.billfrom.payee}
									header={[{
										field: 'bank_info', title: '口座名', width: '30px',
										convert: {
											1: 'みずほ銀行', 2: '三菱東京UFJ銀行', 3: '三井住友銀行', 4: 'りそな銀行', 5: '埼玉りそな銀行',
											6: '楽天銀行',7:'ジャパンネット銀行',8:'巣鴨信用金庫',9:'川口信用金庫',10:'東京都民銀行',11:'群馬銀行',
										}
										
									}, {
										field: 'account_type', title: '口座種類', width: '30px',convert: { 0: '普通' ,1: '当座',}
										
									}, {
										field: 'account_number', title: '口座番号', width: '30px',
										
									}]}
									noneScroll
									fixed
								/>
							}

							{this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="contact_information.fax"
										type="text"
										value={this.entry.contact_information.fax}
										readonly
									/>
								</FormGroup>
							}
							{this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="contact_information.email"
										type="text"
										value={this.entry.contact_information.email}
										readonly
									/>
								</FormGroup>
							}
							{this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonPrefecture
										controlLabel="都道府県"
										componentClass="select"
										name="contact_information.prefecture"
										value={this.entry.contact_information.prefecture}
									/>
								</FormGroup>
							}
							{this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="contact_information.address1"
										type="text"
										value={this.entry.contact_information.address1}
										readonly
									/>
								</FormGroup>
							}
							{this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="contact_information.address2"
										type="text"
										value={this.entry.contact_information.address2}
										readonly
									/>
								</FormGroup>
							}
										
							{!this.entry.billfrom.billfrom_code &&
								<FormGroup className="hide"	>
									<CommonInputText
										name="billfrom.billfrom_name"
										type="text"
										readonly
									/>
								</FormGroup>
							}
							{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.zip_code"
										type="text"
										placeholder="郵便番号"
										readonly
									/>
								</FormGroup>
							}
							{!this.entry.contact_information &&
								<FormGroup className="hide"	>
									<CommonPrefecture
										controlLabel="都道府県"
										componentClass="select"
										name="contact_information.prefecture"
									/>
								</FormGroup>
							}		
							{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.address1"
										type="text"
										readonly
									/>
								</FormGroup>
							}
							{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.address2"
										type="text"
										readonly
									/>
								</FormGroup>
							}
							{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.tel"
										type="text"
										readonly
									/>
								</FormGroup>
							}
							{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.fax"
										type="text"
										readonly
									/>
								</FormGroup>
							}
							{!this.entry.contact_information &&
								<FormGroup className="hide"	>	
									<CommonInputText
										name="contact_information.email"
										type="text"
										readonly
									/>
								</FormGroup>
							}		
							{!this.entry.billfrom.billfrom_code &&
								<FormGroup className="hide"	>
									<CommonTable
										name="billfrom.payee"
										data={this.entry.billfrom.payee}
										header={[{
											field: 'bank_info', title: '口座名', width: '30px',
											convert: {
												1: 'みずほ銀行', 2: '三菱東京UFJ銀行', 3: '三井住友銀行', 4: 'りそな銀行', 5: '埼玉りそな銀行',
												6: '楽天銀行',7:'ジャパンネット銀行',8:'巣鴨信用金庫',9:'川口信用金庫',10:'東京都民銀行',11:'群馬銀行',
											}
										}, {
											field: 'account_type', title: '口座種類', width: '30px',convert: { 0: '普通' ,1: '当座',}
										
										}, {
											field: 'account_number', title: '口座番号', width: '30px',
										
										}]}
										noneScroll
										fixed
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
