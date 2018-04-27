/* @flow */
import React from 'react'
import axios from 'axios'
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
} from 'demo3.types'

import jsSHA from 'jssha'

import StaffForm from './staff-form'
import {
	CommonClearBtn,
	CommonGeneralBtn,
	CommonIndicator,
	CommonNetworkMessage
} from './common'

export default class StaffRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		// 登録先のURL
		this.url = '/d/staff'

		// 初期値の設定
		this.entry = {
			staff: {},
		}

	}
 
	doPost() {

		const staff_entry = JSON.parse(JSON.stringify(this.entry))
		const staff_data = staff_entry.staff
		let isPost = true
		let errorTitle = []
		if (!staff_data.staff_name || staff_data.staff_name === '') {
			isPost = false
			errorTitle.push('　　・担当者名')
		}
		if (!staff_data.role || staff_data.role === '') {
			isPost = false
			errorTitle.push('　　・ロール')
		}
		if (!staff_data.staff_email || staff_data.staff_email === '') {
			isPost = false
			errorTitle.push('　　・メールアドレス')
		}
		if (!staff_data.password || staff_data.password === '') {
			isPost = false
			errorTitle.push('　　・パスワード')
		}
		if (!isPost) {
			alert('以下の項目が入力されていません。\n\n' + errorTitle.join('\n'))
			return false
		}

		const shaObj = new jsSHA('SHA-256', 'TEXT')
		shaObj.update(staff_data.password)
		const hashpass = shaObj.getHash('B64')
		staff_entry.staff.password = hashpass

		staff_entry.link = [{
			___href: '/staff/' + staff_data.staff_email,
			___rel: 'self'
		}]
		const postStaff = (_uid) => {

			staff_entry.staff.uid = _uid

			const req = {
				feed: {
					entry: [staff_entry]
				}
			}
			if (staff_entry.staff.role === '1'
				|| staff_entry.staff.role === '4'
				|| staff_entry.staff.role === '5') {
				req.feed.entry.push({
					id: '/_group/$useradmin/' + _uid,
					link: [{
						___href: '/_group/$useradmin/' + _uid,
						___rel: 'self'
					},{
						___href: '/'+ _uid +'/group/$useradmin',
						___rel: 'alternate'
					}]
				})
			}
			axios({
				url: '/d/',
				method: 'post',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data : req
			}).then(() => {
				alert('登録が完了しました。')
				this.setState({ isDisabled: false })
				location.href = '#/StaffList'
			}).catch((error) => {
				this.setState({ isDisabled: false })
				if (error.response) {
					alert('担当者のマスターデータ登録に失敗しました。\n\n'+JSON.stringify(error.response))						
				} else {
					alert('担当者のマスターデータ登録に失敗しました。\n\n'+JSON.stringify(error))						
				}
			})
		}
		const postAdduserByAdmin = () => {
			const adduserByAdminData = {
				feed: {
					entry: [{
						contributor: [{
							uri: 'urn:vte.cx:auth:' + staff_entry.staff.staff_email + ',' + staff_entry.staff.password,
							name: 'nickname'
						}]
					}]
				}
			}
			axios({
				url: '/d/?_adduserByAdmin',
				method: 'post',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data : adduserByAdminData
			}).then((result) => {

				const uid = result.data.feed.title
				postStaff(uid)

			}).catch((_error) => {
				const error = JSON.parse(JSON.stringify(_error))
				if (error.response) {
					// 既に登録してあるユーザの場合
					// システム管理者(プロジェクト管理者)のみ再登録を実施できる
					if (error.response.status === 409) {
						axios({
							url: '/d/?_userstatus=' + staff_entry.staff.staff_email,
							method: 'get',
							headers: {
								'X-Requested-With': 'XMLHttpRequest'
							}
						}).then((_userstatus) => {
							const href = _userstatus.data.feed.entry[0].link[0].___href
							const uid = href.match(/\d+/)
							postStaff(uid[0])
						})
					} else {
						this.setState({ isDisabled: false })
						alert('担当者の本登録に失敗しました。\n\n' + JSON.stringify(error.response))						
					}
				} else {
					this.setState({ isDisabled: false })
					alert('担当者の本登録に失敗しました。\n\n' + JSON.stringify(error))
				}
			})
		}

		this.setState({ isDisabled: true })

		// 担当者存在チェック
		axios({
			url: '/d/staff?f&staff.staff_email=' + staff_entry.staff.staff_email,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			if (response.status === 204) {
				if (confirm(staff_entry.staff.staff_name + 'を新規登録します。よろしいでしょうか？')) {
					postAdduserByAdmin()
				} else {
					this.setState({ isDisabled: false })
				}
			} else {
				this.setState({ isDisabled: false })
				alert('すでに同じ担当者が存在します。')
			}
		}).catch((error) => {
			this.setState({ isDisabled: false })
			if (error.response) {
				alert('担当者存在チェックに失敗しました。\n\n'+JSON.stringify(error.response))						
			} else {
				alert('担当者存在チェックに失敗しました。\n\n'+JSON.stringify(error))						
			}
		})

	}

	/**
	 * 登録完了後の処理
	 */
	callbackRegistrationButton() {
		alert('登録が完了しました。')
		location.href = '#/StaffList'
	}

	clear() {
		this.entry.staff.staff_name = ''
		this.entry.staff.role = ''
		this.entry.staff.superior_email = ''
		this.entry.staff.staff_email = ''
		this.entry.staff.uid = ''
		this.entry.staff.password = ''
		this.entry.staff.superior_name = ''
		this.forceUpdate()
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

						<PageHeader>担当者情報の登録</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonGeneralBtn NavItem navStyle="create" onClick={()=>this.doPost()} label={<span><Glyphicon glyph="plus" /> 新規登録</span>} />
									<CommonClearBtn NavItem callback={()=>this.clear()}/>
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
									<CommonGeneralBtn NavItem navStyle="create" onClick={()=>this.doPost()} label={<span><Glyphicon glyph="plus" /> 新規登録</span>} />
									<CommonClearBtn NavItem callback={()=>this.clear()}/>
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}
