/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form
} from 'react-bootstrap'
import type {
	Props,
} from 'logioffice.types'
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

		this.customer_code = ''
		this.shipper = this.props.data || {}
		this.shipper.shipper_info = this.shipper.shipper_info || []
		this.errorMessage = []
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {
		this.setMasterShipmentServiceList()
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.customer_code = newProps.customerEntry.customer_code ? newProps.customerEntry.customer_code : ''
		this.shipper = newProps.data || {}
		this.shipper.shipper_info = newProps.data.shipper_info || []
		this.setState({
			isShow: newProps.isShow,
			type: newProps.type
		})
		this.forceUpdate()
	}

	getTitle() {
		return this.state.type === 'add' ? '荷主コード追加' : '荷主コード編集'
	}

	close() {
		this.errorMessage = []
		this.props.close()
	}

	check() {
		this.errorMessage = []
		let isOK = true
		if (this.shipper.shipper_info) {
			let cash = {}
			let duplicated = []
			this.shipper.shipper_info.map((_value) => {
				const key = _value.shipper_code + _value.shipment_class
				if (cash[key]) {
					duplicated.push('荷主コード: ' + _value.shipper_code + ' / 集荷出荷区分: ' + (_value.shipment_class === '0' ? '出荷' : '集荷'))
				} else {
					cash[key] = true
				}
			})
			if (duplicated.length) {
				isOK = false
				let message = []

				message.push('以下の荷主情報が重複しています')
				message.push(<br/>)
				duplicated.map((duplicated) => {
					message.push(duplicated)
					message.push(<br/>)
				})
				this.errorMessage = message

			}
		}
		

		//１件内で荷主＆出荷集荷区分が被っているので終了
		if (!isOK) {
			this.forceUpdate()
			return false
		}
	
		//荷主コードの重複削除
		const shipperCodeList = this.shipper.shipper_info.map((shipper_info) => {
			return shipper_info.shipper_code
		}).filter((x, i, self) => {
			return self.indexOf(x) === i
		})
		const allCount = shipperCodeList.length
		let count = 0
		let duplicated_codes = []

		const complate = (_response,_data) => {
			count++
			// _responseを元に荷主コードが他の顧客で使われているか判断
			// 使用されていたらduplicated_codesに荷主コードと被っている顧客コードをpush
			if (_response.data.feed.title) {
				if (this.customer_code !== _response.data.feed.title) {
					//他の顧客コードで使用されてるのでNG
					duplicated_codes.push({ customer_code: _response.data.feed.title, shipper_code: _data })
				}
			}
			if (count === allCount) {
				// 取得完了処理
				// duplicated_codesのlengthが1以上の場合、エラー表示
				
				if (duplicated_codes.length > 0) {
					//重複してる。エラー表示の際にduplicated_codesの内容を表示する。
					
					let message = []
					
					message.push('以下の荷主コードが重複しています')
					message.push(<br/>)
					duplicated_codes.map((duplicated) => {
						message.push('荷主コード:' + duplicated.shipper_code + '  顧客コード:' + duplicated.customer_code + 'で使用済み')
						message.push(<br/>)
					})

					this.errorMessage = message
					this.forceUpdate()
				} else {
					//重複してない
					this.state.type === 'add' ? this.props.add(this.shipper) : this.props.edit(this.shipper)
				}	
			}
		}

		shipperCodeList.map((_data) => {
			axios({
				url: '/s/check-duplicated-shippercode?shipper_code=' + _data,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {
				complate(response, _data)
			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		})
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
	}

	changeShipmentClass(_data, _rowindex) {
		this.shipper.shipper_info[_rowindex].shipment_class = _data ? _data.value : ''
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
		this.shipper.shipment_service_code = _data ? _data.value : ''
		this.shipper.shipment_service_service_name = _data ? _data.data.shipment_service.service_name : ''
		this.forceUpdate()
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title={this.getTitle()} closeBtn={() => this.close()}
						 addBtn={this.state.type === 'add' ? () => this.check() : false}
					 	 editBtn={this.state.type === 'edit' ? () => this.check() : false}
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
					
					{this.errorMessage &&
							<div style={{
								'padding-left': '100px',
								'text-decoration': 'underline',
								'color':'#FF0000'
							}}>
								<tr>
									<td >{this.errorMessage}</td>
								</tr>
							</div>
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