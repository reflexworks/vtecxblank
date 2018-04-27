/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Grid,
	Row,
	Col,
	PageHeader,
	Form,
	FormGroup,
	FormControl,
} from 'react-bootstrap'
import type {
	Props
} from 'logioffice.types'

import {
	CommonFilterBox,
	CommonMonthlySelect,
	CommonInputText,
	CommonRegistrationBtn,
	CommonTable,
	CommonLoginUser
} from './common'

import {
	BilltoAddModal,
	BilltoEditModal,
} from './master-modal'

export default class QuotationRegistration extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			disabled: true
		}

		// 登録先のURL
		this.url = '/d/quotation'

		// 初期値の設定
		this.entry = {
			quotation: {},
			packing_items: [],
			billto: {},
			basic_condition: [],
			billfrom: {},
			contact_information:{}
		}

		this.master = {
			billtoList: []
		}

		this.billto = null
		this.monthly = null

		this.template = {
			quotation: {},
			packing_items: [],
			basic_condition: [{
				title: '委託される業務',
				condition: [{
					content: 'ロジスティクス業務'
				}]
			},{
				title: '保管',
				condition: [
					{ content: '常温保管' },
					{ content: '共益費、光熱費、バース使用料含む' },
					{ content: '保証金不要' },
				]
			},{
				title: '荷役',
				condition: [
					{ content: '入庫作業　数量検品、外観検品' },
					{ content: '出荷作業　ピッキング、外観検品、梱包、出荷事務' },
				]
			},{
				title: '配送',
				condition: [
					{ content: '宅配便、DM便等にて発送' },
				]
			},{
				title: '保険',
				condition: [
					{ content: '発送：火災保険　　保管：盗難、火災保険' },
				]
			},{
				title: '決済',
				condition: [
					{ content: '毎月末締切、翌月20日　銀行振込み(日本郵便ご利用の場合)' },
					{ content: '毎月末締切、翌月末日　銀行振込み' },
				]
			},{
				title: '取扱商品',
				condition: [
					{ content: '●●' },
				]
			},{
				title: '出荷データ',
				condition: [
					{ content: '伝票発行の際、お客様データの加工などは致しません。' },
					{ content: '弊社指定のCSV、EXCELデータが必須となります。' },
				]
			}],
			item_details: [
				{item_name: '保管料', unit_name: '月', unit: '1坪', unit_price: '4,700', remarks: '棚、ラックリース（新品：500円／中古品：300円）支給品利用可能'},
				{item_name: '保管料', unit_name: '月', unit: '1パレット', unit_price: '2,250', remarks: 'サイズ1,100×1,100 パレットラック、ネステナーによる縦積み'},
				{item_name: '入庫作業料', unit_name: '入庫料', unit: '1点', unit_price: '30', remarks: 'バラ、アソート入庫、外装検品、品番確認、数量検品、棚格納'},
				{item_name: '入庫作業料', unit_name: '入庫料', unit: '1箱', unit_price: '50', remarks: '外装検品、品番確認、内容未見、箱積み'},
				{item_name: '入庫作業料', unit_name: 'デバンニング', unit: '20F', unit_price: '18,000', remarks: 'ハイキューブ＋¥3,000'},
				{item_name: '入庫作業料', unit_name: 'デバンニング', unit: '40F', unit_price: '33,000', remarks: 'ハイキューブ＋¥3,000'},
				{item_name: '出荷作業料', unit_name: 'DM便･ﾈｺﾎﾟｽ･ゆうﾊﾟｹｯﾄ･ゆうﾒｰﾙ･定形外', unit: '1封緘', unit_price: '140', remarks: ''},
				{item_name: '出荷作業料', unit_name: '宅配便', unit: '1梱包', unit_price: '180', remarks: ''},
				{item_name: '出荷作業料', unit_name: 'ピッキング', unit: '1点', unit_price: '20', remarks: ''},
				{item_name: '出荷作業料', unit_name: '同梱作業', unit: '1枚/冊', unit_price: '10', remarks: '納品書、ステッカー、チラシ、カタログ、パンフレットなどの販促物'},
				{item_name: 'FBA出荷作業料', unit_name: 'ピッキング', unit: '1点', unit_price: '20', remarks: 'ピッキング、外装検品'},
				{item_name: 'FBA出荷作業料', unit_name: '梱包作業', unit: '1箱', unit_price: '100', remarks: ''},
				{item_name: 'FBA納品付帯作業料', unit_name: '開梱・閉梱', unit: '1箱', unit_price: '20', remarks: ''},
				{item_name: 'FBA納品付帯作業料', unit_name: 'ﾀｸﾞ貼り', unit: '1点', unit_price: '15', remarks: ''},
				{item_name: 'FBA納品付帯作業料', unit_name: 'ﾗﾍﾞﾙ発行', unit: '1ｼｰﾄ', unit_price: '100', remarks: 'ﾗﾍﾞﾙｼｰﾄ代・加工料込（ﾊﾞｰｺｰﾄﾞﾃﾞｰﾀ必須）'},
				{item_name: '付帯作業料', unit_name: 'ｴｱｷｬｯﾌﾟ巻き', unit: '1点', unit_price: '10', remarks: '※１ アクセサリー、小物（資材別）'},
				{item_name: '付帯作業料', unit_name: 'ｴｱｷｬｯﾌﾟ巻き', unit: '1箱', unit_price: '50', remarks: '※１ （資材別）'},
				{item_name: '付帯作業料', unit_name: '簡易包装', unit: '1箱', unit_price: '60', remarks: '※１ ラッピング袋などへ詰め込みのみ(資材別)'},
				{item_name: '付帯作業料', unit_name: '完全包装', unit: '1箱', unit_price: '100', remarks: '※１ ラッピング、ギフト梱包(資材別)'},
				{item_name: '付帯作業料', unit_name: '商品品番ｼｰﾙ貼り', unit: '1点', unit_price: '5', remarks: '※１ シール印刷、貼り作業（ペーパー代別）'},
				{item_name: '付帯作業料', unit_name: 'バーコード作成', unit: '1SKU', unit_price: '200', remarks: '※１ JAN登録は行いません'},
				{item_name: '付帯作業料', unit_name: 'その他', unit: '', unit_price: '', remarks: '※１ ご相談'},
				{item_name: '実地棚卸作業', unit_name: '人工', unit: '1時間', unit_price: '2,800', remarks: '※１ 必要な場合'},
				{item_name: 'イレギュラー処理費用', unit_name: '返品処理', unit: '1件', unit_price: '250', remarks: '住所不明・長期不在等で返品になった商品の在庫戻し、貴社報告'},
				{item_name: '運営管理費', unit_name: 'データ変換ソフト(月額) ', unit: '', unit_price: '5,000', remarks: 'ご希望に応じて　※２'},
				{item_name: '運営管理費', unit_name: '月額', unit: '', unit_price: '18,000', remarks: '専属窓口1名、在庫報告、システム保守、WMSが必要な場合別途相談'},
			],
			remarks: [
				{content: '※　梱包資材　　　支給品使用または別途相談'},
				{content: '※　対応日　　　　相談　※エコ配JPは土日祝日不可となります。'},
				{content: '※　出荷データ　　1回目 ～12:00迄 最終 14:00迄'},
				{content: '※　納品受入時間　15:00迄'},
				{content: '※　保管、作業場所は弊社倉庫のいずれかとなり、適宜移動する可能性がございます。'},
				{content: '※　上記にない項目（倉庫移動、付帯作業）等はご相談にて料金算出させて頂きます。'},
				{content: '※　上記御見積りは税抜きの金額になります。'},
				{content: '※１　該当項目はご希望に応じて作業を行いますので必須ではございません。'},
				{content: '※２　出荷指示データはご利用になられる運送会社の伝票発行システムに取り込めるように加工したデータとピッキングリストを納品して頂きますが、'},
				{content: '　　　弊社で開発したデータ変換ソフトをご利用頂きましたら、日々のデータ加工作業とピッキングリスト作成作業が不要となります。'},
			]
		}

		this.login_user = CommonLoginUser().get().staff_name

	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setBilltoMasterData()

	}

	setDisabled() {
		this.setState({ disabled: (this.monthly && this.billto ? false : true) })
	}

	setMonthly(_data) {
		this.monthly = _data
		this.setDisabled()
	}

	/**
	 * 請求先取得処理
	 */
	setBilltoMasterData(_billto) {

		this.setState({ isDisabled: true })

		axios({
			url: '/s/get-billto',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.billtoList = response.data.feed.entry
				this.billtoList = this.master.billtoList.map((obj) => {
					return {
						label: obj.billto.billto_name,
						value: obj.billto.billto_code,
						data: obj
					}
				})
				if (_billto) this.entry.billto = _billto
				if (this.entry.billto.billto_code) {
					let target_index
					for (let i = 0, ii = this.billtoList.length; i < ii; ++i) {
						if (this.entry.billto.billto_code === this.billtoList[i].value) {
							this.billto = this.billtoList[i].data
							target_index = i
							break
						}
					}
					if (this.billto) {
						this.changeBillto(this.billtoList[target_index])
					}
				}

				this.setDisabled()
			}

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	setBilltoData(_data, _modal) {
		this.setBilltoMasterData(_data.feed.entry[0].billto)
		if (_modal === 'add') {
			this.setState({ showBilltoAddModal: false })
		} else {
			this.setState({ showBilltoEditModal: false })
		}
	}

	/**
	 * 請求先変更処理
	 * @param {*} _data 
	 */
	changeBillto(_data) {
		if (_data) {
			this.entry.billto = _data.data.billto
			this.billto = _data.data
			//this.templateList = null
			//this.setTemplateData(this.entry.billto.billto_code)
		} else {
			this.entry.billto = {}
			this.billto = null
			//this.templateList = null
		}
		this.setDisabled()
	}

	/**
	 * テンプレート取得処理
	 */
	setTemplateData(_billto_code) {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/quotation?f&billto.billto_code=' + _billto_code,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
	
			if (response.status !== 204) {

				this.master.templateList = response.data.feed.entry
				this.templateList = this.master.templateList.map((obj) => {
					const label = obj.quotation.quotation_code + ' ( ' + obj.billto.billto_name +' ' + obj.quotation.quotation_date + ' )'
					return {
						label: label,
						value: obj.quotation.quotation_code,
						data: obj
					}
				})
				this.changeTemplate(this.templateList[0])
			}
			this.setDisabled()

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	changeTemplate(_data) {
		if (_data) {
			this.selectTemplate = _data.value
			this.template = _data.data
		} else {
			this.selectTemplate = null
			this.template = {
				packing_items: [],
				basic_condition: []
			}
		}
		this.forceUpdate()
	}

	/**
	 * 登録完了後の処理
	 */
	callbackRegistrationButton(_data) {
		if (_data) {
			location.href = '#/QuotationUpdate?' + _data.feed.entry[0].link[0].___href.replace('/quotation/', '')
		}
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >
						<PageHeader>見積書の作成</PageHeader>
					</Col>
				</Row>
				<Row>

					<BilltoAddModal isShow={this.state.showBilltoAddModal} close={() => this.setState({ showBilltoAddModal: false })} add={(data) => this.setBilltoData(data, 'add')} />
					<BilltoEditModal isShow={this.state.showBilltoEditModal} close={() => this.setState({ showBilltoEditModal: false })} edit={(data) => this.setBilltoData(data, 'edit')} data={this.billto} />

					<Form name="mainForm" horizontal data-submit-form>

						<CommonMonthlySelect
							controlLabel="見積月"  
							name="quotation.quotation_date"
							value={this.entry.quotation.quotation_date}
							onChange={(data)=>this.setMonthly(data)}
						/>

						<CommonFilterBox
							controlLabel="請求先"
							name=""
							value={this.entry.billto.billto_code}
							options={this.billtoList}
							add={() => this.setState({ showBilltoAddModal: true })}
							edit={() => this.setState({ showBilltoEditModal: true })}
							onChange={(data) => this.changeBillto(data)}
						/>

						{ this.entry.billto.billto_code && 
							<FormGroup className="hide">
								<CommonInputText
									name="billto.billto_name"
									type="text"
									value={this.entry.billto.billto_name}
								/>
								<CommonInputText
									controlLabel="請求先コード"
									name="billto.billto_code"
									type="text"
									value={this.entry.billto.billto_code}
								/>
								<FormControl name="quotation.quotation_code" type="text" value="${_addids}" />
								<FormControl name="quotation.quotation_code_sub" type="text" value="01" />
								<FormControl name="quotation.status" type="text" value="0" />
								<FormControl name="link" data-rel="self" type="text" value="/quotation/,${_addids},-,${quotation.quotation_code_sub}" />
								<FormControl name="creator" type="text" value={this.login_user} />
							
							</FormGroup>
						}
						{ !this.entry.billto.billto_code && 
							<FormGroup className="hide">
								<CommonInputText
									name="billto.billto_name"
									type="text"
									value=""
								/>
							</FormGroup>
						}

						{/*(this.templateList && this.templateList.length) &&
							<CommonFilterBox
								controlLabel="コピー元の見積書"
								name=""
								value={this.selectTemplate}
								options={this.templateList}
								detail={() => this.setState({ showQuotationDetailModal: true })}
								onChange={(data) => this.changeTemplate(data)}
							/>
						*/}
						<div className="hide">
							<CommonTable
								name="basic_condition"
								data={this.template.basic_condition}
								header={[{
									field: 'title',title: '条件名', width: '300px'
								}]}
							/>
							<CommonTable
								name="item_details"
								data={this.template.item_details}
								header={[{
									field: 'item_name',title: '項目', width: '100px'
								}]}
							/>
							<CommonTable
								name="remarks"
								data={this.template.remarks}
								header={[{
									field: 'content',title: '備考'
								}]}
							/>
							<CommonTable
								name="packing_items"
								data={this.template.packing_items}
								header={[{
									field: 'item_code',title: '品番', width: '100px'
								}]}
							/>
							<CommonInputText
								name="billfrom.billfrom_name"
								value={this.entry.billfrom.billfrom_name}
							/>
							<CommonInputText
								name="contact_information.tel"
								value={this.entry.contact_information.tel}
							/>

							<CommonTable
								controlLabel="口座情報"
								name="billfrom.payee"
								data={this.entry.billfrom.payee}
								header={[{
									field: 'bank_info', title: '銀行名', width: '30px',
									convert: {
										1: 'みずほ銀行', 2: '三菱東京UFJ銀行', 3: '三井住友銀行', 4: 'りそな銀行', 5: '埼玉りそな銀行',
										6: '楽天銀行',7:'ジャパンネット銀行',8:'巣鴨信用金庫',9:'川口信用金庫',10:'東京都民銀行',11:'群馬銀行',
									}
								}, {
									field: 'branch_office', title: '支店名', width: '30px',
								}, {
									field: 'account_type', title: '口座種類', width: '30px',convert: { 0: '普通' ,1: '当座',}
								}, {
									field: 'account_number', title: '口座番号', width: '30px',
								}, {
									field: 'account_name', title: '口座名義', width: '30px',
								}]}
								noneScroll
								fixed
							/>

						</div>
						<CommonRegistrationBtn
							controlLabel=" "
							label="見積内容入力へ"
							url={this.url}
							callback={(data) => this.callbackRegistrationButton(data)}
							disabled={this.state.disabled}
							pure
						/>
					</Form>
				</Row>
			</Grid>
		)
	}
}
