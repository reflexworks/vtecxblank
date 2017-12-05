/* @flow */
import React from 'react'
//import axios from 'axios'
import {
	PageHeader,
	Table,
	Form
} from 'react-bootstrap'
import type {
	Props,
} from 'demo3.types'
import {
	CommonModal,
	CommonTable,
	CommonInputText,
//	CommonFilterBox
} from './common'

export class BasicConditionModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			isShow: this.props.isShow,
			type: this.props.type
		}
		this.basic_condition = this.props.data || {}
		this.basic_condition.condition = this.basic_condition.condition || []

	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.basic_condition = newProps.data || {}
		this.basic_condition.condition = newProps.data.condition || []
		this.setState({
			isShow: newProps.isShow,
			type: newProps.type
		})
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

	}

	getTitle() {
		return this.state.type === 'add' ? '基本条件追加' : '基本条件編集'
	}

	changeTitle(_data) {
		this.basic_condition.title = _data
		this.forceUpdate()
	}

	addList(_data) {
		this.basic_condition.condition.push(_data)
		this.forceUpdate()
	}
	removeList(_index) {
		let array = []
		for (let i = 0, ii = this.basic_condition.condition.length; i < ii; ++i) {
			if (i !== _index) array.push(this.basic_condition.condition[i])
		}
		this.basic_condition.condition = array
		this.forceUpdate()
	}
	change(_data, _rowindex) {
		this.basic_condition.condition[_rowindex].content = _data.value
		this.forceUpdate()
	}

	close() {
		this.props.close()
	}

	add(_obj) {
		this.props.add(_obj)
	}

	edit(_obj) {
		this.props.edit(_obj)
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title={this.getTitle()} closeBtn={() => this.close()}
				addBtn={this.state.type === 'add' ? (obj) => this.add(obj) : false}
				editBtn={this.state.type === 'edit' ? (obj) => this.edit(obj) : false}
				size="lg"
				height="320px"
			>
				<Form name="BasicConditionModal" horizontal>

					<CommonInputText
						controlLabel="条件名"
						name="title"
						type="text"
						value={this.basic_condition.title}
						onChange={(data)=>this.changeTitle(data)}
					/>

					<CommonTable
						controlLabel="条件内容"
						name="condition"
						data={this.basic_condition.condition}
						header={[{
							field: 'content', title: '内容', 
							input: {
								onChange: (data, rowindex)=>{this.change(data, rowindex)}
							}
						}]}
						add={() => this.addList({ content: ''})}
						remove={(data, index) => this.removeList(index)}
						noneScroll
					/>

				</Form>
			</CommonModal>
		)
	}
}

//import ManifestoForm from './manifesto-form'
import ManifestoList from './packingitem-list'
export class ManifestoModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			data: this.props.data ? { manifesto: this.props.data } : {manifesto: {}},
			isShow: this.props.isShow,
			type: this.props.type
		}
		this.master = {
		}
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.setState({
			isShow: newProps.isShow,
			data: newProps.data ? { manifesto: newProps.data } : {manifesto: {}},
			type: newProps.type
		})
	}

	/**
	 * 画面描画の前処理
	 */
	componentWillMount() {

	}

	getTitle() {
		return this.state.type === 'add' ? '資材梱包追加' : '資材梱包編集'
	}

	close() {
		this.props.close()
	}

	add(_obj) {
		this.props.add(_obj.manifesto)
	}

	edit(_obj) {
		this.props.edit(_obj.manifesto)
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title={this.getTitle()} closeBtn={() => this.close()}
				addBtn={this.state.type === 'add' ? (obj) => this.add(obj) : false}
				editBtn={this.state.type === 'edit' ? (obj) => this.edit(obj) : false}
				size="lg"
				height="500px"
			>
				<ManifestoList name="ManifestoModal" entry={this.state.data} />	
			</CommonModal>
		)
	}
}

export class DeliveryChargeModal extends React.Component {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			isShow: this.props.isShow,
		}
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps) {
		this.setState({isShow: newProps.isShow})
	}

	close() {
		this.props.close()
	}

	render() {

		return (
			<CommonModal isShow={this.state.isShow} title="配送料詳細" closeBtn={() => this.close()} size="lg">
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
			</CommonModal>
		)
	}
}
