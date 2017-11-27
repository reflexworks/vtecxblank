/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
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
	CommonSearchConditionsFrom,
	CommonPagination
} from './common'

type State = {
	feed: any,
	url: string
}

export default class BilltoList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/billto?f&l=' + this.maxDisplayRows
		this.state = {
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
	
	onSelect(data) {
		// 入力画面に遷移
		const billto_code = data.billto.billto_code
		this.props.history.push('/BilltoUpdate?' + billto_code)
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

						<PageHeader>請求先一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doSearch(conditions)}>
							<CommonInputText
								controlLabel="請求先コード"
								name="billto.billto_code"
								type="text"
								placeholder="請求先コード"
							/>
							<CommonInputText
								controlLabel="請求先名"
								name="billto.billto_name"
								type="text"
								placeholder="株式会社 ◯◯◯"
							/>

							<CommonInputText
								controlLabel="電話番号"
								name="contact_information.tel"
								type="text"
								placeholder="090-1234-5678"
								size="sm"
							/>

							<CommonInputText
								controlLabel="FAX"
								name="contact_information.fax"
								type="text"
								placeholder="090-1234-5678"
								size="sm"
							/>
							
							<CommonInputText
								controlLabel="メールアドレス"
								name="contact_information.email"
								type="email"
								placeholder="logioffice@gmail.com"
							/>

							<CommonInputText
								controlLabel="郵便番号"
								name="contact_information.zip_code"
								type="text"
								placeholder="123-4567"
								size="sm"
							/>

							<CommonPrefecture
								controlLabel="都道府県"
								componentClass="select"
								name="contact_information.prefecture"
								size="sm"
							/>

							<CommonInputText
								controlLabel="市区郡長村"
								name="contact_information.address1"
								type="text"
								placeholder="◯◯市××町"
							/>

							<CommonInputText
								controlLabel="番地"
								name="contact_information.address2"
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
							header={[{
								field: 'billto.billto_code',title: '請求先コード', width: '200px'
							}, {
								field: 'billto.billto_name', title: '請求先名', width: '200px'
							}, {
								field: 'billto.billing_closing_date', title: '請求締切日', width: '200px'
							}, {
								field: 'billto.payment_date', title: '支払日', width: '200px'
							}, {
								field: 'contact_information.tel', title: '電話番号', width: '200px'
							}, {
								field: 'contact_information.fax', title: 'FAX', width: '200px'
							}, {
								field: 'contact_information.email', title: 'メールアドレス', width: '200px'
							}, {
								field: 'contact_information.zip_code', title: '郵便番号', width: '200px'
							}, {
								field: 'contact_information.prefecture', title: '都道府県', width: '200px'
							}, {
								field: 'contact_information.address1', title: '市区郡町村', width: '200px'
							}, {
								field: 'contact_information.address2', title: '番地', width: '200px'
							}]}
						/>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}