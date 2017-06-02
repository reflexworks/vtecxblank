import '../styles/index.css'
import axios from 'axios'
import PropTypes from 'prop-types'
import jsSHA from 'jssha'
import React from 'react'
import ReactDOM from 'react-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  Form,
  Col,
  FormGroup,
  Button,
  FormControl
} from 'react-bootstrap'
 
class ChangePassword extends React.Component {
	constructor(props) {
		super(props)
		this.state = { isError : false,isForbidden : false, isAlreadyRegistered: false, isIllegalPassword: false,isUnmatchReinput: false, captchaValue:'' }    
		this.handleSubmit = this.handleSubmit.bind(this)
		this.capchaOnChange = this.capchaOnChange.bind(this)
	}

	capchaOnChange(value) {
		this.setState({captchaValue: value})
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
      <div>
        {this.state.isCompleted ? (
          <CompletedForm />
        ) : (
          <ChangePasswordForm onSubmit={this.handleSubmit}  
                            capchaOnChange={this.capchaOnChange} 
                            isIllegalPassword={this.state.isIllegalPassword} 
                            isUnmatchReinput = {this.state.isUnmatchReinput}
                            isForbidden = {this.state.isForbidden}
                            isError = {this.state.isError}
          />
        )}
      </div>      
		)
	}
}

ChangePasswordForm.propTypes = {
	onSubmit: PropTypes.func,
	capchaOnChange: PropTypes.func,  
	isIllegalPassword: PropTypes.boolean,
	isUnmatchReinput: PropTypes.boolean,
	isForbidden: PropTypes.boolean,
	isError: PropTypes.boolean
}

function ChangePasswordForm(props) {
	return (
      <Form horizontal onSubmit={props.onSubmit}>
        <h2>パスワード変更</h2>
        <hr />
        <FormGroup controlId="password">
          <Col sm={12}>
            <FormControl type="password" placeholder="パスワード" />
            <span>（8文字以上、かつ数字・英字・記号を最低1文字含む）</span>            
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
              onChange={props.capchaOnChange}
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

        { props.isIllegalPassword &&
        <FormGroup>
          <Col sm={12}>
            <div className="alert alert-danger">
              パスワードは8文字以上、かつ数字・英字・記号を最低1文字含む必要があります。
            </div>
          </Col>
        </FormGroup>
        }

        { props.isUnmatchReinput &&
        <FormGroup>
          <Col sm={12}>
            <div className="alert alert-danger">
      				入力されたパスワードが不正です。確認用パスワードと一致していない可能性があります。
            </div>
          </Col>
        </FormGroup>
        }

        { props.isForbidden &&
        <FormGroup>
          <Col sm={12}>
            <div className="alert alert-danger">
              <a href="login.html">ログイン</a>を行ってから実行してください。
            </div>
          </Col>
        </FormGroup>
        }

        { props.isError &&
        <FormGroup>
          <Col sm={12}>
            <div className="alert alert-danger">
      				パスワード変更に失敗しました。
            </div>
          </Col>
        </FormGroup>
        }
      </Form>
	)
}

function CompletedForm() {
	return (
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
	)
}

ReactDOM.render(<ChangePassword />, document.getElementById('changepassword_form'))