/* @flow */
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import VtecxPagination from './vtecx_pagination'
import ConditionInputForm from './demo_conditioninput'
import {
	Table,
	Grid,
	Row,
	Col
} from 'react-bootstrap'
import type {
	InputEvent,
	Props
} from 'demo.types'

type State = {
	feed: any,
	isCompleted: boolean,
	isError: boolean,
	errmsg: string,
	isForbidden: boolean,
	url: string
}

export default class ListItems extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.state = {feed: { entry: [] }, isCompleted: false, isError: false, errmsg: '', isForbidden: false, url: '/d/registration?f&l='+ this.maxDisplayRows }
		this.activePage = 1
	}

	static propTypes = {
		hideSidemenu: PropTypes.func,
		history: PropTypes.any
	}
  
	search(condition:string) {
		this.setState({ url: '/d/registration?f&l=' + this.maxDisplayRows + condition })
	}
   
	getFeed(activePage:number) {
		this.activePage = activePage
		axios({
			url: this.state.url + '&n=' + activePage,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( (response) => {
			// 「response.data.feed」に１ページ分のデータ(1~50件目)が格納されている
			// activePageが「2」だったら51件目から100件目が格納されている
			this.setState({ feed: response.data.feed })
			//			console.log('feed='+JSON.stringify(this.state.feed))
		}).catch((error) => {
			if (error.response) {
				if (error.response.status === 401) {
					this.setState({ isForbidden: true })
				} else if (error.response.status === 403 ) {
					alert('実行権限がありません。。ログインからやり直してください。')
					location.href = 'login.html'
				} else if (error.response.status === 204||error.response.data.feed.title === 'Please make a pagination index in advance.') {
					// pagination indexがまだ作成されていなければ１秒待って再検索
					setTimeout(() => this.getFeed(activePage), 1000)
				} 
			}else {
				this.setState({ isError: true, errmsg: error.message })
			}
		})    
	}
  
	componentDidMount() {
		// 一覧取得
		this.getFeed(1)
	}

	onSelect(e:InputEvent) {
		// 入力画面に遷移
		const itemid = e.currentTarget.id.match(/^\/registration\/(.+),.*$/)
		this.props.history.push('/itemupdate?'+itemid[1])
	}

	viewentry(idx:number,entry:any,key:string) {
		return(
			<tr id={entry.id} key={key} onClick={(e)=>this.onSelect(e)}>
				<td>{idx}</td>
				<td>{entry.userinfo.id}</td>
				<td>{entry.userinfo.email}</td>
				<td>{entry.favorite.food}</td>
				<td>{entry.favorite.music}</td>
			</tr>
		)
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
					<Col sm={9} >
						<ConditionInputForm search={(url) => this.search(url)} />
					</Col>  
					<Col sm={3} >
					</Col>  
				</Row>  
				<Row>
					<Col sm={9} >
						<VtecxPagination
							url={this.state.url}
							onChange={(activePage)=>this.getFeed(activePage)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>
						<Table striped bordered condensed hover className="table" >
							<thead>
								<tr>
									<th>No</th>
									<th>id</th>
									<th>email</th>
									<th>好きな食べ物</th>
									<th>好きな音楽</th>
								</tr>
							</thead>
							<tbody>
								{this.state.feed&&this.state.feed.entry.map((entry, idx) => 
          	     					 entry.userinfo && entry.favorite && 
														this.viewentry(((this.activePage-1)*this.maxDisplayRows)+idx + 1,entry,idx)
								)
								}
								{ this.state.isForbidden &&
														<div className="alert alert-danger">
															<a href="login.html">ログイン</a>を行ってから実行してください。
														</div>
								}

								{ this.state.isError &&
												<div>
													<td className="alert alert-danger">通信エラー</td>
													<td>{this.state.errmsg}</td>
												</div>
								}

							</tbody>
						</Table>
					</Col>  
					<Col sm={3} >
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}

//ReactDOM.render(<ListItems />, document.getElementById('container'))
