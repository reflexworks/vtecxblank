/* @flow */
import React from 'react'
//import axios from 'axios'
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

import DeliveryChargeTemplateForm from './deliverycharge-template-form'
import {
	CommonRegistrationBtn,
	CommonClearBtn,
//	CommonEntry
} from './common'

export default class DeliveryChargeTemplateRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/deliverycharge_template'

		// 備考
		this.remarks = [
			{ content:'エコ配JPは、土日祝日は対応不可となります。'},
			{ content:'離島の別途料金につきましては、ヤマト宅急便はかかりません。'},
			{ content:'荷物の運送につきましては、業務提携会社に準じます。'},
			{ content:'コレクト（代金引換）手数料は、1万円以下全国一律300円（税別）、3万円以下全国400円（税別）、10万円以下全国一律（税別）を請求させて頂きます。'}
		]

	}

	/**
	 * 登録完了後の処理
	 */
	callbackRegistrationButton() {
		location.href = '/#/DeliveryChargeTemplateList'
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>配送料テンプレート登録</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn NavItem url={this.url} callback={this.callbackRegistrationButton} type="entitiy" />
									<CommonClearBtn NavItem />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<DeliveryChargeTemplateForm name="mainForm" />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn NavItem url={this.url} callback={this.callbackRegistrationButton} type="entitiy" />
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
