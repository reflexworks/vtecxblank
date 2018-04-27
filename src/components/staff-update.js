/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Navbar,
	Nav,
	Glyphicon
} from 'react-bootstrap'
import type {
	Props
} from 'logioffice.types'

import StaffForm from './staff-form'
import {
	CommonIndicator,
	CommonNetworkMessage,
	CommonUpdateBtn,
	CommonGeneralBtn,
	CommonBackBtn
} from './common'

export default class StaffUpdate extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			isDisabled: false,
			isError: {}
		}
		this.superiorSelect = false

		// URL設定
		this.url = '/d/staff'

		// 戻る先のURL
		this.backUrl = '#/StaffList'

		// 初期値の設定
		this.entry = {}
	}
 
	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setState({ isDisabled: true })

		this.entrykey = location.hash.substring(location.hash.indexOf('?')+1)
		
		axios({
			url: '/d/staff?f&staff.uid=' + this.entrykey,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			this.setState({ isDisabled: false })

			if (response.status === 204) {
				this.setState({ isError: response })
			} else {
				this.entry = response.data.feed.entry[0]
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   

	}

	/**
	 * 更新完了後の処理
	 */
	callbackButton() {
		location.reload()
	}

	/**
	 * 削除完了後の処理
	 */
	callbackDeleteButton() {

		const doDeleteStaff = () => {
			// /d/staff配下を削除
			const id = this.entry.link[0].___href.slice(7)
			axios({
				url: '/d/staff/' + id,
				method: 'delete',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {

				alert('削除が完了しました。')

				this.setState({ isDisabled: false })
				this.props.history.push('/StaffList')

			}).catch((error) => {
				if (this.props.error) {
					this.setState({ isDisabled: false, isError: error })
					this.props.error(error)
				} else {
					this.setState({ isDisabled: false, isError: error })
				}
			})
		}

		if (confirm('この担当者を削除します。よろしいでしょうか？')) {
	
			this.setState({ isDisabled: true })
	
			// アカウント自体を削除
			axios({
				url: '/d?_deleteuser=' + this.entry.staff.staff_email,
				method: 'delete',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {

				doDeleteStaff()

			}).catch((error) => {
				if (this.props.error) {
					this.setState({ isDisabled: false })
					this.props.error(error)
				} else {
					if (error && error.response && error.response.data && error.response.data.feed.title.indexOf('The user does not exist.') !== -1) {
						doDeleteStaff()
					} else {
						this.setState({ isDisabled: false, isError: error })
					}
				}
			})
		}

	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >

						{/* 通信中インジケータ */}
						<CommonIndicator visible={this.state.isDisabled} />

						{/* 通信メッセージ */}
						<CommonNetworkMessage isError={this.state.isError}/>

						<PageHeader>
							担当者情報の更新
						</PageHeader>

					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonBackBtn NavItem href={this.backUrl} />
									<CommonUpdateBtn NavItem url={this.url} callback={this.callbackButton} entry={this.entry} />
									<CommonGeneralBtn NavItem label={<span><Glyphicon glyph="trash" /> 削除</span>} navStyle="delete" onClick={() => this.callbackDeleteButton()} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<StaffForm name="mainForm" entry={this.entry} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonBackBtn NavItem href={this.backUrl} />
									<CommonUpdateBtn NavItem url={this.url} callback={this.callbackButton} entry={this.entry} />
									<CommonGeneralBtn NavItem label={<span><Glyphicon glyph="trash" /> 削除</span>} navStyle="delete" onClick={() => this.callbackDeleteButton()} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}