/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Button,
	Panel,
	Glyphicon,
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
				this.setState({ isDisabled: false, isError: response })
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
	onSelect(index) {
		// 入力画面に遷移
		const customer_code = this.state.feed.entry[index].customer.customer_code
		this.props.history.push('/InvoiceUpdate?' + customer_code)
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
		const icon = this.state.searchDetails === true ? 'menu-up' : 'menu-down'
		const header = (
			<div onClick={() => this.setState({ searchDetails: !this.state.searchDetails })}>詳細検索 <Glyphicon glyph={icon} style={{ float: 'right' }} /></div>
		)
		return (
			<Grid>

				{/* 通信中インジケータ */}
				<CommonIndicator visible={this.state.isDisabled} />

				{/* 通信メッセージ */}
				<CommonNetworkMessage isError={this.state.isError}/>

				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						<PageHeader>請求書一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions) => this.doSearch(conditions)} open={true}>

							<CommonMonthlySelect
    							controlLabel="請求年月"  
								name="quotation.quotation_date"
								value={this.state.searchDate}
							/>
								
							<Panel collapsible header={header} eventKey="1" bsStyle="success" expanded={this.state.searchDetails}>	
								<CommonInputText
									controlLabel="顧客コード"
									name="customer.customer_code"
									type="text"
									placeholder="顧客コード"
								/>
								<CommonInputText
									controlLabel="顧客名"
									name="customer.customer_name"
									type="text"
									placeholder="株式会社 ◯◯◯"
								/>
								<CommonInputText
									controlLabel="顧客名(カナ)"
									name="customer.customer_name_kana"
									type="text"
									placeholder="カブシキガイシャ ◯◯◯"
								/>
								<CommonInputText
									controlLabel="電話番号"
									name="customer.customer_tel"
									type="text"
									placeholder="090-1234-5678"
									size="sm"
								/>
								<CommonInputText
									controlLabel="FAX"
									name="customer.customer_fax"
									type="text"
									placeholder="090-1234-5678"
									size="sm"
								/>
								<CommonInputText
									controlLabel="メールアドレス"
									name="customer.customer_email"
									type="email"
									placeholder="logioffice@gmail.com"
								/>
								<CommonInputText
									controlLabel="郵便番号"
									name="customer.zip_code"
									type="text"
									placeholder="123-4567"
									size="sm"
								/>
								<CommonPrefecture
									controlLabel="都道府県"
									componentClass="select"
									name="customer.prefecture"
									size="sm"
								/>
								<CommonInputText
									controlLabel="市区郡長村"
									name="customer.address1"
									type="text"
									placeholder="◯◯市××町"
								/>
								<CommonInputText
									controlLabel="番地"
									name="customer.address2"
									type="text"
									placeholder="1丁目2番地 ◯◯ビル1階"
									size="lg"
								/>
							</Panel>

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

						<Button>顧客ごとに表示</Button>
						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
							header={[{
								field: 'customer.customer_code',title: '請求年月', width: '100px'
							}, {
								field: 'customer.customer_code',title: '請求番号', width: '200px'
							}, {
								field: 'customer.customer_name', title: '見積番号', width: '200px'
							}, {
								field: 'customer.customer_name_kana', title: '合計請求金額', width: '200px'
							}, {
								field: 'customer.customer_tel', title: '課税対象合計', width: '200px'
							}, {
								field: 'customer.customer_staff', title: '振込先', width: '200px'
							}, {
								field: 'customer.customer_email', title: '小計金額', width: '200px'
							}, {
								field: 'customer.customer_fax', title: '消費税', width: '200px'
							}, {
								field: 'customer.zip_code', title: 'EMS', width: '150px'
							}, {
								field: 'customer.prefecture', title: '立替金', width: '200px'
							}, {
								field: 'customer.address1', title: '購入、弁済代', width: '200px'
							}]}
						/>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
