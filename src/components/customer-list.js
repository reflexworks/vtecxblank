/* @flow */
import axios from 'axios'
import React from 'react'
import VtecxPagination from './vtecx_pagination'
import ConditionInputForm from './demo_conditioninput'
import {
	Grid,
	Row,
	Col,
	PageHeader
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonIndicator,
	CommonNetworkMessage,
	CommonTable
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
			isError: {},
			url: '/d/customer?f&l=' + this.maxDisplayRows
		}
		this.activePage = 1
	}
  
	search(condition: string) {
		
		this.setState({ url: '/d/customer?f&l=' + this.maxDisplayRows + condition })
		this.getFeed(this.activePage)
	}
   
	getFeed(activePage:number) {

		this.setState({ isDisabled: true })

		this.activePage = activePage
		axios({
			url: this.state.url + '&n=' + activePage,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( (response) => {

			this.setState({ isDisabled: false })

			if (response.status === 204) {
				this.setState({ isError: response })
			} else {
				// 「response.data.feed」に１ページ分のデータ(1~50件目)が格納されている
				// activePageが「2」だったら51件目から100件目が格納されている
				this.setState({ feed: response.data.feed })
			}
			
		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})    
	}
  
	componentDidMount() {
		// 一覧取得
		this.getFeed(1)
	}

	onSelect(index) {
		// 入力画面に遷移
		const customer_number = this.state.feed.entry[index].customer.customer_number
		this.props.history.push('/CustomerUpdate?' + customer_number)
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>顧客一覧</PageHeader>
						<ConditionInputForm search={(url) => this.search(url)} />

						{/* 通信中インジケータ */}
						<CommonIndicator visible={this.state.isDisabled} />

						{/* 通信メッセージ */}
						<CommonNetworkMessage isError={this.state.isError}/>

					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						<VtecxPagination
							url={this.state.url}
							onChange={(activePage)=>this.getFeed(activePage)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>

						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
							header={[{
								field: 'customer.customer_number',title: '顧客コード', width: '100px'
							}, {
								field: 'customer.corporate_type', title: '顧客区分', width: '70px', convert: { 1:'個人', 2:'法人'}
							}, {
								field: 'customer.customer_name', title: '顧客名（漢字）姓、名', width: '200px'
							}, {
								field: 'customer.customer_tel1', title: '電話1', width: '150px'
							}, {
								field: 'customer.customer_staff', title: '担当者', width: '150px'
							}, {
								field: 'customer.email_address1', title: 'メールアドレス１', width: '200px'
							}]}
						/>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
