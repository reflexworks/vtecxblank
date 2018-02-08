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

class UploadCsvForm extends React.Component {  
	constructor() {
		super()
		this.state = { }    
	}
 
	handleSubmit(e:InputEvent){
		e.preventDefault()

		const formData = new FormData(e.currentTarget)

		axios({
			url: '/s/put-customercsv',
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
			<Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
				<FormGroup>
					<FormControl type="file" name="csv" />
				</FormGroup>
				<FormGroup>
					<Button type="submit" className="btn btn-primary">
              			登録
					</Button>
				</FormGroup>
			</Form>
		)
	}
}

ReactDOM.render(<UploadCsvForm />, document.getElementById('container'))
