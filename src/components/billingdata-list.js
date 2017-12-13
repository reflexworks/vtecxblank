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
	CommonMonthlySelect,
	CommonSearchConditionsFrom,
	CommonPagination
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
    	this.activePage = 1
    	this.createSampleData()
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
    	//const billing_data_code = data.billing_data.billing_data_code
    	//this.props.history.push('/InternalWorkUpdate' + billing_data_code)
    	this.props.history.push('/BillingDataRegistration')
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

    					<PageHeader>請求データ一覧</PageHeader>

    					<CommonSearchConditionsFrom doSearch={(conditions) => this.doSearch(conditions)} open={true}>

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
    						onChange={(activePage)=>this.getFeed(activePage)}
    						maxDisplayRows={this.maxDisplayRows}
    						maxButtons={4}
    					/>

    					<CommonTable
    						name="entry"
    						data={this.sample}
    						edit={() => this.onSelect() }
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