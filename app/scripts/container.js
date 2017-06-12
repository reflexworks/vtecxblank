import '../styles/index.css'
import '../styles/simple-sidebar.css'
//import axios from 'axios'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
 
class Container extends React.Component {
	constructor(props) {
		super(props)
		this.state = {condition : 'toggled'}    
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(e){
		e.preventDefault()
		this.setState( { condition : !this.state.condition } )
	} 

	input = () => {
		return (
            <PageContent 
            onClick={this.handleClick}
            />
		)
	}
    
	render() {
		return (
            <Router>
            <div id="wrapper" className={this.state.condition ? 'toggled' :''}>

                <div id="sidebar-wrapper">
                    <ul className="sidebar-nav">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/input">入力</Link></li>
                    <li><Link to="/list">一覧</Link></li>
                    </ul>
                </div>
                        
                <Route exact path="/" component={Index}/>
                <Route path="/input" component={this.input} />
                <Route path="/list" component={List}/>
            </div>      
            </Router>            
		)
	}
}

function List() {
	return (
        <p>List</p>
	)
}

function Index() {
	return (
        <p>Index</p>
	)
}


function PageContent(props) {
	return (
        <a href="#menu-toggle" className="btn btn-default" id="menu-toggle" onClick={props.onClick}><i className="glyphicon glyphicon-menu-hamburger"></i></a>
	)
}

PageContent.propTypes = {
	onClick: PropTypes.func
}

ReactDOM.render(<Container />, document.getElementById('container'))


