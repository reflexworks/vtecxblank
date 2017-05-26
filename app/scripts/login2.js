import '../styles/index.css'
import jsSHA from 'jssha'
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
		this.state = { isLoginFailed : false, isCreateServiceFailed: false, isCaptcha: false }    
		this.handleSubmit = this.handleSubmit.bind(this)
	}
 
	componentDidMount() {
		const param = window.location.href.slice(window.location.href.indexOf('?') + 1)
		switch (param) {
		case 'error':
			this.setState({isLoginFailed: true})
			break
		case 'error_create_service':
			this.setState({isCreateServiceFailed: true})
			break
		case 'errorcaptca':
			this.setState({isCaptcha: true})
			break
		}
	}
 
  //ハッシュ化したパスワードを取得する
	getHashPass(pass){
		const shaObj = new jsSHA('SHA-256', 'TEXT')
		shaObj.update(pass)
		return shaObj.getHash('B64')  
	}

	handleSubmit(e){
		e.preventDefault()
		console.log('eventx='+	e.target.account.value)
		console.log('test='+this.getHashPass('test'))
		console.log('token='+createToken(e.target.account.value,e.target.password.value))
		this.setState({isLoginFailed: true})
	} 

	render() {
		const isLoginFailed = this.state.isLoginFailed
		const isCreateServiceFailed = this.state.isCreateServiceFailed
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

        { isCreateServiceFailed &&
        <FormGroup>
          <Col sm={12}>
            <div className="alert alert-danger">
              サービスの作成に失敗しました。<a href="index.html">トップページ</a>から再度やり直してください。
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
