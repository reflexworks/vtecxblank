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
	Glyphicon
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import QuotationForm from './quotation-form'
import {
	CommonIndicator,
	CommonNetworkMessage,
	CommonUpdateBtn,
	CommonDeleteBtn,
	CommonBackBtn,
	CommonGeneralBtn,
	CommonEntry
} from './common'

export default class QuotationUpdate extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			isDisabled: false,
			isError: {}
		}

		// URL設定
		this.url = '/d/quotation'

		// 戻る先のURL
		this.backUrl = '#/QuotationList'

		// 初期値の設定
		this.entry = {}

		// 請求元があるかどうかでプレビューまたはダウンロード実行の判定を行う
		this.isBillfrom = false
	}
 
	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setState({ isDisabled: true })

		this.entrykey = location.hash.substring(location.hash.indexOf('?')+1)

		const getQuotation = () => {
			axios({
				url: this.url + '/' + this.entrykey + '?e',
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {
		
				this.setState({ isDisabled: false })

				if (response.status === 204) {
					this.setState({ isError: response })
				} else {

					this.entry = response.data.feed.entry[0]
					this.entry.billfrom = this.entry.billfrom ||  {}
					this.entry.quotation = this.entry.quotation || {}
					this.entry.basic_condition = this.entry.basic_condition || []
					this.entry.item_details = this.entry.item_details || []
					this.entry.remarks = this.entry.remarks || []
					this.entry.packing_items = this.entry.packing_items || []
					this.entry.billfrom = this.entry.billfrom || {}
					this.entry.contact_information = this.entry.contact_information || {}

					if (this.entry.billfrom.billfrom_code) {
						this.isBillfrom = true
					}
					if (this.entry.quotation.status === '1') {
						this.befor = null
					}
					CommonEntry().init(this.entry)
					this.setButton()
					this.forceUpdate()
				}

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}
		const getBeforQuotation = (_befor_sub) => {
			const quotation_code = this.entrykey.split('-')[0]
			_befor_sub = _befor_sub < 10 ? '0' + _befor_sub : _befor_sub
			axios({
				url: this.url + '/' + quotation_code + '-' + _befor_sub + '?e',
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {
		
				this.setState({ isDisabled: false })

				if (response.status === 204) {
					getQuotation()
				} else {
					this.befor = response.data.feed.entry[0]
					this.befor.billfrom = this.befor.billfrom ||  {}
					this.befor.quotation = this.befor.quotation || {}
					this.befor.basic_condition = this.befor.basic_condition || []
					this.befor.item_details = this.befor.item_details || []
					this.befor.remarks = this.befor.remarks || []
					this.befor.packing_items = this.befor.packing_items || []
					getQuotation()
				}

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}
		let befor_sub = parseInt(this.entrykey.split('-')[1]) - 1
		if (befor_sub > 0) {
			getBeforQuotation(befor_sub)
		} else {
			getQuotation()
		}
	}

	setButton() {
		this.button = (
			<Nav>
				<CommonBackBtn NavItem href={this.backUrl} />
				{this.entry.quotation.status === '0' &&
					<CommonUpdateBtn NavItem url={this.url} callback={this.callbackButton} entry={this.entry} label={<span><Glyphicon glyph="ok" /> 一時保存</span>} />
				}
				{this.entry.quotation.status === '0' &&
					<CommonGeneralBtn NavItem onClick={()=>this.doPrint(true)} label={<span><Glyphicon glyph="print" /> プレビュー(見積明細/基本条件/備考)</span>} />
				}
				{this.entry.quotation.status === '0' &&
					<CommonGeneralBtn NavItem onClick={()=>this.doPrintOther(true)} label={<span><Glyphicon glyph="print" /> プレビュー(配送料/資材)</span>} />
				}
				{this.entry.quotation.status === '0' &&
					<CommonGeneralBtn NavItem onClick={(e)=>this.doIssue(e)} label={<span><Glyphicon glyph="save-file" /> 発行</span>} />
				}
				{this.entry.quotation.status === '1' &&
					<CommonGeneralBtn NavItem onClick={()=>this.doPrint()} label={<span><Glyphicon glyph="print" /> ダウンロード(見積明細/基本条件/備考)</span>} />
				}
				{this.entry.quotation.status === '1' &&
					<CommonGeneralBtn NavItem onClick={()=>this.doPrintOther()} label={<span><Glyphicon glyph="print" /> ダウンロード(配送料/資材)</span>} />
				}
				{this.entry.quotation.status === '1' &&
					<CommonGeneralBtn NavItem onClick={(e)=>this.doAddIssue(e)} label={<span><Glyphicon glyph="copy" /> 追加発行</span>} />
				}
				{this.entry.quotation.status === '0' &&
					<CommonDeleteBtn NavItem entry={this.entry} callback={this.callbackDeleteButton.bind(this)} />
				}
			</Nav>
		)
	}

	/**
	 * 更新完了後の処理
	 */
	callbackButton() {
		location.reload()
	}

	/**
	 * 削除完了後の処理
	 */
	callbackDeleteButton() {
		alert('削除が完了しました。')
		location.href = this.backUrl
	}

	/**
	 * 発行
	 * ステータスを発行済にする
	 */
	doIssue() {

		const update = (_data) => {
			axios({
				url: '/d',
				method: 'put',
				data: _data,
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {
				location.reload()
			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}
		const res = JSON.parse(JSON.stringify(CommonEntry().get()))

		if (res.feed.entry[0].billfrom && res.feed.entry[0].billfrom.billfrom_code) {

			if (confirm('' +
				'見積書を発行します。\n' +
				'発行された見積内容は確定され、編集不可となります。\n' +
				'\nよろしいでしょうか？')) {

				/**
				 * Reactオブジェクトかどうかの判定
				 * @param {*} _value 
				 */
				const checkDom = (_value) => {
					let flg = false
					if (Object.prototype.toString.call(_value) === '[object Object]') {
						flg = true
					}
					return flg
				}
				res.feed.entry[0].quotation.status = '1'
				res.feed.entry[0].item_details = res.feed.entry[0].item_details.map((_obj) => {
					if (checkDom(_obj.item_name)) {
						_obj.item_name = _obj.item_name.props.children
					}
					if (checkDom(_obj.unit_name)) {
						_obj.unit_name = _obj.unit_name.props.children
					}
					let item_detail = {}
					Object.keys(_obj).forEach((_key) => {
						if (_key !== 'is_remove') {
							item_detail[_key] = _obj[_key]
						}
					})
					return item_detail
				})
				res.feed.entry[0].packing_items = res.feed.entry[0].packing_items.map((_obj) => {
					let packing_item = {}
					Object.keys(_obj).forEach((_key) => {
						if (_key !== 'is_remove') {
							packing_item[_key] = _obj[_key]
						}
					})
					return packing_item
				})
				let newObj = {}
				Object.keys(res.feed.entry[0]).forEach((_key) => {
					if (typeof res.feed.entry[0][_key] === 'string') {
						if (_key === 'id') {
							newObj[_key] = res.feed.entry[0][_key]
						}
					} else {
						newObj[_key] = res.feed.entry[0][_key]
					}
				})
				res.feed.entry[0] = newObj
				update(res)
			}
		} else {
			alert('請求元が選択されていません。\n\n請求元を選択しもう一度実行してください。')
		}
	}

	/**
	 * 見積明細と基本条件と備考のプレビュー もしくは ダウンロード
	 */
	doPrint(_isPreview) {
		const print = () => {
			let url = '/s/get-pdf-quotation?quotation_code=' + this.entry.quotation.quotation_code + '&quotation_code_sub=' + this.entry.quotation.quotation_code_sub
			url = _isPreview ? url + '&preview' : url
			location.href = url
		}
		if (_isPreview) {
			if (confirm('プレビューの内容は一時保存されたデータを元に作成されます。\n（一時保存しないとデータが反映されません。）\n\nよろしいでしょうか？')) {
				if (this.isBillfrom) {
					print()
				} else {
					alert('請求元が選択されていません。\nもしくは請求元を選択してから一時保存がされていません。\n\n請求元を選択後に一時保存してもう一度実行してください。')
				}
			}
		} else {
			if (this.isBillfrom) {
				print()
			} else {
				alert('請求元が選択されていません。\n\n追加発行から請求元を選択し直してください。')
			}
		}
	}

	/**
	 * 配送料と資材のプレビュー もしくは ダウンロード
	 */
	doPrintOther(_isPreview) {
		const print = () => {
			let url = '/s/get-pdf-quotation-other?quotation_code=' + this.entry.quotation.quotation_code + '&quotation_code_sub=' + this.entry.quotation.quotation_code_sub
			url = _isPreview ? url + '&preview' : url
			location.href = url
		}
		if (_isPreview) {
			if (confirm('プレビューの内容は一時保存されたデータを元に作成されます。\n（一時保存しないとデータが反映されません。）\n\nよろしいでしょうか？')) {
				if (this.isBillfrom) {
					print()
				} else {
					alert('請求元が選択されていません。\nもしくは請求元を選択してから一時保存がされていません。\n\n請求元を選択後に一時保存してもう一度実行してください。')
				}
			}
		} else {
			if (this.isBillfrom) {
				print()
			} else {
				alert('請求元が選択されていません。\n\n追加発行から請求元を選択し直してください。')
			}
		}
	}
	
	/**
	 * 追加発行
	 * 見積書コードはそのままに枝番を＋1して見積書を新規登録する
	 * ステータスを未発行にする
	 */
	doAddIssue() {
		const res = CommonEntry().get()
		const entry = res.feed.entry[0]
		let sub_code = parseInt(entry.quotation.quotation_code_sub) + 1
		sub_code = sub_code < 10 ? '0' + sub_code : sub_code + ''

		const setData = () => {

			let quotation = entry.quotation || {}
			const billto = entry.billto || {}
			const basic_condition = entry.basic_condition || []
			const item_details = entry.item_details || []
			const remarks = entry.remarks || []
			const packing_items = entry.packing_items || []
			const billfrom = entry.billfrom || {}
			const contact_information = entry.contact_information || {}

			const setObj = (_obj) => {
				return JSON.parse(JSON.stringify(_obj))
			}
			let req = {
				feed: {
					entry: [{
						quotation: setObj(quotation),
						billto: billto,
						basic_condition: basic_condition,
						item_details: item_details,
						remarks: remarks,
						packing_items: packing_items,
						billfrom: billfrom,
						contact_information: contact_information,
						link: [{
							___href: '/quotation/' + quotation.quotation_code + '-' + sub_code,
							___rel: 'self'
						}]
					}]
				}
			}
			req.feed.entry[0].quotation.quotation_code_sub = sub_code
			req.feed.entry[0].quotation.status = '0'

			return req
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
				this.props.history.push('/QuotationUpdate?' + entry.quotation.quotation_code + '-' + sub_code)
				location.reload()
			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}
		if (confirm('' +
			'見積内容を追加するために同じ見積書コードで新規作成します。\n' +
			'(新規作成された見積書の枝番は+1されます。)\n\n' +
			'新たな見積書コード：' + entry.quotation.quotation_code + '-' + sub_code +
			'\n\nよろしいでしょうか？')) {
			create(setData())
		}
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
							見積書の編集
						</PageHeader>

					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								{this.button}
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<QuotationForm name="mainForm" entry={this.entry} befor={this.befor} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								{this.button}
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}
