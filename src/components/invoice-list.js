/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	//	Panel,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonIndicator,
	CommonNetworkMessage,
	CommonTable,
	CommonInputText,
	CommonRadioBtn,
	CommonDatePicker,
	//CommonPrefecture,
	CommonMonthlySelect,
	CommonSearchConditionsFrom,
	CommonPagination,
	CommonGetList,
	CommonBeforConditions
} from './common'

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
		this.url = '/s/get-invoice?f&l=' + this.maxDisplayRows
		this.state = {
			searchYearMonth: '',
			searchDetails: false,
			feed: { entry: [] },
			isDisabled: false,
			isError: {},
			urlToPagenation: '' // ページネーション用に渡すURL
		}
		this.conditionsKey = 'InvoiceList'
	}

	/**
     * 一覧取得実行
     * @param {*} activePage
	 * @param {*} url 
	 */
	getFeed(activePage: number, url) {

		this.setState({
			isDisabled: true,
			isError: null,
			activePage: activePage
		})

		CommonGetList(url, activePage, this.conditionsKey).then((_state) => {
			this.setState(_state)
		})

	}

	/**
	 * 一覧取得設定
	 * @param {*} conditions 
	 */
	doGetFeed(_conditions, _activePage) {

		const url = this.url + (_conditions ? '&' + _conditions : '')
		this.setState({
			urlToPagenation: url,
			isError: null,
			activePage: _activePage
		})
	}

	/**
	 * 更新画面に遷移する
	 * @param {*} index 
	 */
	onSelect(_data) {
		// 入力画面に遷移
		const invoice_code = _data.invoice.invoice_code
		const invoice_code_sub = _data.invoice.invoice_code_sub
		this.props.history.push('/InvoiceUpdate?' + invoice_code + '-' + invoice_code_sub)
	}

	/**
	 * リスト上で削除処理
	 * @param {*} data 
	 */
	onDelete(data) {
		const _delete = () => {
			if (confirm('請求番号:' + data.invoice.invoice_code + '-' + data.invoice.invoice_code_sub + '\n' +
				'この情報を削除します。よろしいですか？')) {
		
				axios({
					url: '/d' + data.link[0].___href,
					method: 'delete',
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					}
				}).then(() => {
					this.setState({ isDisabled: false, isCompleted: 'delete', isError: false })
					this.getFeed(1, this.state.urlToPagenation)
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
		if (data.issue_status === '1') {
			alert('発行済なため削除できません。')
		} else {
			_delete()
		}
	}

	changeSearchYearmonth(_data) {
		if (_data) {
			this.setState({ searchYearMonth: _data.value })
			this.doGetFeed('invoice.invoice_yearmonth-rg-.*' + _data.value + '.*', 1)
		} else {
			this.setState({ searchYearMonth: '' })
			this.doGetFeed(null, 1)
		}	
	}

	/**
	 * 描画後の処理
	 */
	componentDidMount() {
		const befor_conditions = CommonBeforConditions().get(this.conditionsKey, this.url)
		this.doGetFeed(befor_conditions.conditions, befor_conditions.activePage)
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

						
						<CommonSearchConditionsFrom doSearch={(conditions) => this.doGetFeed(conditions, 1)}>
						 
							<CommonInputText
								controlLabel="請求番号"
								name="invoice.invoice_code"
								type="text"
								placeholder="0000001"
							/>
							<CommonInputText
								controlLabel="枝番"
								name="invoice.invoice_code_sub"
								type="text"
								placeholder="01"
							/>
							<CommonMonthlySelect
    							controlLabel="請求年月"  
								name="invoice.invoice_yearmonth"
								value={this.state.searchYearMonth}
							/>
							<CommonInputText
								controlLabel="請求先名"
								name="billto.billto_name"
								type="text"
								placeholder="株式会社 ◯◯◯"
							/>
							<CommonDatePicker
								controlLabel="支払日"
								name="invoice.payment_date"
							/>
							<CommonRadioBtn
								controlLabel="入金ステータス"
								name="invoice.deposit_status"
								data={[{
									label: '未入金',
									value: '0',
								}, {
									label: '入金済',
									value: '1',
								}]}
							/>
							<CommonRadioBtn
								controlLabel="発行ステータス"
								name="invoice.issue_status"
								data={[{
									label: '全て',
									value: ''
								},{
									label: '未発行',
									value: '0'
								},{
									label: '発行済',
									value: '1'
								}]}
							/>
							<CommonInputText
								controlLabel="作成者"
								name="creator"
								type="text"
								placeholder="作成者"
							/>
						</CommonSearchConditionsFrom>
						
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						<CommonPagination
							url={this.state.urlToPagenation}
							activePage={this.state.activePage}
							onChange={(activePage, url)=>this.getFeed(activePage, url)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>

						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							edit={(data)=>this.onSelect(data)}
							remove={(data) => this.onDelete(data)}
							header={[{
								field: 'invoice.invoice_code', title: '請求番号', width: '100px'
							}, {
								field: 'invoice.invoice_code_sub', title: '枝番', width: '50px'
							}, {
								field: 'invoice.invoice_yearmonth', title: '請求年月', width: '100px'
							}, {
								field: 'billto.billto_name', title: '請求先名', width: '300px'
							}, {
								field: 'invoice.payment_date', title: '支払日', width: '100px'
							}, {
								field: 'invoice.deposit_status', title: '入金ステータス', width: '100px', convert: { 0: '未入金', 1: '入金済' }
							}, {
								field: 'invoice.issue_status', title: '発行ステータス', width: '150px', convert: { 0: '未発行', 1: '発行済' }
							}, {
								field: 'creator', title: '作成者', width: '150px', convert: {0: '未発行', 1: '発行済'}							
							}]}
						>
							
							<CommonMonthlySelect
								value={this.state.searchYearMonth}
								style={{float: 'left', width: '150px', 'margin': '0px 5px'}}
								table
								onChange={(data) => this.changeSearchYearmonth(data)}
							/>

						</CommonTable>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
