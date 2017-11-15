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

    					<PageHeader>庫内作業一覧</PageHeader>

    					<CommonSearchConditionsFrom doSearch={(conditions)=>this.doSearch(conditions)}>
    						<CommonInputText
    							controlLabel="担当者"
    							name="internal_work.staff_name"
    							type="text"
    							placeholder="担当者名"
    						/>

    						<CommonDatePicker
    							controlLabel="作業日"  
    							name="internal_work.working_date"
    							placeholder="作業日"
    						/>

    						<CommonInputText
    							controlLabel="承認ステータス"
    							name="internal_work.approval_status"
    							type="text"
    							placeholder="承認ステータス"
    						/>
							
    						<CommonInputText
    							controlLabel="管理基本料"
    							name="internal_work.mgmt_basic_fee"
    							type="text"
    							placeholder="管理基本料"
    						/>

    						<CommonInputText
    							controlLabel="保管費"
    							name="internal_work.custody_fee"
    							type="text"
    							placeholder="保管費"
    						/>

    						<CommonInputText
    							controlLabel="追加１パレット"
    							name="internal_work.additional1_palette"
    							type="text"
    							placeholder="追加１パレット"
    						/>
							
    						<CommonInputText
    							controlLabel="追加２スチール棚"
    							name="internal_work.additional2_steel_shelf"
    							type="text"
    							placeholder="追加２スチール棚"
    						/>

    						<CommonInputText
    							controlLabel="削除パレット"
    							name="internal_work.deletion_palette"
    							type="text"
    							placeholder="削除パレット"
    						/>

    						<CommonInputText
    							controlLabel="入荷"
    							name="internal_work.received"
    							type="text"
    							placeholder="入荷"
    						/>

    						<CommonInputText
    							controlLabel="入荷(通常)"
    							name="internal_work.received_normal"
    							type="text"
    							placeholder="入荷(通常)"							
    						/>

    						<CommonInputText
    							controlLabel="返品処理"
    							name="internal_work.returns"
    							type="text"
    							placeholder="返品処理"
    						/>

    						<CommonInputText
    							controlLabel="入荷その他"
    							name="internal_work.received_others"
    							type="text"
    							placeholder="入荷その他"
    						/>

    						<CommonInputText
    							controlLabel="発送(通常)"
    							name="internal_work.packing_normal"
    							type="text"
    							placeholder="発送(通常)"
    						/>

    						<CommonInputText
    							controlLabel="発送(その他)"
    							name="internal_work.packing_others"
    							type="text"
    							placeholder="発送(その他)"
    						/>

    						<CommonInputText
    							controlLabel="梱包数"
    							name="internal_work.packing"
    							type="text"
    							placeholder="梱包数"
    						/>
							
    						<CommonInputText
    							controlLabel="ヤマト運輸６０サイズ迄"
    							name="internal_work.yamato60size"
    							type="text"
    							placeholder="ヤマト運輸６０サイズ迄"
    						/>

    						<CommonInputText
    							controlLabel="西濃運輸"
    							name="internal_work.seino"
    							type="text"
    							placeholder="西濃運輸"
    						/>

    						<CommonInputText
    							controlLabel="着払い発送"
    							name="internal_work.cash_on_arrival"
    							type="text"
    							placeholder="着払い発送"
    						/>

    						<CommonInputText
    							controlLabel="作業・その他"
    							name="internal_work.work_others"
    							type="text"
    							placeholder="作業・その他"
    						/>

    						<CommonInputText
    							controlLabel="ダンボール(160)"
    							name="internal_work.cardboard160"
    							type="text"
    							placeholder="ダンボール(160)"
    						/>

    						<CommonInputText
    							controlLabel="ダンボール(140)"
    							name="internal_work.cardboard140"
    							type="text"
    							placeholder="ダンボール(140)"
    						/>

    						<CommonInputText
    							controlLabel="ダンボール(120)"
    							name="internal_work.cardboard120"
    							type="text"
    							placeholder="ダンボール(120)"
    						/>

    						<CommonInputText
    							controlLabel="ダンボール(100)"
    							name="internal_work.cardboard100"
    							type="text"
    							placeholder="ダンボール(100)"
    						/>

    						<CommonInputText
    							controlLabel="ダンボール(80)"
    							name="internal_work.cardboard80"
    							type="text"
    							placeholder="ダンボール(80)"
    						/>

    						<CommonInputText
    							controlLabel="ダンボール(60)"
    							name="internal_work.cardboard60"
    							type="text"
    							placeholder="ダンボール(60)"
    						/>

    						<CommonInputText
    							controlLabel="巻段ボール"
    							name="internal_work.corrugated_cardboard"
    							type="text"
    							placeholder="巻段ボール"
    						/>
							
    						<CommonInputText
    							controlLabel="緩衝材"
    							name="internal_work.buffer_material"
    							type="text"
    							placeholder="緩衝材"
    						/>

    						<CommonInputText
    							controlLabel="エアプチ"
    							name="internal_work.bubble_wrap"
    							type="text"
    							placeholder="エアプチ"
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
    							field: 'internal_work.staff_name',title: '担当者', width: '100px'
    						}, {
    							field: 'internal_work.working_date', title: '作業日', width: '200px'
    						}, {
    							field: 'internal_work.approval_status', title: '承認ステータス', width: '200px'
    						}, {
    							field: 'internal_work.mgmt_basic_fee', title: '管理基本料', width: '200px'
    						}, {
    							field: 'internal_work.custody_fee', title: '保管費', width: '150px'
    						}, {
    							field: 'internal_work.additional1_palette', title: '追加１パレット', width: '200px'
    						}, {
    							field: 'internal_work.additional2_steel_shelf', title: '追加２スチール棚', width: '200px'
    						}, {
    							field: 'internal_work.deletion_palette', title: '削除パレット', width: '150px'
    						}, {
    							field: 'internal_work.received', title: '入荷', width: '200px'
    						}, {
    							field: 'internal_work.received_normal', title: '入荷（通常）', width: '200px'
    						}, {
    							field: 'internal_work.returns', title: '返品処理', width: '200px'
    						}, {
    							field: 'internal_work.received_others', title: '入荷（その他）', width: '200px'
    						}, {
    							field: 'internal_work.packing_normal', title: '発送（通常）', width: '200px'
    						}, {
    							field: 'internal_work.packing_others', title: '発送（その他）', width: '200px'
    						}, {
    							field: 'internal_work.packing', title: '梱包数', width: '200px'	
    						}, {
    							field: 'internal_work.yamato60size', title: 'ヤマト運輸６０サイズ迄', width: '200px'
    						}, {
    							field: 'internal_work.seino', title: '西濃運輸', width: '200px'
    						}, {
    							field: 'internal_work.cash_on_arrival', title: '着払い発送', width: '200px'
    						}, {
    							field: 'internal_work.work_others', title: '作業・その他', width: '200px'
    						}, {
    							field: 'internal_work.cardboard160', title: '段ボール（１６０）', width: '200px'
    						}, {
    							field: 'internal_work.cardboard140', title: '段ボール（１４０）', width: '200px'
    						}, {
    							field: 'internal_work.cardboard120', title: '段ボール（１２０）', width: '200px'
    						}, {
    							field: 'internal_work.cardboard100', title: '段ボール（１００）', width: '200px'
    						}, {
    							field: 'internal_work.cardboard80', title: '段ボール（８０）', width: '200px'
    						}, {
    							field: 'internal_work.cardboard60', title: '段ボール（６０）', width: '200px'
    						}, {
    							field: 'internal_work.corrugated_cardboard', title: '巻段ボール', width: '200px'
    						}, {
    							field: 'internal_work.buffer_material', title: '緩衝材', width: '200px'
    						}, {
    							field: 'internal_work.bubble_wrap', title: 'エアプチ', width: '200px'
    						}, {
    							field: 'internal_work.remarks1', title: '備考１', width: '200px'
    						}, {
    							field: 'internal_work.remarks2', title: '備考２', width: '200px'
    						}]}
    					/>
    				</Col>
    			</Row>
    		</Grid>
    	)
    }
}