/* @flow */
import '../styles/index.css'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'

import SideMenu from './side-menu'

//顧客
import CustomerList from './customer-list'
import CustomerRegistration from './customer-registration'
import CustomerUpdate from './customer-update'

//担当者
import StaffList from './staff-list'
import StaffRegistration from './staff-registration'

//倉庫
import WarehouseList from './warehouse-list'
import WarehouseRegistration from './warehouse-registration'

//見積書
import QuotationList from './quotation-list'
import QuotationRegistration from './quotation-registration'
import QuotationUpdate from './quotation-update'

//資材
import ManifestoList from './manifesto-list'
import ManifestoRegistration from './manifesto-registration'

//庫内作業
import InternalWorkList from './internalwork-list'
import InternalWorkRegistration from './internalwork-registration'

//業務
import WorkList from './work-list'
import WorkRegistration from './work-registration'

//請求書
import InvoiceList from './invoice-list'
import InvoiceRegistration from './invoice-registration'
import InvoiceUpdate from './invoice-update'

//配送料
import DeliveryChargeList from './deliverycharge-list'
import DeliveryChargeRegistration from './deliverycharge-registration'

//請求先
import BilltoList from './billto-list'
import BilltoRegistration from './billto-registration'


import {
//	BrowserRouter as Router,
	Route,
	Switch,
	//	Redirect,
	HashRouter
} from 'react-router-dom'
import {
	Navbar,
	Nav,
	NavItem,
	NavDropdown,
	MenuItem,
	Glyphicon
} from 'react-bootstrap'
import type {
	InputEvent
} from 'demo.types'

class MainContainer extends React.Component {

	/**
	 * 設定値
	 * @param {*} props 
	 */
	constructor(props) {
		super(props)

		this.state = {
			condition: 'toggled',
			search: null,
			// サイドメニュー設定
			sideMenu: {
				// 初期表示（true：する, false: しない）
				isVisible: true
			}
		}
	}

	/**
	 * サイドメニューの表示/非表示制御
	 * @param {*} e 
	 */
	hideSidemenu(e: InputEvent) {

		e.preventDefault()

		const sideMenu = this.state.sideMenu
		sideMenu.isVisible = !sideMenu.isVisible

		// bodyの幅をサイドメニュー分調整する
		this.setState({condition: sideMenu.isVisible})

		this.forceUpdate()
	}

