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
	CommonSearchConditionsFrom,
	CommonPagination,
	CommonInputText,
	CommonFilterBox,
	CommonTextArea,
	CommonGetList
} from './common'

type State = {
	feed: any,
	url: string
}

export default class InquiryList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/s/get-inquiry?f&l=' + this.maxDisplayRows
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
		const inquiry_code = data.link[0].___href.slice(9)
		this.props.history.push('/InquiryUpdate?' + inquiry_code)
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

						<PageHeader>特記事項一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doGetFeed(conditions)}>
							
							<CommonInputText
								controlLabel="顧客名"
								name="customer.customer_name"
								type="text"
								placeholder="顧客名"
							/>

							<CommonInputText
								controlLabel="顧客コード"
								name="customer.customer_code"
								type="text"
								placeholder="顧客コード"
							/>

							<CommonInputText
								controlLabel="登録日時"
								name="published"
								type="text"
								placeholder="登録日時"
							/>

							<CommonInputText
								controlLabel="更新日時"
								name="updated"
								type="text"
								placeholder="更新日時"
							/>
							
							<CommonInputText
								controlLabel="担当者"
								name="inquiry.staff_name"
								type="text"
								placeholder="担当者"
							/>

							<CommonFilterBox
								controlLabel="ステータス"
								size="sm"
								name="inquiry.inquiry_status"
								options={[{
									label: '問い合わせ',
									value: '1'
								}, {
									label: '確認中',
									value: '2'
								}, {
									label: '返答待ち',
									value: '3'
								}, {
									label: '完了',
									value: '4'
								}]}
							/>

							<CommonFilterBox
								controlLabel="分類"
								size="sm"
								name="inquiry.content_type"
								options={[{
									label: '経理連絡',
									value: '1'
								}, {
									label: '営業連絡',
									value: '2'
								}, {
									label: 'システム連絡',
									value: '3'
								}, {
									label: 'メモ',
									value: '4'
								}, {
									label: 'その他',
									value: '5'
								}]}
							/>
							
							<CommonTextArea
								controlLabel="内容"
								name="inquiry.content"
								placeholder="内容"
								size='lg'
								style={{'height':'100px'}}
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
								field: 'published',title: '登録日時', width: '150px'
							}, {
								field: 'updated',title: '更新日時', width: '150px'
							}, {
								field: 'customer.customer_name', title: '顧客名', width: '300px'
							}, {
								field: 'customer.customer_code', title: '顧客コード', width: '100px'
							}, {
								field: 'inquiry.staff_name', title: '作成者', width: '150px'
							}, {
								field: 'inquiry.inquiry_status', title: 'ステータス', width: '100px',
								convert: {
									1: '問い合わせ', 2: '確認中', 3: '返答待ち', 4: '完了',
								}
							}, {
								field: 'inquiry.content_type', title: '分類', width: '100px',
								convert: {
									1: '経理連絡',2: '営業連絡',3:'システム連絡',4:'メモ',5:'その他',
								}
							}]}
						/>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}