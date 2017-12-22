/* @flow */
import React from 'react'
import {
	Form
} from 'react-bootstrap'
import type {
	Props,
} from 'demo3.types'
import {
	//CommonInputText,
	CommonTable,
	CommonModal,
	CommonFilterBox,
} from './common'

export class CustomerShipperModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			isShow: this.props.isShow,
			type: this.props.type
		}
		this.shipmentClassList=[{
			label: '集荷',
			value: '0'
		}, {	
			label: '出荷',
			value: '1'
		}]
		this.shipper = this.props.data || {}
		this.shipper.shipper_info = this.shipper.shipper_info || []
		//this.master = {}
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
		
		if(newProps.data.delivery_company === 'エコ配JP' || newProps.data.delivery_company === 'EC'){
			this.delivery_company = 'EC'
		}else if (newProps.data.delivery_company === 'ヤマト' || newProps.data.delivery_company === 'YM') {
			this.delivery_company = 'YM'
		} else if (newProps.data.delivery_company === '佐川急便' || newProps.data.delivery_company === 'SG') {
			this.delivery_company = 'SG'
		} else if (newProps.data.delivery_company === '西濃' || newProps.data.delivery_company === 'SN') {
			this.delivery_company = 'SN'
		} else if (newProps.data.delivery_company === '日本郵政' || newProps.data.delivery_company === 'PO') {
			this.delivery_company = 'PO'
		} else if (newProps.data.delivery_company === '自社配送' || newProps.data.delivery_company === 'JI') {
			this.delivery_company = 'JI'
		} else {
			this.delivery_company = ''
		}

		this.forceUpdate()
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {}

	getTitle() {
		return this.state.type === 'add' ? '荷主コード追加' : '荷主コード編集'
	}

	changeDeliveryCompany(_data) {
		this.shipper.delivery_company = _data
		this.forceUpdate()
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

	shipperCodeChange(_data, _rowindex) {
		this.shipper.shipper_info[_rowindex].shipper_code = _data
		this.forceUpdate()
	}

	shipmentClassChange(_data, _rowindex) {
		this.shipper.shipper_info[_rowindex].shipment_class = _data.value
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
						name="delivery_company"
						value={this.shipper.delivery_company}
						options={[{
							label: 'エコ配JP',
							value: 'EC'
						}, {	
							label: 'ヤマト',
							value: 'YM'
						}, {	
							label: '佐川',
							value: 'SG'
						}, {
							label: '西濃',
							value: 'SN'
						}, {
							label: '日本郵政',
							value: 'PO',
						}, {	
							label: '自社配送',
							value: 'JI'
							
						}]}
						onChange={(data)=>this.changeDeliveryCompany(data)}
					/>

					<CommonTable
						controlLabel="荷主情報"
						name="shipper_info"
						data={this.shipper.shipper_info}
						header={[{
							field: 'shipper_code', title: '荷主コード',
							input: {
								onChange: (data, rowindex) => { this.shipperCodeChange(data, rowindex) }
							}
						},{
							field: 'shipment_class',title: '集荷出荷区分', width: '50px',
							filter: {
								options: this.shipmentClassList,
								onChange:(data,rowindex) => {this.shipmentClassChange(data,rowindex)}
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