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
				customer: false,
				staff: false,
				warehouse: false,
				manifesto: false,
				internal_work: false,
				work: false,
				quotation: true,
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

	sideMenuListTitle(title, key) {
		return (
			<li className="parent-menu">
				<a onClick={(e) => this.openClildMenu(e)} data-target-child={key}>
					{title}
					<Glyphicon className="icon-right" glyph={this.state.isVisible[key] ? 'chevron-down' : 'chevron-right'} />
				</a>
			</li>
		)
	}
	sideMenuList(key, list) {
		const itemlist = list.map((obj, i) => {
			return (
				<li key={i}><Link to={obj.to}><Glyphicon glyph={obj.glyph} className="child-menu-icon" />{obj.title}</Link></li>
			)
		})
		return (
			<li className={this.state.isVisible[key] ? 'child-menu' : 'child-menu menu-hide'}>
				<ul>
					{itemlist}
				</ul>
			</li>
		)
	}

	render() {
		return (
			<div className={ this.props.visible ? 'side-menu' : 'side-menu side-menu-hide'}>
				<ul>
					{ this.sideMenuListTitle('顧客管理', 'customer') }
					{ this.sideMenuList('customer',
						[{
							to: 'CustomerRegistration',
							glyph: 'edit',
							title: '顧客登録'
						},{
							to: 'CustomerList',
							glyph: 'list',
							title: '顧客一覧'
						}]
					)}
					{ this.sideMenuListTitle('担当者管理', 'staff') }
					{ this.sideMenuList('staff',
						[{
							to: 'StaffRegistration',
							glyph: 'edit',
							title: '担当者登録'
						},{
							to: 'StaffList',
							glyph: 'list',
							title: '担当者一覧'
						}]
					)}
					{ this.sideMenuListTitle('倉庫管理', 'warehouse') }
					{ this.sideMenuList('warehouse',
						[{
							to: 'WarehouseRegistration',
							glyph: 'edit',
							title: '倉庫登録'
						},{
							to: 'WarehouseList',
							glyph: 'list',
							title: '倉庫一覧'
						}]
					)}
					{ this.sideMenuListTitle('資材管理', 'manifesto') }
					{ this.sideMenuList('manifesto',
						[{
							to: 'ManifestoRegistration',
							glyph: 'edit',
							title: '資材登録'
						},{
							to: 'ManifestoList',
							glyph: 'list',
							title: '資材一覧'
						}]
					)}
					{ this.sideMenuListTitle('庫内作業管理', 'internal_work') }
					{ this.sideMenuList('internal_work',
						[{
							to: 'InternalWorkRegistration',
							glyph: 'edit',
							title: '庫内作業登録'
						},{
							to: 'InternalWorkList',
							glyph: 'list',
							title: '庫内作業一覧'
						}]
					)}
					{ this.sideMenuListTitle('業務管理', 'work') }
					{ this.sideMenuList('work',
						[{
							to: 'WorkRegistration',
							glyph: 'edit',
							title: '業務登録'
						},{
							to: 'WorkList',
							glyph: 'list',
							title: '業務一覧'
						}]
					)}
					{ this.sideMenuListTitle('見積書管理', 'quotation') }
					{ this.sideMenuList('quotation',
						[{
							to: 'QuotationRegistration',
							glyph: 'edit',
							title: '見積書作成'
						},{
							to: 'QuotationList',
							glyph: 'list',
							title: '見積書一覧'
						}]
					)}
				</ul>
			</div>
		)
	}
}