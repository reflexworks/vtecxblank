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

export default class ManifestoForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			 outer_width:  '',
			 outer_height: '',
			 outer_depth:  '',
		 	 outer_total:  '',
		}

		this.entry = this.props.entry
		this.entry.manifesto = this.entry.manifesto || {}

		this.forceUpdate()		
	}


	changedOuterWidth(value) {
		
		/**
		 * width,height,depthのどれかが0ならばtotalは0
		 */
		
		if (value || this.state.outer_height || this.state.outer_depth ) {
			this.setState({ outer_total: 0 })
		} else {
			this.setState({
				outer_total: parseInt(value) + parseInt(this.state.outer_depth) + parseInt(this.state.outer_height),
			})
		}
		this.setState({outer_width: value})
		
	}

	changedOuterDepth(value) {
		/**
		 * width,height,depthのどれかが0ならばtotalは0
		 */
		
		if (this.state.outer_width || value || this.state.outer_height ) {
			this.setState({ outer_total: 0 })
		} else {
			this.setState({
				outer_total: parseInt(this.state.outer_width) + parseInt(value) + parseInt(this.state.outer_height),
				outer_depth: value
			})
		}	
	}

	changedOuterHeight(value) {
		/**
		 * width,height,depthのどれかが0ならばtotalは0
		 */
		
		if (this.state.outer_width  || this.state.outer_depth || value) {
			this.setState({ outer_total: 0 })
		} else {
			this.setState({
				outer_total: parseInt(this.state.outer_width) + parseInt(this.state.outer_depth) + parseInt(value),
				outer_height: value
			})
		}	
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
								<FormControl name="manifesto.manifesto_code" type="text" value="${_addids}" />
								<FormControl name="link" data-rel="self" type="text" value="/manifesto/${_addids}" />
							</FormGroup>
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
							value={this.state.outer_width}
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
							value={this.state.outer_depth}
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
							value={this.state.outer_height}
							validate="number"
							required
							onChange={(value) => this.changedOuterHeight(value)}
						/>

						<CommonInputText
							controlLabel="三辺合計"
							name="manifesto.outer_total"
							type="text"
							size='sm'
							value={this.state.outer_total}
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

					</Panel>	

				</PanelGroup>		
			</Form>
		)
	}
}