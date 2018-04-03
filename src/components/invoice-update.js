/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Navbar,
	Nav,
	Glyphicon,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import InvoiceForm from './invoice-form'
import {
	CommonIndicator,
	CommonNetworkMessage,
	CommonUpdateBtn,
	CommonDeleteBtn,
	CommonBackBtn,
	CommonGeneralBtn,

} from './common'


export default class InvoiceUpdate extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			isDisabled: false,
			isError: {},
		}

		this.workingYearmonth = ''
		this.customer = ''

		// URL設定
		this.url = '/d/invoice'

		// 戻る先のURL
		this.backUrl = '#/InvoiceList'

		// 初期値の設定
		this.entry = {}

	}

	/**
     * 画面描画の前処理
     */
	componentWillMount() {

		this.setState({ isDisabled: true })

		this.entrykey = location.hash.substring(location.hash.indexOf('?')+1)
        
		axios({
			url: this.url + '/' + this.entrykey+'?e',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
    
			if (response.status === 204) {
				this.setState({ isDisabled: false ,isError: response })
			} else {
				this.entry = response.data.feed.entry[0]
				this.setState({ isDisabled: false })
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	setReqestData(_data, _type) {
		if (_type === 'item_details') {
			let array = []
			Object.keys(_data.item_details).forEach((_key) => {
				const list = _data.item_details[_key]
				list.map((_value) => {
					array.push(_value)
				})
			})
			if (array.length === 0) {
				array = [{
					category: 'none'
				}]
			}
			_data.item_details = array
		}
		this[_type] = _data
	}

	/**
     * 更新完了後の処理
     */
	callbackButton() {
		const req = { feed:{entry:[]}}	
		if (this.item_details) {
			if (this.remarks) {
				this.item_details.remarks = this.remarks
			}
			req.feed.entry.push(this.item_details)
		}
		if (this.edit) {
			req.feed.entry.push(this.edit)
		}
		if (req.feed.entry.length) {
			this.doAfterPut(req)
		} else {
			this.compleat()
		}
	}

	compleat() {
		//location.reload()
	}

	doAfterPut(_data) {
		axios({
			url: '/d/',
			method: 'put',
			data: _data,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then(() => {
	
			this.compleat()

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	/**
     * 削除完了後の処理
     */
	callbackDeleteButton() {
		alert('削除が完了しました。')
		location.href = this.backUrl
	}

	/**
     * 見積明細と基本条件と備考のプレビュー もしくは 再発行
     */

	changeYearmonth(data) {
		this.workingYearmonth = data
	}
	changeCustomerCode(data) {
		this.customer = data
	}

	doPrint(_isPreview,_allCustomer) {
		if (this.workingYearmonth) {
			let print
			if (!_allCustomer) {
				print = () => {
					let url = '/s/get-pdf-invoice?invoice_code=' + this.entry.invoice.invoice_code + '&working_yearmonth=' + this.workingYearmonth + '&customer_code=' + this.customer
					url = _isPreview ? url + '&preview' : url
					location.href = url
				}
			}else {
				print = () => {
					let url = '/s/get-pdf-invoice?invoice_code=' + this.entry.invoice.invoice_code + '&working_yearmonth=' + this.workingYearmonth
					url = _isPreview ? url + '&preview' : url
					location.href = url
				}	
			}
			if (_isPreview) {
				if (confirm('プレビューの内容は一時保存されたデータを元に作成されます。\n（一時保存しないとデータが反映されません。）\nよろしいでしょうか？')) {
					print()
				}
			} else {
				print()
			}	
		} else {
			alert('庫内作業年月が選択されていません。')
		}	
	}

	doPrintSummary(_isPreview) {
		const print = () => {
			const shipping_yearmonth = this.state.workingYearmonth.replace(/\//, '')
			let url = '/s/get-pdf-billing-summary?shipping_yearmonth='+ shipping_yearmonth +'&billto_code=' + this.entry.billto.billto_code
			url = _isPreview ? url + '&preview' : url
			location.href = url
		}
		print()
	}

	render() {
		const buttons = [
			<CommonBackBtn key={0} NavItem href={this.backUrl} />,
			<CommonUpdateBtn key={1} NavItem url={this.url} callback={() => this.callbackButton()} entry={this.entry} />,
			<CommonDeleteBtn key={2} NavItem entry={this.entry} callback={this.callbackDeleteButton.bind(this)} />,
			<CommonGeneralBtn key={3} NavItem onClick={()=>this.doPrint(true,false)} label={<span><Glyphicon glyph="print" /> プレビュー 請求書(顧客毎)</span>} />,
			<CommonGeneralBtn key={4} NavItem onClick={()=>this.doPrint(true,true)}label={<span><Glyphicon glyph="print" /> プレビュー 請求書(請求先毎)</span>} />
		]

		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						{/* 通信中インジケータ */}
						<CommonIndicator visible={this.state.isDisabled} />

						{/* 通信メッセージ */}
						<CommonNetworkMessage isError={this.state.isError}/>

						<PageHeader>
                            請求書情報の更新
						</PageHeader>

					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									{buttons}
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<InvoiceForm
							name="mainForm"
							entry={this.entry}
							setReqestData={(_data, _type) => this.setReqestData(_data, _type)}
							changeCustomerCode={(data) => this.changeCustomerCode(data)}
							changeYearmonth={(data) => this.changeYearmonth(data)}
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									{buttons}
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}