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
	CommonGetList
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
	 * リスト上で削除処理
	 * @param {*} data 
	 */
    onDelete(/*data*/) {
    	/*
		if (confirm('請求データ:' + data.billing_data. + '\n' +
					'この情報を削除します。よろしいですか？')) {
			const id = data.link[0].___href.slice(14)
		
			axios({
				url: '/d/billing_data/' + id,
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
	*/
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

    					<PageHeader>請求データ一覧</PageHeader>

    					<CommonSearchConditionsFrom doSearch={(conditions) => this.doGetFeed(conditions)} open={true}>

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