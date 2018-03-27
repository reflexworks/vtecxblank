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
	CommonSearchConditionsFrom,
	CommonPagination,
} from './common'

type State = {
	feed: any,
	url: string
}

export default class BasicConditionList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/basic_condition?f&l=' + this.maxDisplayRows
		this.state = {
			feed: { entry: [] },
			isDisabled: false,
			isError: {},
			urlToPagenation: '',
		}
		this.activePage = 1
	}

	/**
	 * 一覧取得実行
	 * @param {*} activePage 
	 * @param {*} url 
	 */
	getFeed(activePage:number, url) {

		this.setState({
			isDisabled: true,
			isError: {}
		})

		this.activePage = activePage

		axios({
			url: url + '&n=' + activePage,
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
				this.setState({ feed: response.data.feed, isError: {}})
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})    
	}
  
	/**
	 * 更新画面に遷移する
	 */
	onSelect(data) {
		// 入力画面に遷移
		const id = data.link[0].___href.slice(17)
		this.props.history.push('/BasicConditionUpdate?' + id)
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
						
						<PageHeader>基本条件一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions) => this.doGetFeed(conditions)}>
							
						
							
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
							edit={(data) => this.onSelect(data) }
							header={[{
								field: 'billto.billto_code',title: '請求先コード', width: '150px'
							}, {
								field: 'billto.billto_name', title: '請求先名', width: '100px'
							}]}
						/>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}