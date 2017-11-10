/* @flow */
import React from 'react'
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
	//CommonInputText,
	CommonTable,
} from './common'

import {
	ItemModal,
} from './itemdetails-modal'

export default class ItemDetailsForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			showItemModal: false,
		}

		this.entry = this.props.entry
		this.entry.item_details = this.entry.item_details || []

	}


	/**
	 * remarksにRemarksModalのフォームで入力した物を追加する
	 */
	addItem(obj) {
		if (!this.entry.item_details) {
			this.entry.item_details = []
		}
		this.entry.item_details.push(obj)
		this.setState({showItemModal:false})
	}
	closeItem() {
		this.setState({showItemModal:false})
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

					<Panel collapsible header="明細項目" eventKey="1" bsStyle="info" defaultExpanded="true">

						

						<ItemModal isShow={this.state.showItemModal}
								   callback={(obj) => this.addItem(obj)}
								   callbackClose={() => this.closeItem()} />

						<CommonTable
	
							name="item_details" 
							data={this.entry.item_details}
							header={[{
    							field: 'item_name',title: '項目', width: '100px'
    						}, {
    							field: 'unit_name', title: '単位名称', width: '200px'
    						}, {
    							field: 'unit', title: '単位', width: '200px'
    						}, {
    							field: 'quantity', title: '数量', width: '200px'
    						}, {
    							field: 'unit_price', title: '単価', width: '150px'
    						}, {
    							field: 'remarks', title: '備考', width: '200px'
    						}, {
    							field: 'is_taxation', title: '課税対象', width: '200px'

    						}]}
						>
							<Button onClick={() => this.setState({ showItemModal: true })}>
								<Glyphicon glyph="plus"></Glyphicon>
							</Button>
						</CommonTable>

					</Panel>

				        
				</PanelGroup>
				
			</Form>
		)
	}
}