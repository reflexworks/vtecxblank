/* @flow */
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
} from 'logioffice.types'

import ShipmentServiceForm from './shipment-service-form'
import {
	CommonRegistrationBtn,
	CommonClearBtn
} from './common'

export default class ShipmentServiceRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/shipment_service'

		this.zoneList = [
			'南九州',
			'北九州',
			'四国',
			'中国',
			'関西',
			'北陸',
			'東海',
			'信越',
			'関東',
			'南東北',
			'北東北',
			'北海道',
			'沖縄'
		]

		// 初期値の設定
		this.entry = {}
		this.entry.shipment_service = {}
		this.entry.shipment_service.sizes = [{
			size: '60cm',
			weight: '2kg迄'
		},{
			size: '80cm',
			weight: '2kg迄'
		},{
			size: '100cm',
			weight: '10kg迄'
		},{
			size: '120cm',
			weight: '15kg迄'
		},{
			size: '140cm',
			weight: '20kg迄'
		},{
			size: '160cm',
			weight: '25kg迄'
		}]
		this.entry.zone = this.zoneList.map((value, i) => {
			return {
				zone_name: value,
				zone_code: 'zone_' + i,
				invoice_zones: [],
				pref_codes: this.setInitPref(i)
			}
		})

		this.disabled = true

	}

	setInitPref(_index) {
		const prefList = ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県']
		let array = []
		let setPref = (_value) => {
			return {pref_code:_value}
		}
		// 南九州
		if (_index === 0) {
			array.push(setPref(prefList[42]))
			array.push(setPref(prefList[44]))
			array.push(setPref(prefList[45]))
		}
		// 北九州
		if (_index === 1) {
			array.push(setPref(prefList[39]))
			array.push(setPref(prefList[40]))
			array.push(setPref(prefList[41]))
			array.push(setPref(prefList[43]))
		}
		// 四国
		if (_index === 2) {
			array.push(setPref(prefList[35]))
			array.push(setPref(prefList[36]))
			array.push(setPref(prefList[37]))
			array.push(setPref(prefList[38]))
		}
		// 中国
		if (_index === 3) {
			array.push(setPref(prefList[30]))
			array.push(setPref(prefList[31]))
			array.push(setPref(prefList[32]))
			array.push(setPref(prefList[33]))
			array.push(setPref(prefList[34]))
		}
		// 関西
		if (_index === 4) {
			array.push(setPref(prefList[24]))
			array.push(setPref(prefList[25]))
			array.push(setPref(prefList[26]))
			array.push(setPref(prefList[27]))
			array.push(setPref(prefList[28]))
			array.push(setPref(prefList[29]))
		}
		// 北陸
		if (_index === 5) {
			array.push(setPref(prefList[15]))
			array.push(setPref(prefList[16]))
			array.push(setPref(prefList[17]))
		}
		// 東海
		if (_index === 6) {
			array.push(setPref(prefList[20]))
			array.push(setPref(prefList[21]))
			array.push(setPref(prefList[22]))
			array.push(setPref(prefList[23]))
		}
		// 信越
		if (_index === 7) {
			array.push(setPref(prefList[14]))
			array.push(setPref(prefList[19]))
		}
		// 関東
		if (_index === 8) {
			array.push(setPref(prefList[7]))
			array.push(setPref(prefList[8]))
			array.push(setPref(prefList[9]))
			array.push(setPref(prefList[10]))
			array.push(setPref(prefList[11]))
			array.push(setPref(prefList[12]))
			array.push(setPref(prefList[13]))
			array.push(setPref(prefList[18]))
		}
		// 関東北
		if (_index === 9) {
			array.push(setPref(prefList[3]))
			array.push(setPref(prefList[5]))
			array.push(setPref(prefList[6]))
		}
		// 北東北
		if (_index === 10) {
			array.push(setPref(prefList[1]))
			array.push(setPref(prefList[2]))
			array.push(setPref(prefList[4]))
		}
		// 北海道
		if (_index === 11) {
			array.push(setPref(prefList[0]))
		}
		// 沖縄
		if (_index === 12) {
			array.push(setPref(prefList[46]))
		}
		return array
	}

	/**
     * 登録完了後の処理
     */
	callbackRegistrationButton() {
		alert('登録が完了しました。')
		location.href = '#/ShipmentServiceList'
	}

	/**
	 * 入力チェック
	 * @param {*} _data 
	 */
	onCheck(_data) {
		this.disabled = !_data
		this.forceUpdate()
	}

	clear() {
		this.entry.shipment_service.code = ''
		this.entry.shipment_service.size = ''
		this.entry.shipment_service.name = ''
		this.entry.shipment_service.type = ''
		this.entry.shipment_service.service_name = ''
		this.entry.shipment_sizes = []
		console.log(this.entry)
		this.forceUpdate()
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>配送業者の登録</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn disabled={this.disabled} NavItem url={this.url} callback={this.callbackRegistrationButton} />
									<CommonClearBtn NavItem callback={()=>this.clear()} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<ShipmentServiceForm name="mainForm" entry={this.entry} onCheck={(data)=>this.onCheck(data)} isCreate={true} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonRegistrationBtn disabled={this.disabled} NavItem url={this.url} callback={this.callbackRegistrationButton} />
									<CommonClearBtn NavItem callback={()=>this.clear()} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}