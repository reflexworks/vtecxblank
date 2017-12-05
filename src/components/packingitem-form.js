/* @flow */
import React from 'react'
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
	CommonInputText,
} from './common'

export default class PackingItemForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.packing_item = this.entry.packing_item || {}

		this.forceUpdate()		
	}


	changedOuterWidth(value) {
		
		/**
		 * value,depth,heightのどれかが空ならtotalも空にする
		 */

		if (this.entry.packing_item.outer_depth  &&
			this.entry.packing_item.outer_height && value) {
			this.entry.packing_item.outer_total = parseInt(value) + parseInt(this.entry.packing_item.outer_depth) + parseInt(this.entry.packing_item.outer_height)
		} else {
			this.entry.packing_item.outer_total = ''	
		}

		this.entry.packing_item.outer_width = value
		this.forceUpdate()
	}

	changedOuterDepth(value) {

		/**
		 * width,value,heightのどれかが空ならtotalも空にする
		 */

		if (this.entry.packing_item.outer_width  &&
			this.entry.packing_item.outer_height && value) {
			this.entry.packing_item.outer_total = parseInt(this.entry.packing_item.outer_width) + parseInt(value) + parseInt(this.entry.packing_item.outer_height)
		} else {
			this.entry.packing_item.outer_total = ''
		}

		this.entry.packing_item.outer_depth = value
		this.forceUpdate()
	}

	changedOuterHeight(value) {

		/**
		 * width,depth,valueのどれかが空ならtotalも空にする
		 */

		if (this.entry.packing_item.outer_width &&
			this.entry.packing_item.outer_depth && value) {
			this.entry.packing_item.outer_total = parseInt(this.entry.packing_item.outer_width) + parseInt(this.entry.packing_item.outer_depth) + parseInt(value)
		} else {
			this.entry.packing_item.outer_total = ''
		}

		this.entry.packing_item.outer_height = value
		this.forceUpdate()
	}
	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="資材情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						{/* 登録の場合 */}
						{!this.entry.packing_item.item_code &&
							<FormGroup className="hide">
								<FormControl name="link" data-rel="self" type="text" value="/packing_item/${packing_item.item_code}" />
							</FormGroup>
						}
						{!this.entry.packing_item.item_code &&
							<CommonInputText
								controlLabel="品番"
								name="packing_item.item_code"
								type="text"
								placeholder="品番"
								value={this.entry.packing_item.item_code}
							/>
						}

						{/* 更新の場合 */}
						{this.entry.packing_item.item_code &&
							<CommonInputText
								controlLabel="品番"
								name="packing_item.item_code"
								type="text"
								placeholder="品番"
								value={this.entry.packing_item.item_code}
								readonly="true"
							/>
						}

						<CommonInputText
							controlLabel="商品名称"
							name="packing_item.item_name"
							type="text"
							placeholder="商品名称"
							value={this.entry.packing_item.item_name}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="材質"
							name="packing_item.material"
							type="text"
							placeholder="材質"
							value={this.entry.packing_item.material}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="カテゴリ"
							name="packing_item.category"
							type="text"
							placeholder="カテゴリ"
							value={this.entry.packing_item.category}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="サイズ１"
							name="packing_item.size1"
							type="text"
							placeholder="サイズ１"
							value={this.entry.packing_item.size1}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="サイズ２"
							name="packing_item.size2"
							type="text"
							placeholder="サイズ２"
							value={this.entry.packing_item.size2}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="特記"
							name="packing_item.notices"
							type="text"
							placeholder="特記"
							value={this.entry.packing_item.notices}
							validate="string"
							required
						/>

					</Panel>

					<Panel collapsible header="製品寸法" eventKey="2" bsStyle="info" defaultExpanded="true">						
						<CommonInputText
							controlLabel="厚み"
							name="packing_item.thickness"
							type="text"
							placeholder="厚み"
							size='sm'
							value={this.entry.packing_item.thickness}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="内寸幅"
							name="packing_item.inside_width"
							type="text"
							placeholder="内寸幅"
							size='sm'
							value={this.entry.packing_item.inside_width}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="内寸奥行"
							name="packing_item.inside_depth"
							type="text"
							placeholder="内寸奥行"
							size='sm'
							value={this.entry.packing_item.inside_depth}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="内寸高さ"
							name="packing_item.inside_height"
							type="text"
							placeholder="内寸高さ"
							size='sm'
							value={this.entry.packing_item.inside_height}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="外寸幅"
							name="packing_item.outer_width"
							type="text"
							placeholder="外寸幅"
							size='sm'
							value={this.entry.packing_item.outer_width}
							validate="number"
							required
							onChange={(value) => this.changedOuterWidth(value)}
						/>
								
						<CommonInputText
							controlLabel="外寸奥行"
							name="packing_item.outer_depth"
							type="text"
							placeholder="外寸奥行"
							size='sm'
							value={this.entry.packing_item.outer_depth}
							validate="number"
							required
							onChange={(value) => this.changedOuterDepth(value)}
						/>

						<CommonInputText
							controlLabel="外寸高さ"
							name="packing_item.outer_height"
							type="text"
							placeholder="外寸高さ"
							size='sm'
							value={this.entry.packing_item.outer_height}
							validate="number"
							required
							onChange={(value) => this.changedOuterHeight(value)}
						/>

						<CommonInputText
							controlLabel="三辺合計"
							name="packing_item.outer_total"
							type="text"
							size='sm'
							value={this.entry.packing_item.outer_total}
							required
							readonly='true'
						/>
						
					</Panel>

					<Panel collapsible header="価格情報" eventKey="3" bsStyle="info" defaultExpanded="true">
						
						<CommonInputText
							controlLabel="仕入れ単価"
							name="packing_item.purchase_price"
							type="text"
							placeholder="仕入れ単価"
							value={this.entry.packing_item.purchase_price}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="通常販売価格"
							name="packing_item.regular_price"
							type="text"
							placeholder="通常販売価格"
							value={this.entry.packing_item.regular_price}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="通常販売価格・単価"
							name="packing_item.regular_unit_price"
							type="text"
							placeholder="通常販売価格・単価"
							value={this.entry.packing_item.regular_unit_price}
							validate="string"
							required
						/>
						
						<CommonInputText
							controlLabel="特別販売価格"
							name="packing_item.special_price"
							type="text"
							placeholder="特別販売価格"
							value={this.entry.packing_item.special_price}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="特別販売価格・単価"
							name="packing_item.special_unit_price"
							type="text"
							placeholder="特別販売価格・単価"
							value={this.entry.packing_item.special_unit_price}
							validate="string"
							required
						/>
				
					</Panel>	
				</PanelGroup>		
			</Form>
		)
	}
}
