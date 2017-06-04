import '../styles/index.css'
import '../styles/simple-sidebar.css'
//import axios from 'axios'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Grid,
  Col,
  Row
} from 'react-bootstrap'
 
class Container extends React.Component {
	constructor(props) {
		super(props)
		this.state = {condition : ''}    
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(e){
		e.preventDefault()
		this.setState( { condition : !this.state.condition } )
	} 
  
	render() {
		return (
      <div id="wrapper" className={this.state.condition ? 'toggled' :''}>
          <Sidebar />
          <PageContent onClick={this.handleClick}/>
      </div>      
		)
	}
}

function Sidebar() {
	return (
        <div id="sidebar-wrapper">
            <ul className="sidebar-nav">
                <li className="sidebar-brand">
                    <a href="#">
                        Start Bootstrap
                    </a>
                </li>
                <li>
                    <a href="#">Dashboard</a>
                </li>
                <li>
                    <a href="#">Shortcuts</a>
                </li>
                <li>
                    <a href="#">Overview</a>
                </li>
                <li>
                    <a href="#">Events</a>
                </li>
                <li>
                    <a href="#">About</a>
                </li>
                <li>
                    <a href="#">Services</a>
                </li>
                <li>
                    <a href="#">Contact</a>
                </li>
            </ul>
        </div>
	)
}

function PageContent(props) {
	return (
        <div id="page-content-wrapper">
            <Grid fluid="true">
                <Row>
                    <Col sm={12}>
                        <h1>Simple Sidebar</h1>
                        <p>This template has a responsive menu toggling system. The menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens. When toggled using the button below, the menu will appear/disappear. On small screens, the page content will be pushed off canvas.</p>
                        <p>Make sure to keep all page content within the <code>#page-content-wrapper</code>.</p>
                        <a href="#menu-toggle" className="btn btn-default" id="menu-toggle" onClick={props.onClick}>Toggle Menu</a>
                    </Col>
                </Row>
            </Grid>
        </div>    
	)
}

PageContent.propTypes = {
	onClick: PropTypes.func
}

ReactDOM.render(<Container />, document.getElementById('container'))
