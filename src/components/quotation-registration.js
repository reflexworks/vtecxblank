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
} from 'demo3.types'

import QuotationForm from './quotation-form'
import {
	CommonRegistrationBtn,
	CommonClearBtn
} from './common'

export default class QuotationRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/quotation'

		// 初期値の設定
		this.entry = {
			customer: {}
		}

	}
 
	/**
	 * 登録完了後の処理
	 */
	callbackRegistrationButton() {
		alert('登録が完了しました。')
		location.href = '#/QuotationList'
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>見積書の作成</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn NavItem url={this.url} callback={this.callbackRegistrationButton} />
									<CommonClearBtn NavItem />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<QuotationForm name="mainForm" entry={this.entry} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn NavItem url={this.url} callback={this.callbackRegistrationButton} />
									<CommonClearBtn NavItem />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}
