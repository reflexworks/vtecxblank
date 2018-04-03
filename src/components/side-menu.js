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
import {
	CommonBackInternalWork
} from './common'

export default class SideMenu extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			// 各メニューの初期表示設定(true:する, false:しない)
			isVisible: {
				customer: false,			//顧客、請求、
				master: false,				//担当者、倉庫、配送料、資材
				template: false,			//テンプレート
				quotation: false,			//見積書、入力補完
				internal_work: false,		//庫内作業
				invoice: false				//請求書、請求データ
			}
		}

		this.authList = this.props.authList
		this.isChange = false

		this.list = {
			customer: [],			//顧客、請求、
			master: [],				//担当者、倉庫、配送料、資材
			template: [],			//テンプレート
			quotation: [],			//見積書、入力補完
			internal_work: [],		//庫内作業
			invoice: []				//請求書、請求データ
		}

		this.master = {
			CustomerRegistration: {
				glyph: 'edit',
				title: '顧客登録',
				type: 'customer'
			},
			CustomerList: {
				glyph: 'list',
				title: '顧客一覧',
				type: 'customer'
			},
			BilltoRegistration: {
				glyph: 'edit',
				title: '請求先作成',
				type: 'customer'
			},
			BilltoList: {
				glyph: 'list',
				title: '請求先一覧',
				type: 'customer'
			},
			InquiryRegistration: {
				glyph: 'edit',
				title: '特記事項登録',
				type: 'internal_work'
			},
			InquiryList: {
				glyph: 'list',
				title: '特記事項一覧',
				type: 'internal_work'
			},
			StaffRegistration: {
				glyph: 'edit',
				title: '担当者登録',
				type: 'master'
			},
			StaffList: {
				glyph: 'list',
				title: '担当者一覧',
				type: 'master'
			},
			WarehouseRegistration: {
				glyph: 'edit',
				title: '倉庫登録',
				type: 'master'
			},
			WarehouseList: {
				glyph: 'list',
				title: '倉庫一覧',
				type: 'master'
			},
			PackingItemRegistration: {
				glyph: 'edit',
				title: '資材登録',
				type: 'master'
			},
			PackingItemList: {
				glyph: 'list',
				title: '資材一覧',
				type: 'master'
			},
			ShipmentServiceRegistration: {
				glyph: 'edit',
				title: '配送業者登録',
				type: 'master'
			},
			ShipmentServiceList: {
				glyph: 'list',
				title: '配送業者一覧',
				type: 'master'
			},
			DeliveryChargeTemplateRegistration: {
				glyph: 'edit',
				title: '配送料登録',
				type: 'template'
			},
			DeliveryChargeTemplateList: {
				glyph: 'list',
				title: '配送料一覧',
				type: 'template'
			},
			PackingItemTemplateRegistration: {
				glyph: 'edit',
				title: '資材登録',
				type: 'template'
			},
			PackingItemTemplateList: {
				glyph: 'list',
				title: '資材一覧',
				type: 'template'
			},
			QuotationRegistration: {
				glyph: 'edit',
				title: '見積書作成',
				type: 'quotation'
			}, 
			QuotationList: {
				glyph: 'list',
				title: '見積書一覧',
				type: 'quotation'
			}, 
			TypeAheadRegistration: {
				glyph: 'edit',
				title: '入力補完登録',
				type: 'quotation'
			},
			TypeAheadList: {
				glyph: 'list',
				title: '入力補完一覧',
				type: 'quotation'
			},
			InternalWorkRegistration: {
				glyph: 'edit',
				title: '庫内作業登録',
				type: 'internal_work'
			},
			InternalWorkList: {
				glyph: 'list',
				title: '庫内作業入力'	,
				type: 'internal_work'
			},
			BillfromRegistration: {
				glyph: 'edit',
				title: '請求元作成',
				type: 'invoice'
			},
			BillfromList: {
				glyph: 'list',
				title: '請求元一覧',
				type: 'invoice'
			},
			InvoiceList: {
				glyph: 'list',
				title: '請求書一覧',
				type: 'invoice'
			},
			BillingDataUpload: {
				glyph: 'upload',
				title: '請求データアップロード',
				type: 'invoice'
			}
		}

	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
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
	openClildMenu(e: InputEvent) {
		const targetChild = e.target.dataset.targetChild
		const isVisible = this.state.isVisible
		if (targetChild) {
			isVisible[targetChild] = !isVisible[targetChild]
			this.forceUpdate()
		}
	}

	sideMenuListTitle(title, key) {
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

	onClick(e, _data) {
		e.preventDefault()
		if (location.hash.indexOf('InternalWorkUpdate') !== -1) {
			CommonBackInternalWork('#/' + _data)
		} else {
			location.hash = '#/' + _data
		}
	}

	sideMenuList(key) {
		const list = this.list[key]
		if (list && list.length) {
			const itemlist = list.map((obj, i) => {
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
			<div className={ this.props.visible ? 'side-menu' : 'side-menu side-menu-hide'}>
				<ul>
					{ this.sideMenuListTitle('顧客管理', 'customer') }
					{ this.sideMenuList('customer')}

					{ this.sideMenuListTitle('マスタ管理', 'master') }
					{ this.sideMenuList('master')}

					{ this.sideMenuListTitle('テンプレート管理', 'template') }
					{ this.sideMenuList('template')}

					{ this.sideMenuListTitle('見積管理', 'quotation')}
					{ this.sideMenuList('quotation')}

					{ this.sideMenuListTitle('庫内作業管理', 'internal_work') }
					{ this.sideMenuList('internal_work')}

					{ this.sideMenuListTitle('請求管理', 'invoice') }
					{ this.sideMenuList('invoice')}
					{/*
					{ this.sideMenuListTitle('基本条件管理', 'basic_condition')}
					{ this.sideMenuList('basic_condition',
						[{
							to: 'BasicConditionRegistration',
							glyph: 'edit',
							title: '基本条件登録'
						},{
							to: 'BasicConditionList',
							glyph: 'list',
							title: '基本条件一覧'
						}]
					)}
				*/}
				</ul>
			</div>
		)
	}
}