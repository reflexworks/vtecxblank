/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form,
	PanelGroup,
	Panel,
	Button,
	Glyphicon,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonFilterBox,
	CommonTable,
} from './common'

import {
	BasicModal,
} from './basiccondition-modal'

import {
	BilltoAddModal,
	BilltoEditModal,
} from './quotation-modal'



export default class BasicConditionForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			 showConditionModal: false,
		}

		this.entry = this.props.entry
		this.entry.billto = this.entry.billto || {}
		this.entry.basic_condition = this.entry.basic_condition || {}

		this.master = {
			billtoList: []
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
	 * 画面描画の前処理
	 */
	componentWillMount() {

		this.setState({ isDisabled: true })
		this.setBilltoMasterData()

	}

	/**
	 * 請求先取得処理
	 */
	setBilltoMasterData(_billto) {
		axios({
			url: '/d/billto?f',
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
					for (let i = 0, ii = this.billtoList.length; i < ii; ++i) {
						if (this.entry.billto.billto_code === this.billtoList[i].value) {
							this.billto = this.billtoList[i].data
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
	 * 請求先変更処理
	 * @param {*} _data 
	 */
	changeBillto(_data) {
		if (_data) {
			this.entry.billto = _data.data.billto
			this.entry.billto.billto_name = _data.value
			this.billto = _data.data
		} else {
			this.entry.billto = {}
			this.billto = {}
		}
		this.forceUpdate()
	}

	addCondition(obj) {
		console.log(obj)
		if (!this.entry.basic_condition.condition) {
			console.log('create')
			this.entry.basic_condition.condition = []
		}
		this.entry.basic_condition.condition.push(obj)
		this.setState({ showConditionModal: false })
		
	}

	closeCondition() {
		this.setState({showConditionModal:false})    
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<BilltoAddModal isShow={this.state.showBilltoAddModal} close={() => this.setState({ showBilltoAddModal: false })} add={(data) => this.addBillto(data)} />
					<BilltoEditModal isShow={this.state.showBilltoEditModal} close={() => this.setState({ showBilltoEditModal: false })} data={this.billto} />
					<Panel collapsible header="請求先情報" eventKey="2" bsStyle="info" defaultExpanded={true}>
						<CommonFilterBox
							controlLabel="請求先"
							name="billto.billto_name"
							value={this.entry.billto.billto_name}
							options={this.billtoList}
							add={() => this.setState({ showBilltoAddModal: true })}
							edit={() => this.setState({ showBilltoEditModal: true })}
							onChange={(data) => this.changeBillto(data)}
						/>
						{ this.entry.billto.billto_name && 
							<CommonInputText
								controlLabel="請求先コード"
								name="billto.billto_code"
								type="text"
								value={this.entry.billto.billto_code}
								readonly
							/>
						}
					</Panel>

					<Panel collapsible header="基本条件情報" eventKey="2" bsStyle="info" defaultExpanded="true">

						<CommonInputText
							controlLabel="タイトル"
							name="basic_condition.title"
							type="text"
							placeholder="タイトル"
							value={this.entry.basic_condition.title}
							validate="string"
							required
						/>

						
						
						<CommonTable
							controlLabel="基本条件"
							name="basic_condition.condition"
							data={this.entry.basic_condition.condition}
							//edit={(data) => this.onSelectCondition(data) }
							header={[{

								field: 'content',title: '内容', width: '200px'
							}]}
						>
							<Button onClick={() => this.setState({ showConditionModal: true })}>
								<Glyphicon glyph="plus"></Glyphicon>
							</Button>
						</CommonTable>
						
						<BasicModal isShow={this.state.showConditionModal}
							callback={(obj) => this.addCondition(obj)}
							callbackClose={() => this.closeCondition()} />
						
					</Panel>
				</PanelGroup>
			</Form>
		)
	}
}