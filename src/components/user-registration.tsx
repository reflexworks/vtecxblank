
import * as React from 'react'
import axios, { AxiosError } from 'axios'
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
	CommonGeneralBtn,
	CommonClearBtn,
	CommonNetworkMessage
} from './common'

interface UserRegistrationProps {
	history: any
}
interface UserRegistrationState {
	isError: any
}

export default class UserRegistration extends React.Component<UserRegistrationProps, UserRegistrationState> {

	private entry: VtecxApp.Entry
	constructor(props: UserRegistrationProps) {
		super(props)
		this.state = {
			isError: '',
		}

		// 初期値の設定
		this.entry = {
			userinfo: {},
			favorite: {},
			hobby: [],
		}
	}

	clear() {
		if (this.entry.userinfo) {
			this.entry.userinfo.id = ''
			this.entry.userinfo.email = ''
			this.entry.userinfo.name = ''
		}

		if (this.entry.favorite) {
			this.entry.favorite.food = ''
			this.entry.favorite.music = ''
		}

		if (this.entry.hobby) {
			this.entry.hobby = []
		}

		this.forceUpdate()
	}

	Registration() {
		if (confirm('この情報を登録します。よろしいですか？')) {
			if (this.entry.userinfo) {
				const req: VtecxApp.Request = { feed: { entry: [] } }
				let user_info_entry: VtecxApp.Entry = {
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
					method: 'post',
					data: req,
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					},
				}).then(() => {
					alert('登録が完了しました。')
					location.href = '#/UserList'
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

						{/* 通信メッセージ */}
						<CommonNetworkMessage isError={this.state.isError} />

						<PageHeader>ユーザ情報の登録</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonGeneralBtn NavItem navStyle="create" onClick={() => this.Registration()} label={<span><Glyphicon glyph="plus" />新規登録</span>} />
									<CommonClearBtn NavItem callback={() => this.clear()} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<UserForm name="mainForm" entry={this.entry} registration={true} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonGeneralBtn NavItem navStyle="create" onClick={() => this.Registration()} label={<span><Glyphicon glyph="plus" />新規登録</span>} />
									<CommonClearBtn NavItem callback={() => this.clear()} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}