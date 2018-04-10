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
	CommonLoginUser,
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
		this.sideurl = '/d/invoice_details'

		// 初期値の設定
		this.entry = {
			invoice: {
				invoice_yearmonth: moment().format('YYYY/MM'),
				payment_date:moment(),
			},
			billto: {},
			billfrom: {},
			contact_information: {},
			remarks:[],
			creator: CommonLoginUser().get().staff_name
		}
		this.item_details = null
		this.edit = null
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
	
			if (response.status === 204) {
				this.setState({ isDisabled: false,isError: response })
			} else {
				this.entry.invoice.quotation_code = response.data.feed.entry[0].quotation.quotation_code
				this.entry.invoice.invoice_yearmonth = moment().format('YYYY/MM')
				this.entry.billto = response.data.feed.entry[0].billto
				this.entry.billfrom = response.data.feed.entry[0].billfrom || {}
				
				this.setState({ isDisabled: false })

			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	setReqestData(_data, _type) {
		if (_type === 'item_details' && _data) {
			const array = []
			Object.keys(_data.item_details).forEach((_key) => {
				const list = _data.item_details[_key]
				list.map((_value) => {
					array.push(_value)
				})
			})
			_data.item_details = array
		}
		this[_type] = _data
	}

	callbackRegistrationButton(_res_data) {
		const rea_data = _res_data.feed.entry[0]
		const req = { feed: { entry: [] } }
		const key = rea_data.invoice.invoice_code + '-' + rea_data.invoice.invoice_code_sub
		const item_details_obj_self = {
			link: [{
				___href: '/invoice_details/' + key,
				___rel: 'self'
			}]
		}
		const remarks_obj_self = {
			link: [{
				___href: '/invoice_remarks/' + key,
				___rel: 'self'
			}]
		}
		req.feed.entry.push(item_details_obj_self)
		req.feed.entry.push(remarks_obj_self)

		let item_details
		if (this.item_details) {
			item_details = JSON.parse(JSON.stringify(this.item_details))
		}
		if (this.remarks) {
			if (item_details) {
				item_details.remarks = JSON.parse(JSON.stringify(this.remarks.remarks))
			} else {
				item_details = JSON.parse(JSON.stringify(this.remarks))
			}
		}
		if (item_details) {
			item_details.invoice = {
				invoice_code: rea_data.invoice.invoice_code,
				invoice_code_sub: rea_data.invoice.invoice_code_sub
			}
			item_details.link = [{
				___href: '/invoice_details/' + key + '/' + rea_data.invoice.customer_code,
				___rel: 'self'
			}]
			req.feed.entry.push(item_details)
		}

		if (this.edit) {
			let edit = JSON.parse(JSON.stringify(this.edit))
			edit.invoice.invoice_code = rea_data.invoice.invoice_code
			edit.invoice.invoice_code_sub = rea_data.invoice.invoice_code_sub
			edit.link = [{
				___href: '/invoice_remarks/' + key + '/' + rea_data.invoice.customer_code,
				___rel: 'self'
			}]
			req.feed.entry.push(edit)
		}
		if (req.feed.entry.length) {
			this.doAfterPost(req)
		} else {
			this.compleat()
		}
	}

	compleat() {
		alert('登録が完了しました。')
		location.href = '#/InvoiceList'
	}

	doAfterPost(_data) {
		axios({
			url: '/d/',
			method: 'post',
			data: _data,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then(() => {
	
			this.compleat()

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
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
									<CommonRegistrationBtn NavItem url={this.url} callback={(_res_data)=>this.callbackRegistrationButton(_res_data)} />
									<CommonClearBtn NavItem />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<InvoiceForm name="mainForm" entry={this.entry} setReqestData={(_data, _type)=>this.setReqestData(_data, _type)} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn NavItem url={this.url} callback={(_res_data)=>this.callbackRegistrationButton(_res_data)} />
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