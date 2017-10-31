/* @flow */
import React from 'react'
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
	CommonTable,
} from './common'

import {
	StorageModal,
	Package_handlingModal,
	Shipping_dataModal,
} from './work-modal'

export default class WorkForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			showStorageModal: false,
			showPackage_handlingModal: false,
			showShipping_dataModal: false,
		}

		this.entry = this.props.entry
		this.entry.work = this.entry.work || {}


		this.forceUpdate()
	}

	/**
     * storageにOrderStorageModalのフォームで入力した物を追加する
     */
	addStorage(obj) {
		if (!this.entry.work.storage) {
			this.entry.work.storage = []   
		}
		this.entry.work.storage.push(obj)
		this.setState({showStorageModal:false})
	}
	closeStorage() {
		this.setState({showStorageModal:false})    
	}

	/**
     * Package_handlingにPackage_handlingModalのフォームで入力した物を追加する
     */
	addPackage_handling(obj) {
		if (!this.entry.work.package_handling) {
			this.entry.work.package_handling = []   
		}
		this.entry.work.package_handling.push(obj)
		this.setState({showPackage_handlingModal:false})
	}
	closePackage_handling() {
		this.setState({showPackage_handlingModal:false})    
	}

	/**
     * shipping_dataにShipping_dataModalのフォームで入力した物を追加する
     */
	addShipping_data(obj) {
		if (!this.entry.work.shipping_data) {
			this.entry.work.shipping_data = []   
		}
		this.entry.work.shipping_data.push(obj)
		this.setState({showShipping_dataModal:false})
	}
	closeShipping_data() {
		this.setState({showShipping_dataModal:false})    
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

					<Panel collapsible header="業務情報" eventKey="1" bsStyle="info" defaultExpanded="true">

						<CommonInputText
							controlLabel="委託される業務"
							name="work.consignment_service"
							type="text"
							placeholder="委託される業務"
							value={this.entry.work.consignment_service}
							validate="string"
							required
						/>

						<StorageModal isShow={this.state.showStorageModal}
									  callback={(obj) => this.addStorage(obj)}
									  callbackClose={() => this.closeStorage()} />
						
						<CommonTable
							controlLabel="保管内容"	
							name="work.storage" 
							data={this.entry.work.storage}
							header={[{
								field: 'content', title: '内容',width: '200px'
							}]}
						>
							<Button onClick={() => this.setState({ showStorageModal: true })}>
								<Glyphicon glyph="plus"></Glyphicon>
							</Button>
						</CommonTable>

						<Package_handlingModal isShow={this.state.showPackage_handlingModal}
									  callback={(obj) => this.addPackage_handling(obj)}
									  callbackClose={() => this.closePackage_handling()} />

						<CommonTable
							controlLabel="荷役"	
							name="work.package_handling" 
							data={this.entry.work.package_handling}
							header={[{
								field: 'content', title: '内容',width: '200px'
							}]}
						>
							<Button onClick={() => this.setState({ showPackage_handlingModal: true })}>
								<Glyphicon glyph="plus"></Glyphicon>
							</Button>
						</CommonTable>
						
						<CommonInputText
							controlLabel="配送"
							name="work.delivery"
							type="text"
							placeholder="配送"
							value={this.entry.work.delivery}
						/>

						<CommonInputText
							controlLabel="保険"
							name="work.insurance"
							type="text"
							placeholder="保険"
							value={this.entry.work.insurance}
						/>

						<CommonInputText
							controlLabel="共済"
							name="work.mutual_aid"
							type="text"
							placeholder="共済"
							value={this.entry.work.mutual_aid}
						/>

						<CommonInputText
							controlLabel="取扱い商品"
							name="work.products"
							type="text"
							placeholder="取扱い商品"
							value={this.entry.work.products}
						/>
						
						<Shipping_dataModal isShow={this.state.showShipping_dataModal}
									  callback={(obj) => this.addShipping_data(obj)}
									  callbackClose={() => this.closeShipping_data()} />

						<CommonTable
							controlLabel="出荷データ"	
							name="work.shipping_data" 
							data={this.entry.work.shipping_data}
							header={[{
								field: 'content', title: '内容',width: '200px'
							}]}
						>
							<Button onClick={() => this.setState({ showShipping_dataModal: true })}>
								<Glyphicon glyph="plus"></Glyphicon>
							</Button>
						</CommonTable>

					</Panel>
				</PanelGroup>
			</Form>
		)
	}
}