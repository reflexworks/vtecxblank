/* @flow */
import axios from 'axios'
import React from 'react'
import VtecxPagination from './vtecx_pagination'
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
	CommonSearchConditionsFrom
} from './common'

type State = {
	feed: any,
	url: string
}

export default class CustomerList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.state = {
			feed: { entry: [] },
			isDisabled: false,
			isError: {}
		}
		this.url = '/d/customer?f&l=' + this.maxDisplayRows
		this.activePage = 1
	}

	/**
	 * 一覧取得実行
	 * @param {*} activePage 
	 * @param {*} conditions 
	 */
	getFeed(activePage: number, conditions) {

		this.setState({ isDisabled: true, isError: {} })

		this.activePage = activePage

		axios({
			url: this.url + '&n=' + activePage + (conditions ? '&' + conditions : ''),
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( (response) => {

			this.setState({ isDisabled: false, isError: {} })

			if (response.status === 204) {
				this.setState({ isError: response })
			} else {
				// 「response.data.feed」に１ページ分のデータ(1~50件目)が格納されている
				// activePageが「2」だったら51件目から100件目が格納されている
				this.setState({ feed: response.data.feed})
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
		this.props.history.push('/CustomerUpdate?' + customer_code)
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

						<PageHeader>顧客一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doSearch(conditions)}>
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
						</CommonSearchConditionsFrom>

					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						<VtecxPagination
							url={this.url}
							onChange={(activePage)=>this.getFeed(activePage)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>

						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
							header={[{
								field: 'customer.customer_code',title: '顧客コード', width: '100px'
							}, {
								field: 'customer.customer_name', title: '顧客名', width: '200px'
							}, {
								field: 'customer.customer_name_kana', title: '顧客名カナ', width: '200px'
							}, {
								field: 'customer.customer_tel', title: '電話番号', width: '200px'
							}, {
								field: 'customer.customer_staff', title: '担当者名', width: '150px'
							}, {
								field: 'customer.customer_email', title: 'メールアドレス', width: '200px'
							}, {
								field: 'customer.customer_fax', title: 'FAX', width: '200px'
							}, {
								field: 'customer.zip_code', title: '郵便番号', width: '150px'
							}, {
								field: 'customer.prefecture', title: '都道府県', width: '200px'
							}, {
								field: 'customer.address1', title: '市区郡町村', width: '200px'
							}, {
								field: 'customer.address2', title: '番地', width: '200px'
							}]}
						/>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
