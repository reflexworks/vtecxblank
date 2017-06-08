import '../styles/index.css'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {
  Table
} from 'react-bootstrap'
 
class ListItems extends React.Component {
	constructor(props) {
		super(props)
		this.state = {feed:{entry:[]},isCompleted: false,isError: false,errmsg:'',isForbidden: false}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.pageIndex = 0         // ページネーションを貼る最大index
		this.maxDisplayNum = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.maxPageIndex = 9      // pageIndexにおける最大表示件数-1
	}
 
/****
 * ページネーションのIndex設定処理
 * url ページネーションを設定するURL
 * page 取得したいページ
 *****/
	buildIndex(url, page) {
		return new Promise((resolve, reject) => {

      // ページング取得に必要な設定を行う
			let param
			let pageIndex = page + this.maxPageIndex > this.pageIndex ? page + this.maxPageIndex : this.pageIndex
			if (pageIndex > this.pageIndex) {
				if (this.pageIndex > 1) {
					param = this.pageIndex + ',' + pageIndex
				} else {
					param = pageIndex
				}

        // サーバにページネーション設定リクエストを送信
				axios({
					url: url + '?f&l=' + this.maxDisplayNum + '&_pagination=' + param,
					method: 'get',
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					}
				}).then((response) => {
					this.pageIndex = pageIndex
					resolve(response)
				}).catch((error) => {
					reject(error)
				})
        
			} else {
				resolve()
			}
		})
	}
  
	getFeed(url, pageNo) {
		axios({
			url: url + '?f&l='+ this.maxDisplayNum + '&n=' + pageNo,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( (response) => {
      // 「response.data.feed」にurlの1件目から50件目が格納されている
      // pageNoが「2」だったら51件目から100件目が格納されている
			this.setState({ feed: response.data.feed })
			console.log('feed='+JSON.stringify(this.state.feed))
		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			}else if (error.data.feed.title === 'Please make a pagination index in advance.') {
      		setTimeout(()=>this.getFeed(url,pageNo), 1000)    
			}else {
	        this.setState({isError: true,errmsg:error.message})
			} 
		})    
	}
  
	componentDidMount() {
    
     // ページネーション設定を行う
		const url = '/d/registration'

    // 1ページ目（1〜50件）を取得する（これを2にすれば51から100までを取得する）
		const pageNo = 1

    // pageIndex作成処理呼び出し
		this.buildIndex(url, pageNo).then(()=>{
      // 一覧取得
			this.getFeed(url, pageNo)
		})
	}

	handleSubmit(e){
		e.preventDefault()
	}
  
	render() {
		return (
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
