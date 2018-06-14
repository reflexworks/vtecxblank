import '../styles/index.css'
import '../styles/application.sass'
import axios from 'axios'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import {
	Form,
	Col,
	FormGroup,
	Button,
	ControlLabel,
	FormControl
} from 'react-bootstrap'

/* コンポーネントのProps */
interface ComponentProps {
	//hello: string
}

/* コンポーネントのStateの型宣言 */
interface ComponentState {
	isError: any,
	isForbidden: boolean,
	captchaValue: string,
	isLoading: boolean,
	isCompleted: boolean
}

class ForgotPassword extends React.Component<ComponentProps, ComponentState>  {
	constructor(props: ComponentProps) {
		super(props)
		this.state = {
			isError: false,
			captchaValue: '',
			isLoading: false,
			isCompleted: false,
			isForbidden: false
		}
	}

	capchaOnChange(value: string) {
		this.setState({ captchaValue: value })
	}

	handleSubmit(e: any) {
		e.preventDefault()
		const reqData = { 'feed': { 'entry': [{ 'contributor': [{ 'uri': 'urn:vte.cx:auth:' + e.target.account.value }] }] } }
		const captchaOpt = '&g-recaptcha-response=' + this.state.captchaValue
		this.setState({ isLoading: true })

		axios({
			url: '/d/?_passreset' + captchaOpt,
			method: 'post',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data: reqData

		}).then(() => {
			this.setState({ isCompleted: true, isLoading: false })
		}).catch((error: any) => {
			if (error.response && error.response.status === 401) {
				this.setState({ isForbidden: true, isLoading: false })
			} else {
				this.setState({ isError: true, isLoading: false })
			}
		})
	}

	render() {
		const App = (
			<div className="vtecx-from">
				<div className="vtecx-from-container">
					<div className="vtecx-from-content">
						<h2>
							<img src="../img/logo.svg" alt="有限会社バーチャルテクノロジー" height="24px" />
							<span>パスワード再発行</span>
						</h2>
						{this.state.isCompleted ? (
							<Form>
								<h5 className="text-center">パスワードリセットメールを送信しました</h5>
								<FormGroup>
									<Col sm={12}>
										<div className="text-center">リンクをクリックしパスワードを変更してください。</div>
									</Col>
								</FormGroup>
							</Form>
						) : (
							<Form horizontal onSubmit={(e: any) => this.handleSubmit(e)}>

								<FormGroup controlId="account">
									<Col sm={12}>
										<ControlLabel>メールアドレス</ControlLabel>
										<FormControl type="email" placeholder="" />
									</Col>
								</FormGroup>

								<FormGroup>
									<div className="login_form__recaptcha">
										<ReCAPTCHA
											sitekey="6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19"
											onChange={(value: string) => this.capchaOnChange(value)}
										/>
									</div>
								</FormGroup>

								{this.state.isForbidden &&
										<FormGroup>
											<Col sm={12}>
												<div className="alert alert-danger">
													<a href="login.html">ログイン</a>を行ってから実行してください。
												</div>
											</Col>
										</FormGroup>
								}

								{this.state.isError &&
										<FormGroup>
											<Col sm={12}>
												<div className="alert alert-danger">パスワード変更メール送信に失敗しました。アカウントが使用できない可能性があります。</div>
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
									<Col sm={12}>
										<div className="text-center">
											<a className="btn" href="index.html">トップページへ戻る</a>
										</div>
									</Col>
								</FormGroup>

							</Form>
						)}
					</div>
				</div>
			</div>
		)
		return (
			<div>
				<header>
					<div className="contents_in">
						<a href="http://reflexworks.jp/contact.html#company"><img src="../img/logo_vt.svg" alt="有限会社バーチャルテクノロジー" /></a>
					</div>
				</header>
				<div id="wrapper">
					{App}
				</div>
				<div id="footer">
					<p className="copyright">Copyrights&copy;2018 Virtual Technology,Ltd. ALL Rights Reserved.</p>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<ForgotPassword />, document.getElementById('container'))
