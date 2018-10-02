
import * as React from 'react'

import {
	Link,
} from 'react-router-dom'
import {
	Glyphicon
} from 'react-bootstrap'

import {
	CommonBackInternalWork,
	CommonBeforConditions
} from './common'

/* コンポーネントのPropsの型宣言 */
interface SideMenuProps {
	visible: any
	isVisible?: any
	authList: any
}

/* コンポーネントのStateの型宣言 */
interface SideMenuState {
	isVisible?: any
}


export default class SideMenu extends React.Component<SideMenuProps, SideMenuState> {

	private authList: any
	private isChange: boolean
	private list: any
	private master: any

	constructor(props: SideMenuProps) {
		super(props)
		this.state = {
			// 各メニューの初期表示設定(true:する, false:しない)
			isVisible: {
				company: false,				//企業情報
			}
		}

		this.authList = this.props.authList
		this.isChange = false

		this.list = {
			user: [],			//企業情報
			quotation: [],			//見積書、入力補完
			internal_work: [],		//庫内作業
		}

		this.master = {
			UserRegistration: {
				glyph: 'edit',
				title: 'ユーザ登録',
				type: 'user'
			},
			UserList: {
				glyph: 'list',
				title: 'ユーザ一覧',
				type: 'user'
			},

		}

	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps: any) {
		if (!this.isChange) {
			this.authList = newProps.authList
			this.setAuthList()
		}
		this.isChange = true
		this.forceUpdate()
	}

	setAuthList() {
		Object.keys(this.authList).forEach((_key) => {
			if (this.authList[_key] === true) {
				const data = this.master[_key]
				if (data) {
					const type = data.type
					this.list[type].push({
						to: _key,
						glyph: data.glyph,
						title: data.title
					})
				}
			}
		})
	}

	/**
	 * 親メニュー押下時に子メニューを表示/非表示にする
	 *   指定方法
	 *     親メニュー：data-target-child="customer"
	 *     子メニュー：this.state.isVisible.customer
	 * @param {*} e 
	 */
	openClildMenu(e: any) {
		const targetChild = e.target.dataset.targetChild
		const isVisible = this.state.isVisible
		if (targetChild) {
			isVisible[targetChild] = !isVisible[targetChild]
			this.forceUpdate()
		}
	}

	sideMenuListTitle(title: string, key: any) {
		const list = this.list[key]
		if (list && list.length) {
			return (
				<li className="parent-menu">
					<a onClick={(e) => this.openClildMenu(e)} data-target-child={key}>
						{title}
						<Glyphicon className="icon-right" glyph={this.state.isVisible[key] ? 'chevron-down' : 'chevron-right'} />
					</a>
				</li>
			)
		} else {
			return null
		}
	}

	onClick(e: any, _data: any) {
		e.preventDefault()
		CommonBeforConditions().init()
		if (location.hash.indexOf('InternalWorkUpdate') !== -1) {
			CommonBackInternalWork('#/' + _data)
		} else {
			location.hash = '#/' + _data
		}
	}


	sideMenuList(key: any) {
		const list = this.list[key]
		if (list && list.length) {
			const itemlist = list.map((obj: any, i: string) => {
				return (
					<li key={i}><Link onClick={(e) => this.onClick(e, obj.to)} to={obj.to}><Glyphicon glyph={obj.glyph} className="child-menu-icon" />{obj.title}</Link></li>
				)
			})
			const listSizeClass = 's' + list.length + '00'
			return (
				<li className={this.state.isVisible[key] ? 'child-menu' : 'child-menu menu-hide'}>
					<ul className={listSizeClass}>
						{itemlist}
					</ul>
				</li>
			)
		} else {
			return null
		}
	}

	render() {
		return (
			<div className={this.props.visible ? 'side-menu' : 'side-menu side-menu-hide'}>
				<ul>
					{this.sideMenuListTitle('ユーザ管理', 'user')}
					{this.sideMenuList('user')}

				</ul>
			</div>
		)
	}
}

