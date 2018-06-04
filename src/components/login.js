import '../styles/application.sass'
import axios from 'axios'
import getAuthToken from './getAuthToken.js'
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

class LoginForm extends React.Component {
	constructor() {
		super()
		this.state = { isLoginFailed : false, requiredCaptcha: false, captchaValue:'' }
	}

	capchaOnChange(value) {
		this.setState({captchaValue: value})
	}

	handleSubmit(e){
		e.preventDefault()
		const authToken = getAuthToken(e.target.account.value,e.target.password.value)
		const captchaOpt = this.state.requiredCaptcha ? '&g-recaptcha-response=' + this.state.captchaValue : ''

		axios({
			url: '/d/?_login' + captchaOpt,
			method: 'get',
			headers: {
				'X-WSSE': authToken,
				'X-Requested-With': 'XMLHttpRequest'
			}
			
		}).then(() => {
			location.href = '/'
		}).catch((error) => {
			if (error.response) {
				if (error.response.data.feed.title==='Captcha required at next login.') {
  					this.setState({requiredCaptcha: true,isLoginFailed: true})
				}else {
  					this.setState({isLoginFailed: true})
				}
			} else {
				this.setState({isLoginFailed: true})
			}
		})
	}

	render() {
		return (
			<div>
				<h3 className="login_form__title">ログイン</h3>
				<div className="login_form__block">
					<Form horizontal onSubmit={(e)=>this.handleSubmit(e)}>
						<FormGroup controlId="account">
							<Col sm={12}>
								<ControlLabel>メールアドレス</ControlLabel>
								<FormControl type="email" placeholder="email" />
							</Col>
						</FormGroup>

						<FormGroup controlId="password">
							<Col sm={12}>
								<ControlLabel>パスワード</ControlLabel>
								<FormControl type="password" placeholder="パスワード" />
							</Col>
						</FormGroup>

						{ this.state.requiredCaptcha &&
								<FormGroup>
									<Col sm={12}>
										<ReCAPTCHA
											sitekey="6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19"
											onChange={(value)=>this.capchaOnChange(value)}
											className="login_form__recaptcha"
										/>
									</Col>
								</FormGroup>
						}
						
						<FormGroup>
							<Col sm={12}>
								<Button type="submit" className="btn btn-lg login_form__btn--submit">
              ログイン
								</Button>
							</Col>
						</FormGroup>

						{ this.state.isLoginFailed &&
								<FormGroup>
									<Col sm={12}>
										<div className="alert alert-danger">
              ログインに失敗しました。アカウントまたはパスワードが間違っている可能性があります。
										</div>
									</Col>
								</FormGroup>
						}

					</Form>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<LoginForm />, document.getElementById('container'))
