/* @flow */
import React from 'react'
import {
	Form,
	PanelGroup,
	Panel,
	PageHeader
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonDatePicker,
} from './common'

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
							readonly
						/>
					</Panel>

					<Panel collapsible header="見積項目作業" eventKey="2" bsStyle="info" defaultExpanded="true">
						
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
					
					<Panel collapsible header="発送作業" eventKey="5" bsStyle="info" defaultExpanded="true">
						
						<PageHeader>ヤマト運輸(発払い)</PageHeader>

						<CommonInputText
							controlLabel="サイズ"
							name="internal_work.yamato60size"
							type="text"
							value="60"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="2"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="420"
						/>

						<CommonInputText
							controlLabel="サイズ"
							name="internal_work.yamato60size"
							type="text"
							value="80"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="4"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="500"
						/>
					
						<CommonInputText
							controlLabel="サイズ"
							name="internal_work.yamato60size"
							type="text"
							value="100"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>
					
						<CommonInputText
							controlLabel="サイズ"
							name="internal_work.yamato60size"
							type="text"
							value="120"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<CommonInputText
							controlLabel="サイズ"
							name="internal_work.yamato60size"
							type="text"
							value="140"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<CommonInputText
							controlLabel="サイズ"
							name="internal_work.yamato60size"
							type="text"
							value="160"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<hr />

						<PageHeader>ヤマト運輸(着払い)</PageHeader>
						
						<CommonInputText
							controlLabel="サイズ"
							name="internal_work.yamato60size"
							type="text"
							value="60"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="2"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="420"
						/>

						<CommonInputText
							controlLabel=""
							name="internal_work.yamato60size"
							type="text"
							value="サイズ：80"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="4"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="500"
						/>
					
						<CommonInputText
							controlLabel=""
							name="internal_work.yamato60size"
							type="text"
							value="サイズ：100"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>
					
						<CommonInputText
							controlLabel=""
							name="internal_work.yamato60size"
							type="text"
							value="サイズ：120"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<CommonInputText
							controlLabel=""
							name="internal_work.yamato60size"
							type="text"
							value="サイズ：140"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<CommonInputText
							controlLabel=""
							name="internal_work.yamato60size"
							type="text"
							value="サイズ：160"
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<hr />

						<CommonInputText
							controlLabel="ヤマト運輸(ネコポス)"
							name="internal_work.yamato60size"
							type="text"
							value=""
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<hr />

						<CommonInputText
							controlLabel="佐川急便"
							name="internal_work.yamato60size"
							type="text"
							value=""
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<hr />

						<CommonInputText
							controlLabel="西濃運輸"
							name="internal_work.yamato60size"
							type="text"
							value=""
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<hr />

						<CommonInputText
							controlLabel="EMS"
							name="internal_work.yamato60size"
							type="text"
							value=""
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<hr />

						<CommonInputText
							controlLabel="ゆうパケット"
							name="internal_work.yamato60size"
							type="text"
							value=""
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>

						<hr />

						<CommonInputText
							controlLabel="ゆうメール"
							name="internal_work.yamato60size"
							type="text"
							value=""
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>
					
						<hr />

						<CommonInputText
							controlLabel="自社配送"
							name="internal_work.yamato60size"
							type="text"
							value=""
							readonly
						/>

						<CommonInputText
							controlLabel="梱包数"
							name="internal_work.packing"
							type="text"
							placeholder="9"
							value={this.entry.internal_work.packing}
							comparison="3"
						/>

						<CommonInputText
							controlLabel="配送料金"
							name="internal_work.seino"
							type="text"
							placeholder="999"
							value={this.entry.internal_work.seino}
							comparison="700"
						/>
					
					</Panel>
					
					<Panel collapsible header="資材梱包作業" eventKey="7" bsStyle="info" defaultExpanded="true">
						
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
							
						<CommonInputText
							controlLabel="備考１"
							name="internal_work.remarks1"
							type="text"
							placeholder="備考１"
							value={this.entry.internal_work.remarks1}
							validate="string"
							required
						/>

						<CommonInputText
							controlLabel="備考２"
							name="internal_work.remarks2"
							type="text"
							placeholder="備考２"
							value={this.entry.internal_work.remarks2}
							validate="string"
							required
						/>
					</Panel>
				        
				</PanelGroup>
				
			</Form>
		)
	}
}