/* @flow */
import React from 'react'
import {
	Form,
	FormGroup,
	FormControl,
	PanelGroup,
	Panel,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonPrefecture,
	CommonTable,
	//CommonRadioBtn,
} from './common'


export default class BillfromForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.billfrom = this.entry.billfrom || {}
		this.entry.billfrom.payee = this.entry.billfrom.payee || []
		this.entry.contact_information = this.entry.contact_information || {}


		this.bankList = [{
			label: 'みずほ銀行',
			value: '1',
		}, {
			label: '三菱UFJ銀行',
			value: '2',
		}, {
			label: '三井住友銀行',
			value: '3',
		}, {
			label: 'りそな銀行',
			value: '4',
		}, {
			label: '埼玉りそな銀行',
			value: '5',
		}, {
			label: '楽天銀行',
			value: '6',
		}, {
			label: 'ジャパンネット銀行',
			value: '7',
		}, {
			label: '巣鴨信用金庫',
			value: '8',
		}, {
			label: '川口信用金庫',
			value: '9',
		}, {
			label: '東京都民銀行',
			value: '10',
		}, {
			label: '群馬銀行',
			value: '11',
		}]
		
		this.bankTypeList = [{
			label: '普通',
			value: '0',
		}, {
			label: '当座',
			value: '1',
		}]

		this.forceUpdate()
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	
		this.entry.billfrom.payee = this.entry.billfrom.payee.map((oldPayee) => {
			if (oldPayee.bank_info && !oldPayee.branch_office && !oldPayee.account_name) {
				
				let newPayee = {
					'bank_info': oldPayee.bank_info,
					'account_type': oldPayee.account_type,
					'account_number': oldPayee.account_number,
					'branch_office': '',
					'account_name': '' ,
				}
				return(newPayee)
			} else {
				return(oldPayee)
			}
		})
		this.forceUpdate()
	}

	/**
	 * 	その他の請求リスト、備考リスト、振込先リストの追加
	 */
	addList(list,_data) {
		if (list === 'payee') {
			if (!this.entry.billfrom[list]) {
				this.entry.billfrom[list] = []
			}
			this.entry.billfrom[list].push(_data)
		} else {
			if (!this.entry[list]) {
				this.entry[list] = []
			}
			this.entry[list].push(_data)	
		}
		this.forceUpdate()
	}

	/** 
	 * 	その他の請求リスト、備考リスト、振込先リストの削除
	 */
	removeList(list, _index) {
		let array = []
		if (list === 'payee') {
			for (let i = 0, ii = this.entry.billfrom.payee.length; i < ii; ++i) {
				if (i !== _index) array.push(this.entry.billfrom.payee[i])
			}
			this.entry.billfrom.payee = array	
		} else {
			for (let i = 0, ii = this.entry[list].length; i < ii; ++i) {
				if (i !== _index) array.push(this.entry[list][i])
			}
			this.entry[list] = array
		}	
		this.forceUpdate()
	}
	

	/**
	 *  請求元情報の更新
	 */
	changeBillfrom(_data,_key) {
		this.entry.billfrom[_key] = _data
		this.forceUpdate()
	}

	changeContactInformation(_data,_key) {
		this.entry.contact_information[_key] = _data
		this.forceUpdate()
	}

	/**
	 * 	請求元の振込情報リスト変更
	 */
	changePayee(_data, _rowindex, _celindex) {
		if (_celindex === 'bank_info' || _celindex === 'account_type') {
			this.entry.billfrom.payee[_rowindex][_celindex] = _data ? _data.value : ''
		} else {
			this.entry.billfrom.payee[_rowindex][_celindex] = _data	
		}
		
		this.forceUpdate()
	}

	render() {
		return (
			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="請求元情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						{/* 登録の場合 */}
						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide">
								<FormControl name="billfrom.billfrom_code" type="text" value="${_addids}" />
								<FormControl name="link" data-rel="self" type="text" value="/billfrom/${_addids}" />
							</FormGroup>
						}

						{/* 更新の場合 */}
						{this.entry.billfrom.billfrom_code &&
							<CommonInputText
								controlLabel="請求元コード"
								name="billfrom.billfrom_code"
								type="text"
								placeholder="請求元コード"
								value={this.entry.billfrom.billfrom_code}
								readonly="true"
							/>
						}

						<CommonInputText
							controlLabel="請求元名"
							name="billfrom.billfrom_name"
							type="text"
							placeholder="請求元名"
							value={this.entry.billfrom.billfrom_name}
							validate="string"
							required
							onChange={(data)=>this.changeBillfrom(data,'billfrom_name')}
						/>
						
						<CommonInputText
							controlLabel="電話番号"
							name="contact_information.tel"
							type="text"
							placeholder="090-1234-5678"
							value={this.entry.contact_information.tel}
							size="sm"
							onChange={(data) => this.changeContactInformation(data,'tel')}
						/>

						<CommonInputText
							controlLabel="FAX"
							name="contact_information.fax"
							type="text"
							placeholder="090-1234-5678"
							value={this.entry.contact_information.fax}
							size="sm"
							onChange={(data) => this.changeContactInformation(data,'fax')}
						/>
						
						<CommonInputText
							controlLabel="メールアドレス"
							name="contact_information.email"
							type="email"
							placeholder="logioffice@gmail.com"
							value={this.entry.contact_information.email}
							onChange={(data) => this.changeContactInformation(data,'email')}
						/>

						<CommonInputText
							controlLabel="郵便番号"
							name="contact_information.zip_code"
							type="text"
							placeholder="123-4567"
							value={this.entry.contact_information.zip_code}
							size="sm"
							onChange={(data) => this.changeContactInformation(data,'zip_code')}
						/>

						<CommonPrefecture
							controlLabel="都道府県"
							componentClass="select"
							name="contact_information.prefecture"
							value={this.entry.contact_information.prefecture}
							onChange={(data) => this.changeContactInformation(data,'prefecture')}
						/>

						<CommonInputText
							controlLabel="市区郡町村"
							name="contact_information.address1"
							type="text"
							placeholder="◯◯市××町"
							value={this.entry.contact_information.address1}
							onChange={(data) => this.changeContactInformation(data,'address1')}
						/>

						<CommonInputText
							controlLabel="番地"
							name="contact_information.address2"
							type="text"
							placeholder="1丁目2番地 ◯◯ビル1階"
							value={this.entry.contact_information.address2}
							size="lg"
							onChange={(data) => this.changeContactInformation(data,'address2')}
						/>
					
					</Panel>

					<Panel collapsible header="口座情報" eventKey="2" bsStyle="info" defaultExpanded="true">
						<CommonTable
							//controlLabel="口座情報"
							name="billfrom.payee"
							data={this.entry.billfrom.payee}
							header={[{
								field: 'bank_info', title: '銀行名', width: '30px',
								filter: {
									options: this.bankList,
									onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'bank_info') }
								}
							}, {
								field: 'branch_office', title: '支店名', width: '30px',
								input: {
									onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'branch_office') }
								}
							}, {
								field: 'account_type', title: '口座種類', width: '20px',
								filter: {
									options: this.bankTypeList,
									onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'account_type') }
								}
							}, {
								field: 'account_number', title: '口座番号', width: '20px',
								input: {
									onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'account_number') }
								}
								
							}, {
								field: 'account_name', title: '口座名義', width: '30px',
								input: {
									onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'account_name') }
								}
							}]}
							add={() => this.addList('payee',{ 'bank_info': '0','branch_office':'', 'account_type': '0', 'account_number': '','account_name': '', })}
							remove={(data, index) => this.removeList('payee',index)}
							noneScroll
							fixed
						/>

						{!this.entry.billfrom.payee && 
							<FormGroup className="hide"	>	
								<CommonTable
									//controlLabel="口座情報"
									name="billfrom.payee"
									data={this.entry.billfrom.payee}
									header={[{
										field: 'bank_info', title: '銀行名', width: '30px',
										filter: {
											options: this.bankList,
											onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'bank_info') }
										}
									}, {
										field: 'branch_office', title: '支店名', width: '30px',
										input: {
											onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'branch_office') }
										}
									}, {
										field: 'account_type', title: '口座種類', width: '20px',
										filter: {
											options: this.bankTypeList,
											onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'account_type') }
										}
									}, {
										field: 'account_number', title: '口座番号', width: '20px',
										input: {
											onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'account_number') }
										}
								
									}, {
										field: 'account_name', title: '口座名義', width: '30px',
										input: {
											onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'account_name') }
										}
									}]}
									add={() => this.addList('payee',{ 'bank_info': '0','branch_office':'', 'account_type': '0', 'account_number': '','account_name': '', })}
									remove={(data, index) => this.removeList('payee',index)}
									noneScroll
									fixed
								/>	
							</FormGroup>	
						}
					</Panel>
				</PanelGroup>		
			</Form>
		)
	}
}