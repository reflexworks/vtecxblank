/* @flow */
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import {
	Form,
	FormGroup,
	FormControl,
	Button
} from 'react-bootstrap'

type InputEvent = {
	target: any,
	preventDefault: Function  
} 

class UploadBillingDataForm extends React.Component {  
	constructor() {
		super()
		this.state = { }    
	}
 
	handleSubmit(e:InputEvent){
		e.preventDefault()

		const formData = new FormData(e.currentTarget)

		axios({
			url: '/s/put-billing',
			method: 'post',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data : formData

		}).then(() => {
			alert('success')
		}).catch((error) => {
			if (error.response) {
				alert('error='+JSON.stringify(error.response))
			} else {
				alert('error')
			}
		})
		
	}

	render() {
		return (
			<div>
				<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
					<FormGroup>
						<FormControl type="file" name="csv" />
					</FormGroup>
					<FormGroup>
						<Button type="submit" className="btn btn-primary">
              			CSVアップロード
						</Button>
					</FormGroup>
				</Form>
			</div>
		)
	}
}

ReactDOM.render(<UploadBillingDataForm />, document.getElementById('container'))

