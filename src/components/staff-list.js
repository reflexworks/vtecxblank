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
	CommonSelectBox,
	CommonSearchConditionsFrom,
	CommonPagination,
	CommonGetList
} from './common'

type State = {
	feed: any,
	url: string
}

export default class StaffList extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/staff?f&l=' + this.maxDisplayRows
		this.state = {
			feed: { entry: [] },
			isDisabled: false,
			isError: {},
			urlToPagenation: '',
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
	onSelect(data) {
		// 入力画面に遷移
		const id = data.staff.uid
		this.props.history.push('/StaffUpdate?' + id)
	}
	
	/**
	 * リスト上で削除処理
	 * @param {*} data 
	 */
	onDelete(data) {

		if (confirm('担当者名:' + data.staff.staff_name + '\n' +
					'この情報を削除します。よろしいですか？')) {
			const id = data.link[0].___href.slice(7)
		
			axios({
				url: '/d/staff/' + id,
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
						
						<PageHeader>担当者一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions) => this.doGetFeed(conditions)}>
							<CommonInputText
								controlLabel="担当者名"
								name="staff.staff_name"
								type="text"
								placeholder="担当者名"
							/>
							<CommonSelectBox
								controlLabel="ロール"
								size="sm"
								name="staff.role"
								options={[{
									label: '管理者',
									value: '1'
								}, {
									label: '上長',
									value: '2'
								}, {
									label: '作業員',
									value: '3',
								}, {
									label: '営業',
									value: '4'
								}, {
									label: '経理',
									value: '5'
								}]}
							/>
							<CommonInputText
								controlLabel="メールアドレス"
								name="staff.staff_email"
								type="text"
								placeholder="logioffice@gmail.com"
							/>
							<CommonInputText
								controlLabel="上長メールアドレス"
								name="staff.superior_email"
								type="text"
								placeholder="logioffice@gmail.com"
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
								field: 'staff.staff_name',title: '担当者名', width: '100px'
							}, {
								field: 'staff.role', title: 'ロール', width: '70px', convert: { 1:'管理者', 2:'上長', 3:'作業員', 4:'営業', 5:'経理'}
							}, {
								field: 'staff.staff_email', title: 'メールアドレス', width: '200px'
							}, {
								field: 'staff.superior_email', title: '上長メールアドレス', width: '200px'
							}]}
						/>

					</Col>  
				</Row>  
		 </Grid>
		)
	}
}