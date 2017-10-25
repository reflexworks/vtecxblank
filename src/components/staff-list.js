/* @flow */
import axios from 'axios'
import React from 'react'
import VtecxPagination from './vtecx_pagination'
//import ConditionInputForm from './demo_conditioninput'
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
	CommonSearchConditionsFrom
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
		this.state = {
			feed: { entry: [] },
			isDisabled: false,
			isError: {}
		}
		this.url = '/d/staff?f&l=' + this.maxDisplayRows
		this.activePage = 1
	}
	/*
	search(condition: string) {
		
		this.setState({ url: '/d/staff?f&l=' + this.maxDisplayRows + condition })
		this.getFeed(this.activePage)
	}
*/   
	getFeed(activePage:number, conditions) {

		this.setState({ isDisabled: true })

		this.activePage = activePage

		axios({
			url: this.url + '&n=' + activePage + (conditions ? '&' + conditions : ''),
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( (response) => {

			this.setState({ isDisabled: false })

			if (response.status === 204) {
				this.setState({ isError: response })
			} else {
				// 「response.data.feed」に１ページ分のデータ(1~50件目)が格納されている
				// activePageが「2」だったら51件目から100件目が格納されている
				this.setState({ feed: response.data.feed, isError: {}})
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})    
	}
  
	componentDidMount() {
		// 一覧取得
		this.getFeed(1)
	}

	/*
	onSelect(index) {
		// 入力画面に遷移
		const staff_code = this.state.feed.entry[index].staff.staff_code
		this.props.history.push('/StaffUpdate?' + staff_code)
	}
	*/

	/**
	 * 検索実行
	 * @param {*} conditions 
	 */
	doSearch(conditions) {
		this.getFeed(1, conditions)
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

						<CommonSearchConditionsFrom doSearch={(conditions) => this.doSearch(conditions)}>
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
									value: '3'
								}]}
							/>
							<CommonInputText
								controlLabel="上長メールアドレス"
								name="staff.superior_email"
								type="text"
								placeholder="logioffice@gmail.com"
							/>
							<CommonInputText
								controlLabel="メールアドレス"
								name="staff.staff_email"
								type="text"
								placeholder="logioffice@gmail.com"
							/>
						</CommonSearchConditionsFrom>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						<VtecxPagination
							url={this.url}
							onChange={(activePage)=>this.getFeed(activePage)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>

						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							//edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
							header={[{
								field: 'staff.staff_name',title: '担当者名', width: '100px'
							}, {
								field: 'staff.role', title: 'ロール', width: '70px', convert: { 1:'管理者', 2:'上長', 3:'作業員'}
							}, {
								field: 'staff.superior_email', title: '上長メールアドレス', width: '200px'
							}, {
								field: 'staff.staff_email', title: 'メールアドレス', width: '150px'
							}]}
						/>

					</Col>  
				</Row>  
		 </Grid>
		)
	}
}