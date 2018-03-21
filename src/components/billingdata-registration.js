/* @flow */
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import BillingDataForm from './billingdata-form'

export default class BillingDataRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = {
			billing_data: {},
		}
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>配送会社別請求データ：２０１７年１２月分</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<BillingDataForm name="mainForm" entry={this.entry} />
					</Col>
				</Row>
			</Grid>
		)
	}
}