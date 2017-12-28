/* @flow */
import React from 'react'
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
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonTable,
	CommonRadioBtn,
	CommonFilterBox,
} from './common'

export default class InvoiceForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry

		this.entry = this.props.entry
		this.entry.invoice = this.entry.invoice || {}
		//this.entry.billto = this.entry.billto || {}
		this.entry.billfrom = this.entry.billfrom || {}
		this.entry.billfrom.payee = this.entry.billfrom.payee || []
		this.entry.contact_information = this.entry.contact_information || {}
		this.entry.item_details = this.entry.item_details || []
		this.item_details = this.item_details || []
		this.entry.remarks = this.entry.remarks || []

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

	}

	componentWillMount() {
		this.sampleData()
	}

	sampleData() {
		
		this.entry.invoice.quotation_code = '1710-01317'
		this.entry.invoice.consumption_tax = '¥39,022'
		this.entry.invoice.total_amount = '¥1,025,142'
		
		this.item_details = [{
			category: 'monthly',
			item_name: '保管料',
			quantity: '4',
			unit: '1坪/月',
			unit_price: '¥5,000',
			remarks: '棚、ラックリース(新品:500円/中古品:300円)支給品利用可能',
		}, {
			category: 'monthly',	
			item_name: '保管料',
			quantity: '4',
			unit: '1パレット/月',
			unit_price: '¥2,500',
			remarks: 'サイズ1,100×1,100',
		}, {
			category: 'monthly',	
			item_name: '保管料',
			quantity: '4',
			unit: '1パレット/月',
			unit_price: '¥2,500',
			remarks: 'パレットラック縦積み',
		}, {
			category: 'monthly',	
			item_name: '運営管理費',
			quantity: '',
			unit: 'データ変換ソフト/月額',
			unit_price: '¥10,000',
			remarks: 'ご希望に応じて',
		}, {
			category: 'monthly',
			item_name: '運営管理費',
			quantity: '',
			unit: '月額',
			unit_price: '¥35,000',
			remarks: '専属窓口1名、在庫報告、システム保守、WMSが必要な場合別途相談',
		}, {
			category: 'daily',
			item_name: '入庫作業料',
			quantity: '4',
			unit: '入庫量/1点',
			unit_price: '¥10~30',
			remarks: 'バラ、アソート入庫、外装検品、品番確認、数量検品、棚格納',
		}, {
			category: 'daily',	
			item_name: '入庫作業料',
			quantity: '4',
			unit: '入庫量/1箱',
			unit_price: '¥50',
			remarks: '外装検品、品番確認、内容未見、箱積み',
		}, {
			category: 'daily',
			item_name: '入庫作業料',
			quantity: '4',
			unit: 'デバンニング/20F',
			unit_price: '¥18,000',
			remarks: 'ハイキューブ＋¥3,000',
		}, {
			category: 'daily',
			item_name: '入庫作業料',
			quantity: '4',
			unit: 'デバンニング/40F',
			unit_price: '¥33,000',
			remarks: 'ハイキューブ＋¥3,000',
		}, {
			category: 'daily',
			item_name: '出荷作業料',
			quantity: '4',
			unit: 'DM便・ネコポス・ゆうパケット・ゆうメール・定形外/1封緘',
			unit_price: '¥200',
			remarks: '',
		}, {
			category: 'daily',
			item_name: '出荷作業料',
			quantity: '4',
			unit: '宅配便/1梱包',
			unit_price: '¥300',
			remarks: '',
		}, {
			category: 'daily',
			item_name: '出荷作業料',
			quantity: '4',
			unit: 'ピッキング/1点',
			unit_price: '¥30',
			remarks: '',
		}, {
			category: 'daily',
			item_name: '出荷作業料',
			quantity: '4',
			unit: '同梱作業/1枚/冊',
			unit_price: '¥10',
			remarks: 'ステッカー、チラシ、カタログ、パンフレットなどの販促物',
		}, {
			category: 'daily',
			item_name: '付帯作業料',
			quantity: '4',
			unit: 'エアキャップ巻き/1点',
			unit_price: '¥15',
			remarks: 'アクセサリー、小物(資材別)',
		}, {
			category: 'daily',
			item_name: '付帯作業料',
			quantity: '4',
			unit: 'エアキャップ巻き/1箱',
			unit_price: '¥50',
			remarks: '(資材別)',
		}, {
			category: 'daily',
			item_name: '付帯作業料',
			quantity: '4',
			unit: '簡易包装/1箱',
			unit_price: '¥100',
			remarks: 'ラッピング袋などへ詰め込みのみ(資材別)',
		}, {
			category: 'daily',
			item_name: '付帯作業料',
			quantity: '4',
			unit: '完全包装/1箱',
			unit_price: '¥200',
			remarks: 'ラッピング、ギフト梱包(資材別)',
		}, {
			category: 'daily',
			item_name: '付帯作業料',
			quantity: '4',
			unit: '商品品番シール貼り/1点',
			unit_price: '¥5',
			remarks: 'シール印字・貼り作業(ペーパー代別)',
		}, {
			category: 'daily',
			item_name: '付帯作業料',
			quantity: '4',
			unit: 'バーコード作成/1KSU',
			unit_price: '¥200',
			remarks: 'JAN登録は行いません',
		}, {
			category: 'daily',
			item_name: '実地棚卸作業',
			quantity: '4',
			unit: '人口/1時間',
			unit_price: '¥2,500',
			remarks: '必要な場合',
		}, {
			category: 'daily',
			item_name: 'イレギュラー処理費用',
			quantity: '4',
			unit: '返品処理/1件',
			unit_price: '¥200',
			remarks: '住所不明・長期不在などで返品になった商品の在庫戻し、貴社報告',
		}, {
			category: 'packing_item',
			item_name: '資材費(ダンボール3.5cm<大>)',
			quantity: '2,300',
			unit: '枚',
			unit_price: '¥21',
			remarks: '',
		}, {
			category: 'packing_item',
			item_name: '資材費(ダンボール160サイズ)',
			quantity: '0',
			unit: 'セット',
			unit_price: '¥767',
			remarks: '',
		}, {
			category: 'delivery_charge_shipping',
			item_name: 'エコ配JP',
			quantity: '161',
			unit: '個',
			unit_price: '¥390',
			remarks: '',
		}, {
			category: 'delivery_charge_shipping',	
			item_name: 'ヤマト運輸発払',
			quantity: '97',
			unit: '個',
			unit_price: '¥500',
			remarks: '',
		}, {
			category: 'delivery_charge_shipping',
			item_name: '佐川急便発払',
			quantity: '32',
			unit: '個',
			unit_price: '¥400',
			remarks: '',
		}, {
			category: 'delivery_charge_shipping',
			item_name: '西濃運輸',
			quantity: '144',
			unit: '個',
			unit_price: '¥1,070',
			remarks: '',
		}, {
			category: 'delivery_charge_shipping',
			item_name: '自社配送',
			quantity: '180',
			unit: '個',
			unit_price: '¥300',
			remarks: '',
		}, {
			category: 'delivery_charge_collecting',
			item_name: 'エコ配JP',
			quantity: '131',
			unit: '個',
			unit_price: '¥390',
			remarks: '',
		}, {
			category: 'delivery_charge_collecting',	
			item_name: 'ヤマト運輸発払',
			quantity: '95',
			unit: '個',
			unit_price: '¥500',
			remarks: '',
		}, {
			category: 'delivery_charge_collecting',
			item_name: '佐川急便発払',
			quantity: '34',
			unit: '個',
			unit_price: '¥400',
			remarks: '',
		}, {
			category: 'delivery_charge_collecting',
			item_name: '西濃運輸',
			quantity: '14',
			unit: '個',
			unit_price: '¥1,070',
			remarks: '',
		}, {
			category: 'delivery_charge_collecting',
			item_name: '自社配送',
			quantity: '130',
			unit: '個',
			unit_price: '¥300',
			remarks: '',
		}]

		if (this.item_details) {
			for (let i = 0; i < this.item_details.length; ++i) {
				switch (this.item_details[i].category) {
				case 'monthly':
					if (!this.monthly) {
						this.monthly = []
					}
					this.monthly[this.monthly.length] = this.item_details[i]
					break
				case 'daily':
					if (!this.daily) {
						this.daily = []
					}
					this.daily[this.daily.length] = this.item_details[i]
					break
				case 'packing_item':
					if (!this.packing_item) {
						this.packing_item = []
					}
					this.packing_item[this.packing_item.length] = this.item_details[i]
					break
				case 'delivery_charge_shipping':
					if (!this.delivery_charge_shipping) {
						this.delivery_charge_shipping = []
					}
					this.delivery_charge_shipping[this.delivery_charge_shipping.length] = this.item_details[i]
					break
				case 'delivery_charge_collecting':
					if (!this.delivery_charge_collecting) {
						this.delivery_charge_collecting = []
					}
					this.delivery_charge_collecting[this.delivery_charge_collecting.length] = this.item_details[i]
					break
					
				case 'others':
					if (!this.entry.item_details) {
						this.entry.item_details = []
					}
					this.entry.item_details[this.entry.item_details.length] = this.item_details[i]
					break
				}
			}
		}	
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	/**
	 * 	その他の請求リスト、備考リスト、振込先リストの追加
	 */
	addList(list,_data) {
		if (list === 'payee') {
			if (!this.entry.billfrom[list]) {
				this.entry.billfrom[list] = []
			}
			this.entry.billfrom[list].push(_data)
		} else {
			if (!this.entry[list]) {
				this.entry[list] = []
			}
			this.entry[list].push(_data)	
		}
		console.log(this.entry.remarks)
		this.forceUpdate()
	}

	/** 
	 * 	その他の請求リスト、備考リスト、振込先リストの削除
	 */
	removeList(list, _index) {
		let array = []
		if (list === 'payee') {
			for (let i = 0, ii = this.entry.billfrom.payee.length; i < ii; ++i) {
				if (i !== _index) array.push(this.entry.billfrom.payee[i])
			}
			this.entry.billfrom.payee = array	
		} else {
			for (let i = 0, ii = this.entry[list].length; i < ii; ++i) {
				if (i !== _index) array.push(this.entry[list][i])
			}
			this.entry[list] = array
		}	
		this.forceUpdate()
	}
	
	/**
	 * その他の請求リストの変更
	 */
	changeOthers(_data, _rowindex, _celindex) {
		if (_celindex === 'is_taxation') {
			this.entry.item_details[_rowindex][_celindex] = _data ? _data.value : ''
		} else {
			this.entry.item_details[_rowindex][_celindex] = _data	
		}
		this.forceUpdate()
	}

	/**
	 * 	請求元の振込情報リスト変更
	 */
	changePayee(_data, _rowindex, _celindex) {
		if (_celindex === 'bank_info' || _celindex === 'account_type') {
			this.entry.billfrom.payee[_rowindex][_celindex] = _data ? _data.value : ''
		} else {
			this.entry.billfrom.payee[_rowindex][_celindex] = _data	
		}
		
		this.forceUpdate()
	}

	changeRemarks(_data, _rowindex) {
		this.entry.remarks[_rowindex].content = _data
		this.forceUpdate()
	}
	/**
	 * 	請求元の情報変更
	 *  請求元のマスタ作成後に変更予定(2017/12/27)
	 */
	changeBillfrom(_data) {
		if (!_data) {
			this.entry.billfrom.billfrom_code = ''
			this.entry.billfrom.billfrom_name = ''	
		} else {
			this.entry.billfrom.billfrom_code = _data.value
			this.entry.billfrom.billfrom_name = _data.label
			this.entry.contact_information.zip_code = '〒332 - 0027'
			this.entry.contact_information.address1 = '埼玉県川口市緑町9-35'
			this.entry.contact_information.tel = '048-299-8213'	
		}	

		this.forceUpdate()
	}

	/**
	 * 	入金ステータス変更 
	 */
	changeDepositStatus(_data) {
		this.entry.invoice.deposit_status = _data
		this.forceUpdate()
	}

	onSelect() {
	}

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
								controlLabel="請求コード"
								name="invoice.invoice_code"
								type="text"
								placeholder="請求コード"
								value={this.entry.invoice.invoice_code}
								readonly="true"
							/>
				}

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
						
				
				<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

					<Tab eventKey={1} title="請求内容">
						<PanelGroup defaultActiveKey="1">
							<Panel collapsible header="月次情報" eventKey="1" bsStyle="info" defaultExpanded="true">
								<CommonTable
									name="item_details"
									data={this.monthly}
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
							</Panel>
								
							<Panel collapsible header="日時作業情報" eventKey="2" bsStyle="info" defaultExpanded="true">
								<CommonTable
									name="item_details"
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
							</Panel>

							<Panel collapsible header="資材情報" eventKey="3" bsStyle="info" defaultExpanded="true">
								<CommonTable
									name="item_details"
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
							</Panel>

							<Panel collapsible header="配送料(出荷)" eventKey="4" bsStyle="info" defaultExpanded="true">
								<CommonTable
									name="item_details"
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
							</Panel>	
							
							<Panel collapsible header="配送料(集荷)" eventKey="5" bsStyle="info" defaultExpanded="true">
								<CommonTable
									name="item_details"
									data={this.delivery_charge_collecting}
									header={[{
										field: 'item_name', title: 'ご請求内容(作業内容)', width: '200px'
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
							</Panel>

							<Panel collapsible header="その他" eventKey="6" bsStyle="info" defaultExpanded="true">
								<CommonTable
									name="item_details"
									data={this.entry.item_details}
									header={[{
										field: 'item_name', title: 'ご請求内容(作業内容)', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeOthers(data,rowindex,'item_name')}
										}
									}, {
										field: 'quantity',title: '数量', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeOthers(data,rowindex,'quantity')}
										}
									}, {
										field: 'unit',title: '単位', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeOthers(data,rowindex,'unit')}
										}
									}, {
										field: 'unit_price',title: '単価', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeOthers(data,rowindex,'unit_price')}
										}
									}, {
										field: 'is_taxation',title: '税込/税抜　　 　', width: '30px',
										filter: {
											options: this.taxationList,
											onChange: (data, rowindex)=>{this.changeOthers(data,rowindex,'is_taxation')}
										}
									}, {
										field: 'remarks',title: '備考', width: '30px',
										input: {
											onChange: (data, rowindex)=>{this.changeOthers(data,rowindex,'remarks')}
										}
									}]}
									add={() => this.addList('item_details',{category: 'others', item_name: '',quantity: '',unit: '',unit_price: '',is_taxation:'0',remarks:'',})}
									remove={(data, index) => this.removeList('item_details',index)}
									fixed
								/>
							</Panel>
							<Panel collapsible header="備考" eventKey="7" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//controlLabel="備考"	
									name="remarks"
									data={this.entry.remarks}
									header={[{
										field: 'content', title: '備考', 
										input: {
											onChange: (data, rowindex)=>{this.changeRemarks(data, rowindex)}
										}
									}]}
									add={() => this.addList('remarks', { content: ''})}
									remove={(data, index) => this.removeList('remarks', index)}
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

					</Tab>

					<Tab eventKey={2} title="請求元"> 
						
						<CommonFilterBox
							controlLabel="請求元選択"
							name="billfrom.billfrom_code"
							value={this.entry.billfrom.billfrom_code}
							options={[{
								label: 'CONNECTロジスティクス株式会社',
								value: '1',
							}]}
							add={() => console.log('追加')}
							//edit={() => this.setState({ showBillfromEditModal: true })}
							onChange={(data) => this.changeBillfrom(data)}
						/>
						
						{this.entry.billfrom.billfrom_code &&
							<CommonInputText
								controlLabel="　"
								name="billfrom.billfrom_name"
								type="text"
								//placeholder="請求元名"
								value={this.entry.billfrom.billfrom_name}
								readonly
							/>
						}
						
						{this.entry.billfrom.billfrom_code &&
							<CommonInputText
								controlLabel="　"
								name="contact_information.zip_code"
								type="text"
								placeholder="郵便番号"
								value={this.entry.contact_information.zip_code}
								readonly
							/>
						}
						{this.entry.billfrom.billfrom_code &&
						
							<CommonInputText
								controlLabel="　"
								name="contact_information.address1"
								type="text"
								//placeholder=""
								value={this.entry.contact_information.address1}
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
									filter: {
										options: this.bankList,
										onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'bank_info') }
									}
								}, {
									field: 'account_type', title: '口座種類', width: '30px',
									filter: {
										options: this.bankTypeList,
										onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'account_type') }
									}
								}, {
									field: 'account_number', title: '口座番号', width: '30px',
									input: {
										onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'account_number') }
									}
								}]}
								add={() => this.addList('payee',{ 'bank_info': '0', 'account_type': '0', 'account_number': '', })}
								remove={(data, index) => this.removeList('payee',index)}
								noneScroll
								fixed
							/>
						}

						{!this.entry.billfrom.billfrom_code &&
							<FormGroup className="hide"	>
								<CommonInputText
									controlLabel="　"
									name="billfrom.billfrom_name"
									type="text"
									//placeholder="請求元名"
									value={this.entry.billfrom.billfrom_name}
									readonly
								/>
							</FormGroup>
						}
						
						{!this.entry.billfrom.billfrom_code &&
						<FormGroup className="hide"	>	
							<CommonInputText
								controlLabel="　"
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
								<CommonTable
									controlLabel="口座情報"
									name="billfrom.payee"
									data={this.entry.billfrom.payee}
									header={[{
										field: 'bank_info', title: '口座名', width: '30px',
										filter: {
											options: this.bankList,
											onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'bank_info') }
										}
									}, {
										field: 'account_type', title: '口座種類', width: '30px',
										filter: {
											options: this.bankTypeList,
											onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'account_type') }
										}
									}, {
										field: 'account_number', title: '口座番号', width: '30px',
										input: {
											onChange: (data, rowindex) => { this.changePayee(data, rowindex, 'account_number') }
										}
									}]}
									add={() => this.addList('payee',{ 'bank_info': '0', 'account_type': '0', 'account_number': '', })}
									remove={(data, index) => this.removeList('payee',index)}
									noneScroll
									fixed
								/>
							</FormGroup>
						}
					</Tab>
				</Tabs>	
						
				

			</Form>
		)
	}
}
