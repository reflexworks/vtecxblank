/* @flow */
import React from 'react'
import {
	PageHeader,
	Form,
	PanelGroup,
	Panel,
	Tabs,
	Tab,
	Table,
	Button,
	Glyphicon
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
//	CommonPrefecture,
	CommonInputText,
	//	CommonSelectBox,
	CommonFilterBox,
	CommonTable
} from './common'

export default class QuotationForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.customer = this.entry.customer || {}
		this.entry.work = this.entry.work || []
		this.entry.item_details = this.entry.item_details || []
		this.entry.manifesto = this.entry.manifesto || []

		this.sampleData()
	}

	sampleData() {
		this.entry.work = [{
			consignment_service: '委託される業務',
			workflow: 'ロジスティクス業務'
		},{
			consignment_service: '保管',
			workflow: ['常温保管', '共益費、光熱費、バース使用料含む', '補償金不要']
		},{
			consignment_service: '荷役',
			workflow: ['入庫作業　数量検品、外観検品', '出荷作業　ピッキング、外観検品、梱包、出荷事務']
		},{
			consignment_service: '配送',
			workflow: ['宅急便、DM便等にて発送']
		},{
			consignment_service: '保険',
			workflow: ['発送：火災保険、保管：盗難、火災保険']
		},{
			consignment_service: '決済',
			workflow: ['毎月末締切、翌月20日　銀行振込み（日本郵便ご利用の場合）', '毎月末締切、翌月末日　銀行振込み']
		},{
			consignment_service: '取扱商品',
			workflow: ['◯◯']
		},{
			consignment_service: '出荷データ',
			workflow: ['伝票発行の際、お客様データの加工などは致しません。', '弊社指定のCSV、EXCELデータが必須となります。']
		}]

		this.entry.item_details = [{
			item_name: '保管料',
			unit_name: '1坪',
			unit: '月',
			unit_price: '¥5,000',
			remarks: '棚、ラックシリーズ(新品：500円／中古品：300円)支給品利用可能'
		}, {
			item_name: '保管料',
			unit_name: '1パレット',
			unit: '月',
			unit_price: '¥2,500',
			remarks: 'サイズ1,100×1,100'
		}, {
			item_name: '保管料',
			unit_name: '1パレット',
			unit: '月',
			unit_price: '¥2,500',
			remarks: 'パレットラック縦積み'
		}, {
			item_name: '入庫作業量',
			unit_name: '入庫量',
			unit: '1点',
			unit_price: '¥10〜¥30',
			remarks: 'バラ、アソート入庫、外装検品、品番確認、数量検品、棚格納'
		}, {
			item_name: '入庫作業量',
			unit_name: '入庫量',
			unit: '1箱',
			unit_price: '¥50',
			remarks: '外装検品、品番確認、内装未見、箱積み'
		}, {
			item_name: '入庫作業量',
			unit_name: 'デバンニング',
			unit: '20F',
			unit_price: '¥18,000',
			remarks: 'ハイキューブ + ¥3,000'
		}, {
			item_name: '入庫作業量',
			unit_name: 'デバンニング',
			unit: '40F',
			unit_price: '¥33,000',
			remarks: 'ハイキューブ + ¥3,000'
		}]

		this.entry.manifesto = [{
			manifesto_code: 'dbox-016',
			manifesto_name: 'ダンボール箱 60サイズ 底面A5 20枚入り×2パック',
			material: 'K5×S120g×K5',
			thickness: '3,000',
			inside_width: '240',
			inside_depth: '160',
			inside_height: '170',
			outer_width: '246',
			outer_depth: '166',
			outer_height: '182',
			regular_price: '1,520',
			regular_unit_price: '38.0',
			special_price: '1,400',
			special_unit_price: '35.0'
		},{
			manifesto_code: 'dbox-017',
			manifesto_name: 'ダンボール箱 60サイズ 底面B5 20枚入り×2パック',
			material: 'K5×S120g×K5',
			thickness: '3,000',
			inside_width: '270',
			inside_depth: '190',
			inside_height: '110',
			outer_width: '276',
			outer_depth: '196',
			outer_height: '122',
			regular_price: '1,560',
			regular_unit_price: '39.0',
			special_price: '1,440',
			special_unit_price: '36.0'
		},{
			manifesto_code: 'dbox-018',
			manifesto_name: 'ダンボール箱 60サイズ 底面B5 20枚入り×2パック',
			material: 'K5×S120g×K5',
			thickness: '3,000',
			inside_width: '270',
			inside_depth: '190',
			inside_height: '110',
			outer_width: '276',
			outer_depth: '196',
			outer_height: '122',
			regular_price: '1,560',
			regular_unit_price: '39.0',
			special_price: '1,440',
			special_unit_price: '36.0'
		},{
			manifesto_code: 'dbox-019',
			manifesto_name: 'ダンボール箱 60サイズ 底面B5 20枚入り×2パック',
			material: 'K5×S120g×K5',
			thickness: '3,000',
			inside_width: '270',
			inside_depth: '190',
			inside_height: '110',
			outer_width: '276',
			outer_depth: '196',
			outer_height: '122',
			regular_price: '1,560',
			regular_unit_price: '39.0',
			special_price: '1,440',
			special_unit_price: '36.0'
		},{
			manifesto_code: 'dbox-020',
			manifesto_name: 'ダンボール箱 60サイズ 底面B5 20枚入り×2パック',
			material: 'K5×S120g×K5',
			thickness: '3,000',
			inside_width: '270',
			inside_depth: '190',
			inside_height: '110',
			outer_width: '276',
			outer_depth: '196',
			outer_height: '122',
			regular_price: '1,560',
			regular_unit_price: '39.0',
			special_price: '1,440',
			special_unit_price: '36.0'
		},{
			manifesto_code: 'dbox-016',
			manifesto_name: 'ダンボール箱 60サイズ 底面A5 20枚入り×2パック',
			material: 'K5×S120g×K5',
			thickness: '3,000',
			inside_width: '240',
			inside_depth: '160',
			inside_height: '170',
			outer_width: '246',
			outer_depth: '166',
			outer_height: '182',
			regular_price: '1,520',
			regular_unit_price: '38.0',
			special_price: '1,400',
			special_unit_price: '35.0'
		},{
			manifesto_code: 'dbox-017',
			manifesto_name: 'ダンボール箱 60サイズ 底面B5 20枚入り×2パック',
			material: 'K5×S120g×K5',
			thickness: '3,000',
			inside_width: '270',
			inside_depth: '190',
			inside_height: '110',
			outer_width: '276',
			outer_depth: '196',
			outer_height: '122',
			regular_price: '1,560',
			regular_unit_price: '39.0',
			special_price: '1,440',
			special_unit_price: '36.0'
		},{
			manifesto_code: 'dbox-018',
			manifesto_name: 'ダンボール箱 60サイズ 底面B5 20枚入り×2パック',
			material: 'K5×S120g×K5',
			thickness: '3,000',
			inside_width: '270',
			inside_depth: '190',
			inside_height: '110',
			outer_width: '276',
			outer_depth: '196',
			outer_height: '122',
			regular_price: '1,560',
			regular_unit_price: '39.0',
			special_price: '1,440',
			special_unit_price: '36.0'
		},{
			manifesto_code: 'dbox-019',
			manifesto_name: 'ダンボール箱 60サイズ 底面B5 20枚入り×2パック',
			material: 'K5×S120g×K5',
			thickness: '3,000',
			inside_width: '270',
			inside_depth: '190',
			inside_height: '110',
			outer_width: '276',
			outer_depth: '196',
			outer_height: '122',
			regular_price: '1,560',
			regular_unit_price: '39.0',
			special_price: '1,440',
			special_unit_price: '36.0'
		},{
			manifesto_code: 'dbox-020',
			manifesto_name: 'ダンボール箱 60サイズ 底面B5 20枚入り×2パック',
			material: 'K5×S120g×K5',
			thickness: '3,000',
			inside_width: '270',
			inside_depth: '190',
			inside_height: '110',
			outer_width: '276',
			outer_depth: '196',
			outer_height: '122',
			regular_price: '1,560',
			regular_unit_price: '39.0',
			special_price: '1,440',
			special_unit_price: '36.0'
		}]
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	onSelect() {
	}

	render() {

		return (

			<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">

				<Tab eventKey={1} title="見積書">

					<Form name={this.props.name} horizontal data-submit-form>

						<PanelGroup defaultActiveKey="1">

							<Panel collapsible header="顧客情報" eventKey="1" bsStyle="info" defaultExpanded="true">

								{/* 登録の場合 */}
								{!this.entry.customer.customer_code &&
									<CommonInputText
										controlLabel="顧客コード"
										name="customer.customer_code"
										type="text"
										placeholder="顧客コード"
										value={this.entry.customer.customer_code}
									/>
								}
								{!this.entry.customer.customer_code &&
									<CommonFilterBox
										controlLabel="顧客名"
										name="customer.customer_name"
										value={this.entry.customer.customer_name}
										options={[{
											label: '顧客A',
											value: '00001'
										}, {
											label: '顧客B',
											value: '00002'
										}]}
									/>
								}

								{/* 更新の場合 */}
								{this.entry.customer.customer_code &&
									<CommonInputText
										controlLabel="顧客コード"
										name="customer.customer_code"
										type="text"
										value={this.entry.customer.customer_code}
										readonly
									/>
								}
								{this.entry.customer.customer_code &&
									<CommonInputText
										controlLabel="顧客名"
										name="customer.customer_name"
										type="text"
										value={this.entry.customer.customer_name}
										readonly
									/>
								}

								<CommonInputText
									controlLabel="担当者"
									name="customer.customer_staff"
									type="text"
									value={this.entry.customer.customer_staff}
									readonly
								/>

							</Panel>

							<Panel collapsible header="基本条件" eventKey="2" defaultExpanded={false}>

								<CommonTable
									name="work"
									data={this.entry.work}
									edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
									header={[{
										field: 'consignment_service',title: '条件名', width: '300px'
									}, {
										field: 'workflow', title: '条件内容', width: '800px'
									}]}
								/>

							</Panel>

							<Panel collapsible header="見積明細情報" eventKey="2" bsStyle="info" defaultExpanded="true">

								<Button onClick={() => this.setState({ showManifestoModal: true })}>
									<Glyphicon glyph="plus"></Glyphicon>
								</Button>
								<CommonTable
									name="item_details"
									data={this.entry.item_details}
									edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
									header={[{
										field: 'item_name',title: '項目', width: '100px'
									}, {
										field: 'unit_name',title: '単位名称', width: '50px'
									}, {
										field: 'unit',title: '単位', width: '50px'
									}, {
										field: 'unit_price',title: '単価', width: '100px'
									}, {
										field: 'remarks',title: '備考', width: '500px'
									}]}
								/>

							</Panel>

							<Panel collapsible header="備考情報" eventKey="2" defaultExpanded={false}>

								<Button onClick={() => this.setState({ showRemarksModal: true })}>
									<Glyphicon glyph="plus"></Glyphicon>
								</Button>
								<CommonTable
									name="remarks"
									data={this.entry.remarks}
									edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
									header={[{
										field: 'content',title: '備考'
									}]}
								/>

							</Panel>
						
						</PanelGroup>

					</Form>
				</Tab>

				<Tab eventKey={2} title="配送料詳細">
					<PageHeader>発払い</PageHeader>
					<Table striped bordered>
						<thead>
							<tr>
								<th>利用運送会社</th>
								<th>サイズ(cm)</th>
								<th>重量(kg)</th>
								<th>南九州</th>
								<th>北九州</th>
								<th>四国</th>
								<th>中国</th>
								<th>関西</th>
								<th>北陸</th>
								<th>東海</th>
								<th>信越</th>
								<th>関東</th>
								<th>南東北</th>
								<th>北東北</th>
								<th>北海道</th>
								<th>沖縄</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>エコ配JP</td>
								<td>〜80</td>
								<td>15kg迄</td>
								<td>390</td>
								<td>390</td>
								<td>390</td>
								<td>390</td>
								<td>390</td>
								<td>390</td>
								<td>390</td>
								<td>390</td>
								<td>390</td>
								<td>390</td>
								<td>390</td>
								<td>600</td>
								<td>1,000</td>
							</tr>
							<tr>
								<td rowspan="3">ヤマト運輸</td>
								<td>60</td>
								<td>2kg迄</td>
								<td>780</td>
								<td>780</td>
								<td>690</td>
								<td>580</td>
								<td>470</td>
								<td>450</td>
								<td>450</td>
								<td>450</td>
								<td>450</td>
								<td>450</td>
								<td>470</td>
								<td>780</td>
								<td>1,050</td>
							</tr>
							<tr>
								<td>80</td>
								<td>5kg迄</td>
								<td>780</td>
								<td>780</td>
								<td>690</td>
								<td>580</td>
								<td>470</td>
								<td>450</td>
								<td>450</td>
								<td>450</td>
								<td>450</td>
								<td>450</td>
								<td>470</td>
								<td>780</td>
								<td>1,050</td>
							</tr>
							<tr>
								<td>100</td>
								<td>10kg迄</td>
								<td>780</td>
								<td>780</td>
								<td>690</td>
								<td>580</td>
								<td>470</td>
								<td>450</td>
								<td>450</td>
								<td>450</td>
								<td>450</td>
								<td>450</td>
								<td>470</td>
								<td>780</td>
								<td>1,050</td>
							</tr>
							<tr>
								<td>佐川急便</td>
								<td>160以上</td>
								<td>-</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
							</tr>
							<tr>
								<td>西濃運輸</td>
								<td>160以上</td>
								<td>-</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
								<td>※1</td>
							</tr>
						</tbody>
					</Table>
					<p>(※1 都度相談)</p>

					<PageHeader>メール便・ゆうパケット</PageHeader>
					<Table striped bordered>
						<thead>
							<tr>
								<th>サービス名</th>
								<th>サイズ(cm)</th>
								<th>重量(kg)</th>
								<th>価格</th>
								<th>追跡 有/無</th>
								<th>備考</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>ヤマトDM便</td>
								<td>2cm以内</td>
								<td>1kg未満</td>
								<td>90</td>
								<td>◯</td>
								<td>全国一律</td>
							</tr>
							<tr>
								<td>ネコポス</td>
								<td>2.5cm以内</td>
								<td>1kg未満</td>
								<td>190</td>
								<td>◯</td>
								<td>全国一律</td>
							</tr>
							<tr>
								<td>ゆうパケット</td>
								<td>3cm以内</td>
								<td>1kg未満</td>
								<td>180</td>
								<td>◯</td>
								<td>全国一律</td>
							</tr>
							<tr>
								<td rowspan="4">ゆうメール</td>
								<td>3.5cm以内</td>
								<td>250g以内</td>
								<td>95</td>
								<td>×</td>
								<td>全国一律</td>
							</tr>
							<tr>
								<td>3.5cm以内</td>
								<td>500g以内</td>
								<td>100</td>
								<td>×</td>
								<td>全国一律</td>
							</tr>
							<tr>
								<td>3.5cm以内</td>
								<td>700g以内</td>
								<td>115</td>
								<td>×</td>
								<td>全国一律</td>
							</tr>
							<tr>
								<td>3.5cm以内</td>
								<td>1kg以内</td>
								<td>120</td>
								<td>×</td>
								<td>全国一律</td>
							</tr>
							<tr>
								<td>EMS</td>
								<td>-</td>
								<td>-</td>
								<td>定価</td>
								<td>×</td>
								<td>18％割引</td>
							</tr>
						</tbody>
					</Table>

					<PageHeader>記事</PageHeader>
					<Table striped bordered>
						<tbody>
							<tr><td>エコ配JPは、土日祝日は対応不可となります。</td></tr>
							<tr><td>離島の別途料金につきましては、ヤマト宅急便はかかりません。</td></tr>
							<tr><td>荷物の運送につきましては、業務提携会社に準じます。</td></tr>
							<tr><td>コレクト（代金引換）手数料は、1万円以下全国一律300円(税別)、3万円以下全国一律400円(税別)、10万円以下全国一律600円(税別)を請求させて頂きます。</td></tr>
							<tr><td>...</td></tr>
							<tr><td>...</td></tr>
							<tr><td>...</td></tr>
							<tr><td>...</td></tr>
						</tbody>
					</Table>

				</Tab>
				<Tab eventKey={3} title="梱包資材">
					<Button onClick={() => this.setState({ showManifestoModal: true })}>
						<Glyphicon glyph="plus"></Glyphicon>
					</Button>
					<CommonTable
						name="manifesto"
						data={this.entry.manifesto}
						edit={{ title: '編集', onclick: this.onSelect.bind(this) }}
						header={[{
							field: 'manifesto_code',title: '品番', width: '100px'
						}, {
							field: 'manifesto_name', title: '商品名称', width: '200px'
						}, {
							field: 'material', title: '材質', width: '200px'
						}, {
							field: 'thickness', title: '厚み', width: '70px'
						}, {
							field: 'inside_width', title: '内寸幅', width: '70px'
						}, {
							field: 'inside_depth', title: '内寸奥行', width: '70px'
						}, {
							field: 'inside_height', title: '内寸高さ', width: '70px'
						}, {
							field: 'outer_width', title: '外寸幅', width: '70px'
						}, {
							field: 'outer_depth', title: '外寸奥行', width: '70px'
						}, {
							field: 'outer_height', title: '外寸高さ', width: '70px'
						}, {	
							field: 'regular_price', title: '通常販売価格', width: '150px'
						}, {
							field: 'regular_unit_price', title: '通常販売価格・単価', width: '150px'
						}, {
							field: 'special_price', title: '特別販売価格', width: '150px'
						}, {
							field: 'special_unit_price', title: '特別販売価格・単価', width: '150px'
						}]}
					/>
				</Tab>
				<Tab eventKey={4} title="庫内作業">
    					<CommonTable
    						name="internal_work"
    						data={this.entry.internal_work}
    						header={[{
    							field: 'staff_name',title: '担当者', width: '100px'
    						}, {
    							field: 'working_date', title: '作業日', width: '200px'
    						}, {
    							field: 'approval_status', title: '承認ステータス', width: '200px'
    						}, {
    							field: 'mgmt_basic_fee', title: '管理基本料', width: '200px'
    						}, {
    							field: 'custody_fee', title: '保管費', width: '150px'
    						}, {
    							field: 'additional1_palette', title: '追加１パレット', width: '200px'
    						}, {
    							field: 'additional2_steel_shelf', title: '追加２スチール棚', width: '200px'
    						}, {
    							field: 'deletion_palette', title: '削除パレット', width: '150px'
    						}, {
    							field: 'received', title: '入荷', width: '200px'
    						}, {
    							field: 'received_normal', title: '入荷（通常）', width: '200px'
    						}, {
    							field: 'returns', title: '返品処理', width: '200px'
    						}, {
    							field: 'received_others', title: '入荷（その他）', width: '200px'
    						}, {
    							field: 'packing_normal', title: '発送（通常）', width: '200px'
    						}, {
    							field: 'packing_others', title: '発送（その他）', width: '200px'
    						}, {
    							field: 'packing', title: '梱包数', width: '200px'	
    						}, {
    							field: 'yamato60size', title: 'ヤマト運輸６０サイズ迄', width: '200px'
    						}, {
    							field: 'seino', title: '西濃運輸', width: '200px'
    						}, {
    							field: 'cash_on_arrival', title: '着払い発送', width: '200px'
    						}, {
    							field: 'work_others', title: '作業・その他', width: '200px'
    						}, {
    							field: 'cardboard160', title: '段ボール（１６０）', width: '200px'
    						}, {
    							field: 'cardboard140', title: '段ボール（１４０）', width: '200px'
    						}, {
    							field: 'cardboard120', title: '段ボール（１２０）', width: '200px'
    						}, {
    							field: 'cardboard100', title: '段ボール（１００）', width: '200px'
    						}, {
    							field: 'cardboard80', title: '段ボール（８０）', width: '200px'
    						}, {
    							field: 'cardboard60', title: '段ボール（６０）', width: '200px'
    						}, {
    							field: 'corrugated_cardboard', title: '巻段ボール', width: '200px'
    						}, {
    							field: 'buffer_material', title: '緩衝材', width: '200px'
    						}, {
    							field: 'bubble_wrap', title: 'エアプチ', width: '200px'
    						}]}
    					/>
				</Tab>

			</Tabs>
		)
	}
}
