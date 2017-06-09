import '../styles/index.css'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReflexPagination from './reflex_pagination'
import {
  Table
} from 'react-bootstrap'
 
class ListItems extends React.Component {
	constructor(props) {
		super(props)
		this.state = {feed:{entry:[]},isCompleted: false,isError: false,errmsg:'',isForbidden: false}
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/registration'
		this.pagination
	}
   
	getFeed() {
		axios({
			url: this.url + '?f&l='+ this.maxDisplayRows + '&n=' + this.pagination.state.activePage,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( (response) => {
      // 「response.data.feed」に１ページ分のデータ(1~50件目)が格納されている
      // activePageが「2」だったら51件目から100件目が格納されている
			this.setState({ feed: response.data.feed })
			console.log('feed='+JSON.stringify(this.state.feed))
		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			}else if (error.data.feed.title === 'Please make a pagination index in advance.') {
				// pagination indexがまだ作成されていなければ１秒待って再検索
      		setTimeout(()=>this.getFeed(), 1000)    
			}else {
	        this.setState({isError: true,errmsg:error.message})
			} 
		})    
	}
  
	componentDidMount() {
      // 一覧取得
		this.getFeed()
	}

	render() {
		return (
		<div>
		<ReflexPagination ref={(c) => { this.pagination = c }} url={this.url} maxDisplayRows={this.maxDisplayRows} maxButtons={5} />
    <Table striped bordered condensed hover>
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
          {this.state.feed.entry.map((entry, idx) => 
          	entry.userinfo && entry.favorite && <Entry idx={idx + 1} entry={entry} key={idx} />)
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
		 </div>
		)
	}
}

Entry.propTypes = {
	idx: PropTypes.number,
	entry: PropTypes.object
}

function Entry(props) {
	return(
          <tr>
            <td>{props.idx}</td>
            <td>{props.entry.userinfo.id}</td>
            <td>{props.entry.userinfo.email}</td>
            <td>{props.entry.favorite.food}</td>
            <td>{props.entry.favorite.music}</td>
          </tr>
	)
}

ReactDOM.render(<ListItems />, document.getElementById('container'))

