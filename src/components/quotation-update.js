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
	
			this.setState({ isDisabled: false })

			if (response.status === 204) {
				this.setState({ isError: response })
			} else {
				this.entry = response.data.feed.entry[0]
				this.entry.quotation = this.entry.quotation || {}
				this.entry.basic_condition = this.entry.basic_condition || []
				this.entry.item_details = this.entry.item_details || []
				this.entry.remarks = this.entry.remarks || []
				this.entry.quotation.packing_item = this.entry.quotation.packing_item || []

				CommonEntry().init(this.entry)
				this.setButton()
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}

	setButton() {
		this.button = (
			<Nav>
				<CommonBackBtn NavItem href={this.backUrl} />
				{this.entry.quotation.status === '0' &&
					<CommonUpdateBtn NavItem url={this.url} callback={this.callbackButton} entry={this.entry} label={<span><Glyphicon glyph="ok" /> 一時保存</span>} />
				}
				{this.entry.quotation.status === '0' &&
					<CommonGeneralBtn NavItem onClick={(e)=>this.doIssue(e)} label={<span><Glyphicon glyph="save-file" /> 発行</span>} />
				}
				{this.entry.quotation.status === '1' &&
					<CommonGeneralBtn NavItem onClick={(e)=>this.doReIssue(e)} label={<span><Glyphicon glyph="paste" /> 再発行</span>} />
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
		if (confirm('' +
			'見積書を発行します。\n' +
			'発行された見積内容は確定され、編集不可となります。\n' +
			'\nよろしいでしょうか？')) {
			const res = CommonEntry().get()
			res.feed.entry[0].quotation.status = '1'
			update(res)
		}
	}

	/**
	 * 再発行
	 */
	doReIssue() {
		//console.log(CommonEntry().get())
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

			quotation.packing_item = entry.quotation.packing_item || []

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
						<QuotationForm name="mainForm" entry={this.entry} />
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
