/* @flow */
import React from 'react'
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
		
		if(this.shipper.delivery_company === 'エコ配JP' || this.shipper.delivery_company === 'EC'){
			this.shipper.delivery_company = 'EC'
		}else if (this.shipper.delivery_company === 'ヤマト' || this.shipper.delivery_company === 'YM') {
			this.shipper.delivery_company = 'YM'
		} else if (this.shipper.delivery_company === '佐川急便' || this.shipper.delivery_company === 'SG') {
			this.shipper.delivery_company = 'SG'
		} else if (this.shipper.delivery_company === '西濃' || this.shipper.delivery_company === 'SN') {
			this.shipper.delivery_company = 'SN'
		} else if (this.shipper.delivery_company === '日本郵政' || this.shipper.delivery_company === 'PO') {
			this.shipper.delivery_company = 'PO'
		} else if (this.shipper.delivery_company === '自社配送' || this.shipper.delivery_company === 'JI') {
			this.shipper.delivery_company = 'JI'
		} else {
			this.shipper.delivery_company = ''
		}
		
		for(let i=0;i<this.shipper.shipper_info.length;++i){
			if (this.shipper.shipper_info[i].shipment_class === '集荷' || this.shipper.shipper_info[i].shipment_class === '0') {
				this.shipper.shipper_info[i].shipment_class = '0'
			} else if (this.shipper.shipper_info[i].shipment_class === '出荷' || this.shipper.shipper_info[i].shipment_class === '1') {
				this.shipper.shipper_info[i].shipment_class = '1'
			} else {
				this.shipper.shipper_info[i].shipment_class = ''
			}
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
							label: 'ヤマト運輸',
							value: 'YM'
						}, {	
							label: '佐川急便',
							value: 'SG'
						}, {
							label: '西濃運輸',
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