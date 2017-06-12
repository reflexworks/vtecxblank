import '../styles/index.css'
import '../styles/simple-sidebar.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
 
class RouterSample extends React.Component {
	constructor(props) {
		super(props)
	}
  
	render() {
		return (
            <Router>
                <div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/input">About</Link></li>
                    <li><Link to="/list">Topics</Link></li>
                </ul>

                <hr/>

                <Route exact path="/" component={Index}/>
                <Route path="/input" component={Input}/>
                <Route path="/list" component={List}/>
                </div>
            </Router>            
	    )
	}
}

function Input() {
	return (
        <p>Input</p>
	)
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

ReactDOM.render(<RouterSample />, document.getElementById('container'))

