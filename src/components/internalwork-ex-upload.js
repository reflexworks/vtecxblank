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
	CommonFilterBox,
} from './common'

type InputEvent = {
	target: any,
	preventDefault: Function  
} 

export default class InternalWorkExUpload extends React.Component {  
	constructor() {
		super()
		this.state = {}
		this.entry = {
			customer: {}
		}
		this.master = {
			customerList: []
		}
		this.customerList = []
		this.exList = []
	}
 
	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setCustomerMasterData()

	}

	setCustomerMasterData() {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/customer?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.customerList = response.data.feed.entry
				this.customerList = this.master.customerList.map((obj) => {
					return {
						label: obj.customer.customer_name,
						value: obj.customer.customer_code,
						data: obj
					}
				})

				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	handleSubmit(e: InputEvent) {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)

		// 画像は、/d/registration/{key} としてサーバに保存されます
		axios({
			url: '/s/getcsv',
			method: 'post',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data : formData

		}).then(() => {
			alert('success')
		}).catch((error) => {
			if (error.response) {
				alert('error='+JSON.stringify(error.response))
			} else {
				alert('error')
			}
		})

	}

	changed() {
		
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>請求CSVアップロード</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<Table>
							<thead>
								<tr>
									<th width="100px">発送サービス</th>
									<th width="70px">種類</th>
									<th width="200px">顧客選択</th>
									<th width="500px">ファイル選択</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td rowspan="4">ヤマト運輸</td>
									<td>発払い</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[0]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td>代引き</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[1]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td>DM便</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[2]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td>ネコポス</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[3]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td rowspan="2">佐川急便</td>
									<td>発払い</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[4]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td>代引き</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[5]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td>西濃運輸</td>
									<td>-</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[6]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td>EMS</td>
									<td>-</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[7]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td rowspan="2">日本郵政</td>
									<td>ゆうパケット</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[8]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td>ゆうメール</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[9]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
											<FormGroup>
												<FormControl type="file" name="csv" />
											</FormGroup>
										</Form>
									</td>
								</tr>
								<tr>
									<td>自社配送</td>
									<td>-</td>
									<td>
										<CommonFilterBox
											name="customer_code"
											value={this.exList[10]}
											options={this.customerList}
											onChange={(data) => this.changed(data)}
											table
										/>
									</td>
									<td>
										<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
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

