/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Form,
	FormGroup,
	FormControl,
	//Button,
	//Glyphicon,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

//import InvoiceForm from './invoice-form'

import {
	CommonFilterBox,
	CommonMonthlySelect,
	CommonInputText,
	CommonRegistrationBtn,
	CommonTable
} from './common'

import {
	BillfromAddModal,
	BillfromEditModal,
} from './invoice-modal'
import {
	BilltoAddModal,
	BilltoEditModal,
} from './master-modal'

import moment from 'moment'
export default class InvoiceRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			disabled: true,
		}

		// 登録先のURL
		this.url = '/d/invoice'

		// 初期値の設定
		this.entry = {
			invoice: {
				invoice_yearmonth:moment().format('YYYY/MM'),
			},
			item_details: [],
			billto: {},
			billfrom: {},
			contact_information:{},
			remarks: [],
		}
		this.master = {
			billtoList: [],
			billfromList: [],
			quotationList: [],
		}
	}
 
	componentWillMount() {
		this.setBilltoMasterData()
		this.setBillfromMasterData()
		this.setQuotationMasterData()
	}

	setDisabled() {
		this.setState({
			disabled: (this.entry.invoice.invoice_yearmonth &&
					   this.entry.invoice.quotation_code && 
					   this.entry.billto.billto_code &&
					   this.entry.billfrom.billfrom_code ? false : true)
		})
	}

	callbackRegistrationButton(_data) {
		if (_data) {
			location.href = '#/InvoiceUpdate?' + _data.feed.entry[0].link[0].___href.replace('/invoice/', '')
		}
	}
	/**
	 * 請求先取得処理
	 */
	setBilltoMasterData(_billto) {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/billto?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.billtoList = response.data.feed.entry
				this.billtoList = this.master.billtoList.map((obj) => {
					return {
						label: obj.billto.billto_name,
						value: obj.billto.billto_code,
						data: obj
					}
				})
				if (_billto) this.entry.billto = _billto
				if (this.entry.billto.billto_code) {
					let target_index
					for (let i = 0, ii = this.billtoList.length; i < ii; ++i) {
						if (this.entry.billto.billto_code === this.billtoList[i].value) {
							this.billto = this.billtoList[i].data
							target_index = i
							break
						}
					}
					if (this.billto) {
						this.changeBillto(this.billtoList[target_index])
					}
				}

				this.setDisabled()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	setBilltoData(_data, _modal) {
		this.setBilltoMasterData(_data.feed.entry[0].billto)
		if (_modal === 'add') {
			this.setState({ showBilltoAddModal: false })
		} else {
			this.setState({ showBilltoEditModal: false })
		}
		this.setDisabled()
	}

	changeYearmonth(_data) {
		if (_data) {
			this.entry.invoice.invoice_yearmonth = _data
		} else {
			this.entry.invoice.invoice_yearmonth = ''
		}
		this.setDisabled()
		this.forceUpdate()
	}
	
	/**
	 * 請求先変更処理
	 * @param {*} _data 
	 */
	changeBillto(_data) {
		if (_data) {
			this.entry.billto = _data.data.billto
			this.billto = _data.data
			//if (this.selfValue !== '') this.selfValue = this.selfValue.split('_')[1]
			this.selfValue = '/invoice/' + this.entry.invoice.billto_code + '_' + this.selfValue
		} else {
			this.entry.billto = {}
			this.billto = null
		}
		this.setDisabled()
	}

	/**
	 *  請求元データを取得
	 */
	setBillfromMasterData(_billfrom) {
		this.setState({ isDisabled: true })

		axios({
			url: '/d/billfrom?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.billfromList = response.data.feed.entry
				this.billfromList = this.master.billfromList.map((obj) => {
					return {
						label: obj.billfrom.billfrom_name,
						value: obj.billfrom.billfrom_code,
						data: obj
					}
				})

				if (_billfrom) this.entry.billfrom = _billfrom
				if (this.entry.billfrom.billfrom_code) {
					for (let i = 0, ii = this.billfromList.length; i < ii; ++i) {
						if (this.entry.billfrom.billfrom_code === this.billfromList[i].value) {
							this.billfrom = this.billfromList[i].data
							this.entry.contact_information.address1 = this.billfromList[i].data.contact_information.prefecture + this.billfromList[i].data.contact_information.address1 + this.billfromList[i].data.contact_information.address2
							this.entry.contact_information.zip_code = this.billfromList[i].data.contact_information.zip_code
							this.entry.contact_information.tel 		= this.billfromList[i].data.contact_information.tel
							break
						}
					}
				}
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}

	setBillfromData(_data, _modal) {
		this.setBillfromMasterData(_data.feed.entry[0].billfrom)
		if (_modal === 'add') {
			this.setState({ showBillfromAddModal: false })
		} else {
			this.setState({ showBillfromEditModal: false })
		}
		this.setDisabled()
	}

	/**
	 * 請求元変更
	 * @param {*} _data 
	 */
	changeBillfrom(_data) {
		if (_data) {
			this.entry.billfrom = _data.data.billfrom
			this.billfrom = _data.data
			this.entry.contact_information.address1 = _data.data.contact_information.prefecture + _data.data.contact_information.address1 + _data.data.contact_information.address2
			this.entry.contact_information.zip_code = _data.data.contact_information.zip_code
			this.entry.contact_information.tel = _data.data.contact_information.tel
			
		} else {
			this.entry.billfrom = {}
			this.billfrom = {}
			this.entry.contact_information = {}
		}
		this.setDisabled()
		this.forceUpdate()
	}

	setQuotationMasterData() {
		this.setState({ isDisabled: true })

		axios({
			url: '/d/quotation?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			
			if (response.status !== 204) {

				this.master.quotationList = response.data.feed.entry
				this.quotationList = this.master.quotationList.map((obj) => {
					return {
						label: obj.quotation.quotation_code,
						value: obj.quotation.quotation_code,
						data: obj
					}
				})
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}
	/**
	 * 見積書変更処理
	 */
	changeQuotation(_data) {
		if (_data) {
			this.entry.invoice.quotation_code = _data.label
			this.quotation = _data.data
		} else {
			this.entry.invoice.quotation_code = ''
			this.quotation = {}
		}
		this.setDisabled()
		this.forceUpdate()
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>請求書の作成</PageHeader>
					</Col>
				</Row>
				<Row>
					<BilltoAddModal isShow={this.state.showBilltoAddModal} close={() => this.setState({ showBilltoAddModal: false })} add={(data) => this.setBilltoData(data, 'add')} />
					<BilltoEditModal isShow={this.state.showBilltoEditModal} close={() => this.setState({ showBilltoEditModal: false })} edit={(data) => this.setBilltoData(data, 'edit')} data={this.billto} />
					<BillfromAddModal isShow={this.state.showBillfromAddModal} close={() => this.setState({ showBillfromAddModal: false })} add={(data) => this.setBillfromData(data, 'add')} />
					<BillfromEditModal isShow={this.state.showBillfromEditModal} close={() => this.setState({ showBillfromEditModal: false })} edit={(data) => this.setBillfromData(data, 'edit')} data={this.billfrom} />
					
					<Form name="mainForm" horizontal data-submit-form>
						
						<CommonFilterBox
							controlLabel="見積番号"	
							name='invoice.quotation_code'
							value={this.entry.invoice.quotation_code}
							options={this.quotationList}
							onChange={(data) => this.changeQuotation(data)}
						/>
						
						<CommonMonthlySelect
							controlLabel="請求年月"  
							name="invoice.invoice_yearmonth"
							value={this.entry.invoice.invoice_yearmonth}
							onChange={() =>this.changeYearmonth()}
						/>

						<CommonFilterBox
							controlLabel="請求先"
							name=""
							value={this.entry.billto.billto_code}
							options={this.billtoList}
							add={() => this.setState({ showBilltoAddModal: true })}
							edit={() => this.setState({ showBilltoEditModal: true })}
							onChange={(data) => this.changeBillto(data)}
						/>

						{ this.entry.billto.billto_code && 
							<FormGroup className="hide">
								<CommonInputText
									name="billto.billto_name"
									type="text"
									value={this.entry.billto.billto_name}
								/>
								<CommonInputText
									controlLabel="請求先コード"
									name="billto.billto_code"
									type="text"
									value={this.entry.billto.billto_code}
								/>
								<FormControl name="invoice.invoice_code" type="text" value="${_addids}" />
								<FormControl name="link" data-rel="self" type="text" value="/invoice/${_addids}" />
							</FormGroup>
						}
						{ !this.entry.billto.billto_code && 
							<FormGroup className="hide">
								<CommonInputText
									name="billto.billto_name"
									type="text"
									value=""
								/>
							</FormGroup>
						}

						<CommonFilterBox
							controlLabel="請求元"
							name=""
							value={this.entry.billfrom.billfrom_code}
							options={this.billfromList}
							add={() => this.setState({ showBillfromAddModal: true })}
							edit={() => this.setState({ showBillfromEditModal: true })}
							onChange={(data) => this.changeBillfrom(data)}
						/>

						{this.entry.billfrom.billfrom_code &&
							<FormGroup>	
								<CommonInputText
									controlLabel="　"
									name="billfrom.billfrom_name"
									type="text"
									value={this.entry.billfrom.billfrom_name}
									readonly
								/>
							
								<CommonInputText
									controlLabel="請求元コード"
									name="billfrom.billfrom_code"
									type="text"
									value={this.entry.billfrom.billfrom_code}
									readonly
								/>
							
								<CommonInputText
									controlLabel="郵便番号"
									name="contact_information.zip_code"
									type="text"
									value={this.entry.contact_information.zip_code}
									readonly
								/>
							
								<CommonInputText
									controlLabel="住所"
									name="contact_information.address1"
									type="text"
									value={this.entry.contact_information.address1}
									readonly
								/>	
								<CommonInputText
									controlLabel="電話番号"
									name="contact_information.tel"
									type="text"
									placeholder="電話番号"
									value={this.entry.contact_information.tel}
									readonly
								/>
								<CommonTable
									controlLabel="口座情報"
									name="billfrom.payee"
									data={this.entry.billfrom.payee}
									header={[{
										field: 'bank_info', title: '口座名', width: '30px',
										convert: {
											1: 'みずほ銀行', 2: '三菱東京UFJ銀行', 3: '三井住友銀行', 4: 'りそな銀行', 5: '埼玉りそな銀行',
											6: '楽天銀行',7:'ジャパンネット銀行',8:'巣鴨信用金庫',9:'川口信用金庫',10:'東京都民銀行',11:'群馬銀行',
										}
									
									}, {
										field: 'account_type', title: '口座種類', width: '30px',convert: { 0: '普通' ,1: '当座',}
									
									}, {
										field: 'account_number', title: '口座番号', width: '30px',
									
									}]}
									noneScroll
									fixed
								/>
							</FormGroup>
						}

						{ !this.entry.billfrom.billfrom_code && 
							<FormGroup className="hide">
								<CommonInputText
									name="billfrom.billfrom_name"
									type="text"
									value=""
								/>

								<CommonInputText
									name="contact_information.zip_code"
									type="text"
									value=""
								/>

							</FormGroup>
						}
						
						<CommonRegistrationBtn
							controlLabel=" "
							label="請求書内容入力へ"
							url={this.url}
							callback={(data) => this.callbackRegistrationButton(data)}
							disabled={this.state.disabled}
							pure
						/>
					</Form>
				</Row>
			</Grid>
		)
	}
}
