import '../styles/index.css'
import jsSHA from 'jssha'
import axios from 'axios'
import createToken from './createToken.js'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Form,
  Col,
  FormGroup,
  Button,
  FormControl
} from 'react-bootstrap'
 
class LoginForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = { isLoginFailed : false, isCaptcha: false }    
		this.handleSubmit = this.handleSubmit.bind(this)
	}
 
  //ハッシュ化したパスワードを取得する
	getHashPass(pass){
		const shaObj = new jsSHA('SHA-256', 'TEXT')
		shaObj.update(pass)
		return shaObj.getHash('B64')  
	}

	handleSubmit(e){
		e.preventDefault()
		const hashPass = this.getHashPass(e.target.password.value)
		const wsseToken = createToken(e.target.account.value,hashPass)

		axios({
			url: '/d/?_login',
			method: 'get',
			headers: {
				'X-WSSE': wsseToken,
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( () => {
      	location.href = 'index.html'  
		}).catch((error) => {
			if (error.response) {
				if (error.response.data.feed.title==='Captcha required at next login.') {
					console.log('error captcha')
  					this.setState({isCaptcha: true,isLoginFailed: true})
				}else {
  					this.setState({isLoginFailed: true})
				}
			} else {
				this.setState({isLoginFailed: true})
			}
		})
	} 

	render() {
		const isLoginFailed = this.state.isLoginFailed
		return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormGroup controlId="account">
          <Col sm={12}>
            <FormControl type="email" placeholder="アカウント" />
          </Col>
        </FormGroup>

        <FormGroup controlId="password">
          <Col sm={12}>
            <FormControl type="password" placeholder="パスワード" />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={12}>
            <a href="forgot_password.html">パスワードを忘れた場合</a>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={12}>
            <div id="captcha"></div>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={4} sm={10}>
            <Button type="submit" className="btn btn-primary">
              ログイン
            </Button>
          </Col>
        </FormGroup>
        
        { isLoginFailed &&
        <FormGroup>
          <Col sm={12}>
            <div className="alert alert-danger">
              ログインに失敗しました。アカウントまたはパスワードが間違っている可能性があります。
            </div>
          </Col>
        </FormGroup>
        }
        
        <FormGroup>
          <Col sm={12}>
            <div>初めて利用される方は<a href="registration.html">新規登録</a>から</div>
          </Col>
        </FormGroup>
      </Form>
		)
	}
}

ReactDOM.render(<LoginForm />, document.getElementById('container'))
