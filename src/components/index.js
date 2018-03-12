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
import StaffUpdate from './staff-update'

//倉庫
import WarehouseList from './warehouse-list'
import WarehouseRegistration from './warehouse-registration'
import WarehouseUpdate from './warehouse-update'

//見積書
import QuotationList from './quotation-list'
import QuotationRegistration from './quotation-registration'
import QuotationUpdate from './quotation-update'

//資材
import PackingItemList from './packingitem-list'
import PackingItemRegistration from './packingitem-registration'
import PackingItemUpdate from './packingitem-update'

//資材
import PackingItemTemplateList from './packingitem-template-list'
import PackingItemTemplateRegistration from './packingitem-template-registration'
import PackingItemTemplateUpdate from './packingitem-template-update'

//庫内作業
import InternalWorkList from './internalwork-list'
import InternalWorkRegistration from './internalwork-registration'
import InternalWorkUpdate from './internalwork-update'
//import InternalWorkExUpload from './internalwork-ex-upload'

//請求書
import InvoiceList from './invoice-list'
import InvoiceRegistration from './invoice-registration'
import InvoiceUpdate from './invoice-update'

//配送業者
import ShipmentServiceList from './shipment-service-list'
import ShipmentServiceRegistration from './shipment-service-registration'
import ShipmentServiceUpdate from './shipment-service-update'

//配送料
import DeliveryChargeRegistration from './deliverycharge-registration'

//配送料テンプレート
import DeliveryChargeTemplateRegistration from './deliverycharge-template-registration'
import DeliveryChargeTemplateUpdate from './deliverycharge-template-update'
import DeliveryChargeTemplateList from './deliverycharge-template-list'

//請求先
import BilltoList from './billto-list'
import BilltoRegistration from './billto-registration'
import BilltoUpdate from './billto-update'

//入力保管管理
import TypeAheadList from './typeahead-list'
import TypeAheadRegistration from './typeahead-registration'
import TypeAheadUpdate from './typeahead-update'

//基本条件管理
import BasicConditionList from './basiccondition-list'
import BasicConditionRegistration from './basiccondition-registration'
import BasicConditionUpdate from './basiccondition-update'

//請求データ
//import BillingDataList from './billingdata-list'
import BillingDataUpload from './billingdata-upload'
//import BillingDataRegistration from './billingdata-registration'

//問い合わせ
import InquiryList from './inquiry-list'
import InquiryRegistration from './inquiry-registration'
import InquiryUpdate from './inquiry-update'

//請求先
import BillfromList from './billfrom-list'
import BillfromRegistration from './billfrom-registration'
import BillfromUpdate from './billfrom-update'

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

