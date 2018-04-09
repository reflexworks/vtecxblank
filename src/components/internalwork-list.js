/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	//Button,
	//Glyphicon,
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
	CommonGetList
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
    	this.url = '/s/get-internalwork-list?l=' + this.maxDisplayRows
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

    	CommonGetList(url, activePage).then((_state) => {
    		this.setState(_state)
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
     */
    onSelect(_data) {
    	// 入力画面に遷移
    	const code = _data.id.split(',')[0].split('/internal_work/')[1]
    	this.props.history.push('/InternalWorkUpdate?code=' + code)
    }

    /**
     * 描画後の処理
     */
    componentDidMount() {
    	this.doGetFeed()
    }


	/**
	 * リスト上で削除処理
	 * @param {*} data 
	 */
    onDelete(data) {

    	if (confirm('この情報を削除します。よろしいですか？')) {

    		axios({
    			url: '/d' + data.link[0].___href + '?_rf',
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
    	}
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

    					<CommonSearchConditionsFrom doSearch={(conditions)=>this.doGetFeed(conditions)}>

    						<CommonMonthlySelect
    							controlLabel="作業年月"
    							name="internal_work.working_yearmonth"
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
    							placeholder="000001"
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
    							field: 'internal_work.working_yearmonth',title: '作業年月', width: '70px'
    						}, {
    							field: 'customer.customer_name', title: '顧客', width: '530px'
    						}, {
    							field: 'quotation.quotation_code', title: '対象見積書No', width: '100px'
    						}, {
    							field: 'internal_work.is_completed', title: '入力完了フラグ', width: '100px', convert: {'0': '未完了', '1': '完了'}
    						}, {
    							field: 'creator', title: '作成者', width: '200px'
    						}]}
    					>
    					</CommonTable>
    				</Col>
    			</Row>
    		</Grid>
    	)
    }
}