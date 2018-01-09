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


export default class InternalWorkRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/internal_work'

		// 初期値の設定
		this.entry = {
			internal_work: {},
			remarks: [],
		}

		this.master = {
			shipment_service: []
		}
	}
	
	setShipmentService(entrys) {
		let shipment_service = []
		for (let entry of entrys) {
			const name = entry.shipment_service.name
			const type = entry.shipment_service.type
			const service_name = entry.shipment_service.service_name
			const sizes = entry.shipment_service.sizes
			const setName = (_name, _type, _service_name, _size, _weight) => {
				let array = []
				if (_name) array.push(_name)
				if (_service_name) {
					array.push(_service_name)
				} else {
					array.push((_type === '1') ? '発払い' : 'メール便')
				}
				if (_size) array.push(_size)
				if (_weight) array.push(_weight)
				return array.join(' / ')
			}
			if (sizes && name !== 'ヤマト運輸') {
				for (let size of sizes) {
					shipment_service.push(setName(name, type, service_name, size.size, size.weight))
				}
			} else {
				shipment_service.push(setName(name, type, service_name))
			}
		}
		return shipment_service
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		const init = () => {

			this.setState({ isDisabled: true })

			axios({
				url: '/d/shipment_service?f',
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				this.setState({ isDisabled: false })

				if (response.status === 204) {
					alert('配送業者が1件も登録されていません。')
				} else {

					this.master.shipment_service = this.setShipmentService(response.data.feed.entry)

					this.forceUpdate()
				}

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}

		init()

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
						<InternalWorkForm name="mainForm" entry={this.entry} master={this.master} />
					</Col>
				</Row>
			</Grid>
		)
	}
}
