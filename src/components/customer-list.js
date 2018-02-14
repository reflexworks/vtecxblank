/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
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
	CommonSearchConditionsFrom,
	CommonPagination
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
		this.url = '/s/get-customer?f&l=' + this.maxDisplayRows
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
	 */
	onSelect(_data) {
		// 入力画面に遷移
		const customer_code = _data.customer.customer_code
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

	/**
	 * 配送料登録へ移動
	 * @param {*} _data 
	 */
	moveDeliverycharge(_data) {
		this.props.history.push('/DeliveryChargeRegistration?customer_code=' + _data.customer.customer_code)
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

							<CommonInputText
								controlLabel="URL"
								name="customer.url"
								type="text"
								placeholder="url"
								size="lg"
							/>

							<CommonInputText
								controlLabel="顧客側の担当者"
								name="customer.person_in_charge"
								type="text"
								placeholder="顧客側の担当者"
								size="lg"
							/>
							<CommonInputText
								controlLabel="取扱品"
								name="customer.products"
								type="text"
								placeholder="取扱品"
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
								field: 'btn1', title: '配送料', width: '30px',
								label: <Glyphicon glyph="usd" />,onClick: (_data) => this.moveDeliverycharge(_data)
							}, {
								field: 'customer.customer_code',title: '顧客コード', width: '80px'
							}, {
								field: 'customer.customer_name', title: '顧客名', width: '400px'
							}, {
								field: 'customer.customer_name_kana', title: '顧客名カナ', width: '400px'
							}, {
								field: 'contact_information.tel', title: '電話番号', width: '100px'
							}, {
								field: 'billto.billto_name', title: '請求先', width: '400px'
							}, {
								field: 'customer.sales_staff', title: '営業担当者', width: '300px'
							}, {
								field: 'customer.working_staff', title: '作業担当者', width: '300px'
							}, {
								field: 'contact_information.fax', title: 'FAX', width: '100px'
							}, {
								field: 'contact_information.email', title: 'メールアドレス', width: '300px'
							}, {
								field: 'contact_information.zip_code', title: '郵便番号', width: '80px'
							}, {
								field: 'contact_information.prefecture', title: '都道府県', width: '50px'
							}, {
								field: 'contact_information.address1', title: '市区郡町村', width: '150px'
							}, {
								field: 'contact_information.address2', title: '番地', width: '300px'
							}, {
								field: 'customer.url', title: '顧客URL', width: '200px'
							}, {
								field: 'customer.person_in_charge', title: '担当者', width: '100px'
							}, {
								field: 'customer.products', title: '取扱品', width: '200px'
							}, {
								field: 'customer.warehouse_code', title: '倉庫コード', width: '200px'
							}]}
						/>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
