/* @flow */
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Navbar,
	Nav
} from 'react-bootstrap'
import type {
	Props
} from 'logioffice.types'

import PackingItemForm from './packingitem-form'
import {
	CommonRegistrationBtn,
	CommonClearBtn
} from './common'

export default class PackingItemRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/packing_item'

		// 初期値の設定
		this.entry = {
			packing_item: {},
		}
		this.disabled = true
	}
 
	/**
	 * 登録完了後の処理
	 */
	callbackRegistrationButton() {
		alert('登録が完了しました。')
		location.href = '#/PackingItemList'
	}

	/**
	 * 入力チェック
	 * @param {*} _data 
	 */
	onCheck(_data) {
		this.disabled = !_data
		this.forceUpdate()
	}

	clear() {
		this.entry.packing_item.item_code = ''
		this.entry.packing_item.item_name = ''
		this.entry.packing_item.material = ''
		this.entry.packing_item.category = ''
		this.entry.packing_item.size1 = ''
		this.entry.packing_item.size2 = ''
		this.entry.packing_item.notices = ''
		this.entry.packing_item.thickness = ''
		this.entry.packing_item.inside_width = ''
		this.entry.packing_item.inside_depth = ''
		this.entry.packing_item.inside_height = ''
		this.entry.packing_item.outer_width = ''
		this.entry.packing_item.outer_depth = ''
		this.entry.packing_item.outer_height = ''
		this.entry.packing_item.outer_total = ''
		this.entry.packing_item.purchase_price = ''
		this.entry.packing_item.regular_price = ''
		this.entry.packing_item.regular_unit_price = ''
		this.entry.packing_item.special_price = ''
		this.entry.packing_item.special_unit_price = ''
		this.forceUpdate()
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>資材情報の登録</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn disabled={this.disabled} NavItem url={this.url} callback={this.callbackRegistrationButton} />
									<CommonClearBtn NavItem callback={()=>this.clear()} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PackingItemForm name="mainForm" entry={this.entry} onCheck={(data)=>this.onCheck(data)} isCreate={true} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn disabled={this.disabled} NavItem url={this.url} callback={this.callbackRegistrationButton} />
									<CommonClearBtn NavItem callback={()=>this.clear()} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}