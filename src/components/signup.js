/* @flow */
import '../styles/application.sass'
import axios from 'axios'
import jsSHA from 'jssha'
import React from 'react'
import ReactDOM from 'react-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import ReactPasswordStrength from 'react-password-strength/dist/universal'
import 'react-password-strength/dist/style.css'
import {
	Form,
	Col,
	FormGroup,
	Button,
	ControlLabel,
	HelpBlock,
	FormControl
} from 'react-bootstrap'


type InputEvent = {
		target: any,
	preventDefault: Function
}

class Signup extends React.Component {
	constructor() {
		super()
		this.state = { isError : false, isAlreadyRegistered: false, isIllegalPassword: false, captchaValue:'',isLoading : false,isUnmatchReinput: false,passLength: 0 }
	}

	passwordOnChange(state) {
		this.setState({ passLength: state.password.length })
	}

	capchaOnChange(value:string) {
		this.setState({captchaValue: value})
	}

	//ハッシュ化したパスワードを取得する
	getHashPass(password:string){
		var shaObj = new jsSHA('SHA-256', 'TEXT')
		shaObj.update(password)
		return shaObj.getHash('B64')
	}

	handleSubmit(e: InputEvent) {
		this.setState({isLoading:true})
		e.preventDefault()
		const password = e.target.password.value

		//パスワードのバリデーションチェックを行う
		if (!password.match('^(?=.*?[0-9])(?=.*?[a-zA-Z])(?=.*?[!-/@_])[A-Za-z!-9@_]{8,}$')) {
			this.setState({ isIllegalPassword: true, isLoading: false })
		} else {

			if (password && e.target.re_password.value && password === e.target.re_password.value) {

				const reqData = { 'feed': { 'entry': [{ 'contributor': [{ 'uri': 'urn:vte.cx:auth:' + e.target.account.value + ',' + this.getHashPass(password) + '' }] }] } }
				const captchaOpt = '&g-recaptcha-response=' + this.state.captchaValue

				axios({
					url: '/d/?_adduser' + captchaOpt,
					method: 'post',
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					},
					data: reqData

				}).then(() => {
					this.setState({ isCompleted: true, isLoading: false })
				}).catch((error) => {
					this.setState({ isLoading: false })
					if (error.response) {
						if (error.response.data.feed.title.indexOf('User is already registered') !== -1) {
							this.setState({ isAlreadyRegistered: true })
						} else {
							this.setState({ isError: true })
						}
					} else {
						this.setState({ isError: true })
					}
				})
			} else {
				this.setState({isUnmatchReinput: true, isLoading: false})					
			}
		}
	}	
	
	render() {
		return (
			<div className="col-md-6 col-md-offset-3 col-sm-12">
				{this.state.isCompleted ? (
					<div>
						<h2 className="login_form__title">仮登録完了</h2>
						<div className="login_form__block text-center">
							<p>ご登録いだいたメールアドレスに
							<br />確認メールをお送りしてます。</p>
							<p>ご確認ください。</p>
							<a className="btn btn-lg login_form__btn--submit" href="index.html">TOPページに戻る</a>
						</div>
					</div>
				) : (
					<div>
						<h3 className="login_form__title">アカウント新規登録(無料)</h3>
						<div className="login_form__block" id="signup_form">
							<Form horizontal onSubmit={this.state.isLoading ? null : (e)=>this.handleSubmit(e)}>

    					<FormGroup controlId="account">
									<Col md={12}>
										<ControlLabel>メールアドレス</ControlLabel>
										<FormControl type="email" placeholder="email" />
									</Col>
								</FormGroup>

								<FormGroup controlId="password">
									<Col md={12}>
										<ControlLabel>パスワード</ControlLabel>
										<ReactPasswordStrength
											className="customClass"
											minLength={8}
											minScore={3}
											scoreWords={['弱', '弱', '中', '強', '最強']}
											tooShortWord= '短い'	
											changeCallback={(e)=>this.passwordOnChange(e)}
											inputProps={{ name: 'password', autoComplete: 'off', className: 'form-control' }}
										/>	
										<HelpBlock>（8文字以上で、かつ数字・英字・記号を最低1文字含む必要があります。パスワード強度は「強」以上がお薦めです）</HelpBlock>
									</Col>

								</FormGroup>

								<FormGroup controlId="re_password">
									<Col sm={12}>
										<ControlLabel>パスワード確認</ControlLabel>
										<FormControl type="password" placeholder="" />
									</Col>
								</FormGroup>
									
								<FormGroup>
									<ReCAPTCHA
										sitekey="6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19"
										onChange={(value)=>this.capchaOnChange(value)}
										className="login_form__recaptcha"

									/>
								</FormGroup>

								{ this.state.isIllegalPassword &&
												<FormGroup>
													<Col sm={12}>
														<div className="alert alert-danger">
                  パスワードは8文字以上、かつ数字・英字・記号を最低1文字含む必要があります。
														</div>
													</Col>
												</FormGroup>
								}

								{ this.state.isUnmatchReinput &&
												<FormGroup>
													<Col sm={12}>
														<div className="alert alert-danger">
                  入力されたパスワードが一致していません。
														</div>
													</Col>
												</FormGroup>
								}


								{ this.state.isAlreadyRegistered &&
												<FormGroup>
													<Col sm={12}>
														<div className="alert alert-danger">
                  そのアカウントは既に登録済みです。
														</div>
													</Col>
												</FormGroup>
								}

								{ this.state.isError &&
												<FormGroup>
													<Col sm={12}>
														<div className="alert alert-danger">
                  新規登録に失敗しました。アカウントまたはパスワードが使用できない可能性があります。
														</div>
													</Col>
												</FormGroup>
								}
								<FormGroup>
									<Col md={12}>
										<p className="login_form__text--small">利用規約に同意のうえ、「利用規約に同意して新規登録」ボタンを押してください。</p>
										<Button type="submit" className="btn btn-lg login_form__btn--submit" disabled={this.state.isLoading}>
											{this.state.isLoading ? <span><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>　送信中</span> : '利用規約に同意して新規登録'}
										</Button>
										<div className="text-center">
											<a className="btn" href="index.html">戻る</a>
										</div>
									</Col>
								</FormGroup>
									
							</Form>
						</div>
					</div>
				)}
			</div>
		)
	}
}
 
ReactDOM.render(<Signup />, document.getElementById('signup_form'))
