/* @flow */
import axios from 'axios'
import React, { Children } from 'react'
import {
	FormGroup,
	Radio,
	Button,
	FormControl,
	Glyphicon,
	NavItem,
	Table,
	ControlLabel,
	Col,
	Form
} from 'react-bootstrap'
import type {
	Props,
	InputEvent
} from 'demo3.types'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

/**
 * 通信中インジケータ
 */
export class CommonIndicator extends React.Component {

	render() {
		return (
			<div className={this.props.visible === true ? 'common-indicator' : 'common-indicator-hide'}>
    			<div className="common-indicator common-indicator-background"></div>
    			<div className="common-indicator-img"></div>
			</div>
		)
	}
}

/**
 * 通信メッセージ表示
 */
import AlertContainer from 'react-alert'
export class CommonNetworkMessage extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			error: this.props.isError,
			isCompleted: this.props.isCompleted
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({error: newProps.isError, isCompleted: newProps.isCompleted})
	}

	/**
	 * 初期設定
	 */
	alertOptions = {
		offset: 14,
		position: 'top right',
		theme: 'dark',
		transition: 'scale'
	}

	/**
	 * 成功時の表示
	 */
	showSuccess = (_messeage) => {
		this.msg.success(_messeage, {
			time: 10000,
			icon: <Glyphicon glyph="ok"></Glyphicon>
		})
	}

	/**
	 * 失敗時の表示
	 */
	showAlert = (_messeage) => {
		this.msg.error(_messeage, {
			time: 10000,
			icon: <Glyphicon glyph="exclamation-sign"></Glyphicon>
		})
	}

	/**
	 * 失敗時の表示（消えない）
	 */
	showFixAlert = (_messeage) => {
		this.msg.error(_messeage, {
			time: 0,
			icon: <Glyphicon glyph="exclamation-sign"></Glyphicon>
		})
	}

	render() {

		const messeageNodes = () => {

			const error = this.state.error

			if (error.response && error.response.status === 401) {

				this.showFixAlert(<span><a href="login.html">ログイン</a>を行ってから実行してください。</span>)

			} else if (error.response && error.response.status === 403) {

				this.showFixAlert(<span>実行権限がありません。<br /><a href="login.html">ログイン</a>からやり直してください。</span>)

			} else if (error.response) {

				this.showAlert(<span>データ登録に失敗しました。[{error.response.status}]<br />{error.response.data.feed.title}</span>)

			} else if (error.status === 204) {

				this.showAlert(<span>情報がありません</span>)

			}
		}

		return (
			<div> 
				{ messeageNodes() }
				{this.props.isCompleted === 'registration' &&
					this.showSuccess(<span>登録に成功しました。</span>)	
				}
				{this.props.isCompleted === 'update' &&
					this.showSuccess(<span>更新に成功しました。</span>)	
				}
				{this.props.isCompleted === 'delete' &&
					this.showSuccess(<span>削除に成功しました。</span>)	
				}
				<AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
			</div>
		)
	}
}

/**
 * [グローバルクラス] テーブルからデータ作成
 */
class LogicCommonTable {

	setData(_entry, _form_name) {

		const tables = document.getElementsByName(_form_name)[0].getElementsByTagName('table')

		const setCellData = (_row) => {
			let cellData = null
			const td = _row.getElementsByTagName('td')
			for (var i = 0, ii = td.length; i < ii; ++i) {
				const name = td[i].getAttribute('name')
				if (name) {
					cellData = cellData ? cellData : {}
					const value = td[i].getElementsByTagName('div')[0].innerHTML
					cellData[name] = value
				}
			}
			return cellData
		}

		const setRowData = (_table) => {

			const tableData = []

			const row = _table.getElementsByTagName('tr')
			for (var i = 0, ii = row.length; i < ii; ++i) {
				const rowData = setCellData(row[i])
				if (rowData) {
					tableData.push(rowData)
				}
			}

			return tableData
		}
		for (var i = 0, ii = tables.length; i < ii; ++i) {

			const table = tables[i]
			const table_name = table.getAttribute('name')
			const table_names = table_name.split('.')
			if (table_names.length > 1) {
				const parent_name = table_name.split('.')[0]
				const child_name = table_name.split('.')[1]
				_entry[parent_name] = _entry[parent_name] ? _entry[parent_name] : {}
				_entry[parent_name][child_name] = setRowData(table)
			} else {
				_entry[table_name] = _entry[table_name] || {}
				_entry[table_name] = setRowData(table)
			}

		}
		return _entry
	}
}

