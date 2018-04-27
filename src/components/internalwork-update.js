/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Grid,
	Row,
	Col,
	PageHeader,
} from 'react-bootstrap'
import type {
	Props
} from 'logioffice.types'

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
			internal_work: {},
			customer: {}
		}
	}
	
	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		const init = (_code) => {

			this.setState({ isDisabled: true })

			axios({
				url: '/s/get-internalwork-body?code=' + _code,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				this.setState({ isDisabled: false })

				this.entry = response.data.feed.entry[0]
				const working_yearmonth = this.entry.internal_work.working_yearmonth

				const year = working_yearmonth.split('/')[0]
				const month = working_yearmonth.split('/')[1]

				if (this.entry.billto.billing_closing_date === '1') {
					let befor_month = parseInt(month) - 1
					const befor_year = befor_month === 0 ? parseInt(befor_year) - 1 : year
					befor_month = befor_month === 0 ? 12 : befor_month
					this.monthly = befor_year + '年' + befor_month + '月21日〜' + year + '年' + month + '月20日'
				} else {
					this.monthly = year + '年' + month + '月01日〜' + year + '年' + month + '月末日'
				}

				this.forceUpdate()

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}

		let code = location.hash.split('=')[1] ? location.hash.split('=')[1] : null

		init(code)

	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>庫内作業状況：{this.monthly}：{this.entry.customer.customer_name}</PageHeader>
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