import {
	getAuthList
} from './common-auth'
import {
	CommonLoginUser
} from './common'

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
			},
			authList: getAuthList()
		}
		this.aushScreenList = []
	}
	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {
		const init = () => {

			this.setState({ isDisabled: true })

			/**
			 * ユーザー情報取得
			 */
			axios({
				url: '/s/get-staff',
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response) => {

				if (response.status !== 204) {
					const staff = response.data.feed.entry[0].staff
					const role = staff.role
					const role_name = (_role) => {
						if (_role === '1') return 'システム管理'
						if (_role === '2') return '上長'
						if (_role === '3') return '作業員'
						if (_role === '4') return '営業'
						if (_role === '5') return '経理'
					}

					// ログインユーザ情報を保存
					CommonLoginUser().set(staff)

					this.userName = (
						<span><Glyphicon glyph="user" /> { staff.staff_name } [ {role_name(role)} ]</span>
					)
					this.userEmail = staff.staff_email
					this.setState({ isDisabled: false, authList: getAuthList(role) })
					this.setAuthList()
				} else {
					this.setState({ isDisabled: false })
				}

			}).catch((error) => {
				this.setState({ isDisabled: false, isError: error })
			})
		}

		init()
	}

	setAuthList() {
		this.aushScreenList = []
		Object.keys(this.state.authList).forEach((_key) => {
			if (this.state.authList[_key] === true) {
				const path = '/' + _key
				this.aushScreenList.push(<Route path={path} component={this[_key]} />)
			}
		})
		this.forceUpdate()
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
	 * コンポーネント：担当者更新
	 */
	StaffUpdate = (props) => {
		return (
			<StaffUpdate 
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
	 * コンポーネント：倉庫更新
	 */
	WarehouseUpdate = (props) => {
		return (
			<WarehouseUpdate 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：資材情報一覧
	 */
	PackingItemList = (props) => {
		return (
			<PackingItemList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：資材情報登録
	 */
	PackingItemRegistration = (props) => {
		return (
			<PackingItemRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：資材情報更新
	 */
	PackingItemUpdate = (props) => {
		return (
			<PackingItemUpdate 
				history={props.history}
			/>
		)
	}


	/**
	 * コンポーネント：資材テンプレート一覧
	 */
	PackingItemTemplateList = (props) => {
		return (
			<PackingItemTemplateList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：資材テンプレート登録
	 */
	PackingItemTemplateRegistration = (props) => {
		return (
			<PackingItemTemplateRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：資材テンプレート登録
	 */
	PackingItemTemplateUpdate = (props) => {
		return (
			<PackingItemTemplateUpdate 
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
	 * コンポーネント：庫内作業更新
	 */
	InternalWorkUpdate = (props) => {
		return (
			<InternalWorkUpdate 
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
	 * コンポーネント：配送業者登録
	 */
	ShipmentServiceRegistration = (props) => {
		return (
			<ShipmentServiceRegistration
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：配送業者更新
	 */
	ShipmentServiceUpdate = (props) => {
		return (
			<ShipmentServiceUpdate
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：配送業者一覧
	 */
	ShipmentServiceList = (props) => {
		return (
			<ShipmentServiceList 
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
	 * コンポーネント：配送料テンプレート登録
	 */
	DeliveryChargeTemplateRegistration = (props) => {
		return (
			<DeliveryChargeTemplateRegistration
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：配送料テンプレート編集
	 */
	DeliveryChargeTemplateUpdate = (props) => {
		return (
			<DeliveryChargeTemplateUpdate
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：配送料テンプレート一覧
	 */
	DeliveryChargeTemplateList = (props) => {
		return (
			<DeliveryChargeTemplateList
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
	 * コンポーネント：請求先情報登録
	 */
	BilltoRegistration = (props) => {
		return (
			<BilltoRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：請求先情報更新
	 */
	BilltoUpdate = (props) => {
		return (
			<BilltoUpdate 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：明細項目一覧
	 */
	TypeAheadList = (props) => {
		return (
			<TypeAheadList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：明細項目登録
	 */
	TypeAheadRegistration = (props) => {
		return (
			<TypeAheadRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：明細項目更新
	 */
	TypeAheadUpdate = (props) => {
		return (
			<TypeAheadUpdate
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：基本条件一覧
	 */
	BasicConditionList = (props) => {
		return (
			<BasicConditionList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：基本条件登録
	 */
	BasicConditionRegistration = (props) => {
		return (
			<BasicConditionRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：基本条件更新
	 */
	BasicConditionUpdate = (props) => {
		return (
			<BasicConditionUpdate
				history={props.history}
			/>
		)
	}
	
	/**
	 * コンポーネント：請求データアップロード
	 */
	BillingDataUpload = (props) => {
		return (
			<BillingDataUpload
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：問い合わせ一覧
	 */
	InquiryList = (props) => {
		return (
			<InquiryList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：問い合わせ登録
	 */
	InquiryRegistration = (props) => {
		return (
			<InquiryRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：問い合わせ更新
	 */
	InquiryUpdate = (props) => {
		return (
			<InquiryUpdate 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：請求元一覧
	 */
	BillfromList = (props) => {
		return (
			<BillfromList 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：請求元情報登録
	 */
	BillfromRegistration = (props) => {
		return (
			<BillfromRegistration 
				history={props.history}
			/>
		)
	}

	/**
	 * コンポーネント：請求元情報更新
	 */
	BillfromUpdate = (props) => {
		return (
			<BillfromUpdate 
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
								<a href="#">logioffice <small>- コネクト顧客管理システム -</small></a>
							</Navbar.Brand>
							<Navbar.Toggle />
						</Navbar.Header>
						<Navbar.Collapse>
							<Nav pullRight>
								<NavDropdown title={this.userName} id="basic-nav-dropdown" pullRight>
									<MenuItem header>{this.userEmail}</MenuItem>	
									<MenuItem divider />
									<MenuItem onClick={ () => this.logout() }>サインアウト</MenuItem>
								</NavDropdown>
							</Nav>
						</Navbar.Collapse>
					</Navbar>

					<SideMenu authList={this.state.authList} visible={this.state.sideMenu.isVisible}></SideMenu>

					<div id="page-content-wrapper">
						<Switch>
							{this.aushScreenList}
							{/*
							<Route path="/CustomerRegistration" component={this.CustomerRegistration} />
							<Route path="/CustomerList" component={this.CustomerList} />
							<Route path="/CustomerUpdate" component={this.CustomerUpdate} />
							<Route path="/StaffRegistration" component={this.StaffRegistration} />
							<Route path="/StaffList" component={this.StaffList} />
							<Route path="/StaffUpdate" component={this.StaffUpdate} />
							<Route path="/WarehouseRegistration" component={this.WarehouseRegistration} />
							<Route path="/WarehouseList" component={this.WarehouseList} />
							<Route path="/WarehouseUpdate" component={this.WarehouseUpdate} />
							<Route path="/PackingItemRegistration" component={this.PackingItemRegistration} />
							<Route path="/PackingItemList" component={this.PackingItemList} />
							<Route path="/PackingItemUpdate" component={this.PackingItemUpdate} />
							<Route path="/PackingItemTemplateRegistration" component={this.PackingItemTemplateRegistration} />
							<Route path="/PackingItemTemplateList" component={this.PackingItemTemplateList} />
							<Route path="/PackingItemTemplateUpdate" component={this.PackingItemTemplateUpdate} />
							<Route path="/InternalWorkRegistration" component={this.InternalWorkRegistration} />
							<Route path="/InternalWorkUpdate" component={this.InternalWorkUpdate} />
							<Route path="/InternalWorkList" component={this.InternalWorkList} />
							<Route path="/QuotationRegistration" component={this.QuotationRegistration} />
							<Route path="/QuotationList" component={this.QuotationList} />
							<Route path="/QuotationUpdate" component={this.QuotationUpdate} />
							<Route path="/InvoiceRegistration" component={this.InvoiceRegistration} />
							<Route path="/InvoiceList" component={this.InvoiceList} />
							<Route path="/InvoiceUpdate" component={this.InvoiceUpdate} />
							<Route path="/ShipmentServiceRegistration" component={this.ShipmentServiceRegistration} />
							<Route path="/ShipmentServiceUpdate" component={this.ShipmentServiceUpdate} />
							<Route path="/ShipmentServiceList" component={this.ShipmentServiceList} />
							<Route path="/DeliveryChargeRegistration" component={this.DeliveryChargeRegistration} />
							<Route path="/DeliveryChargeTemplateRegistration" component={this.DeliveryChargeTemplateRegistration} />
							<Route path="/DeliveryChargeTemplateUpdate" component={this.DeliveryChargeTemplateUpdate} />
							<Route path="/DeliveryChargeTemplateList" component={this.DeliveryChargeTemplateList} />
							<Route path="/BilltoRegistration" component={this.BilltoRegistration} />
							<Route path="/BilltoList" component={this.BilltoList} />
							<Route path="/BilltoUpdate" component={this.BilltoUpdate} />
							<Route path="/TypeAheadRegistration" component={this.TypeAheadRegistration} />
							<Route path="/TypeAheadList" component={this.TypeAheadList} />
							<Route path="/TypeAheadUpdate" component={this.TypeAheadUpdate} />
							<Route path="/BasicConditionRegistration" component={this.BasicConditionRegistration} />
							<Route path="/BasicConditionList" component={this.BasicConditionList} />
							<Route path="/BasicConditionUpdate" component={this.BasicConditionUpdate} />
							<Route path="/BillingDataUpload" component={this.BillingDataUpload} />
							<Route path="/InquiryRegistration" component={this.InquiryRegistration} />
							<Route path="/InquiryList" component={this.InquiryList} />
							<Route path="/InquiryUpdate" component={this.InquiryUpdate} />
							<Route path="/BillfromRegistration" component={this.BillfromRegistration} />
							<Route path="/BillfromList" component={this.BillfromList} />
							<Route path="/BillfromUpdate" component={this.BillfromUpdate} />
							<Route component={this.CustomerRegistration} />
							*/}
						</Switch>
					</div>
				</div>
			</HashRouter>            
		)
	}
}

ReactDOM.render(<MainContainer />, document.getElementById('container'))