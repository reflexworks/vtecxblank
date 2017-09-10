/* @flow */
import '../styles/application.sass'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import {
	Form,
	Col,
	FormGroup,
	Button,
	ControlLabel,
	FormControl
} from 'react-bootstrap'
import type {
	InputEvent,
	Props
} from 'demo.types'


type State = {
	rows: Array<number>,
	isCompleted: boolean,
	isError: boolean,
	errmsg: string,
	isForbidden: boolean,
}

class Signup2 extends React.Component {
	state: State

	constructor(props:Props) {
		super(props)
		this.state = { isConfirmed: false,isForbidden:false,isError:false,isRegisterd:false }
		this.entry = { 'account' : {'lastname' :'','firstname' :'','tel' :'','postcode' :'','prefecture_code' :'','address1' :'','address2' :''}}
	}

	componentWillMount() {
		axios({
			url: '/d/?_whoami',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}

		}).then((response) => {
			this.entry.account.email = response.data.feed.entry[0].title
			const id = response.data.feed.entry[0].id.substring(1, response.data.feed.entry[0].id.indexOf(','))

			this.entry.link = []
			const link = { ___href: '/' + id + '/group/userinfo', ___rel: 'self' }
			this.entry.link.push(link)

			axios({
				url: '/d/' + id + '/group/userinfo?e',
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {
				if (response.data.feed.entry && response.data.feed.entry.length > 0) {
					this.entry = response.data.feed.entry[0]
					this.setState({isRegisterd:true})
				} else {
					this.setState({isRegisterd:false})					
				}
			})

		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			} else if (error.response.status === 403) {
				alert('実行権限がありません。ログインからやり直してください。')
				location.href = 'login.html'
			} else {
				this.setState({isError: true,errmsg:error.response.data.feed.title})
			}
		})

	}


	handleSubmit(e: InputEvent) {
		e.preventDefault()
		let reqdata = {'feed': {'entry': []}}
		reqdata.feed.entry.push(this.entry)

		axios({
			url: '/d',
			method: 'put',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data : reqdata

		}).then(() => {
			axios({
				url: '/s/getrxid',
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {
				location.href = 'index.html'
			})
		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			} else if (error.response.status === 403) {
				alert('実行権限がありません。ログインからやり直してください。')
				location.href = 'login.html'
			} else {
				this.setState({isError: true,errmsg:error.response.data.feed.title})
			}
		})

	}

	handleConfirm(e:InputEvent){
		e.preventDefault()		
		this.setState({ isConfirmed: true })
	}

	handleChange(event:InputEvent) {
		this.entry.account[event.target.name] = event.target.value
		this.forceUpdate()
	}

	render() {
		return (
			<div className="col-md-6 col-md-offset-3 col-sm-12">
				<h2 className="login_form__title">基本情報{this.state.isRegisterd ? '更新' : '登録'}</h2>
				<div className="login_form__block">				
					{this.state.isRegisterd ? (
						<div>
							<p className="text-center">基本情報は既に登録済です。</p>						
							<p className="text-center">情報を更新することができます。</p>
						</div>
					) : (
						<div>
							<p className="text-center">ご登録ありがとうございます。</p>
							<p className="text-center">まず初めに、基本情報を登録してください。</p>
						</div>
					)
					}
					{this.state.isConfirmed ? (
						<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
							<FormGroup>
								<Col md={6}>
									<ControlLabel>姓</ControlLabel>
									<p className="form-control-static">{this.entry.account.lastname}</p>
								</Col>
								<Col md={6}>
									<ControlLabel>名</ControlLabel>
									<p className="form-control-static">{this.entry.account.firstname}</p>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col md={12}>
									<ControlLabel>電話番号</ControlLabel>
									<p className="form-control-static">{this.entry.account.tel}</p>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col md={12}>
									<ControlLabel>郵便番号</ControlLabel>
									<p className="form-control-static">{this.entry.account.postcode}</p>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col md={12}>
									<ControlLabel>都道府県</ControlLabel>
									<p className="form-control-static">{this.entry.account.prefecture_code}</p>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col md={12}>
									<ControlLabel>市区町村</ControlLabel>
									<p className="form-control-static">{this.entry.account.address1}</p>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col md={12}>
									<ControlLabel>建物名・部屋番号など</ControlLabel>
									<p className="form-control-static">{this.entry.account.address2}</p>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col md={12}>
									<Button type="submit" className="btn btn-lg login_form__btn--submit">
											この内容で登録する
									</Button>
									<div className="text-center">
										<a className="btn" href="signup2.html">戻る</a>
									</div>
								</Col>
							</FormGroup>
						</Form>
					) : (

						<Form horizontal onSubmit={(e) => this.handleConfirm(e)}>

							<FormGroup controlId="name">
								<Col md={6}>
									<ControlLabel>姓</ControlLabel>
									<FormControl type="text" placeholder="" name="lastname" value={this.entry.account.lastname} onChange={(e)=>this.handleChange(e)} />
								</Col>
								<Col md={6}>
									<ControlLabel>名</ControlLabel>
									<FormControl type="text" placeholder="" name="firstname" value={this.entry.account.firstname} onChange={(e)=>this.handleChange(e)} />
								</Col>
							</FormGroup>
							<FormGroup controlId="tel">
								<Col md={12}>
									<ControlLabel>電話番号</ControlLabel>
									<FormControl type="text" placeholder="0123-45-1234" name="tel" value={this.entry.account.tel} onChange={(e)=>this.handleChange(e)} />
								</Col>
							</FormGroup>

							<FormGroup controlId="postcode">
								<Col md={12}>
									<ControlLabel>郵便番号</ControlLabel>
									<FormControl type="text" placeholder="例: 123-1234" name="postcode" value={this.entry.account.postcode} onChange={(e)=>this.handleChange(e)}/>
								</Col>
							</FormGroup>
 
							<FormGroup controlId="prefecture_code">
								<Col md={12}>
									<ControlLabel>都道府県</ControlLabel>
									<FormControl componentClass="select" placeholder="select" name="prefecture_code" value={this.entry.account.prefecture_code} onChange={(e)=>this.handleChange(e)}>
										<option value="北海道">北海道</option>
										<option value="青森県">青森県</option>
										<option value="岩手県">岩手県</option>
										<option value="宮城県">宮城県</option>
										<option value="秋田県">秋田県</option>
										<option value="山形県">山形県</option>
										<option value="福島県">福島県</option>
										<option value="茨城県">茨城県</option>
										<option value="栃木県">栃木県</option>
										<option value="群馬県">群馬県</option>
										<option value="埼玉県">埼玉県</option>
										<option value="千葉県">千葉県</option>
										<option value="東京都">東京都</option>
										<option value="神奈川県">神奈川県</option>
										<option value="新潟県">新潟県</option>
										<option value="富山県">富山県</option>
										<option value="石川県">石川県</option>
										<option value="福井県">福井県</option>
										<option value="山梨県">山梨県</option>
										<option value="長野県">長野県</option>
										<option value="岐阜県">岐阜県</option>
										<option value="静岡県">静岡県</option>
										<option value="愛知県">愛知県</option>
										<option value="三重県">三重県</option>
										<option value="滋賀県">滋賀県</option>
										<option value="京都府">京都府</option>
										<option value="大阪府">大阪府</option>
										<option value="兵庫県">兵庫県</option>
										<option value="奈良県">奈良県</option>
										<option value="和歌山県">和歌山県</option>
										<option value="鳥取県">鳥取県</option>
										<option value="島根県">島根県</option>
										<option value="岡山県">岡山県</option>
										<option value="広島県">広島県</option>
										<option value="山口県">山口県</option>
										<option value="徳島県">徳島県</option>
										<option value="香川県">香川県</option>
										<option value="愛媛県">愛媛県</option>
										<option value="高知県">高知県</option>
										<option value="福岡県">福岡県</option>
										<option value="佐賀県">佐賀県</option>
										<option value="長崎県">長崎県</option>
										<option value="熊本県">熊本県</option>
										<option value="大分県">大分県</option>
										<option value="宮崎県">宮崎県</option>
										<option value="鹿児島県">鹿児島県</option>
										<option value="沖縄県">沖縄県</option>
									</FormControl>
								</Col>
							</FormGroup>

							<FormGroup controlId="address1">
								<Col md={12}>
									<ControlLabel>市区町村</ControlLabel>
									<FormControl type="text" placeholder="" name="address1" value={this.entry.account.address1} onChange={(e)=>this.handleChange(e)}/>
								</Col>
							</FormGroup>

							<FormGroup controlId="address2">
								<Col md={12}>
									<ControlLabel>建物名・部屋番号など</ControlLabel>
									<FormControl type="text" placeholder="" name="address2" value={this.entry.account.address2} onChange={(e)=>this.handleChange(e)}/>
								</Col>
							</FormGroup>

							{this.state.isForbidden &&
										<FormGroup>
											<div className="alert alert-danger">
												<a href="login.html">ログイン</a>を行ってから実行してください。
											</div>
										</FormGroup>
							}

							{this.state.isError &&
										<FormGroup>
											<div className="alert alert-danger">
												アカウント情報の登録に失敗しました。<br />
												{this.state.errmsg}
											</div>
										</FormGroup>
							}
							

							<FormGroup>
								<Col md={12}>
									<Button type="submit" className="btn btn-lg login_form__btn--submit">
												確認画面へ
									</Button>
									<div className="text-center">
										<a className="btn" href="sign_up.html">戻る</a>
									</div>
								</Col>
							</FormGroup>
						</Form>
					)}
				</div>
			</div>
		)
	}
}

ReactDOM.render(<Signup2 />, document.getElementById('signup_form'))
