/* @flow */
import '../styles/index.css'
import '../styles/application.sass'
import * as vtecxauth from 'vtecxauth'
import axios from 'axios'
import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

/* コンポーネントのProps */
interface ComponentProps {
	//hello: string
}

export default class LoginForm extends React.Component<ComponentProps> {

	isLoginFailed: boolean
	requiredCaptcha: boolean
	captchaValue: string
	values: any

	constructor(props: ComponentProps) {
		super(props)
		this.isLoginFailed = false
		this.requiredCaptcha = false
		this.captchaValue = ''
		this.values = {}
	}

	capchaOnChange(value: string) {
		this.captchaValue = value
		this.forceUpdate()
	}

	handleSubmit(e: any) {

		e.preventDefault()

		const authToken = vtecxauth.getAuthToken(e.target.email.value, e.target.password.value)
		const captchaOpt = this.requiredCaptcha ? '&g-recaptcha-response=' + this.captchaValue : ''

		axios({
			url: '/d/?_login' + captchaOpt,
			method: 'get',
			headers: {
				'X-WSSE': authToken,
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then(() => {
			location.href = 'index.html'
		}, (error) => {
			if (error.response) {
				if (error.response.data.feed.title === 'Captcha required at next login.') {
					this.isLoginFailed = true
					this.requiredCaptcha = true
				} else {
					this.isLoginFailed = true
				}
			} else {
				this.isLoginFailed = true
			}
			this.forceUpdate()
		})
	}

	onChange(_e: any) {
		this.values[_e.target.name] = _e.target.value
		this.forceUpdate()
	}

	render() {
		return (
			<form onSubmit={(e) => this.handleSubmit(e)}>

				{this.isLoginFailed &&
					<div className="login_error">ログインに失敗しました。<br />アカウントまたはパスワードが間違っている可能性があります。</div>
				}

				<input type="email" name="email" onChange={(e) => this.onChange(e)} value={this.values.email} />
				<input type="password" name="password" onChange={(e) => this.onChange(e)} value={this.values.password} />

				{this.requiredCaptcha &&
					<ReCAPTCHA
						sitekey="6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19"
						onChange={(value: string) => this.capchaOnChange(value)}
					//className="login_form__recaptcha"
					/>
				}

				<div className="button-area">
					<button type="submit" className="button-left">ログイン</button>
					<div className="button-right">
						<a href="forgot_password.html">パスワードをお忘れですか？</a>
						<a href="signup.html">はじめてご利用の方（新規会員登録）</a>
					</div>
					<div className="clear"></div>
				</div>

			</form>
		)
	}
}