/**
 * 登録ボタン
 */
export class CommonRegistrationBtn extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			isCompleted: false,
			isError: {},
			isDisabled: false
		}
		this.LogicCommonTable = new LogicCommonTable()

	}

	setReqestdata(_addids) {

		let data = {}
		const addids = ('000000' + _addids).slice(-7)

		const setValue = (element) => {
			let value
			if (element.type === 'radio') {
				if (element.checked === true) {
					value = element.value
				}
			} else {
				value = element.value.replace('${_addids}', addids)
			}
			return value
		}
		const setLink = (entry, element) => {
			let link = entry.link ? entry.link : []
			let data = {
				'___href': element.value.replace('${_addids}', addids),
				'___rel': element.dataset.rel
			}
			link.push(data)
			return link
		}
		const setEntryData = (data) => {
			let entry = {}
			const form_name = data.getAttribute('name')
			for (var i = 0, ii = data.elements.length; i < ii; ++i) {
				let element = data.elements[i]
				if (element.name === 'link') {

					entry.link = setLink(entry, element)

				} else if (element.name) {

					const value = setValue(element)

					if (element.name.indexOf('.') !== -1) {
						const parentKey = element.name.split('.')[0]
						const childKey = element.name.split('.')[1]
						entry[parentKey] = entry[parentKey] ? entry[parentKey] : {}

						if (!entry[parentKey][childKey] || entry[parentKey][childKey] && value) {
							entry[parentKey][childKey] = value
						}

					} else {
						entry[element.name] = value
					}
				}
			}
			entry = this.LogicCommonTable.setData(entry, form_name)
			return entry
		}
		const setFeedData = () => {
			const forms = document.forms
			let feed = {}
			let array = []
			for (var i = 0, ii = forms.length; i < ii; ++i) {
				const target_form = forms[i]
				const isTarget = target_form.getAttribute('data-submit-form')
				if (isTarget) {
					let entry = setEntryData(target_form)
					array.push(entry)
				}
			}
			feed.entry = array
			return feed
		}
		data.feed = setFeedData()
		return data
	}

	submit(e: InputEvent) {

		e.preventDefault()

		if (!this.state.isDisabled) {
            
			if (confirm('この情報を登録します。よろしいですか？')) {

				this.setState({ isDisabled: true })

				const url = this.props.url
				axios({
					url: url + '?_addids=1',
					method: 'put',
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					},
					data: {}
				}).then((response) => {
		
					const reqData = this.setReqestdata(response.data.feed.title)

					axios({
						url: url,
						method: 'post',
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						},
						data: reqData
					}).then(() => {
						this.setState({ isDisabled: false, isCompleted: 'registration', isError: false })
						this.props.callback(reqData)
					}).catch((error) => {
						this.setState({ isDisabled: false, isError: error })
					})

				}).catch((error) => {
					this.setState({ isDisabled: false, isError: error })
				})
			}
		}
	}

	render() {

		const createNode = () => {
			if (this.props.NavItem) {
				return (
					<NavItem href="#" className="common-action-btn">
						<span className="common-action-btn-span create" onClick={(e) => this.submit(e)}>
							<Glyphicon glyph="plus" /> 新規登録
						</span>
						<CommonIndicator visible={this.state.isDisabled} />
						<CommonNetworkMessage
							isError={this.state.isError}
							isCompleted={this.state.isCompleted}
						/>
					</NavItem>
				)
			} else {
				return (
					<div>

						{/* 通信中インジケータ */}
						<CommonIndicator visible={this.state.isDisabled} />

						{/* 登録ボタン */}
						<FormGroup>
							<Button type="submit" className="btn btn-primary" onClick={(e) => this.submit(e)}><Glyphicon glyph="plus" /> 新規登録</Button>
						</FormGroup>

						{/* 通信メッセージ */}
						<CommonNetworkMessage
							isError={this.state.isError}
							isCompleted={this.state.isCompleted}
						/>
					</div>
				)
			}
		}

		return createNode()

	}

}

