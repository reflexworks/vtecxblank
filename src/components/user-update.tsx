
import axios, { AxiosResponse, AxiosError } from 'axios'
import * as React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Navbar,
	Nav,
	Glyphicon,
} from 'react-bootstrap'

import UserForm from './user-form'
import {
	CommonIndicator,
	CommonNetworkMessage,
	CommonGeneralBtn,
	CommonDeleteBtn,
	CommonBackBtn
} from './common'

interface UserUpdateProps {
	history: any
}

interface UserUpdateState {
	isDisabled: boolean
	isError: any
}
export default class UserUpdate extends React.Component<UserUpdateProps, UserUpdateState> {

	private entry: VtecxApp.Entry
	private backUrl: string
	private entrykey: string
	constructor(props: UserUpdateProps) {
		super(props)
		this.state = {
			isDisabled: false,
			isError: {}
		}

		// 戻る先のURL
		this.backUrl = '#/UserList'

		// 初期値の設定
		this.entry = {
			userinfo: {},
			favorite: {},
			hobby: [],
		}
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {
		this.setState({ isDisabled: true })

		this.entrykey = location.hash.substring(location.hash.indexOf('?') + 1)

		axios({
			url: '/d' + this.entrykey + '?e',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response: AxiosResponse) => {

			this.setState({ isDisabled: false })

			if (response.status === 204) {
				this.setState({ isError: response })
			} else {
				this.entry = response.data.feed.entry[0]
				this.forceUpdate()
			}

		}).catch((error: AxiosError) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	Update() {
		if (confirm('この情報を更新します。よろしいですか？')) {
			if (this.entry.userinfo) {
				const req: VtecxApp.Request = { feed: { entry: [] } }
				const user_info_entry: VtecxApp.Entry = {
					userinfo: this.entry.userinfo,
					favorite: this.entry.favorite,
					hobby: this.entry.hobby,

					link: [{
						___href: '/user_info/' + this.entry.userinfo.id,
						___rel: 'self'
					}]
				}
				req.feed.entry.push(user_info_entry)

				axios({
					url: '/d/',
					method: 'put',
					data: req,
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					},
				}).then(() => {
					alert('更新が完了しました。')
				}).catch((error: AxiosError) => {
					this.setState({ isError: error })
				})
			}
		}
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>

						{/* 通信中インジケータ */}
						<CommonIndicator visible={this.state.isDisabled} />

						{/* 通信メッセージ */}
						<CommonNetworkMessage isError={this.state.isError} />

						<PageHeader>ユーザ情報の更新</PageHeader>

					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonBackBtn NavItem href={this.backUrl} />
									<CommonGeneralBtn NavItem navStyle="create" onClick={() => this.Update()} label={<span><Glyphicon glyph="ok" />更新</span>} />
									<CommonDeleteBtn NavItem entry={this.entry} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<UserForm name="mainForm" entry={this.entry} registration={false} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonBackBtn NavItem href={this.backUrl} />
									<CommonGeneralBtn NavItem navStyle="create" onClick={() => this.Update()} label={<span><Glyphicon glyph="ok" />更新</span>} />
									<CommonDeleteBtn NavItem entry={this.entry} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}
