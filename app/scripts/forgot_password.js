import '../styles/index.css'
import axios from 'axios'
import PropTypes from 'prop-types'
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

class ForgotPassword extends React.Component {
	constructor(props) {
		super(props)
		this.state = { isError : false,  captchaValue:'' }    
		this.handleSubmit = this.handleSubmit.bind(this)
		this.capchaOnChange = this.capchaOnChange.bind(this)    
	}

	capchaOnChange(value) {
		this.setState({captchaValue: value})
	}
   
	handleSubmit(e){
		e.preventDefault()
		const reqData = {'feed': {'entry':[{'contributor': [{'uri': 'urn:vte.cx:auth:'+ e.target.account.value}]}]}}
  	const captchaOpt = '&g-recaptcha-response=' + this.state.captchaValue

		axios({
			url: '/d/?_passreset' + captchaOpt,
			method: 'post',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data : reqData

		}).then( () => {
			this.setState({isCompleted: true})
		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			}else {
				this.setState({isError: true})
			} 
		})
	}
  
	render() {
		return (
      <div>
        {this.state.isCompleted ? (
          <CompletedForm />
        ) : (
          <ForgotPasswordForm onSubmit={this.handleSubmit}  
                            isForbidden = {this.state.isForbidden}
                            isError = {this.state.isError}
          />
        )}
      </div>      
		)
	}
}


ForgotPasswordForm.propTypes = {
	onSubmit: PropTypes.func,
	capchaOnChange: PropTypes.func,    
	isForbidden: PropTypes.boolean,
	isError: PropTypes.boolean
}

function ForgotPasswordForm(props) {
	return (
      <Form horizontal onSubmit={props.onSubmit}>
        <h2>パスワード変更</h2>
        <hr />
        <FormGroup controlId="account">
          <Col sm={12}>
            <FormControl type="email" placeholder="アカウント(メールアドレス)" />
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
          <Col smOffset={4} sm={12}>
            <Button type="submit" className="btn btn-primary">
              メール送信
            </Button>
          </Col>
        </FormGroup>

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
      				パスワード変更メール送信に失敗しました。アカウントが使用できない可能性があります。
            </div>
          </Col>
        </FormGroup>
        }

        <FormGroup>
          <Col smOffset={4} sm={12}>
			      	<a href="login.html">ログイン</a>に戻る
          </Col>
        </FormGroup>

      </Form>
	)
}

function CompletedForm() {
	return (
      <Form>
          <h2>パスワード変更メールを送信しました</h2>
          <hr />
          <FormGroup>
            <Col sm={12}>            
              <div className="caution">
                入力したメールアドレスにパスワード変更メールを送信しました。<br />
                メールのリンクをクリックし、パスワード変更をしてください。
              </div>
            </Col>
          </FormGroup>
      </Form>
	)
}

ReactDOM.render(<ForgotPassword />, document.getElementById('forgotPassword_form'))
