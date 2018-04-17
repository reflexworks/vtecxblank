/* @flow */
//import axios from 'axios'
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
	CommonPagination,
	CommonLoginUser,
	CommonGetList,
	CommonBeforConditions
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

		// ログインユーザ情報
		this.loginUser = CommonLoginUser().get()

		// 編集権限の有無
		this.isEdit = this.loginUser.role !== '5'

		this.btn1 = this.isEdit ? {
			field: 'btn1', title: '配送料', width: '30px',
			label: <Glyphicon glyph="usd" />, onClick: (_data) => this.moveDeliverycharge(_data)
		} : null
		this.header = this.btn1 ? [this.btn1] : []
		this.header_other = [{
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
			field: 'customer.person_in_charge', title: '顧客側担当者', width: '300px'
		}, {
			field: 'customer.products', title: '取扱品', width: '300px'
		}, {
			field: 'customer.warehouse_code', title: '倉庫コード', width: '100px'
		}]

		this.header = this.header.concat(this.header_other)

		this.conditionsKey = 'CustomerList'
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
	 */
	onSelect(_data) {
		// 入力画面に遷移
		const customer_code = _data.customer.customer_code
		this.props.history.push('/CustomerUpdate?' + customer_code)
	}

	/**
	 * 描画後の処理
	 */
	componentDidMount() {
		const befor_conditions = CommonBeforConditions().get(this.conditionsKey, this.url)
		this.doGetFeed(befor_conditions.conditions, befor_conditions.activePage)
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

						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doGetFeed(conditions, 1)}>
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
							activePage={this.state.activePage}
							onChange={(activePage, url)=>this.getFeed(activePage, url)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>

						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							edit={this.isEdit ? (data)=>this.onSelect(data) : null}
							header={this.header}
						/>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
