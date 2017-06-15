import React, {Component} from 'react'
import { browserHistory } from 'react-router'

export default class Index extends Component {
	constructor(props) {
  	super(props)
		this.state = {
	    judge: 'page1'
		}
		this.change = this.change.bind(this)
		this.location = this.location.bind(this)
	}

  
	change(e) {
		const activeClass = document.querySelector('.active')
		if (activeClass !== null) {
			activeClass.classList.remove('active')
		}
		let attr = e.target.getAttribute('data-judge')
		e.target.classList.add('active')
		this.setState({
			judge: attr
		})
	}

	location() {
		browserHistory.push(`/template/${this.state.judge}`)
	}

	render() {
		return (
			<main>
				<ul className='page-box'>
					<li data-judge='page1' onClick={this.change} className="page-btn">ページ１</li>
					<li data-judge='page2' onClick={this.change} className="page-btn">ページ２</li>
					<li data-judge='page3' onClick={this.change} className="page-btn">ページ３</li>
				</ul>
				<div onClick={this.location} className="page-enter">ページ遷移</div>
			</main>
		)
	}
}
