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
	CommonSearchConditionsFrom,
	CommonPagination,
} from './common'

type State = {
	feed: any,
	url: string
}

export default class WorkList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/work?f&l=' + this.maxDisplayRows
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
	 * @param {*} conditions 
	 */
	getFeed(activePage:number, conditions) {

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
	/*更新画面未作成なのでコメントアウト
	onSelect(index) {
		// 入力画面に遷移
		const work_name = this.state.feed.entry[index].work.work_name
		this.props.history.push('/WorkUpdate?' + work_name)
	}
	*/

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
		// 一覧取得
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
						
						<PageHeader>業務一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions) => this.doSearch(conditions)}>
							
							<CommonInputText
								controlLabel="委託される業務"
								name="work.consignment_service"
								type="text"
								placeholder="委託される業務"
								validate="string"
							/>

							<CommonInputText
								controlLabel="配送"
								name="work.delivery"
								type="text"
								placeholder="配送"
							/>

							<CommonInputText
								controlLabel="保険"
								name="work.insurance"
								type="text"
								placeholder="保険"
							/>

							<CommonInputText
								controlLabel="共済"
								name="work.mutual_aid"
								type="text"
								placeholder="共済"
							/>

							<CommonInputText
								controlLabel="取扱い商品データ"
								name="work.products"
								type="text"
								placeholder="取扱い商品データ"
							/>
							
						</CommonSearchConditionsFrom>
					
					</Col>
				</Row>

				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						<CommonPagination
							url={this.state.urlToPagenation}
							onChange={(activePage) => this.getFeed(activePage)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>	

						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							//edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
							header={[{
								field: 'work.consignment_service',title: '委託される業務', width: '150px'
							}, {
								field: 'work.storage', title: '保管内容', width: '100px'
							}, {
								field: 'work.package_handling', title: '荷役', width: '100px'
							}, {
								field: 'work.delivery', title: '配送', width: '100px'
							}, {
								field: 'work.insurance', title: '保険', width: '100px'
							}, {
								field: 'work.mutual_aid', title: '共済', width: '100px'
							}, {
								field: 'work.products', title: '取扱商品', width: '100px'
							}, {
								field: 'work.shipping_data', title: '出荷データ', width: '100px'
							}]}
						/>

					</Col>  
				</Row>  
		 </Grid>
		)
	}
}