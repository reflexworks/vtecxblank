/* @flow */
import React from 'react'
import {
	Form,
	PanelGroup,
	Panel,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonFilterBox,
	CommonTable,
} from './common'

export default class ShipmentServiceForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.prefList = ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県']
			.map((value) => {
				return {
					label: value,
					value: value
				}
			})
		this.sizeName

	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	changeShipmentServiceType(_data) {

		this.visibleSize = false

		if (_data) {
			this.sizeName = 'サイズ'

			if (_data.value === 0) {
				this.sizeName = this.sizeName + '(cm)'
				this.visibleSize = true
			}
			if (_data.value === 3) {
				this.sizeName = this.sizeName + '(cm以内)'
				this.visibleSize = true
			}
			if (_data.value === 4) {
				this.sizeName = this.sizeName + '(cm以内)'
				this.visibleSize = true
			}
			this.entry.shipment_service.type = _data.value

		} else {
			this.entry.shipment_service.type = null
		}
		this.forceUpdate()
	}
	
	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="配送業者情報" eventKey="1" bsStyle="info" defaultExpanded={true}>

						<CommonInputText
							controlLabel="配送業者コード"   
							name="shipment_service.code"
							type="text"
							value={this.entry.shipment_service.code}
							placeholder="YH"
							size="sm"
						/>

						<CommonInputText
							controlLabel="配送業者名"   
							name="shipment_service.name"
							type="text"
							value={this.entry.shipment_service.name}
							placeholder="ヤマト運輸"
						/>

						<CommonFilterBox
							controlLabel="配送タイプ"
							size="sm"
							name="shipment_service.type"
							value={this.entry.shipment_service.type}
							options={[{
								label: '発払い',
								value: 0
							}, {
								label: 'コレクト',
								value: 1
							}, {
								label: 'DM',
								value: 2
							}, {
								label: 'メール便',
								value: 3
							}, {
								label: 'その他',
								value: 4
							}]}
							onChange={(data)=>this.changeShipmentServiceType(data)}
						/>
						{this.entry.shipment_service.type === 4 &&
							<CommonInputText
								controlLabel="サービス名"   
								name="shipment_service.service_name"
								type="text"
								value={this.entry.shipment_service.service_name}
								placeholder="ゆうパケット"
							/>
						}
						{this.visibleSize &&
							<CommonTable
								controlLabel="サイズと重量"
								name="shipment_service.sizes"
								data={this.entry.shipment_service.sizes}
								header={[{
									field: 'size', title: 'サイズ', width: '125px'
								},{
									field: 'weight', title: '重量', width: '125px'
								}]}
								add={() => this.addList()}
								remove={(data, i) => this.removeList(data, i)}
								size="md"
							/>
						}

					</Panel>

					{this.entry.shipment_service.type === 0 && 
						<Panel collapsible header="地域帯情報" eventKey="1" bsStyle="info" defaultExpanded={true}>

							<CommonTable
								name="zone"
								data={this.entry.zone}
								header={[{
									field: 'zone_code', title: '地域帯名称', width: '100px'
								}, {
									field: 'pref_codes', title: '所属する都道府県', width: '900px'
								}]}
								edit={(data, i) =>console.log(data, i)}
							/>

						</Panel>
					}
				        
				</PanelGroup>
				
			</Form>
		)
	}
}