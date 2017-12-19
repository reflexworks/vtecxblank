/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Button,
//	Panel,
//	Glyphicon,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonIndicator,
	CommonNetworkMessage,
	CommonTable,
	CommonInputText,
	CommonPrefecture,
	CommonMonthlySelect,
	CommonSearchConditionsFrom,
	CommonPagination,
} from './common'

import moment from 'moment'
type State = {
	feed: any,
	url: string
}

export default class InvoiceList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/invoice?f&l=' + this.maxDisplayRows
		this.state = {
			searchDate: moment().format('YYYY/MM'),
			searchDetails: false,
			feed: { entry: [] },
			isDisabled: false,
			isError: {},
			urlToPagenation: '' // ページネーション用に渡すURL
		}
		this.activePage = 1
	}

	/**
	 * 一覧取得実行
	 * @param {*} activePage 
	 * @param {*} conditions 
	 */
	getFeed(activePage: number, conditions) {

		const url = this.url + (conditions ? '&' + conditions : '')
		this.setState({
			isDisabled: true,
			isError: {},
			urlToPagenation: url
		})

		this.activePage = activePage

		axios({
			url: url + '&n=' + activePage,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( (response) => {

			if (response.status === 204) {
				this.setState({ feed:'',isDisabled: false, isError: response })
			} else {
				// 「response.data.feed」に１ページ分のデータ(1~50件目)が格納されている
				// activePageが「2」だったら51件目から100件目が格納されている
				this.setState({ isDisabled: false, feed: response.data.feed})
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})    
	}

	/**
	 * 更新画面に遷移する
	 * @param {*} index 
	 */
	onSelect(_data) {
		// 入力画面に遷移
		const invoice_code = _data.invoice.invoice_code
		this.props.history.push('/InvoiceUpdate?' + invoice_code)
	}

	/**
	 * リスト上で削除処理
	 * @param {*} data 
	 */
	onDelete(data) {
	
		if (confirm('請求番号:' + data.invoice.invoice_code + '\n' +
					'この情報を削除します。よろしいですか？')) {
			const id = data.invoice.invoice_code
		
			axios({
				url: '/d/invoice/' + id,
				method: 'delete',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {
				this.setState({ isDisabled: false, isCompleted: 'delete', isError: false })
				this.getFeed(this.activePage)
			}).catch((error) => {
				if (this.props.error) {
					this.setState({ isDisabled: false })
					this.props.error(error)
				} else {
					this.setState({ isDisabled: false, isError: error })
				}
			})
			this.forceUpdate()
		}
	}

	/**
	 * 検索実行
	 * @param {*} conditions 
	 */
	doSearch(conditions) {
		this.getFeed(1, conditions)
	}

	/**
	 * 描画後の処理
	 */
	componentDidMount() {
		this.getFeed(1)
	}

	render() {

		return (

			<Grid>

				{/* 通信中インジケータ */}
				<CommonIndicator visible={this.state.isDisabled} />

				{/* 通信メッセージ */}
				<CommonNetworkMessage isError={this.state.isError}/>

				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						<PageHeader>請求書一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions) => this.doSearch(conditions)}>

							<CommonMonthlySelect
    							controlLabel="請求年月"  
								name="quotation.quotation_date"
								value={this.state.searchDate}
							/>
							
							<CommonInputText
								controlLabel="顧客コード"
								name="invoice.customer_code"
								type="text"
								placeholder="顧客コード"
							/>
							<CommonInputText
								controlLabel="顧客名"
								name="invoice.customer_name"
								type="text"
								placeholder="株式会社 ◯◯◯"
							/>
							<CommonInputText
								controlLabel="顧客名(カナ)"
								name="invoice.customer_name_kana"
								type="text"
								placeholder="カブシキガイシャ ◯◯◯"
							/>
							<CommonInputText
								controlLabel="電話番号"
								name="invoice.customer_tel"
								type="text"
								placeholder="090-1234-5678"
								size="sm"
							/>
							<CommonInputText
								controlLabel="FAX"
								name="invoice.customer_fax"
								type="text"
								placeholder="090-1234-5678"
								size="sm"
							/>
							<CommonInputText
								controlLabel="メールアドレス"
								name="invoice.customer_email"
								type="email"
								placeholder="logioffice@gmail.com"
							/>
							<CommonInputText
								controlLabel="郵便番号"
								name="invoice.zip_code"
								type="text"
								placeholder="123-4567"
								size="sm"
							/>
							<CommonPrefecture
								controlLabel="都道府県"
								componentClass="select"
								name="invoice.prefecture"
								size="sm"
							/>
							<CommonInputText
								controlLabel="市区郡長村"
								name="invoice.address1"
								type="text"
								placeholder="◯◯市××町"
							/>
							<CommonInputText
								controlLabel="番地"
								name="invoice.address2"
								type="text"
								placeholder="1丁目2番地 ◯◯ビル1階"
								size="lg"
							/>

						</CommonSearchConditionsFrom>
						
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						<CommonPagination
							url={this.state.urlToPagenation}
							onChange={(activePage)=>this.getFeed(activePage)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>

						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							edit={(data)=>this.onSelect(data)}
							remove={(data) => this.onDelete(data)}
							header={[{
								field: 'invoice.invoice_code',title: '請求番号', width: '100px'
							}, {
								field: 'invoice.quotation_code',title: '見積番号', width: '200px'
							}, {
								field: 'invoice.internal_work_code', title: '庫内作業コード', width: '200px'
							}, {
								field: 'invoice.total_amount', title: '合計請求金額', width: '200px'
							}, {
								field: 'invoice.subtotal', title: '小計', width: '200px'
							}, {
								field: 'invoice.consumption_tax', title: '消費税', width: '200px'
							}, {
								field: 'invoice.issue_status', title: '発行ステータス', width: '150px'
							}, {
								field: 'invoice.deposit_status', title: '入金ステータス', width: '200px'
					
							}]}
						>
							<CommonMonthlySelect
								name="quotation.quotation_date"
								value={this.state.searchDate}
								style={{float: 'left', width: '150px', 'margin': '0px 10px'}}
								table
							/>

							<Button bsSize="sm">顧客ごとに表示</Button>
						</CommonTable>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
