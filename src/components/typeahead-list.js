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
	CommonPagination,
	CommonGetList,
	CommonBeforConditions
} from './common'

type State = {
    feed: any,
    url: string
}

export default class TypeAheadList extends React.Component {
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
    	this.conditionsKey = 'TypeAheadList'
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
	
    onSelect(data) {
    	// 入力画面に遷移
    	const id = data.link[0].___href.slice(12)
    	this.props.history.push('/TypeAheadUpdate?' + id)
    }

	/**
	 * リスト上での削除処理
	 * @param {*} data 
	 */
    onDelete(data) {
    	
    	if (confirm('入力補完内容:' + data.type_ahead.value + '\n' +
					'この情報を削除します。よろしいですか？')) {
    		const id = data.link[0].___href.slice(12)
		
    		axios({
    			url: '/d/type_ahead/' + id,
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

    					<PageHeader>入力補完一覧</PageHeader>

    					<CommonSearchConditionsFrom doSearch={(conditions)=>this.doGetFeed(conditions, 1)}>
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
    						activePage={this.state.activePage}
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