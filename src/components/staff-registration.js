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
	CommonGeneralBtn
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
		const staff_data = this.entry.staff
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
			alert('以下の項目が入力されていません。または不正な値です。\n\n' + errorTitle.join('\n'))
			return false
		}

		const shaObj = new jsSHA('SHA-256', 'TEXT')
		shaObj.update(staff_data.password)
		const hashpass = shaObj.getHash('B64')
		this.entry.staff.password = hashpass

		this.entry.link = [{
			___href: '/staff/' + staff_data.staff_email,
			___rel: 'self'
		}]
		const postStaff = (_uid) => {
			this.entry.staff.uid = _uid
			axios({
				url: '/d/',
				method: 'post',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data : {feed:{entry:[this.entry]}}
			}).then(() => {
				alert('登録が完了しました。')
				location.href = '#/StaffList'
			}).catch((error) => {
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
							uri: 'urn:vte.cx:auth:' + this.entry.staff.staff_email + ',' + this.entry.staff.password,
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

			}).catch((error) => {
				if (error.response) {
					if (error.response.data.feed.title.indexOf('User is already registered. UID') >= 0) {
						const uid = error.response.data.feed.title.match(/\d+/)
						postStaff(uid[0])		
					} else {
						alert('担当者の本登録に失敗しました。\n\n'+JSON.stringify(error.response))						
					}
				} else {
					alert('担当者の本登録に失敗しました。\n\n' + JSON.stringify(error))
				}
			})
		}

		// 担当者存在チェック
		axios({
			url: '/d/staff?f&staff.staff_email=' + this.entry.staff.staff_email,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			if (response.status === 204) {
				postAdduserByAdmin()
			} else {
				alert('すでに同じ担当者が存在します。')
			}
		}).catch((error) => {
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

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>担当者情報の登録</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonGeneralBtn NavItem navStyle="create" onClick={()=>this.doPost()} label={<span><Glyphicon glyph="plus" /> 新規登録</span>} />
									<CommonClearBtn NavItem />
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
									<CommonClearBtn NavItem />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}
