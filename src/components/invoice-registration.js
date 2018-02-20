/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Navbar,
	Nav,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import InvoiceForm from './invoice-form'

import {
	CommonRegistrationBtn,
	CommonClearBtn,
} from './common'

import moment from 'moment'
export default class InvoiceRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			disabled: true,
		}

		// 登録先のURL
		this.url = '/d/invoice'
		this.fromUrl = '/d/quotation'

		// 初期値の設定
		this.entry = {
			invoice: {
				invoice_yearmonth: moment().format('YYYY/MM'),
			},
			item_details: [],
			billto: {},
			billfrom: {},
			contact_information: {},
			remarks: [],
		}
	}
 
	componentWillMount() {
		this.setState({ isDisabled: true })

		this.entrykey = location.hash.substring(location.hash.indexOf('?') + 1)
		
		axios({
			url: this.fromUrl + '/' + this.entrykey + '?e',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			this.setState({ isDisabled: false })

			if (response.status === 204) {
				this.setState({ isError: response })
			} else {
				this.entry.billto = response.data.feed.entry[0].billto
				this.entry.billfrom = response.data.feed.entry[0].billfrom
				this.entry.invoice.quotation_code = response.data.feed.entry[0].quotation.quotation_code

				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	callbackRegistrationButton() {
		alert('登録が完了しました。')
		location.href = '#/InvoiceList'
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>請求書の作成</PageHeader>
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
						<InvoiceForm name="mainForm" entry={this.entry} />
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