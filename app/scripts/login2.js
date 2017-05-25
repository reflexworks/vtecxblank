//import 'bootstrap/dist/css/bootstrap.css'  
import '../styles/index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Form,
  Col,
  FormGroup,
  Button,
  FormControl
} from 'react-bootstrap'

const submit = (event) => {
	event.preventDefault()
	console.log('event='+	event.target.formHorizontalEmail.value)
}


const formInstance = (
  <Form horizontal onSubmit={submit}>
    <FormGroup controlId="formHorizontalEmail">
      <Col sm={12}>
        <FormControl type="email" placeholder="アカウント" />
      </Col>
    </FormGroup>

    <FormGroup controlId="formHorizontalPassword">
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

    <FormGroup>
      <Col sm={12}>
        <div className="alert alert-danger" id="error_mgs">
          ログインに失敗しました。アカウントまたはパスワードが間違っている可能性があります。
        </div>
      </Col>
    </FormGroup>

    <FormGroup>
      <Col sm={12}>
        <div>初めて利用される方は<a href="registration.html">新規登録</a>から</div>
      </Col>
    </FormGroup>
  </Form>
)

ReactDOM.render(formInstance, document.getElementById('container'))