/**
 * 更新ボタン
 */
export class CommonUpdateBtn extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			isCompleted: '',
			isError: {},
			isDisabled: false
		}
		this.entry = this.props.entry
		this.LogicCommonTable = new LogicCommonTable()
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	setReqestdata() {

		let data = {}

		const setValue = (element) => {
			let value
			if (element.type === 'radio') {
				if (element.checked === true) {
					value = element.value
				}
			} else {
				value = element.value
			}
			return value
		}
		const setEntryData = (data) => {
			let entry = {}
			const form_name = data.getAttribute('name')
			for (var i = 0, ii = data.elements.length; i < ii; ++i) {
				let element = data.elements[i]

				if (element.name) {

					const value = setValue(element)

					if (element.name.indexOf('.') !== -1) {
						const parentKey = element.name.split('.')[0]
						const childKey = element.name.split('.')[1]
						entry[parentKey] = entry[parentKey] ? entry[parentKey] : {}

						if (!entry[parentKey][childKey] || entry[parentKey][childKey] && value) {
							entry[parentKey][childKey] = value
						}

					} else {
						entry[element.name] = value
					}
				}
			}
			entry = this.LogicCommonTable.setData(entry, form_name)
			return entry
		}
		const setFeedData = () => {
			const forms = document.forms
			let feed = {}
			let array = []
			for (var i = 0, ii = forms.length; i < ii; ++i) {
				const target_form = forms[i]
				const isTarget = target_form.getAttribute('data-submit-form')
				if (isTarget) {
					let entry = setEntryData(target_form)
					entry.id = this.entry.id
					entry.link = this.entry.link
					array.push(entry)
				}
			}
			feed.entry = array
			return feed
		}
		data.feed = setFeedData()
		return data
	}

	submit(e: InputEvent) {

		e.preventDefault()

		if (!this.state.isDisabled) {

			if (confirm('この情報を更新します。よろしいですか？')) {

				this.setState({ isDisabled: true })

				const url = this.props.url
				const reqData = this.setReqestdata()

				axios({
					url: url,
					method: 'put',
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					},
					data: reqData
				}).then((response) => {
					this.setState({ isDisabled: false, isCompleted: 'update', isError: false })
					this.props.callback(reqData, response)
				}).catch((error) => {
					this.setState({ isDisabled: false, isError: error })
				})

			}

		}
	}

	render() {

		const updateNode = () => {
			if (this.props.NavItem) {
				return (
					<NavItem href="#" className="common-action-btn">
						<span className="common-action-btn-span update" onClick={(e) => this.submit(e)}>
							<Glyphicon glyph="ok" /> 更新
						</span>
						<CommonIndicator visible={this.state.isDisabled} />
						<CommonNetworkMessage
							isError={this.state.isError}
							isCompleted={this.state.isCompleted}
						/>
					</NavItem>
				)
			} else {
				return (
					<div>

						<CommonIndicator visible={this.state.isDisabled} />
						
						<FormGroup>
							<Button type="submit" className="btn btn-primary" onClick={(e) => this.submit(e)}><Glyphicon glyph="ok" /> 更新</Button>
						</FormGroup>

						<CommonNetworkMessage
							isError={this.state.isError}
							isCompleted={this.state.isCompleted}
						/>
					</div>
				)
			}
		}

		return updateNode()
	}

}

/**
 * 削除ボタン
 */
