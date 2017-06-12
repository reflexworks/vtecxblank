import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Col,
  FormGroup,
  Button,
  FormControl
} from 'react-bootstrap'
 
export default class ConditionInputForm extends React.Component {
	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
 
 	static propTypes = {
		search: PropTypes.func
	}

	handleSubmit(e){
		e.preventDefault()
		e.target.email.value
		let condition = ''
		if (e.target.account.value) {
			condition += '&userinfo.id='+e.target.account.value 
		}
		if (e.target.email.value) {
			condition += '&userinfo.email='+e.target.email.value 
		}
		if (e.target.food.value) {
			condition += '&favorite.food='+e.target.food.value 
		}
		if (e.target.music.value) {
			condition += '&favorite.food='+e.target.music.value 
		}
		this.props.search(condition)
	}

	render() {
		return (
      <Form horizontal onSubmit={this.handleSubmit}>
          <Col smOffset={0.5} sm={2}>
            <FormGroup controlId="account">
                <FormControl type="text" placeholder="ID" />
            </FormGroup>
          </Col>
          <Col smOffset={1} sm={2}>
            <FormGroup controlId="email">
                <FormControl type="email" placeholder="email" />
            </FormGroup>
          </Col>
          <Col smOffset={1} sm={2}>
            <FormGroup controlId="food">
                <FormControl type="text" placeholder="好きな食べ物" />
            </FormGroup>
          </Col>  
          <Col smOffset={1} sm={2}>
            <FormGroup controlId="music">
                <FormControl type="text" placeholder="好きな音楽" />
            </FormGroup>
          </Col>
          <Col smOffset={10} sm={2}>
            <FormGroup>
                <Button type="submit" className="btn btn-primary">
                  検索
                </Button>
            </FormGroup>
          </Col>                
      </Form>
		)
	}
}

