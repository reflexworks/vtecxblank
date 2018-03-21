/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form
} from 'react-bootstrap'
import type {
	Props,
} from 'demo3.types'
import {
	CommonTable,
	CommonModal,
	CommonFilterBox,
	CommonInputText,
} from './common'

export class CustomerShipperModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			isShow: this.props.isShow,
			type: this.props.type
		}
		this.shipmentClassList=[{
			label: '出荷',
			value: '0'
		}, {	
			label: '集荷',
			value: '1'
		}]
		
		this.master = {
			shipmentServiceList: [],
		}

		this.shipper = this.props.data || {}
		this.shipper.shipper_info = this.shipper.shipper_info || []
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.shipper = newProps.data || {}
		this.shipper.shipper_info = newProps.data.shipper_info || []
		this.setState({
			isShow: newProps.isShow,
			type: newProps.type
		})
		this.setMasterShipmentServiceList()
		this.forceUpdate()
	}

	getTitle() {
		return this.state.type === 'add' ? '荷主コード追加' : '荷主コード編集'
	}

	close() {
		this.props.close()
	}

	add(_obj) {
		this.props.add(_obj)
	}
	
	edit(_obj) {
		this.props.edit(_obj)
	}

	addList(_data) {
		this.shipper.shipper_info.push(_data)
		this.forceUpdate()
	}

	removeList(_index) {
		let array = []
		for (let i = 0, ii = this.shipper.shipper_info.length; i < ii; ++i) {
			if (i !== _index) array.push(this.shipper.shipper_info[i])
		}
		this.shipper.shipper_info = array
		this.forceUpdate()
	}

	changeShipperCode(_data, _rowindex) {
		this.shipper.shipper_info[_rowindex].shipper_code = _data
		this.forceUpdate()
	}

	changeShipmentClass(_data, _rowindex) {
		this.shipper.shipper_info[_rowindex].shipment_class = _data ? _data.value : ''
		this.forceUpdate()
	}

	setMasterShipmentServiceList() {
		axios({
			url: '/d/shipment_service?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.shipmentServiceList = response.data.feed.entry
				this.shipmentServiceList = this.master.shipmentServiceList.map((obj) => {
					return {
						label: obj.shipment_service.name + '/' + obj.shipment_service.service_name,
						value: obj.shipment_service.code,
						data: obj
					}
				})
			}
		})
	}
	
	changeDeliveryCompany(_data) {
		console.log(_data)
		this.shipper.shipment_service_code = _data ? _data.value : ''
		this.shipper.shipment_service_service_name = _data ? _data.data.shipment_service.service_name : ''
		this.forceUpdate()
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title={this.getTitle()} closeBtn={() => this.close()}
				addBtn={this.state.type === 'add' ? (obj) => this.add(obj) : false}
				editBtn={this.state.type === 'edit' ? (obj) => this.edit(obj) : false}
				height="400px"
			>
				<Form name="CustomerShipperModal" horizontal>
					<CommonFilterBox
						controlLabel="配送業者"
						name="shipment_service_code"
						value={this.shipper.shipment_service_code}
						options={this.shipmentServiceList}
						onChange={(data)=>this.changeDeliveryCompany(data)}
					/>

					{this.shipper.shipment_service_code &&
						<CommonInputText
							controlLabel="サービズ名"
							name="shipment_service_service_name"
							type="text"
							value={this.shipper.shipment_service_service_name}
							readonly
						/>
					}	
					
					<CommonTable
						controlLabel="荷主情報"
						name="shipper_info"
						data={this.shipper.shipper_info}
						header={[{
							field: 'shipper_code', title: '荷主コード',
							input: {
								onChange: (data, rowindex) => { this.changeShipperCode(data, rowindex) }
							}
						},{
							field: 'shipment_class',title: '集荷出荷区分', width: '50px',
							filter: {
								options: this.shipmentClassList,
								onChange:(data,rowindex) => {this.changeShipmentClass(data,rowindex)}
							}
						}]}
						add={() => this.addList({ shipper_code: '',shipment_class: '0'})}
						remove={(data, index) => this.removeList(index)}
						fixed
						noneScroll
					/>
				</Form>
			</CommonModal>
		)
	}
}