import '../styles/index.css'
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
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
 
class Input extends React.Component {
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

		axios.defaults.withCredentials = true // cookies
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
  
	render() {
		return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <PageHeader>新規登録</PageHeader>
        <FormGroup controlId="id">
          <FormControl.Static>ユーザ情報</FormControl.Static>        
          <Col sm={12}>
            <ControlLabel>ID</ControlLabel>
            <FormControl type="text" placeholder="数字" />
          </Col>
        </FormGroup>

        <FormGroup controlId="email">
          <Col sm={12}>
            <ControlLabel>email</ControlLabel>
            <FormControl type="email" placeholder="email" />
          </Col>
        </FormGroup>
        <br />
        <FormGroup controlId="food">
          <FormControl.Static>お気に入り</FormControl.Static>        
          <Col sm={12}>
            <ControlLabel>好きな食べ物</ControlLabel>
            <FormControl type="text" placeholder="３文字" />
          </Col>
        </FormGroup>

        <FormGroup controlId="music">
          <Col sm={12}>
            <ControlLabel>好きな音楽</ControlLabel>
            <FormControl type="text" placeholder="５文字" />
          </Col>
        </FormGroup>

          <Col sm={12}>
            <ControlLabel>趣味</ControlLabel>
          </Col>
            <table className="table">
            <thead>
              <tr>
                <th>タイプ</th>
                <th>名前</th>
              </tr>
            </thead>
               {this.state.rows.map(row => <HobbyForm row={row} key={row.toString()}/>)}
      			</table>

        <FormGroup>
          <Col sm={12}>
            <Button className="btn btn-default" onClick={() => this.addRow() }>
              <Glyphicon glyph="plus" />
            </Button>
          </Col>
        </FormGroup>

        <br/>
        { this.state.isForbidden &&
        <FormGroup>
          <Col sm={12}>
            <div className="alert alert-danger">
              <a href="login.html">ログイン</a>を行ってから実行してください。
            </div>
          </Col>
        </FormGroup>
        }

        { this.state.isError &&
        <FormGroup>
          <Col sm={12}>
            <div className="alert alert-danger">
              データ登録に失敗しました。<br/>
              {this.state.errmsg}
            </div>
          </Col>
        </FormGroup>
        }

        { this.state.isCompleted &&
        <FormGroup>
          <Col sm={12}>
            <div>
      				データを登録しました。
            </div>
          </Col>
        </FormGroup>
        }

        <FormGroup>
          <Col smOffset={4} sm={10}>
            <Button type="submit" className="btn btn-primary">
              登録
            </Button>
          </Col>
        </FormGroup>

      </Form>
		)
	}
}

HobbyForm.propTypes = {
	row: PropTypes.number
}

function HobbyForm(props) {
	const hobby_type = 'hobby_type'+props.row
	const hobby_name = 'hobby_name'+props.row
	return(
            <tbody>
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

ReactDOM.render(<Input />, document.getElementById('container'))
