/* @flow */
import React from 'react'
import axios from 'axios'
import {
	Form,
	//FormGroup,
	PanelGroup,
	Panel,
} from 'react-bootstrap'
import type {
	Props
} from 'demo3.types'

import {
	CommonInputText,
	CommonFilterBox,
} from './common'

export default class StaffForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.staff = this.entry.staff || {}
		this.master = {
			staffList:[]
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
		this.setStaffMasterData()
	}

	/**
	 * 請求先取得処理
	 */
	setStaffMasterData(_staff,) {

		this.setState({ isDisabled: true })

		axios({
			url: '/d/staff?f&staff.role=2',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
		
			if (response.status !== 204) {

				this.master.staffList = response.data.feed.entry
				this.staffList = this.master.staffList.map((obj) => {
					return {
						label: obj.staff.staff_name,
						value: obj.staff.staff_name,
						data: obj
					}
				})
				if (_staff) this.entry.staff = _staff
				if (this.entry.staff.staff_name) {
		
					for (let i = 0, ii = this.staffList.length; i < ii; ++i) {
						if (this.entry.staff.superior_email === this.staffList[i].data.staff.staff_email) {
							this.entry.staff.superior_name = this.staffList[i].data.staff.staff_name
						} 

						if (this.entry.staff.staff_name === this.staffList[i].value) {
							this.staff = this.staffList[i].data
							this.entry.staff.superior_name = this.staffList[i].staff_name
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
	changeSuperior(_data) {
		if (_data) {
			this.entry.staff.superior_name  = _data.label
			this.entry.staff.superior_email = _data.data.staff.staff_email
			this.staff = _data.data
		} else {
			this.entry.staff.superior_name = ''
			this.entry.staff.superior_email = ''
			this.staff = {}
		}
		this.forceUpdate()
	}

	/**
	 * ロール選択で作業員が選ばれたら上長情報パネルフラグを立てる
	 */
	changedRole(value) {
		this.entry.staff.role = value.value
		this.forceUpdate()
	}

	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>

				<PanelGroup defaultActiveKey="1">

					<Panel collapsible header="担当者情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						<CommonInputText
							controlLabel="担当者名"
							name="staff.staff_name"
							type="text"
							placeholder="担当者名"
							value={this.entry.staff.staff_name}
							validate="string"
							required
						/>	
						
						<CommonFilterBox
							controlLabel="ロール"
							size="sm"
							name="staff.role"
							value={this.entry.staff.role}
							options={[{
								label: '管理者',
								value: '1'
							}, {
								label: '上長',
								value: '2'
							}, {
								label: '作業員',
								value: '3'
							}, {
								label: '営業',
								value: '4'
							}, {
								label: '経理',
								value: '5'	
							}]}
							onChange={(value) => this.changedRole(value)}
						/>


						<CommonInputText
							controlLabel="メールアドレス"
							name="staff.staff_email"
							type="email"
							placeholder="logioffice@gmail.com"
							value={this.entry.staff.staff_email}
						/>

					</Panel>

					{ this.entry.staff.role === '3' && 
						
						<Panel collapsible header="上長情報" eventKey="2" bsStyle="info" defaultExpanded="true">
							<CommonFilterBox
								controlLabel="上長名"
								name=""
								value={this.entry.staff.superior_name}
								options={this.staffList}
								onChange={(data) => this.changeSuperior(data)}
							/>
							{ this.entry.staff.superior_email && 
								<CommonInputText
									controlLabel="上長メールアドレス"
									name="staff.superior_email"
									type="text"
									value={this.entry.staff.superior_email}
									readonly
								/>
							}
						</Panel>
					}	

				</PanelGroup>
			</Form>
		)
	}
}