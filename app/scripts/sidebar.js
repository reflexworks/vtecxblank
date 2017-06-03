import '../styles/index.css'
import '../styles/sidebar.css'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {
  Button,
  Modal,
  Nav,
  NavItem
} from 'react-bootstrap'
 
class Sidebar extends React.Component {
	render() {
  	return (
    	<Modal className='Sidebar left' show={ this.props.isVisible } onHide={this.props.onHide} 
      	 autoFocus keyboard
      >
      	<Modal.Header closeButton>
        	<Modal.Title>Sidebar Menu</Modal.Title>
        </Modal.Header>
      	<Modal.Body>
      		{ this.props.children }
        </Modal.Body>
      </Modal>
	)
	}
}

Sidebar.propTypes = {
	onHide: PropTypes.func,
	isVisible: PropTypes.boolean,
	children: PropTypes.element
}

class SidebarItems extends React.Component {
	constructor(props, context) {
  	super(props, context)
    
  	this.state = {
		isVisible: false,
	}
	}
  
	updateModal(isVisible) {
  	this.setState({isVisible : isVisible})
		this.forceUpdate()
	}
  
	render() {
  	return (
    	<div className='Sidebar-items'>
      	<Button onClick={ () => this.updateModal(true) }>Display Modal Dialog</Button>
        <Sidebar side='left' isVisible={ this.state.isVisible } onHide={ () => this.updateModal(false) }>
        	<Nav>
          	<NavItem href='#'>Item 1</NavItem>
            <NavItem href='#'>Item 2</NavItem>
            <NavItem href='#'>Item 3</NavItem>
            <NavItem href='#'>Item 4</NavItem>
            <NavItem href='#'>Item 5</NavItem>
          </Nav>
        </Sidebar>
      </div>
	)
	}
}

ReactDOM.render(
  <SidebarItems />,
  document.getElementById('sidebar')
)
