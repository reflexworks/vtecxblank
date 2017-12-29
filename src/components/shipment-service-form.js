/* @flow */
import React from 'react'
import {
	Form,
	PanelGroup,
	Panel,
	FormControl
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonFilterBox,
	CommonTable,
} from './common'

import {
	ZoneModal,
	ShipmentServiceSizeModal
} from './master-modal'

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
		this.modal = {
			sizes: {},
			zone: {}
		}
		
		this.sizeListType1 = [{
			label: '〜80cm',
			value: '〜80cm'
		},{
			label: '60cm',
			value: '60cm'
		},{
			label: '80cm',
			value: '80cm'
		},{
			label: '100cm',
			value: '100cm'
		},{
			label: '120cm',
			value: '120cm'
		},{
			label: '140cm',
			value: '140cm'
		},{
			label: '160cm',
			value: '160cm'
		},{
			label: '160cm以上',
			value: '160cm以上'
		}]

		this.sizeListType2 = [{
			label: '2cm以内',
			value: '2cm以内'
		},{
			label: '2.5cm以内',
			value: '2.5cm以内'
		},{
			label: '3cm以内',
			value: '3cm以内'
		},{
			label: '3.5cm以内',
			value: '3.5cm以内'
		}]

		this.weightListType1 = [{
			label: '2kg迄',
			value: '2kg迄'
		},{
			label: '10kg迄',
			value: '10kg迄'
		},{
			label: '15kg迄',
			value: '15kg迄'
		},{
			label: '20kg迄',
			value: '20kg迄'
		},{
			label: '25kg迄',
			value: '25kg迄'
		}]

		this.weightListType2 = [{
			label: '1kg未満',
			value: '1kg未満'
		},{
			label: '250g以内',
			value: '250g以内'
		},{
			label: '500g以内',
			value: '500g以内'
		},{
			label: '700g以内',
			value: '700g以内'
		},{
			label: '1kg以内',
			value: '1kg以内'
		},{
			label: '50g',
			value: '50g'
		},{
			label: '100g',
			value: '100g'
		},{
			label: '150g',
			value: '150g'
		},{
			label: '250g',
			value: '250g'
		},{
			label: '500g',
			value: '500g'
		},{
			label: '1000g',
			value: '1000g'
		},{
			label: '2000g',
			value: '2000g'
		},{
			label: '4000g',
			value: '4000g'
		}]

	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
		this.setShipmentServiceTypeInfo(this.entry.shipment_service.type)
		this.forceUpdate()
	}

	setShipmentServiceTypeInfo(value) {
		if (value === '1') {
			this.placeholder_service_name = 'クール'
		} else {
			this.placeholder_service_name = 'ゆうパケット'
		}
		this.sizeList = this['sizeListType' + value]
		this.weightList = this['weightListType' + value]
	}

	changeShipmentServiceType(_data) {

		if (_data) {
			this.setShipmentServiceTypeInfo(_data.value)
			this.entry.shipment_service.type = _data.value
		} else {
			this.entry.shipment_service.type = null
		}
		this.forceUpdate()
	}

	showModal(_key, _data, _index) {
		this.modal[_key].visible = true
		this.modal[_key].data = _data
		this.modal[_key].index = _index
		this.forceUpdate()
	}

	closeModal(_key) {
		this.modal[_key].visible = false
		this.forceUpdate()
	}

	addList(_key, _data) {
		this.modal[_key].visible = false
		if (_key === 'sizes') {
			this.entry.shipment_service[_key].push(_data)
		} else {
			this.entry[_key].push(_data)
		}
		this.forceUpdate()
	}

	removeList(_key, _index) {
		let array = []
		const oldEntry = _key === 'sizes' ? this.entry.shipment_service[_key] : this.entry[_key]
		for (let i = 0, ii = oldEntry.length; i < ii; ++i) {
			if (i !== _index) array.push(oldEntry[i])
		}
		if (_key === 'sizes') {
			this.entry.shipment_service[_key] = array
		} else {
			this.entry[_key] = array
		}
		this.forceUpdate()
	}
	
	updateList(_key, _data) {
		this.modal[_key].visible = false
		this.entry[_key][this.modal[_key].index] = _data
		this.forceUpdate()
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<ShipmentServiceSizeModal
					isShow={this.modal.sizes.visible}
					close={() => this.closeModal('sizes')}
					add={(obj) => this.addList('sizes', obj)}
					data={this.modal.sizes.data}
					sizeList={this.sizeList}
					weightList={this.weightList}
				/>

				<ZoneModal
					isShow={this.modal.zone.visible}
					close={() => this.closeModal('zone')}
					add={(obj) => this.addList('zone', obj)}
					edit={(obj) => this.updateList('zone', obj)}
					data={this.modal.zone.data}
				/>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="配送業者情報" eventKey="1" bsStyle="info" defaultExpanded={true}>

						<div className="hide">
							<FormControl name="link" data-rel="self" type="text" value="/shipment_service/${shipment_service.code}" />
						</div>

						{this.entry.shipment_service.code &&
							<CommonInputText
								controlLabel="配送業者コード"   
								name="shipment_service.code"
								type="text"
								value={this.entry.shipment_service.code}
								placeholder="YH"
								size="sm"
								readonly
							/>
						}						
						{!this.entry.shipment_service.code &&
							<CommonInputText
								controlLabel="配送業者コード"   
								name="shipment_service.code"
								type="text"
								value={this.entry.shipment_service.code}
								placeholder="YH"
								size="sm"
							/>
						}						

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
								value: '1'
							}, {
								label: 'メール便',
								value: '2'
							}]}
							onChange={(data)=>this.changeShipmentServiceType(data)}
						/>
						{(this.entry.shipment_service.type) &&
							<CommonInputText
								controlLabel="サービス名"
								name="shipment_service.service_name"
								type="text"
								value={this.entry.shipment_service.service_name}
								placeholder={this.placeholder_service_name}
							/>
						}
						{(this.entry.shipment_service.type) &&
							<CommonTable
								controlLabel="サイズと重量"
								name="shipment_service.sizes"
								data={this.entry.shipment_service.sizes}
								header={[{
									field: 'size', title: 'サイズ', width: '125px'
								},{
									field: 'weight', title: '重量', width: '125px'
								}]}
								add={() => this.showModal('sizes')}
								remove={(data, i) => this.removeList('sizes', i)}
								size="md"
							/>
						}

					</Panel>

					{this.entry.shipment_service.type === '1' && 
						<Panel collapsible header="地域帯情報" eventKey="1" bsStyle="info" defaultExpanded={true}>

							<CommonTable
								name="zone"
								data={this.entry.zone}
								header={[{
									field: 'zone_name', title: '地域帯名称', width: '100px'
								}, {
									field: 'pref_codes', title: '所属する都道府県', width: '900px'
								}]}
								add={()=>this.showModal('zone')}
								edit={(data, i) =>this.showModal('zone', data, i)}
								remove={(data, i) => this.removeList('zone', i)}
							/>

						</Panel>
					}
				        
				</PanelGroup>
				
			</Form>
		)
	}
}