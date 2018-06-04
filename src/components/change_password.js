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
	HelpBlock,
	ControlLabel,
	FormControl
} from 'react-bootstrap'

class ChangePassword extends React.Component {
	constructor() {
		super()
		this.state = { isError : false,isForbidden : false, isAlreadyRegistered: false, isIllegalPassword: false,isUnmatchReinput: false, captchaValue:'',passLength: 0 }
	}

	capchaOnChange(value) {
		this.setState({captchaValue: value})
	}

	passwordOnChange(state) {
		this.setState({ passLength: state.password.length })
	}

	handleSubmit(e){
		e.preventDefault()
		const password = e.target.password.value

		//パスワードのバリデーションチェックを行う
		if (!password.match('^(?=.*?[0-9])(?=.*?[a-zA-Z])(?=.*?[!-/@_])[A-Za-z!-9@_]{8,}$')) {
			this.setState({isIllegalPassword: true})

		}else {

			if (password && e.target.re_password.value && password === e.target.re_password.value) {

				const shaObj = new jsSHA('SHA-256', 'TEXT')
				shaObj.update(password)
				const hashpass = shaObj.getHash('B64')
				const reqData = {'feed': {'entry':[{'contributor': [{'uri': 'urn:vte.cx:auth:,'+ hashpass +''}]}]}}

  	    const captchaOpt = '&g-recaptcha-response=' + this.state.captchaValue

				axios({
					url: '/d/?_changephash' + captchaOpt,
					method: 'put',
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					},
					data : reqData

				}).then( () => {
					this.setState({isCompleted: true})
    		}).catch((error) => {
		    	if (error.response&&error.response.status===403) {
  					this.setState({isForbidden: true})
    			}else {
  					this.setState({isError: true})
		    	}
  		})

			}else{
				this.setState({isUnmatchReinput: true})
			}

		}
	}

	render() {
		return (
			<div className="col-md-6 col-md-offset-3 col-sm-12">
				<h3 className="login_form__title">パスワード変更</h3>
				<div className="login_form__block">				
					{this.state.isCompleted ? (
						<Form>
							<h5 className="text-center">パスワード変更を完了しました</h5>
							<FormGroup>
								<Col sm={12}>
									<div className="text-center">
                    もう一度<a href="login.html">ログイン</a>を行ってください。
									</div>
								</Col>
							</FormGroup>
						</Form>
				 ) : (
						<Form horizontal onSubmit={(e)=>this.handleSubmit(e)}>
							<FormGroup controlId="password">
								<Col sm={12}>
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

							<br/>
							<FormGroup>
								<Col sm={12}>
									<ReCAPTCHA
										sitekey="6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19"
										onChange={(value)=>this.capchaOnChange(value)}
										className="login_form__recaptcha"
									/>
								</Col>
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
                  入力されたパスワードが不正です。確認用パスワードと一致していない可能性があります。
														</div>
													</Col>
												</FormGroup>
							}

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
                  パスワード変更に失敗しました。
														</div>
													</Col>
												</FormGroup>
							}
							<FormGroup>
								<Col sm={12}>
									<Button type="submit" className="btn btn-lg login_form__btn--submit">
                  パスワード変更実行
									</Button>
								</Col>
							</FormGroup>
						</Form>
					)}
				</div>
			</div>
		)
	}
}

ReactDOM.render(<ChangePassword />, document.getElementById('changepassword_form'))
