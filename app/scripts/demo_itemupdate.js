/* @flow */
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import {
	Grid,
	Row,
	Form,
	Col,
	FormGroup,
	Button,
	ControlLabel,
	PageHeader,
	Glyphicon,
	FormControl
} from 'react-bootstrap'
import type {
	State,
	Props,
	InputEvent
} from 'demo.types'

export default class ItemUpdate extends React.Component {
	state: State
	entrykey: string
	
	constructor(props:Props) {
		super(props)
		this.state = { feed: {},id:0,email:'',food:'',music:'',isCompleted: false, isDeleted:false,isError: false, errmsg: '', isForbidden: false } 
		this.entrykey
	}
 
	static propTypes = {
		hideSidemenu: PropTypes.func
	}

	initValue() {
		this.setState({
			id: this.state.feed.entry ? this.state.feed.entry[0].userinfo.id : 0,
			email: this.state.feed.entry ? this.state.feed.entry[0].userinfo.email : '',
			food: this.state.feed.entry ? this.state.feed.entry[0].favorite.food : '',
			music: this.state.feed.entry ? this.state.feed.entry[0].favorite.music : ''
		})

		if (this.state.feed.entry && this.state.feed.entry[0]&&this.state.feed.entry[0].hobby) {
			this.state.feed.entry[0].hobby.map(
				(hobby,i) => {
					const hobby_type = 'hobby_type' + i
					const hobby_name = 'hobby_name' + i
					this.setState({
						[hobby_type]: hobby.type,
						[hobby_name]: hobby.name					
					})
				}
			)
		}
			

	}

	componentWillMount() {
		this.entrykey = location.search.substring(1)
		axios({
			url: '/d/registration/'+this.entrykey+'?e',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			this.setState({feed:response.data.feed})
			this.initValue()
		}).catch((error) => {
			if (error.response) {
				this.setState({ isError: true, errmsg: error.message })
			}
		})   
	}

