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
	CommonRadioBtn,
	CommonSearchConditionsFrom,
	CommonPagination
} from './common'

type State = {
	feed: any,
	url: string
}

export default class ManifestoList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/manifesto?f&l=' + this.maxDisplayRows
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
	 * @param {*} index 
	 */

	onSelect(data) {
		// 入力画面に遷移
		const manifesto_code = data.manifesto.manifesto_code
		this.props.history.push('/ManifestoUpdate?' + manifesto_code)
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

						<PageHeader>資材一覧</PageHeader>
						
						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doSearch(conditions)}>
							
							<CommonInputText
								controlLabel="品番"
								name="manifesto.manifesto_code"
								type="text"
								placeholder="品番"
								validate="string"
								required
							/>
							
							<CommonInputText
								controlLabel="商品名称"
								name="manifesto.manifesto_name"
								type="text"
								placeholder="商品名称"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="材質"
								name="manifesto.material"
								type="text"
								placeholder="材質"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="厚み"
								name="manifesto.thickness"
								type="text"
								placeholder="厚み"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="内寸幅"
								name="manifesto.inside_width"
								type="text"
								placeholder="内寸幅"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="内寸奥行"
								name="manifesto.inside_depth"
								type="text"
								placeholder="内寸奥行"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="内寸高さ"
								name="manifesto.inside_height"
								type="text"
								placeholder="内寸高さ"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="外寸幅"
								name="manifesto.outer_width"
								type="text"
								placeholder="外寸幅"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="外寸奥行"
								name="manifesto.outer_depth"
								type="text"
								placeholder="外寸奥行"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="外寸高さ"
								name="manifesto.outer_height"
								type="text"
								placeholder="外寸高さ"
								validate="string"
								required
							/>						
						
							<CommonInputText
								controlLabel="通常販売価格"
								name="manifesto.regular_price"
								type="text"
								placeholder="通常販売価格"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="通常販売価格・単価"
								name="manifesto.regular_unit_price"
								type="text"
								placeholder="通常販売価格・単価"
								validate="string"
								required
							/>
						
							<CommonInputText
								controlLabel="特別販売価格"
								name="manifesto.special_price"
								type="text"
								placeholder="特別販売価格"
								validate="string"
								required
							/>

							<CommonInputText
								controlLabel="特別販売価格・単価"
								name="manifesto.special_unit_price"
								type="text"
								placeholder="特別販売価格・単価"
								validate="string"
								required
							/>

							<CommonRadioBtn
								controlLabel="ロット"
								name="manifesto.islot"
								data={[{
									label: '１品単位',
									value: '0'
								}, {
									label: 'ロット単位',
									value: '1'
								}]}
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
							edit={(data) => this.onSelect(data) }
							header={[{
								field: 'manifesto.manifesto_code',title: '品番', width: '100px'
							}, {
								field: 'manifesto.manifesto_name', title: '商品名称', width: '200px'
							}, {
								field: 'manifesto.material', title: '材質', width: '200px'
							}, {
								field: 'manifesto.thickness', title: '厚み', width: '70px'
							}, {
								field: 'manifesto.inside_width', title: '内寸幅', width: '70px'
							}, {
								field: 'manifesto.inside_depth', title: '内寸奥行', width: '70px'
							}, {
								field: 'manifesto.inside_height', title: '内寸高さ', width: '70px'
							}, {
								field: 'manifesto.outer_width', title: '外寸幅', width: '70px'
							}, {
								field: 'manifesto.outer_depth', title: '外寸奥行', width: '70px'
							}, {
								field: 'manifesto.outer_height', title: '外寸高さ', width: '70px'
							}, {
								field: 'manifesto.outer_total', title: '三辺合計', width: '70px'
							}, {	
								field: 'manifesto.regular_price', title: '通常販売価格', width: '150px'
							}, {
								field: 'manifesto.regular_unit_price', title: '通常販売価格・特別', width: '150px'
							}, {
								field: 'manifesto.special_price', title: '特別販売価格', width: '150px'
							}, {
								field: 'manifesto.special_unit_price', title: '特別販売価格・特別', width: '150px'
							}, {
								field: 'manifesto.islot', title: 'ロット', width: '150px',convert:{1:'１品単位',2:'ロット単位'}
							}]}
						/>			
						
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
