/* @flow */
import axios from 'axios'
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
} from 'demo3.types'

import ShipmentServiceForm from './shipment-service-form'
import {
	CommonIndicator,
	CommonNetworkMessage,
	CommonUpdateBtn,
	CommonDeleteBtn,
	CommonBackBtn
} from './common'

export default class ShipmentServiceUpdate extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			isDisabled: false,
			isError: {}
		}

		// URL設定
		this.url = '/d/shipment_service'

		// 戻る先のURL
		this.backUrl = '#/ShipmentServiceList'

		// 初期値の設定
		this.entry = {}
		this.entry.shipment_service = {}
		this.entry.shipment_service.sizes = []
		this.entry.zone = []

	}
 
	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setState({ isDisabled: true })

		this.entrykey = location.hash.substring(location.hash.indexOf('?') + 1)
		
		axios({
			url: '/s/get-shipment-service-sort?shipment_service_code=' + this.entrykey,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			this.setState({ isDisabled: false })

			if (response.status === 204) {
				this.setState({ isError: response })
			} else {
				this.entry = response.data.feed.entry[0]
				if (this.entry.zone) {
					this.entry.zone = this.entry.zone.map((_value) => {
						if (!_value.invoice_zones) {
							_value.invoice_zones = []
						}
						return _value
					})
				}
				
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}

	/**
	 * 更新完了後の処理
	 */
	callbackButton() {
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

						{/* 通信中インジケータ */}
						<CommonIndicator visible={this.state.isDisabled} />

						{/* 通信メッセージ */}
						<CommonNetworkMessage isError={this.state.isError}/>

						<PageHeader>
							配送業者の更新
						</PageHeader>

					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonBackBtn NavItem href={this.backUrl} />
									<CommonUpdateBtn NavItem url={this.url} callback={this.callbackButton} entry={this.entry} />
									<CommonDeleteBtn NavItem entry={this.entry} callback={this.callbackDeleteButton.bind(this)} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<ShipmentServiceForm name="mainForm" entry={this.entry} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonBackBtn NavItem href={this.backUrl} />
									<CommonUpdateBtn NavItem url={this.url} callback={this.callbackButton} entry={this.entry} />
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
