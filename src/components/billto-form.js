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

export default class BilltoForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.billto = this.entry.billto || {}


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

					<Panel collapsible header="請求先情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						{/* 登録の場合 */}
						{!this.entry.billto.billto_code &&
							<FormGroup className="hide">
								<FormControl name="billto.billto_code" type="text" value="${_addids}" />
								<FormControl name="link" data-rel="self" type="text" value="/billto/${_addids}" />
							</FormGroup>
						}

						{/* 更新の場合 */}
						{this.entry.billto.billto_code &&
							<CommonInputText
								controlLabel="請求書コード"
								name="billto.billto_code"
								type="text"
								placeholder="請求書コード"
								value={this.entry.billto.billto_code}
								readonly="true"
							/>
						}

						<CommonInputText
							controlLabel="請求先名"
							name="billto.billto_name"
							type="text"
							placeholder="請求先名"
							value={this.entry.billto.billto_name}
							validate="string"
							required
						/>
					
					</Panel>	
				</PanelGroup>		
			</Form>
		)
	}
}