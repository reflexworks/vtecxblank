/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form,
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
	PackingItemModal,
} from './quotation-modal'

export default class PackingitemTemplateForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.quotation = this.entry.quotation || {}
		this.entry.packing_items = this.entry.packing_items || []

		this.modal = {
			packing_items: { data: {} }
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

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<PackingItemModal
					isShow={this.modal.packing_items.visible}
					close={() => this.closeModal('packing_items')}
					add={(obj) => this.addList('packing_items', obj)}
					select={(obj) => this.selectList('packing_items', obj)}
					data={this.modal.packing_items.data}
					type={this.modal.packing_items.type}
				/>

				<CommonInputText
					controlLabel="テンプレート名"
					name="title"
					type="text"
					placeholder=""
					value={this.entry.title}
					entitiykey="title"
				/>
				<hr />

				<CommonTable
					name="packing_items"
					data={this.entry.packing_items}
					header={[{
						field: 'item_code',title: '品番', width: '100px'
					}, {
						field: 'regular_price', title: '通常販売価格', width: '100px',
						input: {
							onChange: (data, rowindex)=>{this.changePackingItem('regular_price', data, rowindex)},
							price: true
						}
					}, {
						field: 'regular_unit_price', title: '通常販売価格・単価', width: '120px',
						input: {
							onChange: (data, rowindex)=>{this.changePackingItem('regular_unit_price', data, rowindex)},
							price: true
						}
					}, {
						field: 'special_price', title: '特別販売価格', width: '100px',
						input: {
							onChange: (data, rowindex)=>{this.changePackingItem('special_price', data, rowindex)},
							price: true
						}
					}, {
						field: 'special_unit_price', title: '特別販売価格・単価', width: '120px',
						input: {
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
					add={() => this.showAddModal('packing_items')}
					remove={(data, index) => this.removeList('packing_items', index)}
				>
					<CommonFilterBox
						placeholder="品番から追加"
						name=""
						value={this.selectPackingItem}
						onChange={(data) => this.addList('packing_items', data.data.packing_item)}
						style={{float: 'left', width: '200px'}}
						table
						async={(input)=>this.getPackingItemList(input)}
					/>
					<Button bsSize="sm" onClick={()=>this.showEditModal('packing_items')}><Glyphicon glyph="search" /></Button>
				</CommonTable>
				<br />
			</Form>
		)
	}
}
