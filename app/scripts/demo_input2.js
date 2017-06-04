import '../styles/index.css'
//import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Form,
  Col,
  FormGroup,
  Button,
  ControlLabel,
  PageHeader,
  Glyphicon,
  FormControl
} from 'react-bootstrap'
 
class Input extends React.Component {
	constructor(props) {
		super(props)
		this.state = { }    
		this.handleSubmit = this.handleSubmit.bind(this)
	}
 
	handleSubmit(e){
		e.preventDefault()
		console.log('id='+e.target.id.value)

	}
  
	render() {
		return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <PageHeader>新規登録</PageHeader>
        <FormGroup controlId="id">
          <FormControl.Static>ユーザ情報</FormControl.Static>        
          <Col sm={12}>
            <ControlLabel>ID</ControlLabel>
            <FormControl type="text" placeholder="ID" />
          </Col>
        </FormGroup>

        <FormGroup controlId="email">
          <Col sm={12}>
            <ControlLabel>email</ControlLabel>
            <FormControl type="email" placeholder="email" />
          </Col>
        </FormGroup>

        <br />

        <FormGroup controlId="food">
          <FormControl.Static>お気に入り</FormControl.Static>        
          <Col sm={12}>
            <ControlLabel>好きな食べ物</ControlLabel>
            <FormControl type="text" placeholder="food" />
          </Col>
        </FormGroup>

        <FormGroup controlId="music">
          <Col sm={12}>
            <ControlLabel>好きな音楽</ControlLabel>
            <FormControl type="email" placeholder="music" />
          </Col>
        </FormGroup>

          <Col sm={12}>
            <ControlLabel>趣味</ControlLabel>
            <table className="table">
            <thead>
              <tr>
                <th>タイプ</th>
                <th>名前</th>
              </tr>
            </thead>
            <tbody>
              <td>
            <FormGroup controlId="hobby_type">
            <Col sm={11}>              
            <FormControl componentClass="select" placeholder="select">
              <option value="野内">屋内</option>
              <option value="野外">屋外</option>
              <option value="その他">その他</option>
            </FormControl>
            </Col>
            </FormGroup>
            </td>              
            <td>
           <FormGroup controlId="hobby_name">
            <Col sm={12}>              
              <FormControl type="text" placeholder="hobby" />
            </Col>
           </FormGroup>
            </td>
            </tbody>
      			</table>
          </Col>

        <FormGroup>
          <Col sm={12}>
            <Button className="btn btn-default" id="add_list">
              <Glyphicon glyph="plus" />
            </Button>
          </Col>
        </FormGroup>

        <br/>

        <FormGroup>
          <Col smOffset={4} sm={10}>
            <Button type="submit" className="btn btn-primary">
              登録
            </Button>
          </Col>
        </FormGroup>

      </Form>
		)
	}
}

ReactDOM.render(<Input />, document.getElementById('container'))
