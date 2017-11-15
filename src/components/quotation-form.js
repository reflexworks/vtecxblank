/* @flow */
import React from 'react'
import {
	PageHeader,
	Form,
	PanelGroup,
	Panel,
	Tabs,
	Tab,
	Glyphicon
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	//	CommonSelectBox,
	CommonFilterBox,
	CommonTable
} from './common'

import {
	BilltoAddModal,
	BilltoEditModal,
} from './master-modal'

import {
	DeliveryChargeModal,
} from './quotation-modal'

export default class QuotationForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.customer = this.entry.customer || []
		this.entry.billto = this.entry.billto || {}
		this.entry.staff = this.entry.staff || {}
		this.entry.work = this.entry.work || []
		this.entry.item_details = this.entry.item_details || []
		this.entry.manifesto = this.entry.manifesto || []

		this.master = this.props.master
		this.billtoList = []

		this.formType = 'create'

		this.sampleData()

	}

	sampleData() {

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
		this.master = newProps.master

		this.billtoList = this.master.billtoList.map((obj) => {
			return {
				label: obj.billto.billto_name,
				value: obj.billto.billto_code,
				data: obj
			}
		})

		this.sampleData()

	}

	changeBillto(_data) {
		if (_data) {
			this.entry.customer = [{
				customer_code: '001',
				customer_tel: '00001',
				address2: 'aaa'
			},{
				customer_code: '002',
				customer_name_kana: 'アア',
				address1: 'bbb'
			}]
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
			this.entry.billto.billto_code = _data.value
			this.entry.billto.billto_name = _data.value
			this.billto = _data.data
		} else {
			this.entry.customer = []
			this.entry.work = []
			this.entry.billto.billto_name = ''
			this.entry.billto.billto_code = ''
			this.billto = null
		}
		this.forceUpdate()
	}

	addBillto(_data) {
		console.log(_data)
	}

	selectWork(_data) {
		console.log(_data)
	}
	removeWork(_data) {
		console.log(_data)
	}

	render() {

		return (

			<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
				
				<BilltoAddModal isShow={this.state.showBilltoAddModal} close={() => this.setState({ showBilltoAddModal: false })} add={(data) => this.addBillto(data)} />
				<BilltoEditModal isShow={this.state.showBilltoEditModal} close={() => this.setState({ showBilltoEditModal: false })} data={this.billto} />
				<DeliveryChargeModal isShow={this.state.showDeliveryChargeModal} close={() => this.setState({ showDeliveryChargeModal: false })} />

				<Tab eventKey={1} title="見積内容">

					<Form name={this.props.name} horizontal data-submit-form>

						<PanelGroup defaultActiveKey="1">

							<Panel collapsible header="請求先情報" eventKey="1" bsStyle="info" defaultExpanded="true">

								{/* 登録の場合 */}
								{this.formType === 'create' &&
									<CommonFilterBox
										controlLabel="請求先"
										name="billto.billto_name"
										value={this.entry.billto.billto_name}
										options={this.billtoList}
										add={() => this.setState({ showBilltoAddModal: true })}
										edit={() => this.setState({ showBilltoEditModal: true })}
										onChange={(data) => this.changeBillto(data)}
									/>
								}
								{this.billto &&
									<div>
										<CommonInputText
											controlLabel="電話番号"
											name="contact_information.tel"
											type="text"
											value={this.billto.contact_information.tel}
											readonly
										/>
										<CommonInputText
											controlLabel="都道府県"
											name="contact_information.prefecture"
											type="text"
											value={this.billto.contact_information.prefecture}
											readonly
										/>
										<CommonInputText
											controlLabel="市区群町村"
											name="contact_information.address1"
											type="text"
											value={this.billto.contact_information.address1}
											readonly
										/>
									</div>
								}

								{/* 更新の場合 */}
								{this.formType === 'edit' &&
									<CommonInputText
										controlLabel="請求先コード"
										name="billto.billto_code"
										type="text"
										value={this.entry.billto.billto_code}
										readonly
									/>
								}
								{this.formType === 'edit' &&
									<CommonInputText
										controlLabel="請求先名"
										name="billto.billto_name"
										type="text"
										value={this.entry.billto.billto_code}
										readonly
									/>
								}
								{this.entry.customer.length > 0 &&
									
									<CommonTable
										controlLabel="顧客一覧"
										name="customer"
										data={this.entry.customer}
										header={[{
											field: 'btn1', title: '詳細', label: <Glyphicon glyph="list-alt" />, width: '25px', onClick: () => this.setState({ showDeliveryChargeModal: true })
										}, {
											field: 'btn2', title: '配送料', label: <Glyphicon glyph="scale" />, width: '40px', onClick: () => this.setState({ showDeliveryChargeModal: true })
										}, {
											field: 'customer_code',title: '顧客コード', width: '100px'
										}, {
											field: 'customer_name', title: '顧客名', width: '300px'
										}, {
											field: 'customer_staff', title: '担当者名', width: '300px'
										}]}
									/>
								}
							</Panel>

							<Panel collapsible header="基本条件" eventKey="2" defaultExpanded={false}>

								<CommonTable
									name="work"
									data={this.entry.work}
									header={[{
										field: 'consignment_service',title: '条件名', width: '300px'
									}, {
										field: 'workflow', title: '条件内容', width: '800px'
									}]}
									edit={(data) => this.selectWork(data)}
									add={() => this.setState({ showWorkModal: true })}
									remove={(data) => this.removeWork(data)}
								/>

							</Panel>

							<Panel collapsible header="見積明細情報" eventKey="2" bsStyle="info" defaultExpanded={true}>

								<CommonTable
									name="item_details"
									data={this.entry.item_details}
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
									edit={(data) => this.selectWork(data)}
									add={() => this.setState({ showItemDetailsModal: true })}
									remove={(data) => this.removeWork(data)}
								/>

							</Panel>

							<Panel collapsible header="備考情報" eventKey="2" defaultExpanded={true}>

								<CommonTable
									name="remarks"
									data={this.entry.remarks}
									header={[{
										field: 'content',title: '備考'
									}]}
									edit={(data) => this.selectWork(data)}
									add={() => this.setState({ showRemarksModal: true })}
									remove={(data) => this.removeWork(data)}
								/>

							</Panel>
						
						</PanelGroup>

					</Form>
				</Tab>

				<Tab eventKey={2} title="梱包資材">
					<CommonTable
						name="manifesto"
						data={this.entry.manifesto}
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
						edit={(data) => this.selectWork(data)}
						add={() => this.setState({ showManifestoModal: true })}
						remove={(data) => this.removeWork(data)}
					/>
				</Tab>
				<Tab eventKey={3} title="庫内作業状況">
					<PageHeader>見積項目作業一覧</PageHeader>
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

					<PageHeader>発送作業一覧</PageHeader>
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

					<PageHeader>資材作業一覧</PageHeader>
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
