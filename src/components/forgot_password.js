import '../styles/application.sass'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import {
	Form,
	Col,
	FormGroup,
	Button,
	ControlLabel,
	FormControl
} from 'react-bootstrap'

class ForgotPassword extends React.Component {
	constructor() {
		super()
		this.state = { isError : false,  captchaValue:'',isLoading: false }
	}

	capchaOnChange(value) {
		this.setState({captchaValue: value})
	}

	handleSubmit(e){
		e.preventDefault()
		const reqData = {'feed': {'entry':[{'contributor': [{'uri': 'urn:vte.cx:auth:'+ e.target.account.value}]}]}}
  	const captchaOpt = '&g-recaptcha-response=' + this.state.captchaValue
		this.setState({isLoading:true})

		axios({
			url: '/d/?_passreset' + captchaOpt,
			method: 'post',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data : reqData

		}).then( () => {
			this.setState({isCompleted: true,isLoading:false})
		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true,isLoading:false})
			}else {
				this.setState({isError: true,isLoading:false})
			}
		})
	}

	render() {
		return (
			<div className="col-md-6 col-md-offset-3 col-sm-12">
				<h3 className="login_form__title">パスワード再発行</h3>
				<div className="login_form__block">				
					{this.state.isCompleted ? (
						<Form>
							<h5 className="text-center">パスワードリセットメールを送信しました</h5>
							<FormGroup>
								<Col sm={12}>
									<div className="text-center">
                    リンクをクリックしパスワードを変更してください。
									</div>
								</Col>
							</FormGroup>
						</Form>
					) : (
						<Form horizontal onSubmit={(e)=>this.handleSubmit(e)}>
							<h5 className="text-center">パスワードリセットメールをお送りします</h5>
							<br />
							<FormGroup controlId="account">
								<Col sm={12}>
									<ControlLabel>メールアドレス</ControlLabel>
									<FormControl type="email" placeholder="" />
								</Col>
							</FormGroup>

							<br />
							<FormGroup>
								<Col sm={12}>
									<ReCAPTCHA
										sitekey="6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19"
										onChange={(value)=>this.capchaOnChange(value)}
										className="login_form__recaptcha"
									/>
								</Col>
							</FormGroup>

							{ this.state.isForbidden &&
												<FormGroup>
													<Col sm={12}>
														<div className="alert alert-danger">
															<a href="login.html">ログイン</a>を行ってから実行してください。
														</div>
													</Col>
												</FormGroup>
							}

							{ this.state.isError &&
												<FormGroup>
													<Col sm={12}>
														<div className="alert alert-danger">
                  パスワード変更メール送信に失敗しました。アカウントが使用できない可能性があります。
														</div>
													</Col>
												</FormGroup>
							}
							<FormGroup>
								<Col sm={12}>
									<Button type="submit" className="btn btn-lg login_form__btn--submit" disabled={this.state.isLoading}>
										{this.state.isLoading ? <span><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>　送信中</span> : 'メールを送信する'}
									</Button>
								</Col>
							</FormGroup>

							<FormGroup>
								<Col smOffset={4} sm={12}>
									<a href="login.html">ログイン</a>に戻る
								</Col>
							</FormGroup>

						</Form>
					)}
				</div>
			</div>
		)
	}
}

ReactDOM.render(<ForgotPassword />, document.getElementById('forgotPassword_form'))
