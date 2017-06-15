//import '../styles/index.css'
import axios from 'axios'
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
 
class PreferenceInput extends React.Component {
	constructor(props) {
		super(props)
		this.state = { rows:[1],isCompleted: false,isError: false,errmsg:'',isForbidden: false }    
		this.handleSubmit = this.handleSubmit.bind(this)
	}
 
	handleSubmit(e){
		e.preventDefault()
		let reqdata = {'feed': {'entry': []}}
		let entry = {}
		entry.userinfo = { id : Number(e.target.id.value), email : e.target.email.value }
		entry.favorite = { food : e.target.food.value, music : e.target.music.value }

		entry.hobby = []
		this.state.rows.map(row => 
    	entry.hobby.push({'type': e.target['hobby_type'+row].value, 'name': e.target['hobby_name'+row].value})
		)
		reqdata.feed.entry.push(entry)

		/*  for pagination test
		for (let i = 1; i < 100; i++) {
			let entry2 = {}
			entry2.userinfo = { id : i, email : e.target.email.value }
			entry2.favorite = { food : e.target.food.value, music : e.target.music.value }
			reqdata.feed.entry.push(entry2)
		}
*/
    
		axios({
			url: '/d/registration',
			method: 'post',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data : reqdata

		}).then( () => {
			this.setState({isCompleted: true})
		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			} else if (error.response.status === 403) {
				location.href = 'login.html'
			} else {
				this.setState({isError: true,errmsg:error.response.data.feed.title})
			} 
		})

	}

	addRow() {
		this.setState((prevState) => ({
			rows: prevState.rows.concat([prevState.rows.length+1])
		}))
	}

	HobbyForm(row) {
		const hobby_type = 'hobby_type'+row
		const hobby_name = 'hobby_name'+row
		return(
			<tbody key={row.toString()}>
				<td>
					<Col sm={8}>              
						<FormGroup controlId={hobby_type}>
							<FormControl componentClass="select" placeholder="select">
								<option value="屋内">屋内</option>
								<option value="屋外">屋外</option>
								<option value="その他">その他</option>
							</FormControl>
						</FormGroup>
					</Col>
				</td>              
				<td>
					<Col sm={8}>              
						<FormGroup controlId={hobby_name}>
							<FormControl type="text" placeholder="hobby" />
						</FormGroup>
					</Col>
				</td>
			</tbody>
		)
	}
  
	render() {
		return (
			<Form horizontal onSubmit={this.handleSubmit}>
				<PageHeader>新規登録</PageHeader>
				<FormGroup controlId="id">
					<FormControl.Static>ユーザ情報</FormControl.Static>        
					<ControlLabel>ID</ControlLabel>
					<FormControl type="text" placeholder="数字" />
				</FormGroup>

				<FormGroup controlId="email">
					<ControlLabel>email</ControlLabel>
					<FormControl type="email" placeholder="email" />
				</FormGroup>
				<br />
				<FormGroup controlId="food">
					<FormControl.Static>お気に入り</FormControl.Static>        
					<ControlLabel>好きな食べ物</ControlLabel>
					<FormControl type="text" placeholder="３文字" />
				</FormGroup>

				<FormGroup controlId="music">
					<ControlLabel>好きな音楽</ControlLabel>
					<FormControl type="text" placeholder="５文字" />
				</FormGroup>

				<ControlLabel>趣味</ControlLabel>
				<table className="table">
					<thead>
						<tr>
							<th>タイプ</th>
							<th>名前</th>
						</tr>
					</thead>
					{this.state.rows.map(row => this.HobbyForm(row))}
      			</table>

				<FormGroup>
					<Button className="btn btn-default" onClick={() => this.addRow() }>
						<Glyphicon glyph="plus" />
					</Button>
				</FormGroup>

				<br/>
				{ this.state.isForbidden &&
								<FormGroup>
									<div className="alert alert-danger">
										<a href="login.html">ログイン</a>を行ってから実行してください。
									</div>
								</FormGroup>
				}

				{ this.state.isError &&
								<FormGroup>
									<div className="alert alert-danger">
              データ登録に失敗しました。<br/>
										{this.state.errmsg}
									</div>
								</FormGroup>
				}

				{ this.state.isCompleted &&
								<FormGroup>
									<div>
      				データを登録しました。
									</div>
								</FormGroup>
				}

				<FormGroup>
					<Col smOffset={4} sm={12}>
						<Button type="submit" className="btn btn-primary">
              登録
						</Button>
					</Col>
				</FormGroup>

			</Form>
		)
	}
}

ReactDOM.render(<PreferenceInput />, document.getElementById('container'))
