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

import CustomerForm from './customer-form'
import {
	CommonRegistrationBtn,
	CommonClearBtn
} from './common'

export default class CustomerRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/customer'

		// 初期値の設定
		this.entry = {
			customer: {},
			contact_information: {}
		}
	}
	/**
	 * 登録完了後の処理
	 */
	callbackRegistrationButton() {
		alert('登録が完了しました。')
		location.href = '#/CustomerList'
	}

	clear() {
		this.entry.customer.customer_name = ''
		this.entry.customer.customer_name_kana = ''
		this.entry.customer.shipper = []
		this.entry.customer.sales_staff = []
		this.entry.customer.url = ''
		this.entry.customer.person_in_charge = ''
		this.entry.customer.products = ''
		this.entry.customer.warehouse_code = ''
		this.entry.customer.working_staff = []
		this.entry.contact_information.tel = ''
		this.entry.contact_information.fax = ''
		this.entry.contact_information.email = ''
		this.entry.contact_information.zip_code = ''
		this.entry.contact_information.prefecture = ''
		this.entry.contact_information.address1 = ''
		this.entry.contact_information.address2 = ''
		this.entry.billto = {}
		this.forceUpdate()
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>顧客情報の登録</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn NavItem url={this.url} callback={this.callbackRegistrationButton} />
									<CommonClearBtn NavItem callback={()=>this.clear()} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<CustomerForm name="mainForm" entry={this.entry} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn NavItem url={this.url} callback={this.callbackRegistrationButton} />
									<CommonClearBtn NavItem callback={() => this.clear()}/>
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}
