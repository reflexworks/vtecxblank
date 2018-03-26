/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Form,
	FormGroup,
	FormControl,
	Table
} from 'react-bootstrap'

import {
	CommonIndicator
} from './common'

type InputEvent = {
	target: any,
	preventDefault: Function  
} 

export default class BillingDataUpload extends React.Component {  
	constructor() {
		super()
		this.state = {
			isDisabled: false,
		}
	}
 
	handleSubmitYmt(e: InputEvent) {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		if (confirm('アップロードを実行します。よろしいですか？')) {
			this.setState({
				isDisabled: true
			})
			axios({
				url: '/s/put-billing-ymt',
				method: 'post',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data : formData

			}).then(() => {
				this.setState({
					isDisabled: false
				})
				alert('アップロードに成功しました')
			}).catch((error) => {
				this.setState({
					isDisabled: false
				})
				if (error.response) {
					if (error.response.data.feed.title.indexOf('undefined')>=0) {
						alert('CSVデータが正しくありません。:'+error.response.data.feed.title)
					} else {
						alert(error.response.data.feed.title)				
					}
				} else {
					alert('アップロードに失敗しました')
				}
			})
			
		}
	}

	handleSubmitEco(e: InputEvent) {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)

		if (confirm('アップロードを実行します。よろしいですか？')) {
			axios({
				url: '/s/put-billing-eco',
				method: 'post',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data: formData

			}).then(() => {
				alert('アップロードに成功しました')
			}).catch((error) => {
				if (error.response) {
					if (error.response.data.feed.title.indexOf('undefined') >= 0) {
						alert('CSVデータが正しくありません。:' + error.response.data.feed.title)
					} else {
						alert(error.response.data.feed.title)
					}
				} else {
					alert('アップロードに失敗しました')
				}
			})
		}
	}

	render() {
		return (
			<Grid>
				{/* 通信中インジケータ */}
				<CommonIndicator visible={this.state.isDisabled} />
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>請求データアップロード</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Table>
							<thead>
								<tr>
									<th width="100px">配送業者</th>
									<th width="500px">ファイル選択</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>エコ配JP</td>
									<td>
										<Form horizontal onChange={(e) => this.handleSubmitEco(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td rowspan="3">ヤマト運輸</td>
									<td>
										<Form horizontal onChange={(e) => this.handleSubmitYmt(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
							</tbody>
						</Table>
					</Col>
				</Row>
			</Grid>
		)
	}
}