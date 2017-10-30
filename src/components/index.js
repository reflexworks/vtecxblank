/* @flow */
import '../styles/index.css'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'

import SideMenu from './side-menu'

import CustomerList from './customer-list'
import CustomerRegistration from './customer-registration'
import CustomerUpdate from './customer-update'

import StaffList from './staff-list'
import StaffRegistration from './staff-registration'

import WarehouseList from './warehouse-list'
import WarehouseRegistration from './warehouse-registration'

import ManifestoList from './manifesto-list'
import ManifestoRegistration from './manifesto-registration'

import Internal_workList from './internal_work-list'
import Internal_workRegistration from './internal_work-registration'


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
	Internal_workList = (props) => {
		return (
			<Internal_workList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：庫内作業登録
	 */
	Internal_workRegistration = (props) => {
		return (
			<Internal_workRegistration 
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
							<Route path="/Internal_workRegistration" component={this.Internal_workRegistration} />
							<Route path="/Internal_workList" component={this.Internal_workList} />
							<Route component={this.CustomerRegistration} />
						</Switch>	
					</div>
				</div>
			</HashRouter>            
		)
	}
}

ReactDOM.render(<MainContainer />, document.getElementById('container'))
