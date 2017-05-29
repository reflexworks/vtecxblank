import '../styles/index.css'
import PropTypes from 'prop-types'
import getAuthToken from './getAuthToken.js'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Form,
  Col,
  FormGroup,
  Button,
  FormControl
} from 'react-bootstrap'
 
class Registration extends React.Component {
	constructor(props) {
		super(props)
		this.state = { isError : false, isAlreadyRegistered: false, isStatus500: false }    
		this.handleSubmit = this.handleSubmit.bind(this)
	}
  
	componentDidMount() {
		const param = window.location.href.slice(window.location.href.indexOf('?') + 1)
		switch (param) {
		case 'error':
			this.setState({isError: true})
			break
		case 'error_already_registered':
			this.setState({isAlreadyRegistered: true})
			break
		case 'status500':
			this.setState({isStatus500: true})
			break
		}
	}
 
	handleSubmit(e){
		e.preventDefault()
		console.log('token='+getAuthToken(e.target.account.value,e.target.password.value))
		this.setState({isCompleted: true})
	} 
  
	render() {
		const isCompleted = this.state.isCompleted
		return (
      <div>
        {isCompleted ? (
          <CompletedForm />
        ) : (
          <RegistrationForm onSubmit={this.handleSubmit} />
        )}
      </div>      
		)
	}
}

RegistrationForm.propTypes = {
	onSubmit: PropTypes.func
}

function RegistrationForm(props) {
	return (
      <Form horizontal onSubmit={props.onSubmit}>
        <h2>新規登録</h2>
        <hr />
        <FormGroup controlId="account">
          <Col sm={12}>
            <FormControl type="email" placeholder="アカウント(メールアドレス)" />
          </Col>
        </FormGroup>

        <FormGroup controlId="password">
          <Col sm={12}>
            <FormControl type="password" placeholder="パスワード" />
            <span>（8文字以上、かつ数字・英字・記号を最低1文字含む）</span>            
          </Col>
        </FormGroup>

       <FormGroup>
          <Col sm={12}>
            <div className="caution">
            <a href="user_terms.html">利用規約</a>に同意のうえ、「利用規約に同意して新規登録」ボタンを押してください。
            </div>
          </Col>
        </FormGroup>
 
        <FormGroup>
          <Col sm={12}>
            <div id="captcha"></div>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={2} sm={12}>
            <Button type="submit" className="btn btn-primary">
              利用規約に同意して新規登録
            </Button>
          </Col>
        </FormGroup>

        
      </Form>
	)
}

function CompletedForm() {
	return (
      <Form>
          <h2>仮登録が完了しました。</h2>
          <hr />
          <FormGroup>
            <Col sm={12}>
              <div className="caution">
                入力したメールアドレスに本登録用のメールを送信しました。<br />
                メールのリンクをクリックし、本登録を完了してください。
              </div>
            </Col>
          </FormGroup>
      </Form>
	)
}

ReactDOM.render(<Registration />, document.getElementById('registration_form'))
