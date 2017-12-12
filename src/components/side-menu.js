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
				customer: false,			//請求、顧客、問い合わせ
				master: false,				//担当者、倉庫、配送料
				internal_work: false,		//庫内作業、資材
				quotation: false,			//見積書
				invoice: false,				//請求書、請求データ
				//BasicCondition: false,		//基本条件
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
		const listSizeClass = 's' + list.length + '00'
		return (
			<li className={this.state.isVisible[key] ? 'child-menu' : 'child-menu menu-hide'}>
				<ul className={listSizeClass}>
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
						},{
							to: 'BilltoRegistration',
							glyph: 'edit',
							title: '請求先作成'
						},{
							to: 'BilltoList',
							glyph: 'list',
							title: '請求先一覧'	
						},{
							to: 'InquiryRegistration',
							glyph: 'edit',
							title: '問い合わせ記録'
						},{
							to: 'InquiryList',
							glyph: 'list',
							title: '問い合わせ一覧'
						}]
					)}

					{ this.sideMenuListTitle('マスタ管理', 'master') }
					{this.sideMenuList('master',
						[{
							to: 'StaffRegistration',
							glyph: 'edit',
							title: '担当者登録'
						}, {
							to: 'StaffList',
							glyph: 'list',
							title: '担当者一覧'
						}, {
							to: 'WarehouseRegistration',
							glyph: 'edit',
							title: '倉庫登録'
						}, {
							to: 'WarehouseList',
							glyph: 'list',
							title: '倉庫一覧'
						},{
							to: 'ShipmentServiceRegistration',
							glyph: 'edit',
							title: '配送業者登録'
						},{
							to: 'ShipmentServiceList',
							glyph: 'list',
							title: '配送業者一覧'
						},{
							to: 'DeliveryChargeRegistration',
							glyph: 'edit',
							title: '配送料登録'
						},{
							to: 'DeliveryChargeList',
							glyph: 'list',
							title: '配送料一覧'	
						}]
					)}
					{ this.sideMenuListTitle('庫内作業管理', 'internal_work') }
					{this.sideMenuList('internal_work',
						[{
							to: 'InternalWorkList',
							glyph: 'list',
							title: '庫内作業一覧'
						}, {
							to: 'PackingItemRegistration',
							glyph: 'edit',
							title: '資材登録'
						},{
							to: 'PackingItemList',
							glyph: 'list',
							title: '資材一覧'	
						}]
					)}

					{ this.sideMenuListTitle('見積書管理', 'quotation') }
					{this.sideMenuList('quotation',
						[{
							to: 'QuotationRegistration',
							glyph: 'edit',
							title: '見積書作成'
						}, {
							to: 'QuotationList',
							glyph: 'list',
							title: '見積書一覧'
						}, {
							to: 'TypeAheadRegistration',
							glyph: 'edit',
							title: '入力補完登録'
						},{
							to: 'TypeAheadList',
							glyph: 'list',
							title: '入力補完一覧'
						}]
					)}
					{ this.sideMenuListTitle('請求管理', 'invoice') }
					{ this.sideMenuList('invoice',
						[{
							to: 'InvoiceRegistration',
							glyph: 'edit',
							title: '請求書作成'
						}, {
							to: 'InvoiceList',
							glyph: 'list',
							title: '請求書一覧'
						},{
							to: 'BillingDataUpload',
							glyph: 'upload',
							title: '請求データアップロード'
						},{
							to: 'BillingDataList',
							glyph: 'list',
							title: '請求データ一覧'
						}]
					)}
					{/*
					{this.sideMenuListTitle('基本条件管理', 'basiccondition')}
					{ this.sideMenuList('basiccondition',
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