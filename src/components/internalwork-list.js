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
	CommonMonthlySelect,
} from './common'

type State = {
    feed: any,
    url: string
}

export default class InternalWorkList extends React.Component {
    state : State
    maxDisplayRows: number
    activePage: number

    constructor(props:Props) {
    	super(props)
    	this.maxDisplayRows = 50 // 1ページにおける最大表示件数（例：50件/1ページ）
    	this.url = '/d/internal_work?f&l=' + this.maxDisplayRows
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
    			this.setState({ isDisabled: false, feed: response.data.feed})
    		}

    	}).catch((error) => {
    		this.setState({ isDisabled: false, isError: error })
    	})
		
    	this.sampleData()
		
		
    }
	
    sampleData() {
    	let feed = {entry: []}
    	for (let i = 1, ii = 4; i < ii; ++i) {
    		const data = {
    			internal_work: {
    				working_date: '2018/0' + i
    			},
    			customer: {
    				customer_name: 'サンプル顧客'
    			},
    			quotation: {
    				quotation_code: '00000' + i + '-01'
    			}
    		}
    		feed.entry.push(data)
    	}
    	this.setState({feed: feed})
    }
	
    /**
     * 更新画面に遷移する
     */
    onSelect(data) {
    	// 入力画面に遷移
    	const internal_work_code = data.internal_work.internal_work_code
    	this.props.history.push('/InternalWorkRegistration?' + internal_work_code)
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

    					<PageHeader>庫内作業一覧</PageHeader>

    					<CommonSearchConditionsFrom doSearch={(conditions)=>this.doSearch(conditions)}>

    						<CommonMonthlySelect
    							controlLabel="作業年月"
    							name="internal_work.working_date"
    						/>

    						<CommonInputText
    							controlLabel="顧客"  
    							name="customer.customer_name"
    							placeholder="株式会社○○○○"
    						/>

    						<CommonInputText
    							controlLabel="対象見積書No"
    							name="quotation.quotation_code"
    							type="text"
    							placeholder="000001-01"
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
    							field: 'internal_work.working_date',title: '作業年月', width: '100px'
    						}, {
    							field: 'customer.customer_name', title: '顧客', width: '200px'
    						}, {
    							field: 'quotation.quotation_code', title: '対象見積書No', width: '200px'
    						}]}
    					/>
    				</Col>
    			</Row>
    		</Grid>
    	)
    }
}