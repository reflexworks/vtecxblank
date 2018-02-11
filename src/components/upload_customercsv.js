/* @flow */
import axios from 'axios'
import React from 'react'
import jsSHA from 'jssha'
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

	handleSubmit2(e:InputEvent){
		e.preventDefault()

		var updatestaff = function (entry,uid) {
			entry.staff.uid = uid

			const putdata = {
				'feed': {
					'entry': []
				}
			}

			putdata.feed.entry.push(entry)

			axios({
				url: '/d/',
				method: 'put',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data : putdata

			}).then(() => {
				//				console.log('success='+entry.staff.staff_email)
			}).catch((error) => {
				if (error.response) {
					alert('error in put='+JSON.stringify(error.response))
				} else {
					alert('error in put')
				}
			})

		}


		var adduser = function (entry) {
			const shaObj = new jsSHA('SHA-256', 'TEXT')
			shaObj.update('logioffice2017!')
			const hashpass = shaObj.getHash('B64')
		
			const reqdata = {
				'feed': {
					'entry': [{
						'contributor':
						[{ 'uri': 'urn:vte.cx:auth:'+entry.staff.staff_email+','+hashpass, 'name': 'nickname' }]
					}]
				}
			}
			axios({
				url: '/d/?_adduserByAdmin',
				method: 'post',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data : reqdata

			}).then((result) => {
				const uid = result.data.feed.title
				updatestaff(entry,uid)

			}).catch((error) => {
				if (error.response) {
					if (error.response.data.feed.title.indexOf('User is already registered. UID') >= 0) {
						const uid = error.response.data.feed.title.match(/\d+/)
						updatestaff(entry,uid[0])				
					} else {
						alert('error in adduserbyadmin='+JSON.stringify(error.response))						
					}
				} else {
					alert('error in adduserbyadmin')
				}
			})
		}

		axios({
			url: '/d/staff?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((result) => {
			result.data.feed.entry.map(entry => {
				if (!entry.staff.uid) {
					adduser(entry)
				}
			}) 
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
				<Form horizontal onSubmit={(e) => this.handleSubmit2(e)}>
					<FormGroup>
						<Button type="submit" className="btn btn-primary">
              			ユーザ登録
						</Button>
					</FormGroup>
				</Form>
			</div>
		)
	}
}

ReactDOM.render(<UploadCsvForm />, document.getElementById('container'))
