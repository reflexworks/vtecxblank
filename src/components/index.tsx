
import '../styles/index.css'
import axios from 'axios'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import SideMenu from './side-menu'

import UserList from './user-list'
import UserRegistration from './user-registration'
import UserUpdate from './user-update'

import {
	Route,
	Switch,
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

import {
	getAuthList
} from './common-auth'

/* コンポーネントのPropsの型宣言 */
interface MainContainerProps {
}

/* コンポーネントのStateの型宣言 */
interface MainContainerState {
	isDisabled: boolean
	isError: any
	condition: string
	sideMenu: any
	authList: any
}

class MainContainer extends React.Component<MainContainerProps, MainContainerState> {


	private aushScreenList: any[]
	/**
     *
     * 設定値
     * @param {*} props
     */
	constructor(props: MainContainerProps) {
		super(props)
		this.state = {
			isDisabled: false,
			isError: '',
			condition: 'toggled',
			// サイドメニュー設定
			sideMenu: {
				// 初期表示（true：する, false: しない）
				isVisible: true
			},
			authList: getAuthList()
		}

		this.setAuthList()
	}

	componentWillMount() {
	}

	componentDidMount() {
		this.forceUpdate()
	}

	setAuthList() {
		this.aushScreenList = []
		Object.keys(this.state.authList).forEach((_key: any) => {
			if (this.state.authList[_key] === true) {
				const path = '/' + _key
				this.aushScreenList.push(<Route path={path} component={() => _key} />)
			}
		})
		this.forceUpdate()
	}

	/**
	 * サイドメニューの表示/非表示制御
	 * @param {*} e 
	 */
	hideSidemenu(e: any) {
		e.preventDefault()

		const sideMenu = this.state.sideMenu
		sideMenu.isVisible = !sideMenu.isVisible

		// bodyの幅をサイドメニュー分調整する
		this.setState({ condition: sideMenu.isVisible })

		this.forceUpdate()
	}

	/**
	 * コンポーネント：ユーザ情報一覧
	 */
	UserList = (props: any) => {
		return (
			<UserList
				history={props.history}
				error=''
			/>
		)
	}
	/**
	 * コンポーネント：ユーザ情報登録
	 */
	UserRegistration = (props: any) => {
		return (
			<UserRegistration
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：ユーザ情報更新
	 */
	UserUpdate = (props: any) => {
		return (
			<UserUpdate
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
		}).then(() => {
			location.href = 'login.html'
		}).catch(() => {
			location.href = 'login.html'
		})
	}

	render() {
		return (
			<HashRouter>
				<div id="wrapper" className={this.state.condition ? 'toggled' : ''}>

					<Navbar inverse collapseOnSelect fixedTop>
						<Navbar.Header>
							<Nav>
								<NavItem eventKey={1} href="#menu-toggle" id="menu-toggle" onClick={(e) => this.hideSidemenu(e)}><Glyphicon glyph="menu-hamburger" /></NavItem>
							</Nav>
							<Navbar.Brand>
								<a href="#">vtecxblank</a>
							</Navbar.Brand>
							<Navbar.Toggle />
						</Navbar.Header>
						<Navbar.Collapse>
							<Nav pullRight>
								<NavDropdown eventKey={3} id="basic-nav-dropdown" title="" pullRight>
									<MenuItem divider />
									<MenuItem eventKey={3.2} onClick={() => this.logout()}>サインアウト</MenuItem>
								</NavDropdown>
							</Nav>
						</Navbar.Collapse>
					</Navbar>

					<SideMenu visible={this.state.sideMenu.isVisible} authList={this.state.authList}></SideMenu>

					<div id="page-content-wrapper">
						<Switch>
							<Route path="/UserRegistration" component={this.UserRegistration} />
							<Route path="/UserList" component={this.UserList} />
							<Route path="/UserUpdate" component={this.UserUpdate} />
						</Switch>
					</div>
				</div>
			</HashRouter>
		)
	}
}

ReactDOM.render(<MainContainer />, document.getElementById('container'))