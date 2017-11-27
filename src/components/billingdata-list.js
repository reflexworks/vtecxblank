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
	CommonDatePicker,
	CommonSearchConditionsFrom,
	CommonPagination
} from './common'

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
    /*更新処理は未作成なのでコメントアウト
    onSelect(data) {
        // 入力画面に遷移
        const internal_work_code = data.internal_work.internal_work_code
        this.props.history.push('/InternalWorkUpdate?' + internal_work_code)
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

    					<CommonSearchConditionsFrom doSearch={(conditions)=>this.doSearch(conditions)}>
    						<CommonInputText
    							controlLabel="顧客"
    							name="internal_work.staff_name"
    							type="text"
    							placeholder="顧客"
    						/>

    						<CommonDatePicker
    							controlLabel="年月"  
    							name="internal_work.working_date"
    							placeholder="年月"
    						/>

    						<CommonInputText
    							controlLabel="承認ステータス"
    							name="internal_work.approval_status"
    							type="text"
    							placeholder="承認ステータス"
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
    						//edit={(data) => this.onSelect(data) }
    						header={[{
    							field: 'internal_work.staff_name',title: '顧客名', width: '100px'
    						}, {
    							field: 'internal_work.working_date', title: '年月', width: '100px'
    						}, {
    							field: 'internal_work.approval_status', title: '承認ステータス', width: '50px'
    						}]}
    					/>
    				</Col>
    			</Row>
    		</Grid>
    	)
    }
}