export class CommonDeleteBtn extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			isCompleted: false,
			isError: {},
			isDisabled: false
		}
		this.entry = this.props.entry
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
	}

	submit(e: InputEvent) {

		e.preventDefault()

		if (!this.state.isDisabled) {

			if (confirm('この情報を削除します。よろしいですか？')) {

				this.setState({ isDisabled: true })

				const id = this.entry.id
				const url = '/d' + id.split(',')[0]

				axios({
					url: url + '?r=' + id,
					method: 'delete',
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					}
				}).then((response) => {
					this.setState({ isDisabled: false, isCompleted: 'delete', isError: false })
					this.props.callback(response)
				}).catch((error) => {
					this.setState({ isDisabled: false, isError: error })
				})

			}

		}
	}

	render() {

		const deleteNode = () => {
			if (this.props.NavItem) {
				return (
					<NavItem href="#" className="common-action-btn">
						<span className="common-action-btn-span delete" onClick={(e) => this.submit(e)}>
							<Glyphicon glyph="trash" /> 削除
						</span>
						<CommonIndicator visible={this.state.isDisabled} />
						<CommonNetworkMessage
							isError={this.state.isError}
							isCompleted={this.state.isCompleted}
						/>
					</NavItem>
				)
			} else {
				return (
					<div>

						<CommonIndicator visible={this.state.isDisabled} />
						
						<FormGroup>
							<Button type="submit" className="btn btn-danger" onClick={(e) => this.submit(e)}><Glyphicon glyph="trash" /> 削除</Button>
						</FormGroup>

						<CommonNetworkMessage
							isError={this.state.isError}
							isCompleted={this.state.isCompleted}
						/>
					</div>
				)
			}
		}

		return deleteNode()
	}

}

/**
 * 戻るボタン
 */
export class CommonBackBtn extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			href: this.props.href
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({href: newProps.href})
	}

	/**
	 * 戻る処理
	 * @param {*} e 
	 */
	submit(e: InputEvent) {
		e.preventDefault()
		location.href = this.state.href
	}

	render() {

		const backNode = () => {
			if (this.props.NavItem) {
				return (
					<NavItem href="#" onClick={(e) => this.submit(e)}><Glyphicon glyph="step-backward" /> 戻る</NavItem>
				)
			} else {
				return (
					<FormGroup>
						<Button type="submit" className="btn btn-default" onClick={(e) => this.submit(e)}><Glyphicon glyph="step-backward" /> 戻る</Button>
					</FormGroup>
				)
			}
		}

		return backNode()
	}

}

/**
 * クリアボタン
 */
export class CommonClearBtn extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			entry: this.props.entry
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({entry: newProps.entry})
	}

	/**
	 * クリア処理
	 * @param {*} e 
	 */
	action(e: InputEvent) {
		e.preventDefault()
	}

	render() {

		const clearNode = () => {
			if (this.props.NavItem) {
				return (
					<NavItem href="#" onClick={(e) => this.action(e)}><Glyphicon glyph="refresh" /> クリア</NavItem>
				)
			} else {
				return (
					<FormGroup>
						<Button type="submit" className="btn btn-default" onClick={(e) => this.action(e)}><Glyphicon glyph="refresh" /> クリア</Button>
					</FormGroup>
				)
			}
		}

		return clearNode()
	}

}

/**
 * FormGroup
 */
export class CommonFormGroup extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			validationState: this.props.validationState,
			size: this.setSize(this.props.size)
		}
	}

	setSize(_option) {
		let size = 5
		if (_option === 'sm') size = 2
		if (_option === 'lg') size = 10
		return size
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({
			validationState: newProps.validationState,
			size: this.setSize(newProps.size)
		})
	}

	render() {
		return (
			<FormGroup bsSize="small" validationState={this.state.validationState}>
				<Col componentClass={ControlLabel} sm={2}>
					{this.props.controlLabel}
				</Col>
				<Col sm={this.state.size}>
					{this.props.children}
				</Col>
			</FormGroup>
		)
	}
}

/**
 * ラジオボタン
 */
