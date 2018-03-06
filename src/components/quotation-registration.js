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
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonFilterBox,
	CommonMonthlySelect,
	CommonInputText,
	CommonRegistrationBtn,
	CommonTable,
	CommonLoginUser
} from './common'

import {
	BilltoAddModal,
	BilltoEditModal,
} from './master-modal'

export default class QuotationRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			disabled: true
		}

		// 登録先のURL
		this.url = '/d/quotation'

		// 初期値の設定
		this.entry = {
			quotation: {},
			packing_items: [],
			billto: {},
			basic_condition: [],
			billfrom: {},
			contact_information:{}
		}

		this.master = {
			billtoList: []
		}

		this.billto = null
		this.monthly = null

		this.template = {
			quotation: {},
			packing_items: [],
			basic_condition: []
		}

		this.login_user = CommonLoginUser().get().staff_name

	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setBilltoMasterData()

	}

	setDisabled() {
		this.setState({ disabled: (this.monthly && this.billto ? false : true) })
	}

	setMonthly(_data) {
		this.monthly = _data
		this.setDisabled()
	}

	/**
	 * 請求先取得処理
	 */
	setBilltoMasterData(_billto) {

		this.setState({ isDisabled: true })

		axios({
			//url: '/s/get-billto',
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
	}

	/**
	 * 請求先変更処理
	 * @param {*} _data 
	 */
	changeBillto(_data) {
		if (_data) {
			this.entry.billto = _data.data.billto
			this.billto = _data.data
			this.templateList = null
			this.setTemplateData(this.entry.billto.billto_code)
		} else {
			this.entry.billto = {}
			this.billto = null
			this.templateList = null
			this.setDisabled()
		}
	}

	/**
	 * テンプレート取得処理
	 */
	setTemplateData(_billto_code) {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/quotation?f&billto.billto_code=' + _billto_code,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.templateList = response.data.feed.entry
				this.templateList = this.master.templateList.map((obj) => {
					const label = obj.quotation.quotation_code + ' ( ' + obj.billto.billto_name +' ' + obj.quotation.quotation_date + ' )'
					return {
						label: label,
						value: obj.quotation.quotation_code,
						data: obj
					}
				})
				this.changeTemplate(this.templateList[0])
			}
			this.setDisabled()

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	changeTemplate(_data) {
		if (_data) {
			this.selectTemplate = _data.value
			this.template = _data.data
		} else {
			this.selectTemplate = null
			this.template = {
				packing_items: [],
				basic_condition: []
			}
		}
		this.forceUpdate()
	}

	/**
	 * 登録完了後の処理
	 */
	callbackRegistrationButton(_data) {
		if (_data) {
			location.href = '#/QuotationUpdate?' + _data.feed.entry[0].link[0].___href.replace('/quotation/', '')
		}
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>見積書の作成</PageHeader>
					</Col>
				</Row>
				<Row>

					<BilltoAddModal isShow={this.state.showBilltoAddModal} close={() => this.setState({ showBilltoAddModal: false })} add={(data) => this.setBilltoData(data, 'add')} />
					<BilltoEditModal isShow={this.state.showBilltoEditModal} close={() => this.setState({ showBilltoEditModal: false })} edit={(data) => this.setBilltoData(data, 'edit')} data={this.billto} />

					<Form name="mainForm" horizontal data-submit-form>

						<CommonMonthlySelect
							controlLabel="見積月"  
							name="quotation.quotation_date"
							value={this.entry.quotation.quotation_date}
							onChange={(data)=>this.setMonthly(data)}
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
								<FormControl name="quotation.quotation_code" type="text" value="${_addids}" />
								<FormControl name="quotation.quotation_code_sub" type="text" value="01" />
								<FormControl name="quotation.status" type="text" value="0" />
								<FormControl name="link" data-rel="self" type="text" value="/quotation/,${_addids},-,${quotation.quotation_code_sub}" />
								<FormControl name="creator" type="text" value={this.login_user} />
							
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

						{(this.templateList && this.templateList.length) &&
							<CommonFilterBox
								controlLabel="コピー元の見積書"
								name=""
								value={this.selectTemplate}
								options={this.templateList}
								detail={() => this.setState({ showQuotationDetailModal: true })}
								onChange={(data) => this.changeTemplate(data)}
							/>
						}
						<div className="hide">
							<CommonTable
								name="basic_condition"
								data={this.template.basic_condition}
								header={[{
									field: 'title',title: '条件名', width: '300px'
								}]}
							/>
							<CommonTable
								name="item_details"
								data={this.template.item_details}
								header={[{
									field: 'item_name',title: '項目', width: '100px'
								}]}
							/>
							<CommonTable
								name="remarks"
								data={this.template.remarks}
								header={[{
									field: 'content',title: '備考'
								}]}
							/>
							<CommonTable
								name="packing_items"
								data={this.template.packing_items}
								header={[{
									field: 'item_code',title: '品番', width: '100px'
								}]}
							/>
							<CommonInputText
								name="billfrom.billfrom_name"
								value={this.entry.billfrom.billfrom_name}
							/>
							<CommonInputText
								name="contact_information.tel"
								value={this.entry.contact_information.tel}
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

						</div>
						<CommonRegistrationBtn
							controlLabel=" "
							label="見積内容入力へ"
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
