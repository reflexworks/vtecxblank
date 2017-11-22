/* @flow */
import React from 'react'
import {
	PageHeader,
	Form,
	PanelGroup,
	Panel,
	Tabs,
	Tab,
//	Glyphicon
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonTable
} from './common'

import {
	DeliveryChargeModal,
	ItemDetailsModal,
	BasicConditionModal,
	RemarksModal,
	ManifestoModal,
} from './quotation-modal'

export default class QuotationForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.quotation = this.entry.quotation || {}
		this.entry.billto = this.entry.billto || {}
		this.entry.basic_condition = this.entry.basic_condition || []
		this.entry.item_details = this.entry.item_details || []
		this.entry.remarks = this.entry.remarks || []
		this.entry.manifesto = this.entry.manifesto || []

		this.selectItemDetails = null

		this.modal = {
			basic_condition: { data: {} },
			item_details: { data: {} },
			remarks: { data: {} },
			manifesto: { data: {} }
		}

		this.sampleData()

	}

	sampleData() {

		this.entry.basic_condition = [{
			title: '委託される業務',
			condition: [{ content: 'ロジスティクス業務' }]
		},{
			title: '保管',
			condition: [{ content: '常温保管'}, { content: '共益費、光熱費、バース使用料含む'}, { content: '補償金不要'}]
		},{
			title: '荷役',
			condition: [{ content: '入庫作業　数量検品、外観検品'}, { content: '出荷作業　ピッキング、外観検品、梱包、出荷事務'}]
		},{
			title: '配送',
			condition: [{ content: '宅急便、DM便等にて発送'}]
		},{
			title: '保険',
			condition: [{ content: '発送：火災保険、保管：盗難、火災保険'}]
		},{
			title: '決済',
			condition: [{ content: '毎月末締切、翌月20日　銀行振込み（日本郵便ご利用の場合）'}, { content: '毎月末締切、翌月末日　銀行振込み'}]
		},{
			title: '取扱商品',
			condition: [{ content: '◯◯'}]
		},{
			title: '出荷データ',
			condition: [{ content: '伝票発行の際、お客様データの加工などは致しません。'}, { content: '弊社指定のCSV、EXCELデータが必須となります。'}]
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

		this.sampleData()

	}

	showAddModal(_key) {
		this.modal[_key].data = {}
		this.modal[_key].type = 'add'
		this.modal[_key].visible = true
		this.forceUpdate()
	}
	showEditModal(_key, _data, _index) {
		this.modal[_key].data = _data
		this.modal[_key].index = _index
		this.modal[_key].type = 'edit'
		this.modal[_key].visible = true
		this.forceUpdate()
	}
	closeModal(_key) {
		this.modal[_key].visible = false
		this.forceUpdate()
	}
	removeList(_key, _index) {
		let array = []
		for (let i = 0, ii = this.entry[_key].length; i < ii; ++i) {
			if (i !== _index) array.push(this.entry[_key][i])
		}
		this.entry[_key] = array
		this.forceUpdate()
	}
	addList(_key, _data) {
		this.entry[_key].push(_data)
		this.modal[_key].visible = false
		this.forceUpdate()
	}
	updateList(_key, _data) {
		this.entry[_key][this.modal[_key].index] = _data
		this.modal[_key].visible = false
		this.forceUpdate()
	}

	render() {

		return (

			<div>
				<Form horizontal>

					<CommonInputText
						controlLabel="見積書コード"
						name="quotation.quotation_code"
						type="text"
						value={this.entry.quotation.quotation_code}
						readonly
					/>
					<CommonInputText
						controlLabel="見積月"
						name="quotation.quotation_date"
						type="text"
						value={this.entry.quotation.quotation_date}
						readonly
					/>
					<CommonInputText
						controlLabel="請求先名"
						name="billto.billto_name"
						type="text"
						value={this.entry.billto.billto_name}
						readonly
					/>
				</Form>

				<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
					
					<DeliveryChargeModal isShow={this.state.showDeliveryChargeModal} close={() => this.setState({ showDeliveryChargeModal: false })} />
					<ItemDetailsModal
						isShow={this.modal.item_details.visible}
						close={() => this.closeModal('item_details')}
						add={(obj) => this.addList('item_details', obj)}
						edit={(obj) => this.updateList('item_details', obj)}
						data={this.modal.item_details.data}
						type={this.modal.item_details.type}
					/>
					<BasicConditionModal
						isShow={this.modal.basic_condition.visible}
						close={() => this.closeModal('basic_condition')}
						add={(obj) => this.addList('basic_condition', obj)}
						edit={(obj) => this.updateList('basic_condition', obj)}
						data={this.modal.basic_condition.data}
						type={this.modal.basic_condition.type}
					/>
					<RemarksModal
						isShow={this.modal.remarks.visible}
						close={() => this.closeModal('remarks')}
						add={(obj) => this.addList('remarks', obj)}
						edit={(obj) => this.updateList('remarks', obj)}
						data={this.modal.remarks.data}
						type={this.modal.remarks.type}
					/>
					<ManifestoModal
						isShow={this.modal.manifesto.visible}
						close={() => this.closeModal('manifesto')}
						add={(obj) => this.addList('manifesto', obj)}
						edit={(obj) => this.updateList('manifesto', obj)}
						data={this.modal.manifesto.data}
						type={this.modal.manifesto.type}
					/>
					
					<Tab eventKey={1} title="見積内容">

						<Form name={this.props.name} horizontal data-submit-form>

							<div className="hide">
								<CommonInputText
									controlLabel="見積書コード"
									name="quotation.quotation_code"
									type="text"
									value={this.entry.quotation.quotation_code}
								/>
								<CommonInputText
									controlLabel="見積月"
									name="quotation.quotation_date"
									type="text"
									value={this.entry.quotation.quotation_date}
								/>
								<CommonInputText
									controlLabel="請求先コード"
									name="billto.billto_code"
									type="text"
									value={this.entry.billto.billto_code}
									readonly
								/>
								<CommonInputText
									controlLabel="請求先名"
									name="billto.billto_name"
									type="text"
									value={this.entry.billto.billto_name}
									readonly
								/>
							</div>

							<PanelGroup defaultActiveKey="1">

								<Panel collapsible header="基本条件" eventKey="2" defaultExpanded={true}>

									<CommonTable
										name="basic_condition"
										data={this.entry.basic_condition}
										header={[{
											field: 'title',title: '条件名', width: '300px'
										}, {
											field: 'condition', title: '条件内容', width: '800px'
										}]}
										edit={(data, index) => this.showEditModal('basic_condition', data, index)}
										add={() => this.showAddModal('basic_condition')}
										remove={(data, index) => this.removeList('basic_condition', index)}
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
										edit={(data, index) => this.showEditModal('item_details', data, index)}
										add={() => this.showAddModal('item_details')}
										remove={(data, index) => this.removeList('item_details', index)}
									/>

								</Panel>

								<Panel collapsible header="備考情報" eventKey="2" defaultExpanded={true}>

									<CommonTable
										name="remarks"
										data={this.entry.remarks}
										header={[{
											field: 'content',title: '備考'
										}]}
										edit={(data, index) => this.showEditModal('remarks', data, index)}
										add={() => this.showAddModal('remarks')}
										remove={(data, index) => this.removeList('remarks', index)}
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
							edit={(data, index) => this.showEditModal('manifesto', data, index)}
							add={() => this.showAddModal('manifesto')}
							remove={(data, index) => this.removeList('manifesto', index)}
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
			</div>
		)
	}
}
