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
	CommonRegistrationBtn
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
			billto: {}
		}

		this.master = {
			billtoList: []
		}

		this.billto = null
		this.monthly = null
		this.selfValue = ''

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
		if (_data) {
			if (this.selfValue !== '') this.selfValue = this.selfValue.split('_')[0]
			this.selfValue = this.selfValue + '_' + _data.value.replace('/', '')
		}
		this.setDisabled()
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
					for (let i = 0, ii = this.billtoList.length; i < ii; ++i) {
						if (this.entry.billto.billto_code === this.billtoList[i].value) {
							this.billto = this.billtoList[i].data
							break
						}
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
			if (this.selfValue !== '') this.selfValue = this.selfValue.split('_')[1]
			this.selfValue = '/quotation/' + this.entry.billto.billto_code + '_' + this.selfValue
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
			this.template = _data.value
		} else {
			this.template = null
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
								<FormControl name="link" data-rel="self" type="text" value={this.selfValue} />
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
								value={this.template}
								options={this.templateList}
								detail={() => this.setState({ showQuotationDetailModal: true })}
								onChange={(data) => this.changeTemplate(data)}
							/>
						}
						<CommonRegistrationBtn label="見積内容入力へ" url={this.url} callback={(data) => this.callbackRegistrationButton(data)} disabled={this.state.disabled} />	
					</Form>
				</Row>
			</Grid>
		)
	}
}
