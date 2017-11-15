/* @flow */
import React from 'react'
//import axios from 'axios'
import {
	Form,
	PanelGroup,
	Panel,
	Button,
	Glyphicon,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	//CommonFilterBox,
	CommonTable,
} from './common'

import {
	BasicModal,
} from './basiccondition-modal'



export default class BasicConditionForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			 showConditionModal: false,
		}

		this.entry = this.props.entry
		this.entry.billto = this.entry.billto || {}
		this.entry.basic_condition = this.entry.basic_condition || {}

		this.forceUpdate()
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	addCondition(obj) {

		if (!this.entry.basic_condition.condition) {
			console.log('create')
			this.entry.basic_condition.condition = []
		}
		this.entry.basic_condition.condition.push(obj)
		this.setState({ showConditionModal: false })
		
	}

	closeCondition() {
		this.setState({showConditionModal:false})    
	}


	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="請求先情報" eventKey="1" bsStyle="info" defaultExpanded="true">
						
					</Panel>
					<Panel collapsible header="基本条件情報" eventKey="2" bsStyle="info" defaultExpanded="true">

						<BasicModal isShow={this.state.showConditionModal}
							callback={(obj) => this.addCondition(obj)}
							callbackClose={() => this.closeCondition()} />

						<CommonInputText
							controlLabel="タイトル"
							name="basic.condition.title"
							type="text"
							placeholder="タイトル"
							value={this.entry.basic_condition.title}
							validate="string"
							required
						/>


						<CommonTable
							controlLabel="基本条件"
							name="basic_condition.condition"
							data={this.entry.basic_condition.condition}
							header={[{
								field: 'content',title: '内容', width: '200px'
							}]}
						>
							<Button onClick={() => this.setState({ showConditionModal: true })}>
								<Glyphicon glyph="plus"></Glyphicon>
							</Button>
						</CommonTable>
						
						
					</Panel>
				</PanelGroup>
			</Form>
		)
	}
}