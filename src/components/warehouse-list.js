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

export default class WarehouseList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/warehouse?f&l=' + this.maxDisplayRows
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

	onSelect(_data) {
		// 入力画面に遷移
		const warehouse_code = _data.warehouse.warehouse_code
		this.props.history.push('/WarehouseUpdate?' + warehouse_code)
	}
	

	onDelete(data) {
		
		if (confirm('倉庫名:' + data.warehouse.warehouse_name + '\n' +
					'この情報を削除します。よろしいですか？')) {
			const id = data.warehouse.warehouse_code
		
			axios({
				url: '/d/warehouse/' + id,
				method: 'delete',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {
				this.setState({ isDisabled: false, isCompleted: 'delete', isError: false })
				this.getFeed(this.activePage, this.state.urlToPagenation)
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

						<PageHeader>倉庫一覧</PageHeader>
						
						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doGetFeed(conditions)}>
							<CommonInputText
								controlLabel="倉庫コード"
								name="warehouse.warehouse_code"
								type="text"
								placeholder="倉庫コード"
							/>
							<CommonInputText
								controlLabel="倉庫名"
								name="warehouse.warehouse_name"
								type="text"
								placeholder="倉庫名"
							/>
							<CommonInputText
								controlLabel="郵便番号"
								name="warehouse.zip_code"
								type="text"
								placeholder="123-4567"
								size="sm"
							/>
							<CommonPrefecture
								controlLabel="都道府県"
								componentClass="select"
								name="warehouse.prefecture"
								size="sm"
							/>
							<CommonInputText
								controlLabel="市区郡町村"
								name="warehouse.address1"
								type="text"
								placeholder="◯◯市××町"
							/>
							<CommonInputText
								controlLabel="番地"
								name="warehouse.address2"
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
							edit={(data) => this.onSelect(data)}
							remove={(data) => this.onDelete(data)}
							header={[{
								field: 'warehouse.warehouse_code',title: '倉庫コード', width: '100px'
							}, {
								field: 'warehouse.warehouse_name', title: '倉庫名', width: '200px'
							}, {
								field: 'warehouse.zip_code', title: '郵便番号', width: '70px'
							}, {
								field: 'warehouse.prefecture', title: '都道府県', width: '150px'
							}, {
								field: 'warehouse.address1', title: '市区郡町村', width: '150px'
							}, {
								field: 'warehouse.address2', title: '番地', width: '150px'
							}]}
						/>			
						
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}