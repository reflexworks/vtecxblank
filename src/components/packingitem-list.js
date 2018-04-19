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
	CommonGetList,
	CommonBeforConditions
} from './common'

type State = {
	feed: any,
	url: string
}

export default class PackingItemList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/packing_item?f&l=' + this.maxDisplayRows
		this.state = {
			feed: { entry: [] },
			isDisabled: false,
			isError: {},
			urlToPagenation: '' // ページネーション用に渡すURL
		}
		this.conditionsKey = 'PackingItemList'
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
	 * @param {*} index 
	 */
	moveEdit(data) {
		// 入力画面に遷移
		const item_code = data.packing_item.item_code
		this.props.history.push('/PackingItemUpdate?' + item_code)
	}

	onSelect(_data) {
		console.log(_data)
	}

	/**
	 * リスト上で削除処理
	 * @param {*} data 
	 */
	onDelete(data) {

		if (confirm('資材コード:' + data.packing_item.item_code + '\n' +
					'資材名:' + data.packing_item.item_name + '\n' +
					'この情報を削除します。よろしいですか？')) {		
			axios({
				url: '/d' + data.link[0].___href,
				method: 'delete',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {
				this.setState({ isDisabled: false, isCompleted: 'delete', isError: false })
				this.getFeed(1, this.state.urlToPagenation)
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
		const befor_conditions = CommonBeforConditions().get(this.conditionsKey, this.url)
		this.doGetFeed(befor_conditions.conditions, befor_conditions.activePage)
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

						<PageHeader>資材一覧</PageHeader>
						
						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doGetFeed(conditions, 1)}>
							
							<CommonInputText
								controlLabel="品番"
								name="packing_item.item_code"
								type="text"
								placeholder="品番"
								validate="string"
								required
							/>
							
							<CommonInputText
								controlLabel="商品名称"
								name="packing_item.item_name"
								type="text"
								placeholder="商品名称"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="材質"
								name="packing_item.material"
								type="text"
								placeholder="材質"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="カテゴリ"
								name="packing_item.category"
								type="text"
								placeholder="カテゴリ"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="サイズ１"
								name="packing_item.size1"
								type="text"
								placeholder="サイズ１"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="サイズ２"
								name="packing_item.size2"
								type="text"
								placeholder="サイズ２"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="特記"
								name="packing_item.notices"
								type="text"
								placeholder="特記"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="厚み"
								name="packing_item.thickness"
								type="text"
								placeholder="厚み"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="内寸幅"
								name="packing_item.inside_width"
								type="text"
								placeholder="内寸幅"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="内寸奥行"
								name="packing_item.inside_depth"
								type="text"
								placeholder="内寸奥行"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="内寸高さ"
								name="packing_item.inside_height"
								type="text"
								placeholder="内寸高さ"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="外寸幅"
								name="packing_item.outer_width"
								type="text"
								placeholder="外寸幅"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="外寸奥行"
								name="packing_item.outer_depth"
								type="text"
								placeholder="外寸奥行"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="外寸高さ"
								name="packing_item.outer_height"
								type="text"
								placeholder="外寸高さ"
								validate="string"
								required
							/>						

							<CommonInputText
								controlLabel="仕入れ単価"
								name="packing_item.purchase_price"
								type="text"
								placeholder="仕入れ単価"
								validate="string"
								required
							/>
							<CommonInputText
								controlLabel="通常販売価格"
								name="packing_item.regular_price"
								type="text"
								placeholder="通常販売価格"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="通常販売価格・単価"
								name="packing_item.regular_unit_price"
								type="text"
								placeholder="通常販売価格・単価"
								validate="string"
								required
							/>
						
							<CommonInputText
								controlLabel="特別販売価格"
								name="packing_item.special_price"
								type="text"
								placeholder="特別販売価格"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="特別販売価格・単価"
								name="packing_item.special_unit_price"
								type="text"
								placeholder="特別販売価格・単価"
								validate="string"
								required
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
							edit={!this.props.selectTable ? (data) => this.moveEdit(data) : null }
							select={this.props.selectTable ? (data) => this.onSelect(data) : null}
							remove={!this.props.selectTable ? (data) => this.onDelete(data) : null}
							header={[{
								field: 'packing_item.item_code',title: '品番', width: '100px'
							}, {
								field: 'packing_item.item_name', title: '商品名称', width: '200px'
							}, {
								field: 'packing_item.material', title: '材質', width: '200px'
							}, {
								field: 'packing_item.category', title: 'カテゴリ', width: '200px'
							}, {
								field: 'packing_item.size1', title: 'サイズ１', width: '200px'
							}, {
								field: 'packing_item.size2', title: 'サイズ２', width: '200px'
							}, {
								field: 'packing_item.notices', title: '特記', width: '200px'
							}, {
								field: 'packing_item.thickness', title: '厚み', width: '70px'
							}, {
								field: 'packing_item.inside_width', title: '内寸幅', width: '70px'
							}, {
								field: 'packing_item.inside_depth', title: '内寸奥行', width: '70px'
							}, {
								field: 'packing_item.inside_height', title: '内寸高さ', width: '70px'
							}, {
								field: 'packing_item.outer_width', title: '外寸幅', width: '70px'
							}, {
								field: 'packing_item.outer_depth', title: '外寸奥行', width: '70px'
							}, {
								field: 'packing_item.outer_height', title: '外寸高さ', width: '70px'
							}, {
								field: 'packing_item.outer_total', title: '三辺合計', width: '70px'
							}, {	
								field: 'packing_item.purchase_price', title: '仕入れ単価', width: '150px'
							}, {	
								field: 'packing_item.regular_price', title: '通常販売価格', width: '150px'
							}, {
								field: 'packing_item.regular_unit_price', title: '通常販売価格・単価', width: '150px'
							}, {
								field: 'packing_item.special_price', title: '特別販売価格', width: '150px'
							}, {
								field: 'packing_item.special_unit_price', title: '特別販売価格・単価', width: '150px'
							}]}
						/>			
						
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}