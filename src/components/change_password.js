/* @flow */
import '../styles/index.css'
import axios from 'axios'
import jsSHA from 'jssha'
import React from 'react'
import ReactDOM from 'react-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import {
	Form,
	Col,
	FormGroup,
	Button,
	HelpBlock,
	FormControl
} from 'react-bootstrap'

type InputEvent = {
	target: any,
	preventDefault: Function
} 

class ChangePassword extends React.Component {
	constructor() {
		super()
		this.state = { isError : false,isForbidden : false, isAlreadyRegistered: false, isIllegalPassword: false,isUnmatchReinput: false, captchaValue:'' }    
	}

	capchaOnChange(value:string) {
		this.setState({captchaValue: value})
	}
   
	handleSubmit(e:InputEvent){
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
			<div>
				{this.state.isCompleted ? (
					<Form>
						<h2>パスワード変更を完了しました</h2>
						<hr />
						<FormGroup>
							<Col sm={12}>
								<div className="caution">
                    入力したパスワードに変更完了しました。<br />
                    もう一度<a href="login.html">ログイン</a>を行ってください。
								</div>
							</Col>
						</FormGroup>
					</Form>
				) : (
					<Form horizontal onSubmit={(e)=>this.handleSubmit(e)}>
						<h2>パスワード変更</h2>
						<hr />
						<FormGroup controlId="password">
							<Col sm={12}>
								<FormControl type="password" placeholder="パスワード" />
								<HelpBlock>（8文字以上、かつ数字・英字・記号を最低1文字含む）</HelpBlock>
							</Col>
						</FormGroup>

						<FormGroup controlId="re_password">
							<Col sm={12}>
								<FormControl type="password" placeholder="パスワード確認" />
							</Col>
						</FormGroup>
    
						<FormGroup>
							<Col smOffset={1} sm={12}>
								<ReCAPTCHA
									sitekey="6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19"
									onChange={(value)=>this.capchaOnChange(value)}
								/>
							</Col>
						</FormGroup>

						<FormGroup>
							<Col smOffset={3} sm={12}>
								<Button type="submit" className="btn btn-primary">
                  パスワード変更実行
								</Button>
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
					</Form>            
				)}
			</div>      
		)
	}
}

ReactDOM.render(<ChangePassword />, document.getElementById('changepassword_form'))