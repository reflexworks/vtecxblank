/* @flow */
import React from 'react'
import axios from 'axios'
import {
	PageHeader,
	Form,
	Tabs,
	Tab,
	Glyphicon,
	Button
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonTable,
	CommonFilterBox
} from './common'

import {
	DeliveryChargeModal,
	BasicConditionModal,
	PackingItemModal,
} from './quotation-modal'

export default class QuotationForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.quotation = this.entry.quotation || {}
		this.entry.basic_condition = this.entry.basic_condition || []
		this.entry.quotation.packing_item = this.entry.quotation.packing_item || []
		this.entry.billto = this.entry.billto || {}
		this.entry.item_details = this.entry.item_details || []
		this.entry.remarks = this.entry.remarks || []

		this.selectItemDetails = null

		this.master = {
			typeList: []
		}
		this.originTypeList = [[],[],[],[],[]]
		this.typeList = [[], [], [], [], []]
		this.remarksList = []

		this.modal = {
			basic_condition: { data: {} },
			item_details: { data: {} },
			remarks: { data: {} },
			packing_item: { data: {} }
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

		this.setTypeaheadMasterData()

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
		const oldEntry = _key === 'packing_item' ? this.entry.quotation[_key] : this.entry[_key]
		for (let i = 0, ii = oldEntry.length; i < ii; ++i) {
			if (i !== _index) array.push(oldEntry[i])
		}
		if (_key === 'packing_item') {
			this.entry.quotation[_key] = array
		} else {
			this.entry[_key] = array
		}
		this.forceUpdate()
	}
	addList(_key, _data) {
		if (_key === 'packing_item') {
			this.entry.quotation[_key].push(_data)
		} else {
			this.entry[_key].push(_data)
		}
		this.modal[_key].visible = false
		this.forceUpdate()
	}
	updateList(_key, _data) {
		if (_key === 'packing_item') {
			this.entry.quotation[_key][this.modal[_key].index] = _data
		} else {
			this.entry[_key][this.modal[_key].index] = _data
		}
		this.modal[_key].visible = false
		this.forceUpdate()
	}
	selectList(_key, _data) {
		for (let i = 0, ii = _data.length; i < ii; ++i) {
			if (_key === 'packing_item') {
				this.entry.quotation[_key].push(_data[i][_key])
			} else {
				this.entry[_key].push(_data[i][_key])
			}
		}
		this.modal[_key].visible = false
		this.forceUpdate()
	}

	render() {

		return (

			<div>
				<Form horizontal>

					<CommonInputText
						controlLabel="見積書コード"
						name="quotation.quotation_code"
						type="text"
						value={this.entry.quotation.quotation_code}
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
						isShow={this.modal.packing_item.visible}
						close={() => this.closeModal('packing_item')}
						add={(obj) => this.addList('packing_item', obj)}
						select={(obj) => this.selectList('packing_item', obj)}
						data={this.modal.packing_item.data}
						type={this.modal.packing_item.type}
					/>
						
					<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

						<Tab eventKey={1} title="見積明細">

							<CommonTable
								name="item_details"
								data={this.entry.item_details}
								header={[{
									field: 'item_name', title: '項目', width: '100px',
									filter: {
										options: this.typeList[0],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 0, rowindex)}
									}
								}, {
									field: 'unit_name',title: '単位名称', width: '50px',
									filter: {
										options: this.typeList[1],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 1, rowindex)}
									}
								}, {
									field: 'unit',title: '単位', width: '50px',
									filter: {
										options: this.typeList[2],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 2, rowindex)}
									}
								}, {
									field: 'unit_price',title: '単価', width: '100px',
									filter: {
										options: this.typeList[3],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 3, rowindex)}
									}
								}, {
									field: 'remarks',title: '備考', width: '500px',
									filter: {
										options: this.typeList[4],
										onChange: (data, rowindex)=>{this.changeTypeahead(data, 4, rowindex)}
									}
								}]}
								add={() => this.addList('item_details', { item_name: '', unit_name: '', unit: '', unit_price: '', remarks: '' })}
								remove={(data, index) => this.removeList('item_details', index)}
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
								edit={(data, index) => this.showEditModal('basic_condition', data, index)}
								add={() => this.showAddModal('basic_condition')}
								remove={(data, index) => this.removeList('basic_condition', index)}
							/>

						</Tab>

						<Tab eventKey={3} title="備考">

							<CommonTable
								name="remarks"
								data={this.entry.remarks}
								header={[{
									field: 'content', title: '備考', 
									input: {
										onChange: (data, rowindex)=>{this.changeRemarks(data, rowindex)}
									}
								}]}
								add={() => this.addList('remarks', { content: ''})}
								remove={(data, index) => this.removeList('remarks', index)}
								fixed
							/>

						</Tab>

						<Tab eventKey={4} title="梱包資材">
							<CommonTable
								name="quotation.packing_item"
								data={this.entry.quotation.packing_item}
								header={[{
									field: 'item_code',title: '品番', width: '100px'
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
								}, {	
									field: 'regular_price', title: '通常販売価格', width: '150px'
								}, {
									field: 'regular_unit_price', title: '通常販売価格・特別', width: '150px'
								}, {
									field: 'special_price', title: '特別販売価格', width: '150px'
								}, {
									field: 'special_unit_price', title: '特別販売価格・特別', width: '150px'
								}]}
								add={() => this.showAddModal('packing_item')}
								remove={(data, index) => this.removeList('packing_item', index)}
							>
								<CommonFilterBox
									placeholder="品番から追加"
									name=""
									value={this.selectPackingItem}
									onChange={(data) => this.addList('packing_item', data.data.packing_item)}
									style={{float: 'left', width: '200px'}}
									table
									async={(input)=>this.getPackingItemList(input)}
								/>
								<Button bsSize="sm" onClick={()=>this.showEditModal('packing_item')}><Glyphicon glyph="search" /></Button>
							</CommonTable>
						</Tab>

						<Tab eventKey={5} title="庫内作業状況">
							<PageHeader>見積項目作業一覧</PageHeader>
							<CommonTable
								name=""
								data={this.entry.internal_work}
								header={[{
									field: 'staff_name',title: '担当者', width: '100px'
								}, {
									field: 'working_date', title: '作業日', width: '200px'
								}, {
									field: 'approval_status', title: '承認ステータス', width: '200px'
								}, {
									field: 'mgmt_basic_fee', title: '管理基本料', width: '200px'
								}, {
									field: 'custody_fee', title: '保管費', width: '150px'
								}, {
									field: 'additional1_palette', title: '追加１パレット', width: '200px'
								}, {
									field: 'additional2_steel_shelf', title: '追加２スチール棚', width: '200px'
								}, {
									field: 'deletion_palette', title: '削除パレット', width: '150px'
								}, {
									field: 'received', title: '入荷', width: '200px'
								}, {
									field: 'received_normal', title: '入荷（通常）', width: '200px'
								}, {
									field: 'returns', title: '返品処理', width: '200px'
								}, {
									field: 'received_others', title: '入荷（その他）', width: '200px'
								}, {
									field: 'packing_normal', title: '発送（通常）', width: '200px'
								}, {
									field: 'packing_others', title: '発送（その他）', width: '200px'
								}, {
									field: 'packing', title: '梱包数', width: '200px'	
								}, {
									field: 'yamato60size', title: 'ヤマト運輸６０サイズ迄', width: '200px'
								}, {
									field: 'seino', title: '西濃運輸', width: '200px'
								}, {
									field: 'cash_on_arrival', title: '着払い発送', width: '200px'
								}, {
									field: 'work_others', title: '作業・その他', width: '200px'
								}, {
									field: 'cardboard160', title: '段ボール（１６０）', width: '200px'
								}, {
									field: 'cardboard140', title: '段ボール（１４０）', width: '200px'
								}, {
									field: 'cardboard120', title: '段ボール（１２０）', width: '200px'
								}, {
									field: 'cardboard100', title: '段ボール（１００）', width: '200px'
								}, {
									field: 'cardboard80', title: '段ボール（８０）', width: '200px'
								}, {
									field: 'cardboard60', title: '段ボール（６０）', width: '200px'
								}, {
									field: 'corrugated_cardboard', title: '巻段ボール', width: '200px'
								}, {
									field: 'buffer_material', title: '緩衝材', width: '200px'
								}, {
									field: 'bubble_wrap', title: 'エアプチ', width: '200px'
								}]}
							/>

							<PageHeader>発送作業一覧</PageHeader>
							<CommonTable
								name=""
								data={this.entry.internal_work}
								header={[{
									field: 'staff_name',title: '担当者', width: '100px'
								}, {
									field: 'working_date', title: '作業日', width: '200px'
								}, {
									field: 'approval_status', title: '承認ステータス', width: '200px'
								}, {
									field: 'mgmt_basic_fee', title: '管理基本料', width: '200px'
								}, {
									field: 'custody_fee', title: '保管費', width: '150px'
								}, {
									field: 'additional1_palette', title: '追加１パレット', width: '200px'
								}, {
									field: 'additional2_steel_shelf', title: '追加２スチール棚', width: '200px'
								}, {
									field: 'deletion_palette', title: '削除パレット', width: '150px'
								}, {
									field: 'received', title: '入荷', width: '200px'
								}, {
									field: 'received_normal', title: '入荷（通常）', width: '200px'
								}, {
									field: 'returns', title: '返品処理', width: '200px'
								}, {
									field: 'received_others', title: '入荷（その他）', width: '200px'
								}, {
									field: 'packing_normal', title: '発送（通常）', width: '200px'
								}, {
									field: 'packing_others', title: '発送（その他）', width: '200px'
								}, {
									field: 'packing', title: '梱包数', width: '200px'	
								}, {
									field: 'yamato60size', title: 'ヤマト運輸６０サイズ迄', width: '200px'
								}, {
									field: 'seino', title: '西濃運輸', width: '200px'
								}, {
									field: 'cash_on_arrival', title: '着払い発送', width: '200px'
								}, {
									field: 'work_others', title: '作業・その他', width: '200px'
								}, {
									field: 'cardboard160', title: '段ボール（１６０）', width: '200px'
								}, {
									field: 'cardboard140', title: '段ボール（１４０）', width: '200px'
								}, {
									field: 'cardboard120', title: '段ボール（１２０）', width: '200px'
								}, {
									field: 'cardboard100', title: '段ボール（１００）', width: '200px'
								}, {
									field: 'cardboard80', title: '段ボール（８０）', width: '200px'
								}, {
									field: 'cardboard60', title: '段ボール（６０）', width: '200px'
								}, {
									field: 'corrugated_cardboard', title: '巻段ボール', width: '200px'
								}, {
									field: 'buffer_material', title: '緩衝材', width: '200px'
								}, {
									field: 'bubble_wrap', title: 'エアプチ', width: '200px'
								}]}
							/>

							<PageHeader>資材作業一覧</PageHeader>
							<CommonTable
								name=""
								data={this.entry.internal_work}
								header={[{
									field: 'staff_name',title: '担当者', width: '100px'
								}, {
									field: 'working_date', title: '作業日', width: '200px'
								}, {
									field: 'approval_status', title: '承認ステータス', width: '200px'
								}, {
									field: 'mgmt_basic_fee', title: '管理基本料', width: '200px'
								}, {
									field: 'custody_fee', title: '保管費', width: '150px'
								}, {
									field: 'additional1_palette', title: '追加１パレット', width: '200px'
								}, {
									field: 'additional2_steel_shelf', title: '追加２スチール棚', width: '200px'
								}, {
									field: 'deletion_palette', title: '削除パレット', width: '150px'
								}, {
									field: 'received', title: '入荷', width: '200px'
								}, {
									field: 'received_normal', title: '入荷（通常）', width: '200px'
								}, {
									field: 'returns', title: '返品処理', width: '200px'
								}, {
									field: 'received_others', title: '入荷（その他）', width: '200px'
								}, {
									field: 'packing_normal', title: '発送（通常）', width: '200px'
								}, {
									field: 'packing_others', title: '発送（その他）', width: '200px'
								}, {
									field: 'packing', title: '梱包数', width: '200px'	
								}, {
									field: 'yamato60size', title: 'ヤマト運輸６０サイズ迄', width: '200px'
								}, {
									field: 'seino', title: '西濃運輸', width: '200px'
								}, {
									field: 'cash_on_arrival', title: '着払い発送', width: '200px'
								}, {
									field: 'work_others', title: '作業・その他', width: '200px'
								}, {
									field: 'cardboard160', title: '段ボール（１６０）', width: '200px'
								}, {
									field: 'cardboard140', title: '段ボール（１４０）', width: '200px'
								}, {
									field: 'cardboard120', title: '段ボール（１２０）', width: '200px'
								}, {
									field: 'cardboard100', title: '段ボール（１００）', width: '200px'
								}, {
									field: 'cardboard80', title: '段ボール（８０）', width: '200px'
								}, {
									field: 'cardboard60', title: '段ボール（６０）', width: '200px'
								}, {
									field: 'corrugated_cardboard', title: '巻段ボール', width: '200px'
								}, {
									field: 'buffer_material', title: '緩衝材', width: '200px'
								}, {
									field: 'bubble_wrap', title: 'エアプチ', width: '200px'
								}]}
							/>
						</Tab>

					</Tabs>
				</Form>
			</div>
		)
	}
}
