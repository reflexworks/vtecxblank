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
	//CommonPrefecture,
	CommonSearchConditionsFrom,
	CommonPagination
} from './common'

type State = {
	feed: any,
	url: string
}

export default class DeliveryList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/delivery?f&l=' + this.maxDisplayRows
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
				this.setState({ feed:'',isDisabled: false, isError: response })
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
		this.props.history.push('/DeliveryUpdate?' + customer_code)
	}

	/**
	 * リスト上で削除処理
	 * @param {*} data 
	 */
	onDelete(/*data*/) {
	/*
		if (confirm('配送情報:' + data.deliverycharge. + '\n' +
					'この情報を削除します。よろしいですか？')) {
			const id = data.link[0].___href.slice(16)
		
			axios({
				url: '/d/deliverycharge/' + id,
				method: 'delete',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {
				this.setState({ isDisabled: false, isCompleted: 'delete', isError: false })
				this.getFeed(this.activePage)
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
	*/
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

						<PageHeader>配送料一覧</PageHeader>

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
							edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
							remove={(data) => this.onDelete(data)}
							header={[{
								field: 'customer.customer_code',title: '顧客コード', width: '100px'
							}, {
								field: 'customer.customer_name', title: '顧客名', width: '200px'
							}]}
						/>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
