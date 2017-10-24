/* @flow */
import React from 'react'

import {
	Link,
} from 'react-router-dom'
import {
	Glyphicon
} from 'react-bootstrap'
import type {
	InputEvent
} from 'demo.types'

export default class SideMenu extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			// 各メニューの初期表示設定(true:する, false:しない)
			isVisible: {
				customer: true,
				order: true
			}
		}
	}

	/**
	 * 親メニュー押下時に子メニューを表示/非表示にする
	 *   指定方法
	 *     親メニュー：data-target-child="customer"
	 *     子メニュー：this.state.isVisible.customer
	 * @param {*} e 
	 */
	openClildMenu(e: InputEvent) {
		const targetChild = e.target.dataset.targetChild
		const isVisible = this.state.isVisible
		if (targetChild) {
			isVisible[targetChild] = !isVisible[targetChild]
			this.forceUpdate()
		}
	}

	render() {
		return (
			<div className={ this.props.visible ? 'side-menu' : 'side-menu side-menu-hide'}>
				<ul>
					<li className="parent-menu">
						<a onClick={(e) => this.openClildMenu(e)} data-target-child="customer">
							顧客管理
							<Glyphicon className="icon-right" glyph={this.state.isVisible.customer ? 'chevron-down' : 'chevron-right'} />
						</a>
					</li>
					<li className={this.state.isVisible.customer ? 'child-menu' : 'child-menu menu-hide'}>
						<ul>
							<li><Link to="CustomerRegistration"><Glyphicon glyph="edit" className="child-menu-icon" />顧客登録</Link></li>
							<li><Link to="CustomerList"><Glyphicon glyph="list" className="child-menu-icon" />顧客一覧</Link></li>
						</ul>
					</li>
				</ul>
			</div>
		)
	}
}