	/**
	 * コンポーネント：顧客一覧
	 */
	CustomerList = (props) => {
		return (
			<CustomerList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：顧客登録
	 */
	CustomerRegistration = (props) => {
		return (
			<CustomerRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：顧客更新
	 */
	CustomerUpdate = (props) => {
		return (
			<CustomerUpdate 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：担当者一覧
	 */
	StaffList = (props) => {
		return (
			<StaffList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：担当者登録
	 */
	StaffRegistration = (props) => {
		return (
			<StaffRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：倉庫一覧
	 */
	WarehouseList = (props) => {
		return (
			<WarehouseList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：倉庫登録
	 */
	WarehouseRegistration = (props) => {
		return (
			<WarehouseRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：資材一覧
	 */
	ManifestoList = (props) => {
		return (
			<ManifestoList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：資材登録
	 */
	ManifestoRegistration = (props) => {
		return (
			<ManifestoRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：庫内作業一覧
	 */
	InternalWorkList = (props) => {
		return (
			<InternalWorkList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：庫内作業登録
	 */
	InternalWorkRegistration = (props) => {
		return (
			<InternalWorkRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：業務情報一覧
	 */
	WorkList = (props) => {
		return (
			<WorkList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：業務情報登録
	 */
	WorkRegistration = (props) => {
		return (
			<WorkRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：見積書一覧
	 */
	QuotationList = (props) => {
		return (
			<QuotationList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：見積書作成
	 */
	QuotationRegistration = (props) => {
		return (
			<QuotationRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：見積書更新
	 */
	QuotationUpdate = (props) => {
		return (
			<QuotationUpdate 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：請求書一覧
	 */
	InvoiceList = (props) => {
		return (
			<InvoiceList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：請求書作成
	 */
	InvoiceRegistration = (props) => {
		return (
			<InvoiceRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：請求書更新
	 */
	InvoiceUpdate = (props) => {
		return (
			<InvoiceUpdate 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：配送料登録
	 */
	DeliveryChargeRegistration = (props) => {
		return (
			<DeliveryChargeRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：配送料一覧
	 */
	DeliveryChargeList = (props) => {
		return (
			<DeliveryChargeList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：請求先登録
	 */
	BilltoRegistration = (props) => {
		return (
			<BilltoRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：請求先一覧
	 */
	BilltoList = (props) => {
		return (
			<BilltoList 
				history={props.history}
			/>
		)
	}

	/**
	 * ログアウト処理
	 */
	logout() {
		axios({
			url: '/d/?_logout',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( () => {
			location.href = 'login.html'
		}).catch(() => {
			location.href = 'login.html'
		})
	}

	render() {
	
		return (
			<HashRouter>
				<div id="wrapper" className={this.state.condition ? 'toggled' :''}>

					<Navbar inverse collapseOnSelect fixedTop>
						<Navbar.Header>
							<Nav>
								<NavItem eventKey={1} href="#menu-toggle" id="menu-toggle" onClick={ (e) => this.hideSidemenu(e) }><Glyphicon glyph="menu-hamburger" /></NavItem>
							</Nav>
							<Navbar.Brand>
								<a href="#">logioffice <small>- 物流向け販売管理システム -</small></a>
							</Navbar.Brand>
							<Navbar.Toggle />
						</Navbar.Header>
						<Navbar.Collapse>
							<Nav pullRight>
								<NavDropdown eventKey={3} title="UserName" id="basic-nav-dropdown" pullRight>
									<MenuItem eventKey={3.1}>設定</MenuItem>
									<MenuItem divider />
									<MenuItem eventKey={3.2} onClick={ () => this.logout() }>サインアウト</MenuItem>
								</NavDropdown>
							</Nav>
						</Navbar.Collapse>
					</Navbar>

					<SideMenu visible={this.state.sideMenu.isVisible}></SideMenu>

					<div id="page-content-wrapper">
						<Switch>
							<Route path="/CustomerRegistration" component={this.CustomerRegistration} />
							<Route path="/CustomerList" component={this.CustomerList} />
							<Route path="/CustomerUpdate" component={this.CustomerUpdate} />
							<Route path="/StaffRegistration" component={this.StaffRegistration} />
							<Route path="/StaffList" component={this.StaffList} />
							<Route path="/WarehouseRegistration" component={this.WarehouseRegistration} />
							<Route path="/WarehouseList" component={this.WarehouseList} />
							<Route path="/ManifestoRegistration" component={this.ManifestoRegistration} />
							<Route path="/ManifestoList" component={this.ManifestoList} />
							<Route path="/InternalWorkRegistration" component={this.InternalWorkRegistration} />
							<Route path="/InternalWorkList" component={this.InternalWorkList} />
							<Route path="/WorkRegistration" component={this.WorkRegistration} />
							<Route path="/WorkList" component={this.WorkList} />
							<Route path="/QuotationRegistration" component={this.QuotationRegistration} />
							<Route path="/QuotationList" component={this.QuotationList} />
							<Route path="/QuotationUpdate" component={this.QuotationUpdate} />
							<Route path="/InvoiceRegistration" component={this.InvoiceRegistration} />
							<Route path="/InvoiceList" component={this.InvoiceList} />
							<Route path="/InvoiceUpdate" component={this.InvoiceUpdate} />
							<Route path="/DeliveryChargeRegistration" component={this.DeliveryChargeRegistration} />
							<Route path="/DeliveryChargeList" component={this.DeliveryChargeList} />
							<Route path="/BilltoRegistration" component={this.BilltoRegistration} />
							<Route path="/BilltoList" component={this.BilltoList} />	
							<Route component={this.CustomerRegistration} />
						</Switch>	
					</div>
				</div>
			</HashRouter>            
		)
	}
}

ReactDOM.render(<MainContainer />, document.getElementById('container'))