export class CommonRadioBtn extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			name: this.props.name,
			checked: this.props.checked
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({checked: newProps.checked})
	}

	/**
	 * 値の変更処理
	 * @param {*} e 
	 */
	changed(e: InputEvent) {
		this.setState({checked: e.target.value})
	}

	render() {

		const RadioNode = this.props.data.map((obj, i) => {
			return (
				<Radio
					key={i}	
					value={obj.value}
					name={this.state.name}
					checked={this.state.checked === obj.value}
					onChange={(e) => this.changed(e)}
					inline
				>{ obj.label }
				</Radio>
			)
		})

		return (
			<CommonFormGroup controlLabel={this.props.controlLabel}>
				{ RadioNode }
			</CommonFormGroup>
		)
	}

}

/**
 * カレンダー
 */
export class CommonDatePicker extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			name: this.props.name,
			selected: this.props.selected,
			size: this.props.size
		}
		moment.locale('ja')
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({selected: newProps.selected})
	}

	/**
	 * 値の変更処理
	 * @param {*} date 
	 */
	changed(date) {
		this.setState({selected: date})
	}

	render() {

		return (
			<CommonFormGroup controlLabel={this.props.controlLabel} size={this.state.size}>
				<DatePicker
					selected={this.state.selected}
					name={this.state.name}
					onChange={(e) => this.changed(e)}
					className="form-control"
				/>
			</CommonFormGroup>
		)
	}

}

/**
 * 都道府県
 */
export class CommonPrefecture extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			size: this.props.size
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({value: newProps.value})
	}

	/**
	 * 値の変更処理
	 * @param {*} e 
	 */
	changed(e: InputEvent) {
		this.setState({value: e.target.value})
	}

	render() {

		return (
			<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
				<FormControl
					componentClass={this.props.componentClass}
					placeholder="都道府県"
					name={this.props.name}
					value={this.state.value}
					onChange={(e) => this.changed(e)}
				>
					<option value="1">北海道</option>
					<option value="2">青森県</option>
					<option value="3">岩手県</option>
					<option value="4">宮城県</option>
					<option value="5">秋田県</option>
					<option value="6">山形県</option>
					<option value="7">福島県</option>
					<option value="8">茨城県</option>
					<option value="9">栃木県</option>
					<option value="10">群馬県</option>
					<option value="11">埼玉県</option>
					<option value="12">千葉県</option>
					<option value="13">東京都</option>
					<option value="14">神奈川県</option>
					<option value="15">新潟県</option>
					<option value="16">富山県</option>
					<option value="17">石川県</option>
					<option value="18">福井県</option>
					<option value="19">山梨県</option>
					<option value="20">長野県</option>
					<option value="21">岐阜県</option>
					<option value="22">静岡県</option>
					<option value="23">愛知県</option>
					<option value="24">三重県</option>
					<option value="25">滋賀県</option>
					<option value="26">京都府</option>
					<option value="27">大阪府</option>
					<option value="28">兵庫県</option>
					<option value="29">奈良県</option>
					<option value="30">和歌山県</option>
					<option value="31">鳥取県</option>
					<option value="32">島根県</option>
					<option value="33">岡山県</option>
					<option value="34">広島県</option>
					<option value="35">山口県</option>
					<option value="36">徳島県</option>
					<option value="37">香川県</option>
					<option value="38">愛媛県</option>
					<option value="39">高知県</option>
					<option value="40">福岡県</option>
					<option value="41">佐賀県</option>
					<option value="42">長崎県</option>
					<option value="43">熊本県</option>
					<option value="44">大分県</option>
					<option value="45">宮崎県</option>
					<option value="46">鹿児島県</option>
					<option value="47">沖縄県</option>
				</FormControl>
			</CommonFormGroup>
		)
	}

}

/**
 * セレクトボックス
 */
