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
	//CommonRadioBtn,
} from './common'

export default class InvoiceForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry

		this.entry = this.props.entry
		this.entry.invoice = this.entry.invoice || {}
		this.entry.invoice.other_quotation = this.entry.invoice.other_quotaton || []
		//this.entry.billto = this.entry.billto || {}
		//this.entry.contact_information = this.entry.contact_information
		//this.entry.item_details = this.entry.item_details || []
		//this.entry.remarks = this.entry.remarks || []
		
		//this.entry.work = this.entry.work || []
		//this.entry.manifesto = this.entry.manifesto || []

		this.sampleData()
	}

	sampleData() {
		this.entry.invoice.quotation_code = '1710-01317'
		//this.entry.invoice.subtotal = '¥100,000'
		this.entry.invoice.consumption_tax = '¥8,000'
		this.entry.invoice.total_amount = '¥108,000'
		this.entry.invoice.content = 'CONNECTロジスティクス株式会社'
		
		this.sampleMonthlyWork = [{
			work: '保管料',
			quantity: '4',
			unit: '1坪/月',
			unit_price: '¥5,000',
			cost: '¥20,000',
			remarks: '棚、ラックリース(新品:500円/中古品:300円)支給品利用可能',
		}, {
			work: '保管料',
			quantity: '5',
			unit: '1パレット/月',
			unit_price: '¥2,500',
			cost: '¥12,500',
			remarks: 'サイズ1,100×1,100',
		}, {
			work: '保管料',
			quantity: '5',
			unit: '1パレット/月',
			unit_price: '¥2,500',
			cost: '¥12,500',
			remarks: 'パレットラック縦積み',
		}, {
			work: '運営管理費',
			quantity: '',
			unit: 'データ変換ソフト/月額',
			unit_price: '¥10,000',
			cost: '¥10,000',
			remarks: 'ご希望に応じて',
		}, {
			work: '運営管理費',
			quantity: '',
			unit: '月額',
			unit_price: '¥35,000',
			cost: '¥35,000',
			remarks: '専属窓口1名、在庫報告、システム保守、WMSが必要な場合別途相談',
		}]

		this.sampleDateWork = [{
			work: '入庫作業料',
			quantity: '4',
			unit: '入庫量/1点',
			unit_price: '¥10~30',
			cost: '¥120',
			remarks: 'バラ、アソート入庫、外装検品、品番確認、数量検品、棚格納',
		}, {
			work: '入庫作業料',
			quantity: '4',
			unit: '入庫量/1箱',
			unit_price: '¥50',
			cost: '¥200',
			remarks: '外装検品、品番確認、内容未見、箱積み',
		}, {
			work: '入庫作業料',
			quantity: '4',
			unit: 'デバンニング/20F',
			unit_price: '¥18,000',
			cost: '¥72,000',
			remarks: 'ハイキューブ＋¥3,000',
		}, {
			work: '入庫作業料',
			quantity: '4',
			unit: 'デバンニング/40F',
			unit_price: '¥33,000',
			cost: '¥132,000',
			remarks: 'ハイキューブ＋¥3,000',
		}, {
			work: '出荷作業料',
			quantity: '4',
			unit: 'DM便・ネコポス・ゆうパケット・ゆうメール・定形外/1封緘',
			unit_price: '¥200',
			cost: '¥800',
			remarks: '',
		}, {
			work: '出荷作業料',
			quantity: '4',
			unit: '宅配便/1梱包',
			unit_price: '¥300',
			cost: '¥1,200',
			remarks: '',
		}, {
			work: '出荷作業料',
			quantity: '4',
			unit: 'ピッキング/1点',
			unit_price: '¥30',
			cost: '¥120',
			remarks: '',
		}, {
			work: '出荷作業料',
			quantity: '4',
			unit: '同梱作業/1枚/冊',
			unit_price: '¥10',
			cost: '¥40',
			remarks: 'ステッカー、チラシ、カタログ、パンフレットなどの販促物',
		}, {
			work: '付帯作業料',
			quantity: '4',
			unit: 'エアキャップ巻き/1点',
			unit_price: '¥15',
			cost: '¥60',
			remarks: 'アクセサリー、小物(資材別)',
		}, {
			work: '付帯作業料',
			quantity: '4',
			unit: 'エアキャップ巻き/1箱',
			unit_price: '¥50',
			cost: '¥200',
			remarks: '(資材別)',
		}, {
			work: '付帯作業料',
			quantity: '4',
			unit: '簡易包装/1箱',
			unit_price: '¥100',
			cost: '¥400',
			remarks: 'ラッピング袋などへ積み込みのみ(資材別)',
		}, {
			work: '付帯作業料',
			quantity: '4',
			unit: '完全包装/1箱',
			unit_price: '¥200',
			cost: '¥800',
			remarks: 'ラッピング、ギフト梱包(資材別)',
		}, {
			work: '付帯作業料',
			quantity: '4',
			unit: '商品品番シール貼り/1点',
			unit_price: '¥5',
			cost: '¥20',
			remarks: 'シール印字・貼り作業(ペーパー第別)',
		}, {
			work: '付帯作業料',
			quantity: '4',
			unit: 'バーコード作成/1KSU',
			unit_price: '¥200',
			cost: '¥800',
			remarks: 'JAN登録は行いません',
		}, {
			work: '実地棚卸作業',
			quantity: '4',
			unit: '人口/1時間',
			unit_price: '¥2,500',
			cost: '¥10,000',
			remarks: '必要な場合',
		}, {
			work: 'イレギュラー処理費用',
			quantity: '4',
			unit: '返品処理/1件',
			unit_price: '¥200',
			cost: '¥800',
			remarks: '住所不明・長期不在などで返品になった商品の在庫戻し、貴社報告',
		}]
		
		this.samplePackingItem = [{
			work: '資材費(ダンボール3.5cm<大>)',
			quantity: '2,300',
			unit: '枚',
			unit_price: '¥21',
			cost: '¥48.300',
			remarks: '',
		}, {
			work: '資材費(ダンボール160サイズ)',
			quantity: '0',
			unit: 'セット',
			unit_price: '¥767',
			cost: '¥0',
			remarks: '',
		}]

		this.sampleDelivery = [{
			work: 'エコ配JP',
			quantity: '161',
			unit: '個',
			unit_price: '¥390',
			cost: '¥62,790',
			remarks: '',
		}, {
			work: 'ヤマト運輸発払',
			quantity: '97',
			unit: '個',
			unit_price: '¥500',
			cost: '¥47,500',
			remarks: '',
		}, {
			work: '佐川急便発払',
			quantity: '32',
			unit: '個',
			unit_price: '¥400',
			cost: '¥12,800',
			remarks: '',
		}, {
			work: '西濃運輸',
			quantity: '144',
			unit: '個',
			unit_price: '¥1,070',
			cost: '¥154,080',
			remarks: '',
		}, {
			work: '自社配送',
			quantity: '180',
			unit: '個',
			unit_price: '¥300',
			cost: '¥54,000',
			remarks: '',
		}]
				
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	addList(_data) {
		this.entry.invoice.other_quotation.push(_data)
		this.forceUpdate()
	}

	removeList(_index) {
		let array = []
		for (let i = 0, ii = this.entry.invoice.other_quotation.length; i < ii; ++i) {
			if (i !== _index) array.push(this.entry.invoice.other_quotation[i])
		}
		this.entry.invoice.other_quotation = array
		this.forceUpdate()
	}
	
	changeDetails(_data,_rowindex) {
		this.entry.invoice.other_quotation[_rowindex].details = _data
		this.forceUpdate()
	}

	changeCost(_data, _rowindex) {
		this.entry.invoice.other_quotation[_rowindex].cost = _data
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
						
				<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

					<Tab eventKey={1} title="金額">
						<PanelGroup defaultActiveKey="1">
							<Panel collapsible header="月次情報" eventKey="1" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="item_details"
									data={this.sampleMonthlyWork}
									edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
									header={[{
										field: 'work',title: 'ご請求内容(作業内容)', width: '200px'
									}, {
										field: 'quantity',title: '数量', width: '50px'
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'unit_price',title: '単価', width: '100px'
									}, {
										field: 'cost', title: '金額', width: '500px'
									}, {
										field: 'remarks',title: '備考', width: '500px'	
									}]}
								/>
							</Panel>
								
							<Panel collapsible header="日時作業情報" eventKey="2" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="item_details"
									data={this.sampleDateWork}
									edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
									header={[{
										field: 'work',title: 'ご請求内容(作業内容)', width: '200px'
									}, {
										field: 'quantity',title: '数量', width: '50px'
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'unit_price',title: '単価', width: '100px'
									}, {
										field: 'cost', title: '金額', width: '500px'
									}, {
										field: 'remarks',title: '備考', width: '500px'	
									}]}
								/>
							</Panel>

							<Panel collapsible header="資材情報" eventKey="3" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="item_details"
									data={this.samplePackingItem}
									edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
									header={[{
										field: 'work',title: 'ご請求内容(作業内容)', width: '200px'
									}, {
										field: 'quantity',title: '数量', width: '50px'
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'unit_price',title: '単価', width: '100px'
									}, {
										field: 'cost', title: '金額', width: '500px'
									}, {
										field: 'remarks',title: '備考', width: '500px'	
									}]}
								/>
							</Panel>

							<Panel collapsible header="配送料" eventKey="4" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="item_details"
									data={this.sampleDelivery}
									edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
									
									header={[{
										field: 'work',title: 'ご請求内容(作業内容)', width: '200px'
									}, {
										field: 'quantity',title: '数量', width: '50px'
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'unit_price',title: '単価', width: '100px'
									}, {
										field: 'cost', title: '金額', width: '500px'
									}, {
										field: 'remarks',title: '備考', width: '500px'	
									}]}
								/>
							</Panel>	
									
							<Panel collapsible header="その他" eventKey="5" bsStyle="info" defaultExpanded="true">
								<CommonTable
									//name="other_quotation"
									data={this.entry.invoice.other_quotation}
									header={[{
										field: 'details', title: '項目', width: '100px',
										input: {
											onChange: (data, rowindex)=>{this.changeDetails(data,rowindex)}
										}
									}, {
										field: 'quantity',title: '数量', width: '50px',
										input: {
											onChange: (data, rowindex)=>{this.changeCost(data,rowindex)}
										}
									}, {
										field: 'unit',title: '単位', width: '50px',
										input: {
											onChange: (data, rowindex)=>{this.changeCost(data,rowindex)}
										}
									}, {
										field: 'unit_price',title: '単価', width: '50px',
										input: {
											onChange: (data, rowindex)=>{this.changeCost(data,rowindex)}
										}
									}, {
										field: 'cost',title: '金額', width: '50px',
										input: {
											onChange: (data, rowindex)=>{this.changeCost(data,rowindex)}
										}
									}, {
										field: 'remarks',title: '備考', width: '50px',
										input: {
											onChange: (data, rowindex)=>{this.changeCost(data,rowindex)}
										}
									}]}
									add={() => this.addList({ details: '',quantity: '',unit: '',unit_price: '',cost: '',remarks:'',})}
									remove={(data, index) => this.removeList(index)}
									fixed
								/>
							</Panel>	
						</PanelGroup>
						<br />
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

					<Tab eventKey={2} title="振込先"> 
						<CommonInputText
							controlLabel="振込先"
							//name="invoice.payee.content"
							type="text"
							placeholder="振込先"
							value={this.entry.invoice.content}
							readonly
						/>

					</Tab>
				</Tabs>	
						
				

			</Form>
		)
	}
}
