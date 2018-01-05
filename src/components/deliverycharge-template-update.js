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

import DeliveryChargeTemplateForm from './deliverycharge-template-form'
import {
	CommonUpdateBtn,
	CommonBackBtn,
	CommonDeleteBtn,
	CommonEntry
} from './common'

export default class DeliveryChargeTemplateUpdate extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/deliverycharge_template'

		// 戻る先のURL
		this.backUrl = '#/DeliveryChargeTemplateList'

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

		const init = (_code) => {

			this.setState({ isDisabled: true })

			this.initEntry()

			axios({
				url: '/s/deliverycharge?template=' + _code,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				this.setState({ isDisabled: false })

				if (!response.data.feed.entry[0].remarks) {
					response.data.feed.entry[0].remarks = this.remarks
				}
				const obj = CommonEntry().init(Object.assign(this.entry, response.data.feed.entry[0]))
				this.entry = obj.feed.entry[0]

				this.forceUpdate()

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}

		let code = location.hash.split('=')[1] ? location.hash.split('=')[1] : null

		init(code)

	}

	/**
	 * 更新完了後の処理
	 */
	callbackUpdateButton() {
		alert('更新が完了しました。')
		location.reload()
	}

	/**
	 * 削除完了後の処理
	 */
	callbackDeleteButton() {
		alert('削除が完了しました。')
		location.href = this.backUrl
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>配送料テンプレート更新</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonBackBtn NavItem href={this.backUrl} />
									<CommonUpdateBtn NavItem url={this.url} entry={this.entry} callback={this.callbackUpdateButton} type="entitiy" />
									<CommonDeleteBtn NavItem entry={this.entry} callback={this.callbackDeleteButton.bind(this)} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<DeliveryChargeTemplateForm name="mainForm" entry={this.entry} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonBackBtn NavItem href={this.backUrl} />
									<CommonUpdateBtn NavItem url={this.url} entry={this.entry} callback={this.callbackUpdateButton} type="entitiy" />
									<CommonDeleteBtn NavItem entry={this.entry} callback={this.callbackDeleteButton.bind(this)} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}