export class CommonSelectBox extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			options: this.props.options,
			size: this.props.size
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({value: newProps.value, options: newProps.options})
	}

	/**
	 * 値の変更処理
	 * @param {*} e 
	 */
	changed(e: InputEvent) {
		this.setState({value: e.target.value})
	}

	render() {

		const options = this.props.options.map((obj, index) => {
			return <option key={index} value={obj.value}>{obj.label}</option>
		})

		return (
			<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
				<FormControl
					componentClass="select"
					placeholder={this.props.placeholder}
					name={this.props.name}
					value={this.state.value}
					onChange={(e) => this.changed(e)}
				>
					{ options }	
				</FormControl>
			</CommonFormGroup>
		)
	}

}

/**
 * テキストボックス
 */
export class CommonInputText extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			name: this.props.name,
			type: this.props.type,
			placeholder: this.props.placeholder,
			value: this.props.value,
			readonly: this.props.readonly,
			size: this.props.size
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({
			value: newProps.value,
			readonly: newProps.readonly,
			size: newProps.size
		})
	}

	/**
	 * 値の変更処理
	 * @param {*} e 
	 */
	changed(e: InputEvent) {
		this.setState({value: e.target.value})
	}

	render() {

		return (
			<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
				{this.state.readonly === 'true' && 
					<div>
						<FormControl.Static name={this.state.name} id={this.state.name}>
							{ this.state.value }
						</FormControl.Static>
						<FormControl
							name={this.state.name}
							type={this.state.type}
							value={this.state.value}
							className="hide"
						/>
					</div>
				}
				{ (!this.state.readonly || this.state.readonly === 'false') && 
					<FormControl
						name={this.state.name}
						type={this.state.type}
						placeholder={this.state.placeholder}
						value={this.state.value}
						onChange={(e) => this.changed(e)}
						data-validate={this.props.validate}
						data-required={this.props.required}
					/>
				}
			</CommonFormGroup>
		)
	}

}

/**
 * テーブル
 */
export class CommonTable extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			data: this.props.data,
			header: this.props.header
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({data: newProps.data, header: newProps.header})
	}

	render() {

		// ヘッダー情報をキャッシュする
		const cashInfo = {}
		const header_obj = this.state.header

		let option = [{
			field: 'no', title: 'No', width: '50px'
		}]
		if (this.props.edit) option.push({
			field: 'edit', title: this.props.edit.title, width: '50px', onclick: this.props.edit.onclick
		})
		const thNode = (_obj, _index) => {
			const bsStyle = {
				width: _obj.width
			}
			const field = _obj.field.replace(/\./g, '___')
			cashInfo[field] = _obj
			cashInfo[field].style = bsStyle
			cashInfo[field].index = _index
			return (
				<th key={_index} style={bsStyle}>
					<div style={bsStyle}>{_obj.title}</div>
				</th>
			)
		}
		let header = option.concat(header_obj)
		header = header.map((obj, i) => {
			return thNode(obj, i)
		})

		const convertValue = (convertData, value) => {
			return convertData ? convertData[value] : value
		}
		const body = this.state.data && this.state.data.map((obj, i) => {

			const td = (_obj, _index) => {

				let tdCount = 1
				let array = new Array(cashInfo.length)

				array[cashInfo.no.index] = <td key="0" style={cashInfo.no.style}>{(_index + 1)}</td>
				if (this.props.edit) {
					array[cashInfo.edit.index] = <td key="1" style={cashInfo.edit.style}><Button onClick={() => this.props.edit.onclick(_index)}>{this.props.edit.title}</Button></td>
					tdCount++
				}

				const setCel = (__obj, _key) => {
					Object.keys(__obj).forEach(function (__key) {

						if (typeof __obj[__key] === 'object') {
							setCel(__obj[__key], _key + __key + '.')
						} else {
							const field = _key.replace(/\./g, '___') + __key
							tdCount++
							if (cashInfo[field]) {
								array[cashInfo[field].index] = (
									<td
										key={tdCount}
										style={cashInfo[field].style ? cashInfo[field].style : ''}
										name={_key + __key}
										data-value={__obj[__key]}
									>
										<div style={cashInfo[field].style ? cashInfo[field].style : ''}>
											{ convertValue(cashInfo[field].convert, __obj[__key]) }
										</div>
									</td>
								)
							} else {
								array.push(
									<td
										key={tdCount}
										style={{ 'display': 'none' }}
										name={_key + __key}
										data-value={__obj[__key]}
									>
										<div>
											{ __obj[__key] }
										</div>
									</td>
								)
							}
						}

					})
					return array
				}
				array = setCel(_obj, '')
				return array
			}
			return (
				<tr key={i}>{td(obj, i)}</tr>
			)
		})

		const tableNode = (
			<div>
				{ this.props.children }
				<div className="common-table">
					<Table striped bordered hover name={this.props.name}>
						<thead>
							<tr>{header}</tr>
						</thead>
						<tbody>{body}</tbody>
					</Table>
				</div>
			</div>
		)

		return (
			<div>
				{ this.props.controlLabel &&
				<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size="lg">
					{ tableNode }
				</CommonFormGroup>
				}
				{!this.props.controlLabel &&
					tableNode
				}
			</div>
		)

	}

}

