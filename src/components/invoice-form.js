/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form,
	PanelGroup,
	Panel,
	FormGroup,
	FormControl,
	Tabs,
	Tab,
	Button,
	Glyphicon,
	Table,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	BillfromAddModal,
	BillfromEditModal,
} from './billfrom-modal'
import {
	CommonInputText,
	CommonTable,
	CommonRadioBtn,
	CommonFilterBox,
	CommonPrefecture,
	CommonMonthlySelect,
} from './common'

export default class InvoiceForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			showBillfromAddModal: false,
			showBillfromEditModal: false,
			selectCustomer: '',
			selectQuotation: '',
			selectInternalWorkYearMonth:'',
		}

		this.entry = this.props.entry

		this.entry = this.props.entry
		this.entry.invoice = this.entry.invoice || {}
		this.entry.billto = this.entry.billto || {}
		this.entry.billfrom = this.entry.billfrom || {}
		this.entry.billfrom.payee = this.entry.billfrom.payee || []
		this.entry.contact_information = this.entry.contact_information || {}
		this.entry.item_details = this.entry.item_details || []
		this.item_details = this.item_details || []
		this.entry.remarks = this.entry.remarks || []
		this.master = {
			customerList: [],
			billfromList: [],
			internalWorkYearMonthList: [],
		}

		this.address = ''

		this.taxationList=[{
			label: '税込',
			value: '0'
		}, {	
			label: '税抜',
			value: '1'
		}]
		
		this.bankList = [{
			label: 'みずほ銀行',
			value: '1',
		}, {
			label: '三菱東京UFJ銀行',
			value: '2',
		}, {
			label: '三井住友銀行',
			value: '3',
		}, {
			label: 'りそな銀行',
			value: '4',
		}, {
			label: '埼玉りそな銀行',
			value: '5',
		}, {
			label: '楽天銀行',
			value: '6',
		}, {
			label: 'ジャパンネット銀行',
			value: '7',
		}, {
			label: '巣鴨信用金庫',
			value: '8',
		}, {
			label: '川口信用金庫',
			value: '9',
		}, {
			label: '東京都民銀行',
			value: '10',
		}, {
			label: '群馬銀行',
			value: '11',
		}]
		
		this.bankTypeList = [{
			label: '普通',
			value: '0',
		}, {
			label: '当座',
			value: '1',
		}]

		this.zoneArray = ['南九州', '北九州', '四国', '中国', '関西', '北陸', '東海', '信越', '関東', '南東北', '北東北', '北海道', '沖縄']
		this.deliverySize = ['60', '80', '100', '120', '140', '160']

	}
	
	componentWillMount() {
		this.sampleData()
		this.getService()
		
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
		this.address = this.entry.contact_information.prefecture + this.entry.contact_information.address1 + this.entry.contact_information.address2
		this.setCustomerMasterData()
		this.setBillfromMasterData()
		this.setInternalWorkYearMonthList()
		this.sortItemDetails()
	}
	
	/**
	 * /d/で登録されているitem_detailsをカテゴリ毎に振り分ける
	 */
	sortItemDetails() {
		if (this.entry.item_details) {
			for (let i = 0; i < this.entry.item_details.length; ++i) {
				switch (this.entry.item_details[i].category) {
				case 'monthly':
					if (!this.item_details.monthly) {
						this.item_details.monthly = []
					}
					this.item_details.monthly[this.item_details.monthly.length] = this.entry.item_details[i]
					break
				case 'daily':
					if (!this.item_details.daily) {
						this.item_details.daily = []
					}
	
					this.item_details.daily[this.item_details.daily.length] = this.entry.item_details[i]
					break
				case 'packing_item':
					if (!this.item_details.packing_item) {
						this.item_details.packing_item = []
					}
					this.item_details.packing_item[this.item_details.packing_item.length] = this.entry.item_details[i]
					break
				case 'delivery_charge_shipping':
					if (!this.item_details.delivery_charge_shipping) {
						this.item_details.delivery_charge_shipping = []
					}
					this.item_details.delivery_charge_shipping[this.item_details.delivery_charge_shipping.length] = this.entry.item_details[i]
					break
				case 'delivery_charge_collecting':
					if (!this.item_details.delivery_charge_collecting) {
						this.item_details.delivery_charge_collecting = []
					}
					this.item_details.delivery_charge_collecting[this.item_details.delivery_charge_collecting.length] = this.entry.item_details[i]
					break
					
				case 'others':
					if (!this.item_details.others) {
						this.item_details.others = []
					}
					this.item_details.others[this.item_details.others.length] = this.entry.item_details[i]
					break	
				}
			}
		}
	}

	/**
	 * サービスで受け取ったitem_detailsを取得後、カテゴリ毎に振り分ける
	 */
	getService() {
		this.setState({ isDisabled: true })

		//item_details
		axios({
			url: '/s/invoice',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {
				if (response.data.feed.entry[0].item_details) {
					for (let i = 0; i < response.data.feed.entry[0].item_details.length; ++i) {
						switch (response.data.feed.entry[0].item_details[i].category) {
						case 'monthly':
							if (!this.monthly) {
								this.monthly = []
							}
							this.monthly[this.monthly.length] = response.data.feed.entry[0].item_details[i]
							break
						case 'daily':
							if (!this.daily) {
								this.daily = []
							}
							this.daily[this.daily.length] = response.data.feed.entry[0].item_details[i]
							break
						case 'packing_item':
							if (!this.packing_item) {
								this.packing_item = []
							}
							this.packing_item[this.packing_item.length] = response.data.feed.entry[0].item_details[i]
							break
						case 'delivery_charge_shipping':
							if (!this.delivery_charge_shipping) {
								this.delivery_charge_shipping = []
							}
							this.delivery_charge_shipping[this.delivery_charge_shipping.length] = response.data.feed.entry[0].item_details[i]
							break
						case 'delivery_charge_collecting':
							if (!this.delivery_charge_collecting) {
								this.delivery_charge_collecting = []
							}
							this.delivery_charge_collecting[this.delivery_charge_collecting.length] = response.data.feed.entry[0].item_details[i]
							break
						
						case 'others':
							if (!this.entry.item_details) {
								this.entry.item_details = []
							}
							this.entry.item_details[this.entry.item_details.length] = response.data.feed.entry[0].item_details[i]
							break
						}
					}
				}
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
		
		/* 請求データ用
		axios({
			url: '/s/billingdetails',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			console.log(response)
		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
		*/
	}

	getHead() {
		let head = []
		head.push(<th aling="middle"></th>)

		this.zoneArray.map((_value) => {
			head.push(<th colspan="3" align="middle" margin="20px">{_value}</th>)
		})

		head.push(<th></th>)
		head.push(<th align="middle">合計</th>)	

		return head
	}
	getBody() {
		let body = []

		body.push(<td align="middle">サイズ</td>)

		this.zoneArray.map(() => {
			body.push(<td align="middle" >個数</td>)
			body.push(<td align="middle" >単価</td>)
			body.push(<td align="middle" >小計</td>)
		})

		body.push(<td  align="middle">総個数</td>)
		body.push(<td  align="middle">金額</td>)

		return body
	}

	getEtrTotal() {
		let etr = []
		this.deliverySize.map((_size) => {
			etr.push(this.getEtr(_size))
		})
		etr.push(this.getTotal())
		return etr
	}
	getEtr(size){
		let tdnode = []
		tdnode.push(<td  align="center" >{size}</td>)
		this.zoneArray.map(() => {
			tdnode.push(<td  align="right">26</td>)
			tdnode.push(<td  align="right">480</td>)
			tdnode.push(<td  align="right">12,480</td>)
		})
		tdnode.push(<td  align="right">338</td>)
		tdnode.push(<td  align="right">162,240</td>)
		
		return <tr>{tdnode}</tr>
	}
	getTotal() {
		let tdnode = []
		tdnode.push(<td valign="top" align="middle">合計</td>)
		this.zoneArray.map(() => {
			tdnode.push(<td  align="right"></td>)
			tdnode.push(<td  align="right"></td>)
			tdnode.push(<td  align="right">74,880</td>)
		})

		tdnode.push(<td  align="right">2,028</td>)
		tdnode.push(<td  align="right">973,440</td>)
		return <tr>{tdnode}</tr>
	}

	sampleData() {

		this.ehead = this.getHead()
		this.ebody = this.getBody()
		this.etr = this.getEtrTotal()

		this.entry.invoice.consumption_tax = '¥39,022'
		this.entry.invoice.total_amount = '¥1,025,142'
		this.ecoJP = [{
			day: '12/1',
			work: '10',
			invoices: '10',
			amount: '¥3,900',
		}, {
			day: '12/2',
			work: '60',
			invoices: '60',
			amount: '¥23,400',
		}, {
			day: '12/3',
			work: '7',
			invoices: '7',
			amount: '¥2,730',
		}, {
			day: '12/4',
			work: '25',
			invoices: '25',
			amount: '¥9,750',
		}, {
			day: '12/5',
			work: '14',
			invoices: '14',
			amount: '¥5,460',			
		}, {
			day: '12/6',
			work: '45',
			invoices: '45',
			amount: '¥17,750',
		}, {
			day: '合計',
			work: '161',
			invoices: '161',
			amount: '¥62,790',
			is_total:true,
		}]
		
		this.YAMATOdep = [{
			day: '12/1',
			work: '4',
			invoices: '4',
			amount: '¥2,000',
		}, {
			day: '12/2',
			work: '6',
			invoices: '6',
			amount: '¥3,000',
		}, {
			day: '12/3',
			work: '10',
			invoices: '10',
			amount: '¥5,000',
		}, {
			day: '12/4',
			work: '30',
			invoices: '30',
			amount: '¥15,000',
		}, {
			day: '12/5',
			work: '25',
			invoices: '25',
			amount: '¥12,500',
		}, {
			day: '12/6',
			work: '22',
			invoices: '22',
			amount: '¥11,000',
		}, {
			day: '合計',
			work: '97',
			invoices: '97',
			amount: '¥48,500',
			is_total:true,
		}]
		
		this.YAMATOcash = [{
			day: '12/1',
			work: '3',
			invoices: '3',
			amount: '¥1,200',
		}, {
			day: '12/2',
			work: '4',
			invoices: '4',
			amount: '¥1,600',
		}, {
			day: '12/3',
			work: '1',
			invoices: '1',
			amount: '¥400',
		}, {
			day: '12/4',
			work: '8',
			invoices: '8',
			amount: '¥3,200',
		}, {
			day: '12/5',
			work: '10',
			invoices: '10',
			amount: '¥4,000',
		}, {
			day: '12/6',
			work: '6',
			invoices: '6',
			amount: '¥2,400',
		}, {
			day: '合計',
			work: '32',
			invoices: '32',
			amount: '¥12,800',
			is_total:true,
		}]
		
		this.YAMATOdm = [{
			day: '12/1',
			work: '41',
			invoices: '40',
			amount: '¥40,000',
			is_error: true,
		}, {
			day: '12/2',
			work: '5',
			invoices: '4',
			amount: '¥4,000',
			is_error: true,
		}, {
			day: '12/3',
			work: '36',
			invoices: '36',
			amount: '¥36,000',
		}, {
			day: '12/4',
			work: '8',
			invoices: '8',
			amount: '¥8,000',
		}, {
			day: '12/5',
			work: '10',
			invoices: '10',
			amount: '¥10,000',
		}, {
			day: '12/6',
			work: '50',
			invoices: '50',
			amount: '¥50,000',
		}, {
			day: '合計',
			work: '150',
			invoices: '148',
			amount: '¥148,000',
			is_total:true,
		}]
		
		this.JPems = [{
			day: '12/1',
			work: '40',
			invoices: '40',
			amount: '¥42,800',
		}, {
			day: '12/2',
			work: '10',
			invoices: '10',
			amount: '¥10,700',
		}, {
			day: '12/3',
			work: '21',
			invoices: '21',
			amount: '¥22,470',
		}, {
			day: '12/4',
			work: '25',
			invoices: '25',
			amount: '¥26,750',
		}, {
			day: '12/5',
			work: '35',
			invoices: '35',
			amount: '¥37,450',			
		}, {
			day: '12/6',
			work: '13',
			invoices: '13',
			amount: '¥13,910',
		}, {
			day: '合計',
			work: '144',
			invoices: '144',
			amount: '¥154,080',
			is_total:true,
		}]
			
		this.JPpacket = [{
			day: '12/1',
			work: '8',
			invoices: '8',
			amount: '¥1,200',
		}, {
			day: '12/2',
			work: '10',
			invoices: '10',
			amount: '¥1,500',
		}, {
			day: '12/3',
			work: '5',
			invoices: '5',
			amount: '¥750',
		}, {
			day: '12/4',
			work: '30',
			invoices: '30',
			amount: '¥4,500',
		}, {
			day: '12/5',
			work: '28',
			invoices: '28',
			amount: '¥4,200',			
		}, {
			day: '12/6',
			work: '17',
			invoices: '17',
			amount: '¥2,550',
		}, {
			day: '合計',
			work: '98',
			invoices: '98',
			amount: '¥14,700',
			is_total:true,
		}]

		this.JPmail = [{
			day: '12/1',
			work: '30',
			invoices: '30',
			amount: '¥9,000',
		}, {
			day: '12/2',
			work: '10',
			invoices: '10',
			amount: '¥3,000',
		}, {
			day: '12/3',
			work: '11',
			invoices: '11',
			amount: '¥3,300',
		}, {
			day: '12/4',
			work: '50',
			invoices: '50',
			amount: '¥15,000',
		}, {
			day: '12/5',
			work: '35',
			invoices: '35',
			amount: '¥10,500',			
		}, {
			day: '12/6',
			work: '44',
			invoices: '44',
			amount: '¥13.500',
		}, {
			day: '合計',
			work: '180',
			invoices: '180',
			amount: '¥54,000',
			is_total:true,
		}]

		this.self = [{
			day: '12/1',
			work: '30',
			invoices: '30',
			amount: '¥9,000',
		}, {
			day: '12/2',
			work: '10',
			invoices: '10',
			amount: '¥3,000',
		}, {
			day: '12/3',
			work: '11',
			invoices: '11',
			amount: '¥3,300',
		}, {
			day: '12/4',
			work: '50',
			invoices: '50',
			amount: '¥15,000',
		}, {
			day: '12/5',
			work: '35',
			invoices: '35',
			amount: '¥10,500',			
		}, {
			day: '12/6',
			work: '44',
			invoices: '44',
			amount: '¥13.500',
		}, {
			day: '合計',
			work: '180',
			invoices: '180',
			amount: '¥54,000',
			is_total:true,
		}]
		
		this.YAMATO_details = [{
			shipping_date:'11月1日',
			tracking_number:'3054-7340-9570',
			delivery_class1:'宅急便発払',
			delivery_class2:'宅急便',
			size:'140',
			quantity:'1',
			prefecture:'香川県',
			delivery_charge:'840',
		}, {
			shipping_date:'11月1日',
			tracking_number:'3054-7340-9581',
			delivery_class1:'宅急便発払',
			delivery_class2:'宅急便',
			size:'140',
			quantity:'1',
			prefecture:'東京都',
			delivery_charge:'640',
		}]
		
		this.deliveryCSV = [{
			delivery:'エコ配JP',
		}, {
			delivery:'ヤマト運輸'	
		}]
	
	}

	/**
	 *  請求元リストを作成する
	 */
	setBillfromMasterData(_billfrom) {
		this.setState({ isDisabled: true })

		axios({
			url: '/d/billfrom?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			if (response.status !== 204) {

				this.master.billfromList = response.data.feed.entry
				this.billfromList = this.master.billfromList.map((obj) => {
					return {
						label: obj.billfrom.billfrom_name,
						value: obj.billfrom.billfrom_code,
						data: obj
					}
				})

				if (_billfrom) this.entry.billfrom = _billfrom
				if (this.entry.billfrom.billfrom_code) {
					for (let i = 0, ii = this.billfromList.length; i < ii; ++i) {
						if (this.entry.billfrom.billfrom_code === this.billfromList[i].value) {
							this.billfrom = this.billfromList[i].data
							this.entry.contact_information = this.billfromList[i].data.contact_information
							if(this.billfromList[i].data.contact_information.prefecture || this.billfromList[i].data.contact_information.address1 || this.billfromList[i].data.contact_information.address2){
								this.address = this.billfromList[i].data.contact_information.prefecture + this.billfromList[i].data.contact_information.address1 + this.billfromList[i].data.contact_information.address2
							}
							break
						}
					}
				}
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}
	/**
	 * 請求元リストの変更
	 */
	changeBillfrom(_data) {
		if (_data) {
			this.entry.billfrom = _data.data.billfrom
			this.entry.contact_information = _data.data.contact_information
			this.billfrom = _data.data
			this.address = _data.data.contact_information.prefecture + _data.data.contact_information.address1 + _data.data.contact_information.address2
			
		} else {
			this.entry.billfrom = {}
			this.entry.contact_information = {}
			this.billfrom = {}
			this.address=''
		}
		this.forceUpdate()
		
	}
	setBillfromData(_data, _modal) {
		this.setBillfromMasterData(_data.feed.entry[0].billfrom)
		if (_modal === 'add') {
			this.setState({ showBillfromAddModal: false })
		} else {
			this.setState({ showBillfromEditModal: false })
		}
	}

	/**
	 * 顧客リストを作成する
	 */
	setCustomerMasterData() {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/customer?f&billto.billto_code=' + this.entry.billto.billto_code,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			if (response.status !== 204) {
				this.master.customerList = response.data.feed.entry
				this.customerList = this.master.customerList.map((obj) => {
					return {
						label: obj.customer.customer_name,
						value: obj.customer.customer_code,
						data: obj
					}
				})
				this.forceUpdate()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})   
	}
	/**
	 * 顧客変更処理
	 */
	changeCustomer(_data) {
		if (_data) {
			this.setState({selectCustomer :_data.data.customer})
			this.customer = _data.data
		} else {
			this.setState({ selectCustomer: {} })
			this.customer = {}
		}
		this.forceUpdate()
	}

	/**
	 * 庫内作業年月リスト作成
	 */
	setInternalWorkYearMonthList() {
		this.setState({ isDisabled: true })

		axios({
			url: '/d/internal_work?f&quotation.quotation_code='+this.entry.invoice.quotation_code,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			if (response.status === 204) {
				this.setState({ isDisabled: false })
				//alert('庫内作業データがありません')
			}else if (response.status !== 204) {
				this.master.internalWorkYearMonthList = response.data.feed.entry
				
				//重複したものを削除する
				this.internalWorkYearMonthList = this.master.internalWorkYearMonthList.map((obj) => {
					return obj.internal_work.working_yearmonth
				}).filter((x, i, self) => {
					return self.indexOf(x) === i
				}).map((obj) => {
					return {
						label: obj,
						value: obj,
					}
				})
				this.forceUpdate()
			}
		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	/**
	 * 庫内作業年月変更
	 */
	changeInternalWorkYearMonth(_data) {
		this.setState({
			selectInternalWorkYearMonth: _data ? _data.value : ''
		})
		this.forceUpdate()
	}

	/**
	 * 請求書内で追加した請求リストの変更処理
	 */
	changeInvoiceList(list, _data, _rowindex, _celindex) {
	
		//変更処理
		if (_celindex === 'is_taxation') {
			this.item_details[list][_rowindex][_celindex] = _data ? _data.value : ''
		} else {
			this.item_details[list][_rowindex][_celindex] = _data	
		}

		let changeArray = []
		for (let i = 0, ii = this.entry.item_details.length; i < ii; ++i) {
			if (this.entry.item_details[i].category !== list) {

				changeArray.push(this.entry.item_details[i])
			}
		}

		this.forceUpdate()
	}
	/*
	 * 請求書内の月次作業、日時作業、資材などに項目を追加する
	 */
	addInvoiceList(list, _data) {
		if (!this.item_details[list]) {
			this.item_details[list] = []
		}
		this.item_details[list].push(_data)
		if (!this.entry.item_details) {
			this.entry.item_details = []
		}
		this.entry.item_details.push(_data)
		this.forceUpdate()
	}
	/**
	 * 請求書内で追加した項目を削除
	 */
	removeInvoiceList(list, _index) {
		let array = []
		for (let i = 0, ii = this.item_details[list].length; i < ii; ++i) {
			if (i !== _index) array.push(this.item_details[list][i])
		}
		this.item_details[list] = array

		let entryArray = []
		for (let i = 0, ii = this.entry.item_details.length; i < ii; ++i) {
			if (this.entry.item_details[i].category !== list) {
				entryArray.push(this.entry.item_details[i])
			}
		}

		for (let i = 0, ii = this.item_details[list].length; i < ii; ++i){
			entryArray.push(this.item_details[list][i])
		}	
		this.entry.item_details = entryArray
		
		this.forceUpdate()
	}
	
	/**
	 * 	備考リストの追加
	 */
	addRemarksList(list,_data) {
		
		if (!this.entry[list]) {
			this.entry[list] = []
		}
		this.entry[list].push(_data)	
		this.forceUpdate()
	}
	/** 
	 * 	備考リストの削除
	 */
	removeRemarksList(list, _index) {
		let array = []

		for (let i = 0, ii = this.entry[list].length; i < ii; ++i) {
			if (i !== _index) array.push(this.entry[list][i])
		}
		this.entry[list] = array

		this.forceUpdate()
	}
	/**
	 *  備考タブの内容変更
	 */
	changeRemarks(_data, _rowindex) {
		this.entry.remarks[_rowindex].content = _data
		this.forceUpdate()
	}
	/**
	 * 	入金ステータス変更 
	 */
	changeDepositStatus(_data) {
		this.entry.invoice.deposit_status = _data
		this.forceUpdate()
	}

	//onSelect() {}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>
				
				<Button className="total_amount"><Glyphicon glyph="print" />　請求書発行</Button>	
								
				{/* 登録の場合 */}
				{!this.entry.invoice.invoice_code &&
					<FormGroup className="hide">
						<FormControl name="invoice.invoice_code" type="text" value="${_addids}" />
						<FormControl name="link" data-rel="self" type="text" value="/invoice/${_addids}" />
					</FormGroup>
				}

				{/* 更新の場合 */}
				{this.entry.invoice.invoice_code &&
					<CommonInputText
						controlLabel="請求番号"
						name="invoice.invoice_code"
						type="text"
						placeholder="請求番号"
						value={this.entry.invoice.invoice_code}
						readonly="true"
					/>
				}

				<CommonMonthlySelect
					controlLabel="請求年月"  
					name="invoice.invoice_yearmonth"
					value={this.entry.invoice.invoice_yearmonth}
				/>
				
				<CommonInputText
					controlLabel="請求先名"	
					name='billto.billto_name'							
					type="text"
					placeholder="請求先名"
					value={this.entry.billto.billto_name}
					readonly='true'
				/>

				<FormGroup className="hide">
					<CommonInputText
						controlLabel="請求先コード"	
						name='billto.billto_code'							
						type="text"
						placeholder="請求先コード"
						value={this.entry.billto.billto_code}
						readonly='true'
					/>
				</FormGroup>	

				<CommonInputText
					controlLabel="見積番号"	
					name='invoice.quotation_code'							
					type="text"
					placeholder="見積番号"
					value={this.entry.invoice.quotation_code}
					readonly='true'
				/>

				<CommonRadioBtn 
					controlLabel="入金ステータス"
					name="invoice.deposit_status"
					checked={this.entry.invoice.deposit_status}
					data={[{
						label: '未入金',
						value: '0',
					}, {
						label: '入金済',
						value: '1',
					}]}
					onChange={(data) => this.changeDepositStatus(data)}
				/>

				<CommonFilterBox
					controlLabel="庫内作業年月"
					value={this.state.selectInternalWorkYearMonth}
					options={this.internalWorkYearMonthList}
					onChange={(data) => this.changeInternalWorkYearMonth(data)}
					size='sm'
				/>

				<CommonFilterBox
					controlLabel="顧客選択"
					name=""
					value={this.state.selectCustomer.customer_code}
					options={this.customerList}
					onChange={(data) => this.changeCustomer(data)}
					size='sm'
				/>
						
				<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

					<Tab eventKey={1} title="請求内容">
						<PanelGroup defaultActiveKey="1">
							
							<Button bsSize="sm" style={{width:'130px'}} >
								<Glyphicon glyph="download" />CSVダウンロード
							</Button>

							<br />
							<br />
							<Panel collapsible header="月次情報" eventKey="1" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="item_details"
									data={this.monthly}
									header={[{
										field: 'item_name',title: 'ご請求内容(作業内容)', width: '200px',
									}, {
										field: 'quantity',title: '数量', width: '50px',
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'unit_price',title: '単価', width: '100px'
									}, {
										field: 'remarks',title: '備考', width: '500px'	
									}]}	
								/>

								<br />
								<br />
								<CommonTable	
									//name="item_details"
									data={this.item_details.monthly}
									header={[{
										field: 'item_name', title: 'ご請求内容(作業内容)', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'item_name')}
										}
									}, {
										field: 'quantity',title: '数量', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'quantity')}
										}
									}, {
										field: 'unit',title: '単位', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'unit')}
										}
									}, {
										field: 'unit_price',title: '単価', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'unit_price')}
										}
									}, {
										field: 'is_taxation',title: '税込/税抜　　 　', width: '30px',
										filter: {
											options: this.taxationList,
											onChange: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'is_taxation')}
										}
									}, {
										field: 'remarks',title: '備考', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('monthly',data,rowindex,'remarks')}
										}
									}]}
									add={() => this.addInvoiceList('monthly', { category:'monthly',item_name: '', quantity: '', unit: '', unit_price: '', is_taxation: '0', remarks: '', })}
									remove={(data, index) => this.removeInvoiceList('monthly', index)}
									fixed
									noneScroll
								/>
							</Panel>
								
							<Panel collapsible header="日時作業情報" eventKey="2" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="item_details"
									data={this.daily}
									header={[{
										field: 'item_name',title: 'ご請求内容(作業内容)', width: '200px'
									}, {
										field: 'quantity',title: '数量', width: '50px'
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'unit_price',title: '単価', width: '100px'
									}, {
										field: 'remarks',title: '備考', width: '500px'	
									}]}
								/>

								<br />
								<br />
								
								<CommonTable	
									//name="item_details"
									data={this.item_details.daily}
									header={[{
										field: 'item_name', title: 'ご請求内容(作業内容)', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'item_name')}
										}
									}, {
										field: 'quantity',title: '数量', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'quantity')}
										}
									}, {
										field: 'unit',title: '単位', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'unit')}
										}
									}, {
										field: 'unit_price',title: '単価', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'unit_price')}
										}
									}, {
										field: 'is_taxation',title: '税込/税抜　　 　', width: '30px',
										filter: {
											options: this.taxationList,
											onChange: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'is_taxation')}
										}
									}, {
										field: 'remarks',title: '備考', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('daily',data,rowindex,'remarks')}
										}
									}]}
									add={() => this.addInvoiceList('daily', { category:'daily',item_name: '', quantity: '', unit: '', unit_price: '', is_taxation: '0', remarks: '', })}
									remove={(data, index) => this.removeInvoiceList('daily', index)}
									fixed
									noneScroll
								/>
							</Panel>

							<Panel collapsible header="資材情報" eventKey="3" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="item_details"
									data={this.packing_item}
									header={[{
										field: 'item_name',title: 'ご請求内容(作業内容)', width: '200px'
									}, {
										field: 'quantity',title: '数量', width: '50px'
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'unit_price',title: '単価', width: '100px'
									}, {
										field: 'remarks',title: '備考', width: '500px'	
									}]}
								/>

								<br />
								<br />
								<CommonTable	
									//name="item_details"
									data={this.item_details.packing_item}
									header={[{
										field: 'item_name', title: 'ご請求内容(作業内容)', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'item_name')}
										}
									}, {
										field: 'quantity',title: '数量', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'quantity')}
										}
									}, {
										field: 'unit',title: '単位', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'unit')}
										}
									}, {
										field: 'unit_price',title: '単価', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'unit_price')}
										}
									}, {
										field: 'is_taxation',title: '税込/税抜　　 　', width: '30px',
										filter: {
											options: this.taxationList,
											onChange: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'is_taxation')}
										}
									}, {
										field: 'remarks',title: '備考', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('packing_item',data,rowindex,'remarks')}
										}
									}]}
									add={() => this.addInvoiceList('packing_item', { category:'packing_item',item_name: '', quantity: '', unit: '', unit_price: '', is_taxation: '0', remarks: '', })}
									remove={(data, index) => this.removeInvoiceList('packing_item', index)}
									fixed
								/>
							</Panel>

							<Panel collapsible header="配送料(出荷)" eventKey="4" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="item_details"
									data={this.delivery_charge_shipping}
									header={[{
										field: 'item_name',title: 'ご請求内容(作業内容)', width: '200px'
									}, {
										field: 'quantity',title: '数量', width: '50px'
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'unit_price',title: '単価', width: '100px'
									}, {
										field: 'remarks',title: '備考', width: '500px'	
									}]}
								/>

								<br />
								<br />
								<CommonTable	
									//name="item_details"
									data={this.item_details.delivery_charge_shipping}
									header={[{
										field: 'item_name', title: 'ご請求内容(作業内容)', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_shipping',data,rowindex,'item_name')}
										}
									}, {
										field: 'quantity',title: '数量', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_shipping',data,rowindex,'quantity')}
										}
									}, {
										field: 'unit',title: '単位', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_shipping',data,rowindex,'unit')}
										}
									}, {
										field: 'unit_price',title: '単価', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_shipping',data,rowindex,'unit_price')}
										}
									}, {
										field: 'is_taxation',title: '税込/税抜　　 　', width: '30px',
										filter: {
											options: this.taxationList,
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_shipping',data,rowindex,'is_taxation')}
										}
									}, {
										field: 'remarks',title: '備考', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_shipping',data,rowindex,'remarks')}
										}
									}]}
									add={() => this.addInvoiceList('delivery_charge_shipping', { category:'delivery_charge_shipping',item_name: '', quantity: '', unit: '', unit_price: '', is_taxation: '0', remarks: '', })}
									remove={(data, index) => this.removeInvoiceList('delivery_charge_shipping', index)}
									fixed
								/>
							</Panel>	
							
							<Panel collapsible header="配送料(集荷)" eventKey="5" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="item_details"
									data={this.delivery_charge_collecting}
									header={[{
										field: 'item_name',title: 'ご請求内容(作業内容)', width: '200px'
									}, {
										field: 'quantity',title: '数量', width: '50px'
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'unit_price',title: '単価', width: '100px'
									}, {
										field: 'remarks',title: '備考', width: '500px'	
									}]}
								/>

								<br />
								<br />
								<CommonTable	
									//name="item_details"
									data={this.item_details.delivery_charge_collecting}
									header={[{
										field: 'item_name', title: 'ご請求内容(作業内容)', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_collecting',data,rowindex,'item_name')}
										}
									}, {
										field: 'quantity',title: '数量', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_collecting',data,rowindex,'quantity')}
										}
									}, {
										field: 'unit',title: '単位', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_collecting',data,rowindex,'unit')}
										}
									}, {
										field: 'unit_price',title: '単価', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_collecting',data,rowindex,'unit_price')}
										}
									}, {
										field: 'is_taxation',title: '税込/税抜　　 　', width: '30px',
										filter: {
											options: this.taxationList,
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_collecting',data,rowindex,'is_taxation')}
											
										}
									}, {
										field: 'remarks',title: '備考', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('delivery_charge_collecting',data,rowindex,'remarks')}
										}
									}]}
									add={() => this.addInvoiceList('delivery_charge_collecting', { category:'delivery_charge_collecting',item_name: '', quantity: '', unit: '', unit_price: '', is_taxation: '0', remarks: '', })}
									remove={(data, index) => this.removeInvoiceList('delivery_charge_collecting', index)}
									fixed
								/>
							</Panel>

							<Panel collapsible header="その他" eventKey="6" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="item_details"
									data={this.item_details.others}
									header={[{
										field: 'item_name', title: 'ご請求内容(作業内容)', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'item_name')}
										}
									}, {
										field: 'quantity',title: '数量', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'quantity')}
										}
									}, {
										field: 'unit',title: '単位', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'unit')}
										}
									}, {
										field: 'unit_price',title: '単価', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'unit_price')}
										}
									}, {
										field: 'is_taxation',title: '税込/税抜　　 　', width: '30px',
										filter: {
											options: this.taxationList,
											onChange: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'is_taxation')}
										}
									}, {
										field: 'remarks',title: '備考', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeInvoiceList('others',data,rowindex,'remarks')}
										}
									}]}
									add={() => this.addInvoiceList('others', { category:'others',item_name: '', quantity: '', unit: '', unit_price: '', is_taxation: '0', remarks: '', })}
									remove={(data, index) => this.removeInvoiceList('others',index)}
									fixed
								/>
							</Panel>

							<Panel collapsible header="備考" eventKey="7" bsStyle="info" defaultExpanded="true">
								<CommonTable	
									name="remarks"
									data={this.entry.remarks}
									header={[{
										field: 'content', title: '備考', 
										input: {
											onChange: (data, rowindex)=>{this.changeRemarks(data, rowindex)}
										}
									}]}
									add={() => this.addRemarksList('remarks', { content: ''})}
									remove={(data, index) => this.removeRemarksList('remarks', index)}
									fixed
								/>
							</Panel>
							
						</PanelGroup>

						<br />

						<CommonInputText
							controlLabel="消費税"
							name="invoice.consumption_tax"
							type="text"
							placeholder="消費税"
							value={this.entry.invoice.consumption_tax}
							readonly
							className="total_amount"
						/>

						<br />
						<br />

						<CommonInputText
							controlLabel="合計請求金額"
							name="invoice.total_amount"
							type="text"
							placeholder="合計請求金額"
							value={this.entry.invoice.total_amount}
							readonly='true'
							className="total_amount"
						/>

						<br />
						<br />

						<FormGroup className="hide">	
							<CommonTable	
								name="item_details"
								data={this.entry.item_details}
								header={[{
									field: 'category',title:'項目',width:'200px',
								}, {
									field: 'item_name',title: 'ご請求内容(作業内容)', width: '200px'
								}, {
									field: 'quantity',title: '数量', width: '50px'
								}, {
									field: 'unit',title: '単位', width: '50px'
								}, {
									field: 'unit_price',title: '単価', width: '100px'
								}, {
									field: 'remarks',title: '備考', width: '500px'	
								}]}
							/>
						</FormGroup>
					</Tab>
					
					<Tab eventKey={2} title="請求明細(簡易)">

						<Panel collapsible header="エコ配JP簡易明細" eventKey="2" bsStyle="info" defaultExpanded="true">
							<div className="invoiceDetails-table scroll">	
								<Table striped bordered hover>
									<thead>
										<tr>
											{this.ehead}
										</tr>
									</thead>
									<tbody>
										<tr>
											{this.ebody}
										</tr>
										{this.etr}
									</tbody>
								</Table>
							</div>
						</Panel>	
						<Panel collapsible header="ヤマト運輸発払簡易明細" eventKey="2" bsStyle="info" defaultExpanded="true">
							<div className="invoiceDetails-table scroll">	
								<Table striped bordered hover>
									<thead>
										<tr>
											{this.ehead}
										</tr>
									</thead>
									<tbody>
										<tr>
											{this.ebody}
										</tr>
										{this.etr}
									</tbody>
								</Table>
							</div>
						</Panel>

					</Tab>

					<Tab eventKey={3} title="請求明細(詳細)">
						
						<Panel collapsible header="明細CSVダウンロード" eventKey="3" bsStyle="info" defaultExpanded="true">
							<CommonTable
							//name="""
								data={this.deliveryCSV}
								header={[{
									field: 'btn1', title: 'CSV', width: '10px',
									label: <Glyphicon glyph="download" />,
									//onClick:
								}, {
									field:'delivery', title:'配送業者',width:'1000px',
								}]}
								
							/>
						</Panel>

					</Tab>

					<Tab eventKey={4} title="請求元"> 
						
						{/*
						画面に表示
						 名前
						 郵便番号
						 住所（都道府県 + 市区郡町村 + 番地）表示用
						 電話番号
						 口座情報
						
						画面非表示
						 FAX
						 メールアドレス
						 都道府県
						 市区郡町村
						 番地
						*/}

						<CommonFilterBox
							controlLabel="請求元"
							name="billfrom.billfrom_code"
							value={this.entry.billfrom.billfrom_code}
							options={this.billfromList}
							add={() => this.setState({ showBillfromAddModal: true })}
							edit={() => this.setState({ showBillfromEditModal: true })}
							onChange={(data) => this.changeBillfrom(data)}
						/>
						{this.entry.billfrom.billfrom_code &&
							<CommonInputText
								controlLabel=" "
								name="billfrom.billfrom_name"
								type="text"
								value={this.entry.billfrom.billfrom_name}
								readonly
							/>
						}			
						{this.entry.billfrom.billfrom_code &&
							<CommonInputText
								controlLabel="郵便番号"
								name="contact_information.zip_code"
								type="text"
								placeholder="郵便番号"
								value={this.entry.contact_information.zip_code}
								readonly
							/>
						}
						{this.entry.billfrom.billfrom_code &&
						
							<CommonInputText
								controlLabel="住所"
								type="text"
								value={this.address}
								readonly
							/>
						}
						{this.entry.billfrom.billfrom_code &&
							<CommonInputText
								controlLabel="電話番号"
								name="contact_information.tel"
								type="text"
								placeholder="電話番号"
								value={this.entry.contact_information.tel}
								readonly
							/>
						}
						{this.entry.billfrom.billfrom_code &&
							<CommonTable
								controlLabel="口座情報"
								name="billfrom.payee"
								data={this.entry.billfrom.payee}
								header={[{
									field: 'bank_info', title: '口座名', width: '30px',
									convert: {
										1: 'みずほ銀行', 2: '三菱東京UFJ銀行', 3: '三井住友銀行', 4: 'りそな銀行', 5: '埼玉りそな銀行',
										6: '楽天銀行',7:'ジャパンネット銀行',8:'巣鴨信用金庫',9:'川口信用金庫',10:'東京都民銀行',11:'群馬銀行',
									}
									
								}, {
									field: 'account_type', title: '口座種類', width: '30px',convert: { 0: '普通' ,1: '当座',}
									
								}, {
									field: 'account_number', title: '口座番号', width: '30px',
									
								}]}
								noneScroll
								fixed
							/>
						}
						
						{this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>
								<CommonInputText
									name="contact_information.fax"
									type="text"
									value={this.entry.contact_information.fax}
									readonly
								/>
							</FormGroup>
						}
						{this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>
								<CommonInputText
									name="contact_information.email"
									type="text"
									value={this.entry.contact_information.email}
									readonly
								/>
							</FormGroup>
						}
						{this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>
								<CommonPrefecture
									controlLabel="都道府県"
									componentClass="select"
									name="contact_information.prefecture"
									value={this.entry.contact_information.prefecture}
								/>
							</FormGroup>
						}
						{this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>
								<CommonInputText
									name="contact_information.address1"
									type="text"
									value={this.entry.contact_information.address1}
									readonly
								/>
							</FormGroup>
						}
						{this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>
								<CommonInputText
									name="contact_information.address2"
									type="text"
									value={this.entry.contact_information.address2}
									readonly
								/>
							</FormGroup>
						}
				
						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>
								<CommonInputText
									name="billfrom.billfrom_name"
									type="text"
									value={this.entry.billfrom.billfrom_name}
									readonly
								/>
							</FormGroup>
						}
						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>	
								<CommonInputText
									name="contact_information.zip_code"
									type="text"
									placeholder="郵便番号"
									value={this.entry.contact_information.zip_code}
									readonly
								/>
							</FormGroup>
						}

						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>
								<CommonPrefecture
									controlLabel="都道府県"
									componentClass="select"
									name="contact_information.prefecture"
									value={this.entry.contact_information.prefecture}
								/>
							</FormGroup>
						}
						
						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>	
								<CommonInputText
									name="contact_information.address1"
									type="text"
									value={this.entry.contact_information.address1}
									readonly
								/>
							</FormGroup>
						}
						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>	
								<CommonInputText
									name="contact_information.address2"
									type="text"
									value={this.entry.contact_information.address2}
									readonly
								/>
							</FormGroup>
						}
						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>	
								<CommonInputText
									name="contact_information.tel"
									type="text"
									value={this.entry.contact_information.tel}
									readonly
								/>
							</FormGroup>
						}

						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>	
								<CommonInputText
									name="contact_information.fax"
									type="text"
									value={this.entry.contact_information.fax}
									readonly
								/>
							</FormGroup>
						}
						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>	
								<CommonInputText
									name="contact_information.email"
									type="text"
									value={this.entry.contact_information.email}
									readonly
								/>
							</FormGroup>
						}
						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>
								<CommonTable
									name="billfrom.payee"
									data={this.entry.billfrom.payee}
									header={[{
										field: 'bank_info', title: '口座名', width: '30px',
										convert: {
											1: 'みずほ銀行', 2: '三菱東京UFJ銀行', 3: '三井住友銀行', 4: 'りそな銀行', 5: '埼玉りそな銀行',
											6: '楽天銀行',7:'ジャパンネット銀行',8:'巣鴨信用金庫',9:'川口信用金庫',10:'東京都民銀行',11:'群馬銀行',
										}
									}, {
										field: 'account_type', title: '口座種類', width: '30px',convert: { 0: '普通' ,1: '当座',}
									
									}, {
										field: 'account_number', title: '口座番号', width: '30px',
									
									}]}
									noneScroll
									fixed
								/>
							</FormGroup>
						}

					</Tab>
					
					<Tab eventKey={5} title="請求データ(発送)">
						
						<Panel collapsible header="エコ配JP" eventKey="1" bsStyle="info" defaultExpanded="true">
						
							<CommonTable
								data={this.ecoJP}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
							/>
					
						</Panel>

						<Panel collapsible header="ヤマト運輸(発払)" eventKey="2" bsStyle="info" defaultExpanded="true">
						
							<CommonTable
								data={this.YAMATOdep}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
							/>
						
						</Panel>
						<Panel collapsible header="ヤマト運輸(代引)" eventKey="3" bsStyle="info" defaultExpanded="true">
						
							<CommonTable
								data={this.YAMATOdep}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
							/>

						</Panel>
						<Panel collapsible header="ヤマト運輸(DM便/ネコポス)" eventKey="4" bsStyle="info" defaultExpanded="true">
						
							<CommonTable
								data={this.YAMATOdm}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
							/>
						
						</Panel>

						<Panel collapsible header="日本郵政(EMS)" eventKey="5" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								data={this.JPems}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
						
								}]}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(ゆうパケット)" eventKey="6" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								data={this.JPpacket}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(ゆうメール)" eventKey="7" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								data={this.JPmail}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
							/>

						</Panel>

					</Tab>
					<Tab eventKey={6} title="請求データ(集荷)">
						
						<Panel collapsible header="エコ配JP" eventKey="1" bsStyle="info" defaultExpanded="true">
						
							<CommonTable
								data={this.ecoJP}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
							/>
					
						</Panel>

						<Panel collapsible header="ヤマト運輸(発払)" eventKey="2" bsStyle="info" defaultExpanded="true">
						
							<CommonTable
								data={this.YAMATOdep}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
							/>
						
						</Panel>
						<Panel collapsible header="ヤマト運輸(代引)" eventKey="3" bsStyle="info" defaultExpanded="true">
						
							<CommonTable
								data={this.YAMATOdep}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
							/>

						</Panel>
						<Panel collapsible header="ヤマト運輸(DM便/ネコポス)" eventKey="4" bsStyle="info" defaultExpanded="true">
						
							<CommonTable
								data={this.YAMATOdm}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
							/>
						
						</Panel>

						<Panel collapsible header="日本郵政(EMS)" eventKey="5" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								data={this.JPems}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
						
								}]}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(ゆうパケット)" eventKey="6" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								data={this.JPpacket}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}
								}]}
							/>

						</Panel>
						<Panel collapsible header="日本郵政(ゆうメール)" eventKey="7" bsStyle="info" defaultExpanded="true">
		
							<CommonTable
								data={this.JPmail}
								header={[{
									field: 'day',title: '日付', width: '50px'
								}, {
									field: 'work', title: '発送作業個数', width: '300px'
								}, {
									field: 'invoices', title: '請求個数', width: '300px'
								}, {
									field: 'amount', title: '請求金額', width: '200px',style: {'text-align': 'right'}			
								}]}
							/>

						</Panel>

					</Tab>
				</Tabs>	
							
				<BillfromAddModal isShow={this.state.showBillfromAddModal} close={() => this.setState({ showBillfromAddModal: false })} add={(data) => this.setBillfromData(data, 'add')} />
				<BillfromEditModal isShow={this.state.showBillfromEditModal} close={() => this.setState({ showBillfromEditModal: false })} edit={(data) => this.setBillfromData(data, 'edit')} data={this.billfrom} />
			</Form>
		)
	}
}
