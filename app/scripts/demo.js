import '../styles/demo.css'
import '../styles/simple-sidebar.css'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import ListItems from './demo_listitems'
import ItemInput from './demo_iteminput'
import {
	BrowserRouter as Router,
	Route,
	Link,
	Switch,
	Redirect
} from 'react-router-dom'
 
class DemoContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {condition : 'toggled',search:null}    
		this.hideSidemenu = this.hideSidemenu.bind(this)
	}

	hideSidemenu(e){
		e.preventDefault()
		this.setState( { condition : !this.state.condition } )
	} 

	listitems = (props) => {
		return (
			<ListItems 
				hideSidemenu={this.hideSidemenu} 
				history={props.history}
			/>
		)
	}
    
	iteminput = () => {
		return (
			<ItemInput 
				hideSidemenu={this.hideSidemenu}
			/>
		)
	}

	logout() {
		axios({
			url: '/d/?_logout',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( () => {
			location.href = 'login.html'
		}).catch(() => {
			location.href = 'login.html'
		})
	}

	render() {
		return (
			<Router>
				<div id="wrapper" className={this.state.condition ? 'toggled' :''}>

					<div id="sidebar-wrapper">
						<ul className="sidebar-nav">
							<li><Link to="/iteminput">入力</Link></li>
							<li><Link to="/listitems">一覧</Link></li>
							<li><a onClick={ () => this.logout() }>logout</a></li>
						</ul>
					</div>
                        
					<div id="page-content-wrapper">
						<Switch>
							<Route path="/iteminput" component={this.iteminput} />
							<Route path="/listitems" component={this.listitems} />
						</Switch>	
					</div>    
					<Redirect to='/iteminput' />
				</div>      
			</Router>            
		)
	}
}

ReactDOM.render(<DemoContainer />, document.getElementById('container'))

