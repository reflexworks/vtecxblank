/* @flow */
//import axios from 'axios'
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
	CommonPagination,
	CommonGetList
} from './common'

type State = {
	feed: any,
	url: string
}

export default class BillfromList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/billfrom?f&l=' + this.maxDisplayRows
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
	 * @param {*} url 
	 */
	getFeed(activePage: number, url) {

		this.setState({
			isDisabled: true,
			isError: {}
		})

		this.activePage = activePage

		CommonGetList(url, activePage).then((_state) => {
			this.setState(_state)
		})

	}

	/**
	 * 一覧取得設定
	 * @param {*} conditions 
	 */
	doGetFeed(conditions) {

		const url = this.url + (conditions ? '&' + conditions : '')
		this.setState({
			urlToPagenation: url
		})
	}

	/**
	 * 更新画面に遷移する
	 * @param {*} index 
	 */
	
	onSelect(data) {
		// 入力画面に遷移
		const billfrom_code = data.billfrom.billfrom_code
		this.props.history.push('/BillfromUpdate?' + billfrom_code)
	}

	/**
	 * 描画後の処理
	 */
	componentDidMount() {
		this.doGetFeed()
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

						<PageHeader>請求元一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doGetFeed(conditions)}>
							<CommonInputText
								controlLabel="請求元コード"
								name="billfrom.billfrom_code"
								type="text"
								placeholder="請求元コード"
							/>
							<CommonInputText
								controlLabel="請求元名"
								name="billfrom.billfrom_name"
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
								controlLabel="市区郡町村"
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
							onChange={(activePage, url)=>this.getFeed(activePage, url)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>

						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							edit={(data)=>this.onSelect(data)}
							header={[{
								field: 'billfrom.billfrom_code',title: '請求元コード', width: '200px'
							}, {
								field: 'billfrom.billfrom_name', title: '請求元名', width: '200px'
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