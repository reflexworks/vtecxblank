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
	CommonFilterBox,
} from './common'

export default class TypeAheadForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			showItemModal: false,
		}

		this.entry = this.props.entry
		this.entry.type_ahead = this.entry.type_ahead || []
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

					<Panel collapsible header="入力補完登録" eventKey="1" bsStyle="info" defaultExpanded="true">

						<CommonFilterBox
							controlLabel="入力補完種別"
							size="sm"
							name="type_ahead.type"
							value={this.entry.type_ahead.type}
							options={[{
								label: '項目名',
								value: '0'
							}, {
								label: '単位名称',
								value: '1'
							}, {
								label: '単位',
								value: '2'
							}, {
								label: '単価',
								value: '3'
							}, {
								label: '備考',
								value: '4'
							}]}
						/>
							
						<CommonInputText
							controlLabel="入力補完内容"   
							name="type_ahead.value"
							type="text"
							value={this.entry.type_ahead.value}
							placeholder="入力補完内容"
							size='lg'
						/>

					</Panel>

				        
				</PanelGroup>
				
			</Form>
		)
	}
}