/**
 * Modal
 */
import ReactModal from 'react-modal'
export class CommonModal extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			isShow: this.props.isShow
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
		this.setState({isShow: false})
		this.props.closeBtn()
	}

	add() {
		const modal_body = document.getElementById('common_modal_body')
		const form = modal_body.children[0]
		const obj = {}
		for (let i = 0, ii = form.elements.length; i < ii; ++i) {
			const element = form.elements[i]
			const name = element.getAttribute('name')
			obj[name] = element.value
		}
		this.props.addBtn(obj)
	}

	render() {

		const modal_size = () => {
			const option = this.props.size
			let className = 'modal-dialog'
			if (option) {
				className = option === 'lg' ? className + ' modal-lg' : className
				className = option === 'sm' ? className + ' modal-sm' : className
			}
			return className
		}

		return (
			<ReactModal
				isOpen={this.state.isShow}
				className="Modal"
			>
				<div class="modal">
					<div class={modal_size()} role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title"> { this.props.title } </h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.close()}>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body" id="common_modal_body">
								{ this.props.children }
							</div>
							<div class="modal-footer">
								{ this.props.addBtn && 
									<button type="button" class="btn btn-primary" onClick={() => this.add()}>追加</button>
								}
								<button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={() => this.close()}>閉じる</button>
							</div>
						</div>
					</div>
				</div>
			</ReactModal>
		)
	}

}

/**
 * バリデーション処理(実装中)
 */
export function CommonValidate(_target, _validate) {
	let obj = {
		validate: _validate
	}
	const target_names = _target.name.split('.')
	if (target_names.length > 1) {
		//		obj.entry[target_names[0]][target_names[1]] = _target.value
		obj.validate[target_names[0]][target_names[1]] = 'error'
	} else {
		//		obj.entry[target_names[0]] = _target.value
		obj.validate[target_names[0]] = 'error'
	}
	obj.validate[_target.name] = 'error'
	return obj
}

/**
 * バリデーション要フォーム(実装中)
 */
export class CommonValidateForm extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}
		this.validate = {}
		this.forceUpdate()
	}

	onValidate(e) {
		this.validate[e.target.name] = 'error'
		this.forceUpdate()
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		console.log(newProps)
	}

	render() {

		const childrenWithProps = (_children) => { 
			return Children.map(
				_children,
				(child) => {

					switch (typeof child) {
					case 'string':
						return child

					case 'object':
						if (child && child.props && child.props.children) {
							child.props.children = childrenWithProps(child.props.children)
						}
						if (child && child.props) {
							if (child.props.validate) {
								return React.cloneElement(child, {
									validationState: this.validate[child.props.name]
								})
							}
						}
						return child
					default:
						return null
					}
				}
			)
		}
		return (
			<Form name={this.props.name} horizontal data-submit-form onChange={(e) => this.onValidate(e)}>
				{ childrenWithProps(this.props.children) }
			</Form>
		)
	}

}
