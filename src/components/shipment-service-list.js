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
	CommonFilterBox,
	CommonSearchConditionsFrom,
	CommonPagination
} from './common'

type State = {
    feed: any,
    url: string
}

export default class ShipmentServiceList extends React.Component {
    state : State
    maxDisplayRows: number
    activePage: number

    constructor(props:Props) {
    	super(props)
    	this.maxDisplayRows = 50 // 1ページにおける最大表示件数（例：50件/1ページ）
    	this.url = '/d/shipment_service?f&l=' + this.maxDisplayRows
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
    	const id = data.link[0].___href.replace('/shipment_service/', '')
    	this.props.history.push('/ShipmentServiceUpdate?' + id)
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

    					<PageHeader>配送業者一覧</PageHeader>

    					<CommonSearchConditionsFrom doSearch={(conditions)=>this.doSearch(conditions)}>

    						<CommonInputText
    							controlLabel="配送業者コード"   
    							name="shipment_service.code"
    							type="text"
    							placeholder="YH"
    							size="sm"
    						/>

    						<CommonInputText
    							controlLabel="配送業者名"   
    							name="shipment_service.name"
    							type="text"
    							placeholder="ヤマト運輸"
    						/>

    						<CommonFilterBox
    							controlLabel="配送タイプ"
    							size="sm"
    							name="shipment_service.type"
    							options={[{
    								label: '宅配便',
    								value: 1
    							}, {
    								label: 'メール便',
    								value: 2
    							}]}
    						/>
    						<CommonInputText
    							controlLabel="サービス名"
    							name="shipment_service.service_name"
    							type="text"
    							placeholder="クール"
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
    						edit={(data)=>this.onSelect(data)}
    						header={[{
    							field: 'shipment_service.code',title: '配送業者コード', width: '100px'
    						}, {
    							field: 'shipment_service.name', title: '配送業者名', width: '200px'
    						}, {
    							field: 'shipment_service.type', title: '配送タイプ', width: '100px', convert: { 1:'宅配便', 2:'メール便'}
    						}, {
    							field: 'shipment_service.service_name', title: 'サービス名', width: '500px'
    						}]}
    					/>
    				</Col>
    			</Row>
    		</Grid>
    	)
    }
}