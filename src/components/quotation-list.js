/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Button,
	Glyphicon,
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
	CommonRadioBtn,
	CommonMonthlySelect
} from './common'

type State = {
	feed: any,
	url: string
}

export default class QuotationList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/quotation?f&l=' + this.maxDisplayRows
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
				this.setState({ feed:'',isDisabled: false, isError: response })
			} else {
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
	onSelect(_data) {
		// 入力画面に遷移
		this.props.history.push('/QuotationUpdate?' + _data.link[0].___href.replace('/quotation/', ''))
	}

	moveInvoiceRegistration(_data) {
		this.props.history.push('/InvoiceRegistration?'+ _data.link[0].___href.replace('/quotation/', ''))
		//location.href = '#/InvoiceRegistration'
	}
	/**
	 * リスト上で削除処理
	 * @param {*} data 
	 */
	onDelete(data) {

		if (confirm('見積書No:' + data.quotation.quotation_code + '\n' +
					'この情報を削除します。よろしいですか？')) {
			const id = data.link[0].___href.slice(11)
		
			axios({
				url: '/d/quotation/' + id,
				method: 'delete',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {
				this.setState({ isDisabled: false, isCompleted: 'delete', isError: false })
				this.getFeed(this.activePage)
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

						<PageHeader>見積書一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doSearch(conditions)}>
							<CommonInputText
								controlLabel="見積書No"
								name="quotation.quotation_code"
								type="text"
								placeholder="000000000"
							/>
							<CommonInputText
								controlLabel="枝番"
								name="quotation.quotation_code_sub"
								type="text"
								placeholder="01"
							/>
							<CommonMonthlySelect
								controlLabel="見積月"  
								name="quotation.quotation_date"
							/>
							<CommonInputText
								controlLabel="請求先名"
								name="billto.billto_name"
								type="text"
								placeholder="株式会社 ◯◯◯"
							/>
							<CommonRadioBtn
								controlLabel="発行ステータス"
								name="quotation.status"
								data={[{
									label: '全て',
									value: ''
								},{
									label: '未発行',
									value: '0'
								},{
									label: '発行済み',
									value: '1'
								}]}
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
							edit={(data) => this.onSelect(data)}
							remove={(data) => this.onDelete(data)}
							header={[{
								field: 'btn1', title:'請求書', width: '30px',
								label: <Glyphicon glyph="open-file" />,
								onClick: (_data) => this.moveInvoiceRegistration(_data)
							},{
								field: 'quotation.quotation_code',title: '見積書No', width: '250px'
							}, {
								field: 'quotation.quotation_code_sub',title: '枝番', width: '100px'
							}, {
								field: 'quotation.quotation_date',title: '見積年月', width: '100px'
							}, {
								field: 'billto.billto_name', title: '請求先名', width: '250px'
							}, {
								field: 'quotation.status', title: '発行ステータス', width: '200px', convert: {0: '未発行', 1: '発行済み'}
							}]}
						>
							<Button bsSize="sm" style={{float: 'left', width: '130px', 'margin': '0px 5px'}}>
								<Glyphicon glyph="download" />CSVダウンロード
							</Button>
						</CommonTable>
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
