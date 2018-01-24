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
				url: '/d/internal_work/' + _code,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				this.setState({ isDisabled: false })

				this.entry = response.data.feed.entry[0]
				const working_yearmonth = this.entry.internal_work.working_yearmonth
				this.monthly = working_yearmonth.split('/')[0] + '年' + working_yearmonth.split('/')[1] + '月'

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
						<PageHeader>庫内作業状況：{this.monthly} {this.entry.customer.customer_name}</PageHeader>
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