	handleDelete(e: InputEvent) {
		e.preventDefault()
		axios({
			// 削除の場合、エントリーキー?r=エントリーID
			url: '/d/registration/' + this.entrykey,
			method: 'delete',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}

		}).then( () => {
			this.setState({isDeleted: true})
		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			} else if (error.response.status === 403) {
				alert('実行権限がありません。ログインからやり直してください。')
				location.href = 'login.html'
			} else {
				this.setState({isError: true,errmsg:error.response.data.feed.title})
			} 
		})
		
	}

	handleSubmit(e:InputEvent){
		e.preventDefault()
		let reqdata = {'feed': {'entry': []}}
		let entry = {}
		// 更新の際に必要となるキー
		entry.link = this.state.feed.entry ? this.state.feed.entry[0].link : ''
		// idを指定すると楽観的排他チェックができる。,の右の数字がリビジョン(更新回数)
		//		entry.id = this.state.feed.entry[0].id
		entry.userinfo = { id : Number(e.target.id.value), email : e.target.email.value }
		entry.favorite = { food : e.target.food.value, music : e.target.music.value }

		entry.hobby = []

		if (this.state.feed.entry&&this.state.feed.entry[0].hobby) {
			this.state.feed.entry[0].hobby.map((row,key) => 
				entry.hobby.push({'type': e.target['hobby_type'+key].value, 'name': e.target['hobby_name'+key].value})
			)
		}
		reqdata.feed.entry.push(entry)
    
		axios({
			url: '/d/registration',
			method: 'put',
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
				alert('実行権限がありません。ログインからやり直してください。')
				location.href = 'login.html'
			} else {
				this.setState({isError: true,errmsg:error.response.data.feed.title})
			} 
		})
	}

	addRow() {
		this.setState((prevState) => ({
			feed: ((prevState) => { 
				if (!prevState.feed.entry[0].hobby) {
					prevState.feed.entry[0].hobby = []
				}
				prevState.feed.entry[0].hobby.push({ type: '', name: '' })
				return prevState.feed				
			})(prevState)
		}))			
	}

	HobbyForm(key:number) {
		const hobby_type = 'hobby_type'+key
		const hobby_name = 'hobby_name'+key
		return(
			<tbody key={key.toString()}>
				<td>
					<Col sm={8}>              
						<FormGroup controlId={hobby_type}>
							<FormControl componentClass="select" placeholder="select" value={this.state[hobby_type]} name={hobby_type} onChange={(e)=>this.handleChange(e)}>
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
							<FormControl type="text" placeholder="hobby" value={this.state[hobby_name]} name={hobby_name} onChange={(e)=>this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>
			</tbody>
		)
	}
  
	handleChange(event:InputEvent) {
		this.setState({ [event.target.name]: event.target.value })
	}

	render() {
		return (
			<Grid>
				<Row>
		    		<a href="#menu-toggle" className="btn btn-default" id="menu-toggle" onClick={this.props.hideSidemenu}><i className="glyphicon glyphicon-menu-hamburger"></i></a>        
				</Row>
				<Row>
					<br/>
				</Row>
				<Row>
					<Col sm={8} >					
						<Form horizontal onSubmit={(e)=>this.handleSubmit(e)}>
							<PageHeader>更新</PageHeader>
							<FormGroup controlId="id">
								<FormControl.Static>ユーザ情報</FormControl.Static>        
								<ControlLabel>ID</ControlLabel>
								<FormControl type="text" placeholder="数字" name="id" value={this.state.id} onChange={(e)=>this.handleChange(e)}/>
							</FormGroup>

							<FormGroup controlId="email">
								<ControlLabel>email</ControlLabel>
								<FormControl type="email" placeholder="email" name="email" value={this.state.email} onChange={(e)=>this.handleChange(e)}/>
							</FormGroup>
							<br />
							<FormGroup controlId="food">
								<FormControl.Static>お気に入り</FormControl.Static>        
								<ControlLabel>好きな食べ物</ControlLabel>
								<FormControl type="text" placeholder="３文字" name="food" value={this.state.food} onChange={(e)=>this.handleChange(e)}/>
							</FormGroup>

							<FormGroup controlId="music">
								<ControlLabel>好きな音楽</ControlLabel>
								<FormControl type="text" placeholder="５文字" name="music" value={this.state.music} onChange={(e)=>this.handleChange(e)}/>
							</FormGroup>

							<ControlLabel>趣味</ControlLabel>
							<table className="table">
								<thead>
									<tr>
										<th>タイプ</th>
										<th>名前</th>
									</tr>
								</thead>
								{this.state.feed.entry&&this.state.feed.entry[0].hobby&&this.state.feed.entry[0].hobby.map((row, key) => this.HobbyForm(key))}
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

							{this.state.isError &&
								<FormGroup>
									<div className="alert alert-danger">
              						データ更新に失敗しました。<br/>
										{this.state.errmsg}
									</div>
								</FormGroup>
							}

							{ this.state.isCompleted &&
								<FormGroup>
									<div>
      								データを更新しました。
									</div>
								</FormGroup>
							}

							{ this.state.isDeleted &&
								<FormGroup>
									<div>
      								データを削除しました。
									</div>
								</FormGroup>
							}
							
							<FormGroup>
								<Col smOffset={2} sm={4}>
									<Button type="submit" className="btn btn-primary">
              						更新
									</Button>
								</Col>
								<Col smOffset={2} sm={4}>
									<Button type="button" className="btn btn-primary" onClick={(e)=>this.handleDelete(e)}>
              						削除
									</Button>
								</Col>
							</FormGroup>
						</Form>
					</Col>  
					<Col sm={4} >
					</Col>  
				</Row>				
			</Grid>
		)
	}
}

//ReactDOM.render(<ItemInput />, document.getElementById('container'))
