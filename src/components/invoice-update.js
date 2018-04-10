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
	CommonLoginUser,

} from './common'
import moment from 'moment'

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
				this.issue = this.entry.invoice.issue_status
				this.setState({ isDisabled: false })
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	setReqestData(_data, _type) {
		if (_type === 'item_details' && _data) {
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

	setAfterData() {

		const req = { feed: { entry: [] } }

		let item_details
		if (this.item_details) {
			item_details = this.item_details
		}
		if (this.remarks) {
			if (item_details) {
				item_details.remarks = this.remarks.remarks
			} else {
				item_details = this.remarks
			}
		}
		if (item_details) {
			req.feed.entry.push(item_details)
		}
		if (this.edit) {
			req.feed.entry.push(this.edit)
		}
		return req
	}

	/**
     * 更新完了後の処理
     */
	callbackButton() {
		const req = this.setAfterData()
		if (req.feed.entry.length) {
			this.doAfterPut(req)
		} else {
			this.compleat()
		}
	}

	compleat() {
		location.reload()
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

	doIssue() {

		let isPut = true
		let errorTitle = []
		if (!this.entry.invoice.invoice_yearmonth) {
			isPut = false
			errorTitle.push('　　・請求年月')
		}
		if (!this.entry.invoice.working_yearmonth) {
			isPut = false
			errorTitle.push('　　・庫内作業年月')
		}
		if (!this.entry.billfrom.billfrom_code) {
			isPut = false
			errorTitle.push('　　・請求元')
		}
		if (!isPut) {
			alert('以下の項目が選択されていません。\n\n' + errorTitle.join('\n'))
			return false
		}
		const req = this.setAfterData()

		let issue_entry = JSON.parse(JSON.stringify(this.entry))
		issue_entry.invoice.issue_status = '1'
		issue_entry.invoice.payment_date = moment(issue_entry.invoice.payment_date).format('YYYY/MM/DD')

		req.feed.entry.push(issue_entry)

		if (confirm('' +
			'請求書を発行します。\n' +
			'発行された請求内容は確定され、編集不可となります。\n' +
			'（支払日・入金ステータスは変更可能です。）\n' +
			'\nよろしいでしょうか？')) {
			this.doAfterPut(req)
		}

	}

	doAddIssue() {

		this.item_details = null
		this.edit = null

		const target_entry = JSON.parse(JSON.stringify(this.entry))
		const invoice_code = target_entry.invoice.invoice_code
		const invoice_code_sub = target_entry.invoice.invoice_code_sub
		const key = invoice_code + '-' + invoice_code_sub

		// 追加発行時の枝番
		let add_invoice_code_sub = parseInt(invoice_code_sub) + 1
		add_invoice_code_sub = add_invoice_code_sub > 9 ? add_invoice_code_sub : '0' + add_invoice_code_sub

		const setEntry = (_entry, _type) => {
			const obj = {}
			Object.keys(_entry).forEach((_key) => {
				const target_data = _entry[_key]
				if (_key === 'link') {
					let link_href = '/' + _type + '/' + invoice_code + '-' + add_invoice_code_sub
					if (_type !== 'invoice') {
						link_href = link_href + '/' + _entry.customer.customer_code
					}
					obj[_key] = [{
						___href: link_href,
						___rel : 'self'
					}]
				} else if (_key !== 'id' && _key !== 'author') {
					obj[_key] = target_data
				}
			})
			return obj
		}
		const setData = (_entrys, _type) => {
			let array = []
			_entrys.map((_entry) => {
				const obj = setEntry(_entry, _type)
				array.push(obj)
			})
			return array
		}

		let count = 0

		const complate = () => {

 			if (count === 2) {

				let issue_entry = setEntry(target_entry, 'invoice')
				issue_entry.invoice.issue_status = '0'
				issue_entry.invoice.payment_date = moment(issue_entry.invoice.payment_date).format('YYYY/MM/DD')
				issue_entry.invoice.invoice_code_sub = add_invoice_code_sub
				issue_entry.creator = CommonLoginUser().get().staff_name

				let array = [issue_entry]
				if (this.item_details) {
					const data = setData(this.item_details, 'invoice_details')
					array.push({
						link: [{
							___href: '/invoice_details/' + invoice_code + '-' + add_invoice_code_sub,
							___rel: 'self'
						}]
					})
					array = array.concat(data)
				}
				if (this.edit) {
					const data = setData(this.edit, 'invoice_remarks')
					array.push({
						link: [{
							___href: '/invoice_remarks/' + invoice_code + '-' + add_invoice_code_sub,
							___rel: 'self'
						}]
					})
					array = array.concat(data)
				}
				const create = (_data) => {
					axios({
						url: '/d',
						method: 'post',
						data: _data,
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						}
					}).then(() => {
						this.props.history.push('/InvoiceUpdate?' + invoice_code + '-' + add_invoice_code_sub)
						location.reload()
					}).catch((error) => {
						this.setState({ isDisabled: false, isError: error })
					})
				}
				if (confirm('' +
					'請求内容を追加するために同じ請求書コードで新規作成します。\n' +
					'(新規作成された請求書の枝番は+1されます。)\n\n' +
					'新たな請求書コード：' + invoice_code + '-' + add_invoice_code_sub +
					'\n\nよろしいでしょうか？')) {
					create({feed: {entry: array}})
				}
			}
		}
		const get = (_url) => {
			axios({
				url: '/d' + _url,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				count++

				if (response.status !== 204) {
					if (_url.indexOf('invoice_details') != -1) {
						this.item_details = response.data.feed.entry
					}
					if (_url.indexOf('invoice_remarks') != -1) {
						this.edit = response.data.feed.entry
					}
				}
				complate()

			}).catch(() => {
				count++
				complate()
			})
		}
		get('/invoice_details/' + key + '?f')
		get('/invoice_remarks/' + key + '?f')

	}

	buttons() {
		let array = []

		array.push(<CommonBackBtn NavItem href={this.backUrl} />)

		if (this.issue === '1') {
			array.push(<CommonGeneralBtn NavItem onClick={()=>this.doPrint(false,false)} label={<span><Glyphicon glyph="print" /> 請求書(顧客毎)</span>} />)
			array.push(<CommonGeneralBtn NavItem onClick={()=>this.doPrint(false,false)} label={<span><Glyphicon glyph="print" /> 請求書(請求先毎)</span>} />)
			array.push(<CommonGeneralBtn NavItem onClick={()=>this.doAddIssue()} label={<span><Glyphicon glyph="copy" /> 追加発行</span>} />)
		} else if (this.issue === '0'){
			array.push(<CommonUpdateBtn NavItem url={this.url} callback={() => this.callbackButton()} entry={this.entry} />)
			array.push(<CommonDeleteBtn NavItem entry={this.entry} callback={this.callbackDeleteButton.bind(this)} />)
			array.push(<CommonGeneralBtn NavItem onClick={()=>this.doPrint(true,false)} label={<span><Glyphicon glyph="print" /> プレビュー 請求書(顧客毎)</span>} />)
			array.push(<CommonGeneralBtn NavItem onClick={()=>this.doPrint(true,true)} label={<span><Glyphicon glyph="print" /> プレビュー 請求書(請求先毎)</span>} />)
			array.push(<CommonGeneralBtn NavItem onClick={()=>this.doIssue()} label={<span><Glyphicon glyph="save-file" /> 発行</span>} />)
		}
		return array
	}

	render() {

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
									{this.buttons()}
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
									{this.buttons()}
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}