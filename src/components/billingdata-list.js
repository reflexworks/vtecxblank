/* @flow */
//import axios from 'axios'
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
	CommonMonthlySelect,
	CommonSearchConditionsFrom,
	CommonPagination,
	CommonGetList,
	CommonBeforConditions
} from './common'

import moment from 'moment'
type State = {
    feed: any,
    url: string
}

export default class BillingDataList extends React.Component {
    state : State
    maxDisplayRows: number
    activePage: number

    constructor(props:Props) {
    	super(props)
    	this.maxDisplayRows = 50 // 1ページにおける最大表示件数（例：50件/1ページ）
    	this.url = '/d/billing_data?f&l=' + this.maxDisplayRows
    	this.state = {
    		searchDate: moment().format('YYYY/MM'),
    		feed: { entry: [] },
    		disabled: true,
    		isDisabled: false,
    		isError: {},
    		urlToPagenation: '' // ページネーション用に渡すURL
    	}
    	this.createSampleData()
		this.conditionsKey = 'BillingDataList'
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

    createSampleData() {
		
    	this.sample = [{
    		customer_name: '顧客１',
    		date: '2017/12',
    	}, {
    		customer_name: '顧客2',
    		date: '2017/12',
    	}]
    }
    /**
     * 更新画面に遷移する
     * @param {*} index
     */

    onSelect() {
    	// 入力画面に遷移
    	this.props.history.push('/BillingDataRegistration')
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

    					<PageHeader>請求データ一覧</PageHeader>

    					<CommonSearchConditionsFrom doSearch={(conditions) => this.doGetFeed(conditions, 1)} open={true}>

    						<CommonMonthlySelect
    							controlLabel="請求年月"
    							name="quotation_date"
    							value={this.state.searchDate}
    						/>
							
    						<CommonInputText
    							controlLabel="顧客"
    							name="customer_name"
    							type="text"
    							placeholder="顧客"
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
    						data={this.sample}
    						edit={() => this.onSelect()}
    						remove={(data) => this.onDelete(data)}
    						header={[{
    							field: 'customer_name',title: '顧客名', width: '100px'
    						}, {
    							field: 'date', title: '年月', width: '100px'
    						
    						}]}
    					/>
    				</Col>
    			</Row>
    		</Grid>
    	)
    }
}