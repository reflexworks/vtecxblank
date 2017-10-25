/* @flow */
import axios from 'axios'
import React from 'react'
import VtecxPagination from './vtecx_pagination'
//import ConditionInputForm from './demo_conditioninput'
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

export default class WarehouseList extends React.Component {
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
		this.url = '/d/warehouse?f&l=' + this.maxDisplayRows
		this.activePage = 1
	}
	/*
	search(condition: string) {
		
		this.setState({ url: '/d/warehouse?f&l=' + this.maxDisplayRows + condition })
		this.getFeed(this.activePage)
	}
*/   
	getFeed(activePage:number, conditions) {

		this.setState({ isDisabled: true })

		this.activePage = activePage

		axios({
			url: this.url + '&n=' + activePage + (conditions ? '&' + conditions : ''),
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
  
	componentDidMount() {
		// 一覧取得
		this.getFeed(1)
	}

	/*
	onSelect(index) {
		// 入力画面に遷移
		const warehouse_code = this.state.feed.entry[index].warehouse.warehouse_code
		this.props.history.push('/WarehouseUpdate?' + warehouse_code)
	}
	*/

	/**
	 * 検索実行
	 * @param {*} conditions 
	 */
	doSearch(conditions) {
		this.getFeed(1, conditions)
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
						
						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doSearch(conditions)}>
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
								controlLabel="市区郡長村"
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

						<VtecxPagination
							url={this.url}
							onChange={(activePage)=>this.getFeed(activePage)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>

						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							//edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
							header={[{
								field: 'warehouse.warehouse_code',title: '倉庫コード', width: '100px'
							}, {
								field: 'warehouse.warehouse_name', title: '倉庫名', width: '70px'
							}, {
								field: 'warehouse.zip_code', title: '郵便番号', width: '200px'
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