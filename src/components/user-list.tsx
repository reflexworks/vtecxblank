
import axios, { AxiosError } from 'axios'
import * as React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
} from 'react-bootstrap'

import {
	CommonIndicator,
	CommonNetworkMessage,
	CommonTable,
	CommonInputText,
	CommonSearchConditionsFrom,
	CommonPagination,
	CommonGetList,
	CommonBeforConditions,
} from './common'

interface UserListProps {
	history: any
	error: any
}

interface UserListState {
	feed: any
	isDisabled: boolean
	isError: any
	urlToPagenation: string
	activePage: number
	isCompleted: any
}
export default class UserList extends React.Component<UserListProps, UserListState> {


	private maxDisplayRows: number
	private url: string
	private conditionsKey: string
	constructor(props: UserListProps) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/user_info?f&l=' + this.maxDisplayRows
		this.state = {
			feed: { entry: [] },
			isDisabled: false,
			isError: '',
			urlToPagenation: '', // ページネーション用に渡すURL
			activePage: 1,
			isCompleted: ''
		}
		this.conditionsKey = 'UserList'
	}

	/**
     * 一覧取得実行
     * @param {*} activePage
	 * @param {*} url 
	 */
	getFeed(activePage: number, url: string) {

		this.setState({
			isDisabled: true,
			isError: null,
			activePage: activePage
		})

		CommonGetList(url, activePage, this.conditionsKey).then((_state: any) => {
			this.setState(_state)
		})

	}

	/**
	 * 一覧取得設定
	 * @param {*} conditions 
	 */
	doGetFeed(_conditions: string, _activePage: number) {

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

	onEdit(_data: any) {
		// 入力画面に遷移
		const user_code = _data.link[0].___href
		this.props.history.push('/UserUpdate?' + user_code)
	}

	/**
	 * リスト上で削除処理
	 * @param {*} data 
	 */
	onDelete(_data: any) {
		if (confirm(_data.link[0].___href + '\n' + 'この情報を削除します。よろしいですか？')) {
			axios({
				url: '/d' + _data.link[0].___href,
				method: 'delete',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {
				this.setState({ isDisabled: false, isCompleted: 'delete', isError: false })
				this.getFeed(1, this.state.urlToPagenation)
			}).catch((error: AxiosError) => {
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
				<CommonNetworkMessage isError={this.state.isError} />

				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>

						<PageHeader>ユーザ一覧</PageHeader>

						<CommonSearchConditionsFrom doSearch={(conditions: string) => this.doGetFeed(conditions, 1)}>
							<CommonInputText
								controlLabel="ユーザ名"
								name="userinfo.name"
								size=''
								type="text"
								placeholder="ユーザ名"
							/>
						</CommonSearchConditionsFrom>

					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>

						<CommonPagination
							url={this.state.urlToPagenation}
							activePage={this.state.activePage}
							onChange={(activePage: number, url: string) => this.getFeed(activePage, url)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>
						<CommonTable
							name="entry"
							data={this.state.feed.entry}
							size=''
							controlLabel=''
							edit={(data: any) => this.onEdit(data)}
							remove={(data: any) => this.onDelete(data)}
							header={[{
								field: 'userinfo.id', title: 'ID', width: '100px',
							}, {
								field: 'userinfo.name', title: 'ユーザ名', width: '200px'
							}]}
						/>

					</Col>
				</Row>
			</Grid>
		)
	}
}

{/*
	"feed" :{
		"entry" :[{
			"userinfo":
				{ "id": "abc", "email": "b", "name": "a" },
			"favorite": { "food": "c", "music": "d" },
			"hobby": [], "author": [{ "uri": "urn:vte.cx:created:541" }],
			"id": "/user_info/5664902681198592,1",
			"link": [{ "___href": "/user_info/5664902681198592", "___rel": "self" }],
			"published": "2018-10-02T13:21:53.759+09:00",
			"updated": "2018-10-02T13:21:53.759+09:00"
		}, {
				"userinfo":
					{ "id": "a", "email": "c", "name": "b" },
				"favorite": { "food": "d", "music": "e" },
				[], "author": [{ "uri": "urn:vte.cx:created:541" }],
				"id": "/user_info/5705241014042624,1",
				"link": [{ "___href": "/user_info/5705241014042624", "___rel": "self" }],
				"published": "2018-10-02T13:05:33.415+09:00",
				"updated": "2018-10-02T13:05:33.415+09:00"
			}]
	}
*/}