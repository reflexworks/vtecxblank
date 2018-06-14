import '../styles/index.css'
import '../styles/application.sass'
import * as vtecxauth from 'vtecxauth'
import axios from 'axios'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ReCAPTCHA from 'react-google-recaptcha'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
	//hello: string
}

export default class Login extends React.Component<ComponentProps> {

	/* コンポーネントの変数の型宣言 */
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

	capchaOnChange(value: string): void {
		this.captchaValue = value
		this.forceUpdate()
	}

	handleSubmit(e: any): void {

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
		}, (error: any) => {
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

	onChange(_e: any): void {
		this.values[_e.target.name] = _e.target.value
		this.forceUpdate()
	}

	render() {
		const App = (
			<form onSubmit={(e: any) => this.handleSubmit(e)}>

				{this.isLoginFailed &&
					<div className="login_error">ログインに失敗しました。<br />アカウントまたはパスワードが間違っている可能性があります。</div>
				}

				<input type="email" name="email" onChange={(e: any) => this.onChange(e)} value={this.values.email} />
				<input type="password" name="password" onChange={(e: any) => this.onChange(e)} value={this.values.password} />

				{this.requiredCaptcha &&
					<div className="login_form__recaptcha">
						<ReCAPTCHA
							sitekey="6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19"
							onChange={(value: string) => this.capchaOnChange(value)}
						/>
					</div>
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
		return (
			<div>
				<header>
					<div className="contents_in">
						<a href="http://reflexworks.jp/contact.html#company"><img src="../img/logo_vt.svg" alt="有限会社バーチャルテクノロジー" /></a>
					</div>
				</header>
				<div id="wrapper">
					<div className="vtecx-from">
						<div className="vtecx-from-container">
							<div className="vtecx-from-content">
								<h2>
									<img src="../img/logo.svg" alt="有限会社バーチャルテクノロジー" height="24px" />
									<span>ログイン</span>
								</h2>
								{App}
							</div>
						</div>
					</div>
				</div>
				<div id="footer">
					<p className="copyright">Copyrights&copy;2018 Virtual Technology,Ltd. ALL Rights Reserved.</p>
				</div>
			</div>
		)
	}
}
ReactDOM.render(<Login />, document.getElementById('container'))
