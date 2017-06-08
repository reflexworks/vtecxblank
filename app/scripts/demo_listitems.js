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

//		this.state = { feed: {entry: [{userinfo:{id:123,email:'aaa@bbb'},favorite:{food:'りんご',music:'ジャズ'}},{userinfo:{id:123,email:'aaa@bbb'},favorite:{food:'りんご',music:'ジャズ'}}]}}     
		this.state = {feed:{entry:[]},isCompleted: false,isError: false,errmsg:'',isForbidden: false}
		this.handleSubmit = this.handleSubmit.bind(this)
	}
 
	componentDidMount() {
		axios({
			url: '/d/registration?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( (response) => {
			this.setState({feed : response.data.feed})
		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			} else {
				this.setState({isError: true,errmsg:error.message})
			} 
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
          { this.state.feed.entry.map((entry,idx) => <Entry idx={idx+1} entry={entry} key={idx}/>)}        
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
