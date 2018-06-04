import '../styles/index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {
	Form,
	Col,
	FormGroup
} from 'react-bootstrap'
 
function CompletedForm() {
	return (
		<Form>
			<h2>本登録が完了しました</h2>
			<hr />
			<FormGroup>
				<Col sm={12}>
                仮登録から本登録の手続きが完了しました。<br /><br />
					<a href="index.html">トップページ</a>
				</Col>
			</FormGroup>
		</Form>
	)
}

ReactDOM.render(<CompletedForm />, document.getElementById('container'))