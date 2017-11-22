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
	CommonRadioBtn,
} from './common'

export default class ManifestoForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.manifesto = this.entry.manifesto || {}

		this.forceUpdate()		
	}


	changedOuterWidth(value) {
		
		/**
		 * value,depth,heightのどれかが空ならtotalも空にする
		 */

		if (this.entry.manifesto.outer_depth  &&
			this.entry.manifesto.outer_height && value) {
			this.entry.manifesto.outer_total = parseInt(value) + parseInt(this.entry.manifesto.outer_depth) + parseInt(this.entry.manifesto.outer_height)
		} else {
			this.entry.manifesto.outer_total = ''	
		}

		this.entry.manifesto.outer_width = value
		this.forceUpdate()
	}

	changedOuterDepth(value) {

		/**
		 * width,value,heightのどれかが空ならtotalも空にする
		 */

		if (this.entry.manifesto.outer_width  &&
			this.entry.manifesto.outer_height && value) {
			this.entry.manifesto.outer_total = parseInt(this.entry.manifesto.outer_width) + parseInt(value) + parseInt(this.entry.manifesto.outer_height)
		} else {
			this.entry.manifesto.outer_total = ''
		}

		this.entry.manifesto.outer_depth = value
		this.forceUpdate()
	}

	changedOuterHeight(value) {

		/**
		 * width,depth,valueのどれかが空ならtotalも空にする
		 */

		if (this.entry.manifesto.outer_width &&
			this.entry.manifesto.outer_depth && value) {
			this.entry.manifesto.outer_total = parseInt(this.entry.manifesto.outer_width) + parseInt(this.entry.manifesto.outer_depth) + parseInt(value)
		} else {
			this.entry.manifesto.outer_total = ''
		}

		this.entry.manifesto.outer_height = value
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
						{!this.entry.manifesto.manifesto_code &&
							<FormGroup className="hide">
								<FormControl name="link" data-rel="self" type="text" value="/manifesto/${manifesto.manifesto_code}" />
							</FormGroup>
						}
						{!this.entry.manifesto.manifesto_code &&
							<CommonInputText
								controlLabel="品番"
								name="manifesto.manifesto_code"
								type="text"
								placeholder="品番"
								value={this.entry.manifesto.manifesto_code}
							/>
						}

						{/* 更新の場合 */}
						{this.entry.manifesto.manifesto_code &&
							<CommonInputText
								controlLabel="品番"
								name="manifesto.manifesto_code"
								type="text"
								placeholder="品番"
								value={this.entry.manifesto.manifesto_code}
								readonly="true"
							/>
						}

						<CommonInputText
							controlLabel="商品名称"
							name="manifesto.manifesto_name"
							type="text"
							placeholder="商品名称"
							value={this.entry.manifesto.manifesto_name}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="材質"
							name="manifesto.material"
							type="text"
							placeholder="材質"
							value={this.entry.manifesto.material}
							validate="string"
							required
						/>
					</Panel>

					<Panel collapsible header="製品寸法" eventKey="2" bsStyle="info" defaultExpanded="true">						
						<CommonInputText
							controlLabel="厚み"
							name="manifesto.thickness"
							type="text"
							placeholder="厚み"
							size='sm'
							value={this.entry.manifesto.thickness}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="内寸幅"
							name="manifesto.inside_width"
							type="text"
							placeholder="内寸幅"
							size='sm'
							value={this.entry.manifesto.inside_width}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="内寸奥行"
							name="manifesto.inside_depth"
							type="text"
							placeholder="内寸奥行"
							size='sm'
							value={this.entry.manifesto.inside_depth}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="内寸高さ"
							name="manifesto.inside_height"
							type="text"
							placeholder="内寸高さ"
							size='sm'
							value={this.entry.manifesto.inside_height}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="外寸幅"
							name="manifesto.outer_width"
							type="text"
							placeholder="外寸幅"
							size='sm'
							value={this.entry.manifesto.outer_width}
							validate="number"
							required
							onChange={(value) => this.changedOuterWidth(value)}
						/>
								
						<CommonInputText
							controlLabel="外寸奥行"
							name="manifesto.outer_depth"
							type="text"
							placeholder="外寸奥行"
							size='sm'
							value={this.entry.manifesto.outer_depth}
							validate="number"
							required
							onChange={(value) => this.changedOuterDepth(value)}
						/>

						<CommonInputText
							controlLabel="外寸高さ"
							name="manifesto.outer_height"
							type="text"
							placeholder="外寸高さ"
							size='sm'
							value={this.entry.manifesto.outer_height}
							validate="number"
							required
							onChange={(value) => this.changedOuterHeight(value)}
						/>

						<CommonInputText
							controlLabel="三辺合計"
							name="manifesto.outer_total"
							type="text"
							size='sm'
							value={this.entry.manifesto.outer_total}
							required
							readonly='true'
						/>
						
					</Panel>

					<Panel collapsible header="価格情報" eventKey="3" bsStyle="info" defaultExpanded="true">
						
						<CommonInputText
							controlLabel="通常販売価格"
							name="manifesto.regular_price"
							type="text"
							placeholder="通常販売価格"
							value={this.entry.manifesto.regular_price}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="通常販売価格・単価"
							name="manifesto.regular_unit_price"
							type="text"
							placeholder="通常販売価格・単価"
							value={this.entry.manifesto.regular_unit_price}
							validate="string"
							required
						/>
						
						<CommonInputText
							controlLabel="特別販売価格"
							name="manifesto.special_price"
							type="text"
							placeholder="特別販売価格"
							value={this.entry.manifesto.special_price}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="特別販売価格・単価"
							name="manifesto.special_unit_price"
							type="text"
							placeholder="特別販売価格・単価"
							value={this.entry.manifesto.special_unit_price}
							validate="string"
							required
						/>

						<CommonRadioBtn
							controlLabel="ロット"
							name="manifesto.islot"
							checked={this.entry.manifesto.islot}
							data={[{
								label: '１品単位',
								value: '0'
							}, {
								label: 'ロット単位',
								value: '1'
							}]}
						/>						
					</Panel>	

				</PanelGroup>		
			</Form>
		)
	}
}
