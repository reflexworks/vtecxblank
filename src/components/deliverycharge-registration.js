/* @flow */
import React from 'react'
import axios from 'axios'
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

import DeliveryChargeForm from './deliverycharge-form'
import {
	CommonRegistrationBtn,
	CommonUpdateBtn,
	CommonClearBtn,
	CommonEntry
} from './common'

export default class DeliveryChargeRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/'

		// 備考
		this.remarks = [
			{ content:'エコ配JPは、土日祝日は対応不可となります。'},
			{ content:'離島の別途料金につきましては、ヤマト宅急便はかかりません。'},
			{ content:'荷物の運送につきましては、業務提携会社に準じます。'},
			{ content:'コレクト（代金引換）手数料は、1万円以下全国一律300円（税別）、3万円以下全国400円（税別）、10万円以下全国一律（税別）を請求させて頂きます。'}
		]

		this.initEntry()
	}

	// 初期値の設定
	initEntry() {
		this.entry = {
			customer: {},
			remarks: []
		}
	}
 
	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		const init = () => {

			this.setState({ isDisabled: true })

			this.initEntry()

			axios({
				url: '/s/deliverycharge?customer_code=' + customer_code,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				this.setState({ isDisabled: false })

				if (response.status === 204) {
					alert('配送業者が1件も登録されていません。')
				} else {
					if (!response.data.feed.entry[0].remarks) {
						response.data.feed.entry[0].remarks = this.remarks
					}
					const obj = CommonEntry().init(Object.assign(this.entry, response.data.feed.entry[0]))
					this.entry = obj.feed.entry[0]
					if (this.entry.id) {
						this.button = <CommonUpdateBtn NavItem url={this.url} entry={this.entry} callback={this.callbackUpdateButton} type="entitiy" />
					} else {
						this.button = <CommonRegistrationBtn NavItem url={this.url} callback={this.callbackRegistrationButton} type="entitiy" />
					}

					this.forceUpdate()
				}

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}

		const customer_code = location.hash.split('=')[1] ? location.hash.split('=')[1] : null

		if (customer_code) {
			init()
		} else {
			location.href = '#'
		}

	}

	/**
	 * 登録完了後の処理
	 */
	callbackRegistrationButton() {
		alert('登録が完了しました。')
		location.reload()
	}

	/**
	 * 更新完了後の処理
	 */
	callbackUpdateButton() {
		alert('更新が完了しました。')
		location.reload()
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>配送料詳細：{this.entry.customer.customer_name}({this.entry.customer.customer_code})</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									{this.button}
									<CommonClearBtn NavItem />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<DeliveryChargeForm name="mainForm" entry={this.entry} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									{this.button}
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
