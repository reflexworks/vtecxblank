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
	CommonPrefecture,
} from './common'

export default class WarehouseForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.warehouse = this.entry.warehouse || {}


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

					<Panel collapsible header="倉庫情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						{/* 登録の場合 */}
						{!this.entry.warehouse.warehouse_code &&
							<FormGroup className="hide">
								<FormControl name="warehouse.warehouse_code" type="text" value="${_addids}" />
								<FormControl name="link" data-rel="self" type="text" value="/warehouse/${_addids}" />
							</FormGroup>
						}

						{/* 更新の場合 */}
						{this.entry.warehouse.warehouse_code &&
							<CommonInputText
								controlLabel="倉庫コード"
								name="warehouse.warehouse_code"
								type="text"
								placeholder="倉庫コード"
								value={this.entry.warehouse.warehouse_code}
								readonly="true"
							/>
						}

						<CommonInputText
							controlLabel="倉庫名"
							name="warehouse.warehouse_name"
							type="text"
							placeholder="倉庫名"
							value={this.entry.warehouse.warehouse_name}
							validate="string"
							required
						/>
					
						<CommonInputText
							controlLabel="郵便番号"
							name="warehouse.zip_code"
							type="text"
							placeholder="123-4567"
							value={this.entry.warehouse.zip_code}
							size="sm"
						/>

						<CommonPrefecture
							controlLabel="都道府県"
							componentClass="select"
							name="warehouse.prefecture"
							value={this.entry.warehouse.prefecture}
							size="sm"
						/>

						<CommonInputText
							controlLabel="市区郡長村"
							name="warehouse.address1"
							type="text"
							placeholder="◯◯市××町"
							value={this.entry.warehouse.address1}
						/>

						<CommonInputText
							controlLabel="番地"
							name="warehouse.address2"
							type="text"
							placeholder="1丁目2番地 ◯◯ビル1階"
							value={this.entry.warehouse.address2}
						/>

					</Panel>	
				</PanelGroup>		
			</Form>
		)
	}
}