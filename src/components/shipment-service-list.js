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
    	this.url = '/d/type_ahead?f&l=' + this.maxDisplayRows
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
    	const id = data.link[0].___href.slice(12)
    	this.props.history.push('/TypeAheadUpdate?' + id)
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
    						<CommonFilterBox
    							controlLabel="入力補完種別"
    							size="sm"
    							name="type_ahead.type"
    							options={[{
    								label: '項目名',
    								value: '0'
    							}, {
    								label: '単位名称',
    								value: '1'
    							}, {
    								label: '単位',
    								value: '2'
    							}, {
    								label: '単価',
    								value: '3'
    							}, {
    								label: '備考',
    								value: '4'
    							}]}
    						/>
								
    						<CommonInputText
    							controlLabel="入力補完内容"   
    							name="type_ahead.value"
    							type="text"
    							placeholder="入力補完内容"
    							size='lg'
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
    							field: 'type_ahead.type',title: '入力補完種別', width: '100px',convert: { 0:'項目名', 1:'単位名称', 2:'単位',3:'単価',4:'備考'}
    						}, {
    							field: 'type_ahead.value', title: '入力補完内容', width: '100px'
    						}]}
    					/>
    				</Col>
    			</Row>
    		</Grid>
    	)
    }
}