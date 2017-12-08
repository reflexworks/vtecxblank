/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Navbar,
	Nav
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import InquiryForm from './inquiry-form'
import {
	CommonIndicator,
	CommonNetworkMessage,
	CommonUpdateBtn,
	CommonDeleteBtn,
	CommonBackBtn
} from './common'

import moment from 'moment'
export default class InquiryUpdate extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			isDisabled: false,
			isError: {}
		}

		// URL設定
		this.url = '/d/inquiry'

		// 戻る先のURL
		this.backUrl = '#/InquiryList'

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
			url: this.url + '/' + this.entrykey+'?e',
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
				this.entry.published = this.entry.published ? moment(this.entry.published).format('YYYY/MM/DD HH:mm ') : ''
				this.entry.updated = this.entry.updated ? moment(this.entry.updated).format('YYYY/MM/DD HH:mm ') : ''
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
	}

	/**
	 * 削除完了後の処理
	 */
	callbackDeleteButton() {
		alert('削除が完了しました。')
		location.href = this.backUrl
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
							問い合わせ情報の更新
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
									<CommonDeleteBtn NavItem entry={this.entry} callback={this.callbackDeleteButton.bind(this)} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<InquiryForm name="mainForm" entry={this.entry} />
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Navbar collapseOnSelect>
							<Navbar.Collapse>
								<Nav>
									<CommonBackBtn NavItem href={this.backUrl} />
									<CommonUpdateBtn NavItem url={this.url} callback={this.callbackButton} entry={this.entry} />
									<CommonDeleteBtn NavItem entry={this.entry} callback={this.callbackDeleteButton.bind(this)} />
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		)
	}
}
