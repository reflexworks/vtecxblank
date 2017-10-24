/* @flow */
import React from 'react'
import {
	Form,


	PanelGroup,
	Panel,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonSelectBox
} from './common'

export default class StaffForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.staff = this.entry.staff || {}


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

					<Panel collapsible header="担当者情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						<CommonInputText
							controlLabel="担当者名"
							name="staff.staff_name"
							type="text"
							placeholder="担当者名"
							value={this.entry.staff.staff_name}
							validate="string"
							required
						/>	
						
						<CommonSelectBox
							controlLabel="ロール"
							size="sm"
							name="staff.role"
							value={this.entry.staff.role}
							options={[{
								label: '管理者',
								value: '1'
							}, {
								label: '上長',
								value: '2'
							}, {
								label: '作業員',
								value: '3'
							}]}
						/>

						<CommonInputText
							controlLabel="上長メールアドレス"
							name="staff.superior_email"
							type="email"
							placeholder="logioffice@gmail.com"
							value={this.entry.staff.superior_email}
						/>

						<CommonInputText
							controlLabel="メールアドレス"
							name="staff.staff_email"
							type="email"
							placeholder="logioffice@gmail.com"
							value={this.entry.staff.staff_email}
						/>

					</Panel>	
				</PanelGroup>		
			</Form>
		)
	}
}
