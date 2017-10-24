/* @flow */
import React from 'react'
import PropTypes from 'prop-types'
import {
	Form,
	Col,
	FormGroup,
	Button,
	FormControl
} from 'react-bootstrap'

import type {
	Props,
	InputEvent
} from 'demo.types'
 
export default class ConditionInputForm extends React.Component {
	
	constructor(props:Props) {
		super(props)
	}
 
	static propTypes = {
		search: PropTypes.func
	}

	handleChange_type(e:InputEvent) {
		this.setState({ type: e.target.value })
	}
	handleSubmit(e:InputEvent){
		e.preventDefault()
		//e.target.email.value
		let condition = ''
		if (e.target.customer_number.value) {
			condition += '&customer.customer_number=' + e.target.customer_number.value
		}
		if (e.target.corporate_type.value) {
			condition += '&customer.corporate_type='+e.target.corporate_type.value 
		}
		if (e.target.customer_name.value) {
			condition += '&customer.customer_name='+e.target.customer_name.value 
		}
		if (e.target.customer_tel1.value) {
			condition += '&customer.customer_tel1='+e.target.customer_tel1.value 
		}
		if (e.target.customer_staff.value) {
			condition += '&customer.customer_staff='+e.target.customer_staff.value 
		}
		if (e.target.email_address1.value) {
			condition += '&customer.email_address1='+e.target.email_address1.value 
		}
		this.props.search(condition)
	}

	render() {
		return (
			<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
				
				<Col smOffset={1} sm={3}>
					<FormGroup controlId="customer_number">
						<FormControl type="text" placeholder="顧客コード" />
					</FormGroup>
				</Col>

				<Col smOffset={1} sm={3}>
					<FormGroup controlId="corporate_type"onChange={(e) => this.handleChange_type(e)}>
						<FormControl componentClass="select" placeholder="顧客区分">
									 <option value="1">個人</option>
									 <option value="2">法人</option>
						</FormControl>
					</FormGroup>
				</Col>
					
				<Col smOffset={1} sm={3}>
					<FormGroup controlId="customer_name">
						<FormControl type="text" placeholder="顧客名" />
					</FormGroup>
				</Col>  
				<Col smOffset={1} sm={3}>
					<FormGroup controlId="customer_tel1">
						<FormControl type="text" placeholder="電話" />
					</FormGroup>
				</Col>
				<Col smOffset={1} sm={3}>
					<FormGroup controlId="customer_staff">
						<FormControl type="text" placeholder="担当者" />
					</FormGroup>
				</Col>
				
				<Col smOffset={1} sm={3}>
					<FormGroup controlId="email_address1">
						<FormControl type="email" placeholder="メールアドレス" />
					</FormGroup>
				</Col>
					
				<Col smOffset={10} sm={1}>
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

