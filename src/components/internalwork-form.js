/* @flow */
import React from 'react'
import {
	Form,
	Button,
	Glyphicon,
	PanelGroup,
	Panel,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonDatePicker,
	CommonTable,
} from './common'


import {
	RemarksModal,
} from './remarks-modal'


export default class InternalWorkForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.internal_work = this.entry.internal_work || {}
	}


	/**
	 * remarksにRemarksModalのフォームで入力した物を追加する
	 */
	addRemarks(obj) {
		if (!this.entry.remarks) {
			this.entry.remarks = []
		}
		this.entry.remarks.push(obj)
		this.setState({showRemarksModal:false})
	}
	closeRemarks() {
		this.setState({showRemarksModal:false})
	}
	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="庫内作業情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						<CommonInputText
							controlLabel="担当者"
							name="internal_work.staff_name"
							type="text"
							placeholder="担当者名"
							value={this.entry.internal_work.staff_name}
							validate="string"
							required
						/>

						<CommonDatePicker
							controlLabel="作業日"  
							name="internal_work.working_date"
							placeholder="作業日"
							value={this.entry.internal_work.working_date}
							required
						/>

						<CommonInputText
							controlLabel="承認ステータス"
							name="internal_work.approval_status"
							type="text"
							placeholder="承認ステータス"
							value={this.entry.internal_work.approval_status}
							validate="string"
							required
						/>
					</Panel>

					<Panel collapsible header="保管・商品管理情報" eventKey="2" bsStyle="info" defaultExpanded="true">
						
						<CommonInputText
							controlLabel="管理基本料"
							name="internal_work.mgmt_basic_fee"
							type="text"
							placeholder="管理基本料"
							value={this.entry.internal_work.mgmt_basic_fee}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="保管費"
							name="internal_work.custody_fee"
							type="text"
							placeholder="保管費"
							value={this.entry.internal_work.custody_fee}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="追加１パレット"
							name="internal_work.additional1_palette"
							type="text"
							placeholder="追加１パレット"
							value={this.entry.internal_work.additional1_palette}
							validate="string"
							required
						/>
                        
						<CommonInputText
							controlLabel="追加２スチール棚"
							name="internal_work.additional2_steel_shelf"
							type="text"
							placeholder="追加２スチール棚"
							value={this.entry.internal_work.additional2_steel_shelf}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="削除パレット"
							name="internal_work.deletion_palette"
							type="text"
							placeholder="削除パレット"
							value={this.entry.internal_work.deletion_palette}
							validate="string"
							required
						/>
					</Panel>
					
					<Panel collapsible header="入荷情報" eventKey="3" bsStyle="info" defaultExpanded="true">

						<CommonInputText
							controlLabel="入荷"
							name="internal_work.received"
							type="text"
							placeholder="入荷"
							value={this.entry.internal_work.received}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="入荷(通常)"
							name="internal_work.received_normal"
							type="text"
							placeholder="入荷(通常)"
							value={this.entry.internal_work.received_normal}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="返品処理"
							name="internal_work.returns"
							type="text"
							placeholder="返品処理"
							value={this.entry.internal_work.returns}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="入荷その他"
							name="internal_work.received_others"
							type="text"
							placeholder="入荷その他"
							value={this.entry.internal_work.received_others}
							validate="string"
							required
						/>  
						
					</Panel>

					<Panel collapsible header="出庫(ピッキング)情報" eventKey="4" bsStyle="info" defaultExpanded="true">
						
						<CommonInputText
							controlLabel="発送(通常)"
							name="internal_work.packing_normal"
							type="text"
							placeholder="発送(通常)"
							value={this.entry.internal_work.packing_normal}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="発送(その他)"
							name="internal_work.packing_others"
							type="text"
							placeholder="発送(その他)"
							value={this.entry.internal_work.packing_others}
							validate="string"
							required
						/>

					</Panel>
					
					<Panel collapsible header="発送情報" eventKey="5" bsStyle="info" defaultExpanded="true">
						
						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="梱包数"
							value={this.entry.internal_work.packing}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="ヤマト運輸６０サイズ迄"
							name="internal_work.yamato60size"
							type="text"
							placeholder="ヤマト運輸６０サイズ迄"
							value={this.entry.internal_work.yamato60size}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="西濃運輸"
							name="internal_work.seino"
							type="text"
							placeholder="西濃運輸"
							value={this.entry.internal_work.seino}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="着払い発送"
							name="internal_work.cash_on_arrival"
							type="text"
							placeholder="着払い発送"
							value={this.entry.internal_work.cash_on_arrival}
							validate="string"
							required
						/>

					</Panel>
					
					<Panel collapsible header="作業情報" eventKey="6" bsStyle="info" defaultExpanded="true">
						
						<CommonInputText
							controlLabel="作業・その他"
							name="internal_work.work_others"
							type="text"
							placeholder="作業・その他"
							value={this.entry.internal_work.work_others}
							validate="string"
							required
						/>

					</Panel>
					
					<Panel collapsible header="資材内訳情報" eventKey="7" bsStyle="info" defaultExpanded="true">
						
						<CommonInputText
							controlLabel="ダンボール(160)"
							name="internal_work.cardboard160"
							type="text"
							placeholder="ダンボール(160)"
							value={this.entry.internal_work.cardboard160}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="ダンボール(140)"
							name="internal_work.cardboard140"
							type="text"
							placeholder="ダンボール(140)"
							value={this.entry.internal_work.cardboard160}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="ダンボール(120)"
							name="internal_work.cardboard120"
							type="text"
							placeholder="ダンボール(120)"
							value={this.entry.internal_work.cardboard120}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="ダンボール(100)"
							name="internal_work.cardboard100"
							type="text"
							placeholder="ダンボール(100)"
							value={this.entry.internal_work.cardboard100}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="ダンボール(80)"
							name="internal_work.cardboard80"
							type="text"
							placeholder="ダンボール(80)"
							value={this.entry.internal_work.cardboard80}
							validate="string"
							required
						/>


						<CommonInputText
							controlLabel="ダンボール(60)"
							name="internal_work.cardboard60"
							type="text"
							placeholder="ダンボール(60)"
							value={this.entry.internal_work.cardboard60}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="巻段ボール"
							name="internal_work.corrugated_cardboard"
							type="text"
							placeholder="巻段ボール"
							value={this.entry.internal_work.corrugated_cardboard}
							validate="string"
							required
						/>
                        
						<CommonInputText
							controlLabel="緩衝材"
							name="internal_work.buffer_material"
							type="text"
							placeholder="緩衝材"
							value={this.entry.internal_work.buffer_material}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="エアプチ"
							name="internal_work.bubble_wrap"
							type="text"
							placeholder="エアプチ"
							value={this.entry.internal_work.bubble_wrap}
							validate="string"
							required
						/>
                        
					</Panel>

					
					<Panel collapsible header="備考" eventKey="8" bsStyle="info" defaultExpanded="true">
							
						<RemarksModal isShow={this.state.showRemarksModal}
							callback={(obj) => this.addRemarks(obj)}
							callbackClose={() => this.closeRemarks()} />
							
						<CommonTable
							name="remarks"
							data={this.entry.remarks}
							header={[{
								field: 'content', title: '内容',width: '200px'
							}]}
						>
							<Button onClick={() => this.setState({ showRemarksModal: true })}>
								<Glyphicon glyph="plus"></Glyphicon>
							</Button>
						</CommonTable>
					</Panel>
				        
				</PanelGroup>
				
			</Form>
		)
	}
}