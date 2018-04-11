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
	CommonMonthlySelect,
	CommonGetList,
	CommonLoginUser
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
		//		this.url = '/d/quotation?f&l=' + this.maxDisplayRows
		this.url = '/s/get-quotation?l=' + this.maxDisplayRows
		this.state = {
			feed: { entry: [] },
			isDisabled: false,
			isError: {},
			urlToPagenation: '' // ページネーション用に渡すURL
		}
		this.activePage = 1
		const role = CommonLoginUser().get().role
		this.isInvoice = role === '2' || role === '4' ? false : true
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

		const _delete = () => {
			if (confirm('見積書No:' + data.quotation.quotation_code + '-' + data.quotation.quotation_code_sub + '\n' +
						'この情報を削除します。よろしいですか？')) {		
				axios({
					url: '/d' + data.link[0].___href,
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
		if (data.quotation.status === '1') {
			alert('発行済なため削除できません。')
		} else {
			_delete()
		}
	}

	/**
	 * 描画後の処理
	 */
	componentDidMount() {
		this.doGetFeed()
	}

	render() {

		let header = []

		if (this.isInvoice) {
			header.push({
				field: 'btn1', title:'請求書', width: '30px',
				label: <Glyphicon glyph="open-file" />,
				onClick: (_data) => this.moveInvoiceRegistration(_data)
			})
		}
		header.push({
			field: 'quotation.quotation_code',title: '見積書No', width: '70px'
		})
		header.push({
			field: 'quotation.quotation_code_sub',title: '枝番', width: '50px'
		})
		header.push({
			field: 'quotation.quotation_date',title: '見積年月', width: '70px'
		})
		header.push({
			field: 'billto.billto_name', title: '請求先名', width: '500px'
		})
		header.push({
			field: 'quotation.status', title: '発行ステータス', width: '80px', convert: {0: '未発行', 1: '発行済'}
		})
		header.push({
			field: 'creator', title: '作成者', width: '150px', convert: {0: '未発行', 1: '発行済'}
		})
		return (
			<Grid>

				{/* 通信中インジケータ */}
				<CommonIndicator visible={this.state.isDisabled} />

				{/* 通信メッセージ */}
				<CommonNetworkMessage isError={this.state.isError}/>

				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						<PageHeader>見積書一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions)=>this.doGetFeed(conditions)}>
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
									label: '発行済',
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
							onChange={(activePage, url)=>this.getFeed(activePage, url)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>

						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							edit={(data) => this.onSelect(data)}
							remove={(data) => this.onDelete(data)}
							header={header}
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
