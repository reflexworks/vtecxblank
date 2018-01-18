/* @flow */
import React from 'react'
//import axios from 'axios'
import {
	Grid,
	Row,
	Col,
	PageHeader,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import InternalWorkForm from './internalwork-form'
import {
//	CommonRegistrationBtn,
//	CommonClearBtn
} from './common'

export default class InternalWorkUpdate extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/internal_work'

		// 初期値の設定
		this.entry = {
			internal_work: {}
		}
	}
	
	/**
     * 登録完了後の処理
     */
	callbackRegistrationButton() {
		alert('登録が完了しました。')
		location.href = '#/InternalWorkList'
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>庫内作業状況：2017年12月 株式会社 テスト顧客</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<InternalWorkForm name="mainForm" entry={this.entry} />
					</Col>
				</Row>
			</Grid>
		)
	}
}
