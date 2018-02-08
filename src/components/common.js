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
	Form,
	PanelGroup,
	Panel,
	Pagination,
	ButtonToolbar,
	ToggleButtonGroup,
	ToggleButton
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

	setData(_entry, _form_name, _tables) {

		let tables = _tables || document.getElementsByName(_form_name)[0].getElementsByTagName('table')

		const getValue = (_element) => {

			const isArray = _element.className.indexOf('array') !== -1 ? true : false
			let value
			if (isArray) {
				const arrayEle = _element.getElementsByTagName('div')
				const getMultiValue = (_multiObj) => {
					let obj = {}
					for (let i = 0, ii = _multiObj.length; i < ii; ++i) {
						const ele = _multiObj[i]
						const eleKey = ele.getAttribute('name')
						if (eleKey) {
							obj[eleKey] = ele.dataset.value ? ele.dataset.value : ''
						}
					}
					return obj
				}
				value = []
				for (let i = 0, ii = arrayEle.length; i < ii; ++i) {
					const ele = arrayEle[i]
					if (ele.getAttribute('class') && ele.getAttribute('class').indexOf('multi') !== -1) {
						const multiObj = ele.getElementsByTagName('p')
						const multiValue = getMultiValue(multiObj)
						value.push(multiValue)
					} else {
						const eleKey = ele.getAttribute('name')
						if (eleKey) {
							let eleObj = {}
							eleObj[eleKey] = ele.dataset.value ? ele.dataset.value : ''
							value.push(eleObj)
						}
					}
				}
			} else {

				const childNodes = _element.childNodes ? _element.childNodes[0] : false
				const isFilter = (childNodes && childNodes.className && childNodes.className.indexOf('Select') !== -1)
				const isInput = (!isFilter && childNodes && childNodes.children)
				if (isFilter) {
					value = childNodes.childNodes[0].value ? childNodes.childNodes[0].value : ''
				} else if (isInput) {
					value = childNodes.getElementsByTagName('input')[0].value
				} else {
					value = _element.dataset.value ? _element.dataset.value : ''
				}

			}

			return value
		}

		const setCellData = (_row) => {
			let cellData = null
			if (_row) {
				const td = _row.getElementsByTagName('td')
				for (let i = 0, ii = td.length; i < ii; ++i) {
					if (td[i] && td[i].getAttribute('name')) {
						const name = td[i].getAttribute('name')
						if (name && name !== '__tableFilter' && name !== '__tableInput' && name !== 'is_error') {
							cellData = cellData ? cellData : {}
							const value = getValue(td[i].getElementsByTagName('div')[0])

							const names = name.split('.')
							if (names.length > 1) {
								const parent_name = names[0]
								const child_name = names[1]
								cellData[parent_name] = cellData[parent_name] ? cellData[parent_name] : {}
								cellData[parent_name][child_name] = value
							} else {
								cellData[name] = cellData[name] || {}
								cellData[name] = value
							}
						}
					}
				}
			}
			return cellData
		}

		const setRowData = (_table) => {

			const tableData = []

			const row = _table.getElementsByTagName('tr')
			for (let i = 0, ii = row.length; i < ii; ++i) {
				const rowData = setCellData(row[i])
				if (rowData) {
					tableData.push(rowData)
				}
			}

			return tableData
		}
		for (let i = 0, ii = tables.length; i < ii; ++i) {

			const table = tables[i]
			const table_name = table.getAttribute('name')
			if (table_name && table_name !== '') {
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
			isDisabled: false,
			disabled: this.props.disabled
		}
		this.LogicCommonTable = new LogicCommonTable()
		this.label = this.props.label || <span><Glyphicon glyph="plus" /> 新規登録</span>

	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState(newProps)
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
			const selfSplit = element.value.split(',')
			let selfValue = []
			selfSplit.map((_value) => {
				const selfMark = _value.split('${')
				if (selfMark.length > 1) {
					const selfKey = selfMark[1].split('}')[0]
					if (selfKey === '_addids') {
						selfValue.push(_value.replace('${_addids}', addids))
					} else {
						const childNode = document.getElementsByName(selfKey)[0]
						selfValue.push(_value.replace('${'+ selfKey +'}', childNode.value))
					}
				} else {
					selfValue.push(_value)
				}
			})
			let data = {
				'___href': selfValue.join(''),
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

					entry.link = setLink(entry, element, data)

				} else if (element.name && element.name !== '__tableFilter' && element.name !== '__tableInput') {

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

			let feed = {}
			let array = []

			const forms = document.forms
			if (this.props.targetFrom) {
				for (let i = 0, ii = forms.length; i < ii; ++i) {
					const target_form = forms[i]
					if (forms[i].getAttribute('name') === this.props.targetFrom) {
						let entry = setEntryData(target_form)
						array.push(entry)
						break
					}
				}
			} else {
				for (let i = 0, ii = forms.length; i < ii; ++i) {
					const target_form = forms[i]
					const isTarget = target_form.getAttribute('data-submit-form')
					if (isTarget) {
						let entry = setEntryData(target_form)
						array.push(entry)
					}
				}
			}
			feed.entry = array
			return feed
		}
		data.feed = setFeedData()
		return data
	}

	doPost() {
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
		
			let reqData
			if (this.props.type === 'entitiy') {
				reqData = CommonEntry().get()
			} else {
				reqData = this.setReqestdata(response.data.feed.title)
			}
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
				if (this.props.error) {
					this.setState({ isDisabled: false})
					this.props.error(error, reqData)
				} else {
					this.setState({ isDisabled: false, isError: error })
				}
			})

		}).catch((error) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	submit(e: InputEvent) {

		e.preventDefault()

		if (!this.state.isDisabled) {
            
			if (!this.props.pure) {
				if (confirm('この情報を登録します。よろしいですか？')) this.doPost()
			} else {
				this.doPost()
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
						<CommonFormGroup controlLabel={this.props.controlLabel}>
							<Button type="submit" bsStyle="primary" onClick={(e) => this.submit(e)} disabled={this.state.disabled}>{ this.label }</Button>
						</CommonFormGroup>

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

export function CommonSetUpdateData(_target_form) {

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

			if (element.name && element.name !== '__tableFilter' && element.name !== '__tableInput') {

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
		entry = new LogicCommonTable().setData(entry, form_name)
		return entry
	}
	return setEntryData(_target_form)
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
			isDisabled: false,
			disabled: this.props.disabled
		}
		this.entry = this.props.entry
		this.label = this.props.label || <span><Glyphicon glyph="ok" /> 更新</span>
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.entry = newProps.entry
		this.setState(newProps)
	}

	setReqestdata() {

		let data = {}

		const setFeedData = () => {
			const forms = document.forms
			let feed = {}
			let array = []
			if (this.props.targetFrom) {
				for (let i = 0, ii = forms.length; i < ii; ++i) {
					const target_form = forms[i]
					if (forms[i].getAttribute('name') === this.props.targetFrom) {
						let entry = CommonSetUpdateData(target_form)
						entry.id = this.entry.id
						entry.link = this.entry.link
						array.push(entry)
						break
					}
				}
			} else {
				for (let i = 0, ii = forms.length; i < ii; ++i) {
					const target_form = forms[i]
					const isTarget = target_form.getAttribute('data-submit-form')
					if (isTarget) {
						let entry = CommonSetUpdateData(target_form)
						entry.id = this.entry.id
						entry.link = this.entry.link
						array.push(entry)
					}
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

				let reqData
				if (this.props.type === 'entitiy') {
					reqData = CommonEntry().get()
				} else {
					reqData = this.setReqestdata()
				}

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
					if (this.props.error) {
						this.setState({ isDisabled: false})
						this.props.error(error)
					} else {
						this.setState({ isDisabled: false, isError: error })
					}
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
							{this.label}
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
						
						<CommonFormGroup controlLabel={this.props.controlLabel}>
							<Button type="submit" bsStyle="success" onClick={(e) => this.submit(e)} disabled={this.state.disabled}>{this.label}</Button>
						</CommonFormGroup>

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
					if (this.props.error) {
						this.setState({ isDisabled: false})
						this.props.error(error)
					} else {
						this.setState({ isDisabled: false, isError: error })
					}
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
						
						<CommonFormGroup controlLabel={this.props.controlLabel}>
							<Button type="submit" className="btn btn-danger" onClick={(e) => this.submit(e)}><Glyphicon glyph="trash" /> 削除</Button>
						</CommonFormGroup>

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
 * 汎用ボタン（ボタン名を呼び出し先で設定する）
 */
export class CommonGeneralBtn extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			isCompleted: false,
			isError: {},
			isDisabled: false,
			label: this.props.label,
			buttonStyle: this.props.buttonStyle ? 'btn ' + this.props.buttonStyle : 'btn',
			navStyle: this.props.navStyle ? 'common-action-btn-span ' + this.props.navStyle : 'common-action-btn-span'
		}
	}

	render() {

		const node = () => {
			if (this.props.NavItem) {
				return (
					<NavItem href="#" className="common-action-btn">
						<span className={this.state.navStyle} onClick={(e) => this.props.onClick(e, this.data)}>
							{this.state.label}
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
						
						<CommonFormGroup controlLabel={this.props.controlLabel}>
							<Button type="submit" className={this.state.buttonStyle} onClick={(e) => this.props.onClick(e, this.data)}>
								{this.state.label}
							</Button>
						</CommonFormGroup>

						<CommonNetworkMessage
							isError={this.state.isError}
							isCompleted={this.state.isCompleted}
						/>
					</div>
				)
			}
		}

		return node()
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
					<CommonFormGroup controlLabel={this.props.controlLabel}>
						<Button type="submit" className="btn btn-default" onClick={(e) => this.submit(e)}><Glyphicon glyph="step-backward" /> 戻る</Button>
					</CommonFormGroup>
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
					<CommonFormGroup controlLabel={this.props.controlLabel}>
						<Button type="submit" className="btn btn-default" onClick={(e) => this.action(e)}><Glyphicon glyph="refresh" /> クリア</Button>
					</CommonFormGroup>
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
			labelSize: this.labelSize(this.props.size),
			inputSize: this.inputSize(this.props.size)
		}
	}

	labelSize() {
		let size = 2
		return size
	}

	inputSize(_option) {
		let size = 4
		if (_option === 'sm') size = 2
		if (_option === 'md') size = 4
		if (_option === 'lg') size = 9
		return size
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({
			validationState: newProps.validationState,
			labelSize: this.labelSize(newProps.size),
			inputSize: this.inputSize(newProps.size)
		})
	}

	render() {
		return (
			<FormGroup bsSize="small" validationState={this.state.validationState}>
				{this.props.controlLabel && 
					<Col componentClass={ControlLabel} sm={this.state.labelSize}>
						{this.props.controlLabel}
					</Col>
				}
				{this.props.controlLabel && 
					<Col sm={this.state.inputSize}>
						{this.props.children}
					</Col>
				}
				{!this.props.controlLabel && 
					this.props.children
				}
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
		const value = e.target.value
		this.setState({checked: value})
		if (this.props.onChange) {
			this.props.onChange(value)
		}
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
			size: this.props.size,
			dateFormat: this.props.dateFormat || 'YYYY/MM/DD'
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
		if (this.props.onChange) {
			this.props.onChange(date)
		}
	}

	render() {

		return (
			<CommonFormGroup controlLabel={this.props.controlLabel} size={this.state.size}>
				<DatePicker
					selected={this.state.selected}
					name={this.state.name}
					onChange={(e) => this.changed(e)}
					className="form-control"
					placeholderText={this.props.dateFormat}
					dateFormat={this.props.dateFormat}
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
	changed(value) {
		this.setState({value: value})
		if (this.props.onChange) {
			this.props.onChange(value)
		}
	}

	datas = () => {
		const data = ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県']
		return data.map((value) => {
			return {
				label: value,
				value: value
			}
		})
	}

	render() {

		return (
			<CommonSelectBox
				controlLabel="都道府県"
				size="sm"
				name={this.props.name}
				value={this.state.value}
				validationState={this.props.validationState}
				options={this.datas()}
				onChange={(value)=>this.changed(value)}
			/>

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
		const value = e.target.value
		this.setState({ value: value })
		if (this.props.onChange) {
			this.props.onChange(value)
		}
	}

	render() {

		const blank = [{
			label: '--選択してください--',
			value: ''
		}]
		const array = blank.concat(this.props.options)
		const options = array.map((obj, index) => {
			return <option key={index} value={obj.value}>{obj.label}</option>
		})

		const selectNode = (
			<FormControl
				componentClass="select"
				placeholder={this.props.placeholder}
				name={this.props.name}
				value={this.state.value}
				onChange={(e) => this.changed(e)}
				bsSize={this.props.bsSize}
			>
				{ options }	
			</FormControl>
		)

		return (
			<div style={this.props.style}>
				{ this.props.pure && selectNode }
				{ !this.props.pure && 
					<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
						{selectNode}
					</CommonFormGroup>
				}
			</div>
		)
	}

}

let _CommonEntry = {}
export function CommonEntry() {

	const _event = {
		init: (_init = {}) => {
			_CommonEntry = _event.setFeed(_init)
			return _CommonEntry
		},
		get: () => {
			return _CommonEntry
		},
		setValue: (_key, _value) => {

			if (_CommonEntry.feed) {
				const keys = _key.split('.')
				const setKey = (_obj, _index) => {

					const thisKey = keys[_index]

					if (keys[_index + 1]) {
						const isArray = thisKey.indexOf('[') !== -1 ? true : false
						if (isArray) {
							const arrayKey = thisKey.split('[')[0]
							const number = parseInt(thisKey.split('[')[1].split(']')[0])
							if (!_obj[arrayKey]) _obj[arrayKey] = []
							if (!_obj[arrayKey][number]) _obj[arrayKey][number] = {}
							_obj[arrayKey][number] = setKey(_obj[arrayKey][number], (_index + 1))
						} else {
							if (!_obj[thisKey]) _obj[thisKey] = {}
							_obj[thisKey] = setKey(_obj[thisKey], (_index + 1))
						}
					} else {
						_obj[keys[_index]] = _value
					}
					return _obj
				}

				if (_key.indexOf('entry') === -1) {
					_CommonEntry.feed.entry[0] = setKey(_CommonEntry.feed.entry[0], 0)
				} else {
					_CommonEntry.feed = setKey(_CommonEntry.feed, 0)
				}
			}

		},
		setFeed: (_obj) => {
			if (!_obj.feed && !_obj.entry) {
				return { feed: { entry: [_obj] } }
			} else if (!_obj.feed) {
				return { feed: _obj }
			} else {
				return _obj
			}
		}
	}
	return _event
}

/**
 * テキストボックス
 */
export class CommonInputText extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			name: this.props.name,
			type: this.props.type || 'text',
			placeholder: this.props.placeholder,
			value: this.props.value,
			readonly: this.props.readonly,
			size: this.props.comparison ? 'lg' : this.props.size,
			entitiykey: this.props.entitiykey
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
			placeholder: newProps.placeholder,
			size: newProps.size
		})
	}

	/**
	 * 値の変更処理
	 * @param {*} e 
	 */
	changed(e: InputEvent) {
		const value = e.target.value
		const entitiykey = this.state.entitiykey || this.state.name
		CommonEntry().setValue(entitiykey, value)
		this.setState({ value: value })
		if (this.props.onChange) {
			this.props.onChange(value)
		}
	}

	/**
	 * フォーカスアウト時
	 * @param {*} e 
	 */
	blured(e: InputEvent) {
		const value = e.target.value
		if (this.props.onBlur) {
			this.props.onBlur(value)
		}
	}

	render() {

		const TextNode = () => {
			if (Object.prototype.toString.call(this.state.value) === '[object Object]') {
				if (this.state.value['$$typeof']) {
					return this.state.value
				}
			} else {
				return (
					<FormControl
						name={this.state.name}
						type={this.state.type}
						placeholder={this.state.placeholder}
						value={this.state.value}
						onChange={(e) => this.changed(e)}
						onBlur={(e) => this.blured(e)}
						data-validate={this.props.validate}
						data-required={this.props.required}
						bsSize="small"
					/>
				)
			}
		}
		const InputTextNode = () => {
			return (
				<div>
					{this.state.readonly && 
						<FormControl.Static name={this.state.name} id={this.state.name}>
							{ this.state.value }
							<FormControl
								name={this.state.name}
								type={this.state.type}
								value={this.state.value}
								className="hide"
							/>
						</FormControl.Static>
					}
					{(!this.state.readonly || this.state.readonly === 'false') && 
						<div>
							{TextNode()}
							{this.props.customIcon && 
								<FormControl.Feedback>
									<Glyphicon glyph={this.props.customIcon} />
								</FormControl.Feedback>
							}
						</div>
					}
				</div>	
			)
		}

		return (
			<div style={this.props.style} className={this.props.className}>
				{ !this.props.table && 
					<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
						{InputTextNode()}
					</CommonFormGroup>
				}
				{ this.props.table && 
					InputTextNode()
				}
			</div>
		)
	}

}

/**
 * テキストエリア
 */
export class CommonTextArea extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			name: this.props.name,
			placeholder: this.props.placeholder,
			value: this.props.value,
			size: this.props.comparison ? 'lg' : this.props.size,
			style: this.props.style || null
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.setState({
			value: newProps.value,
			size: newProps.size,
			style: newProps.style || null
		})
	}

	/**
	 * 値の変更処理
	 * @param {*} e 
	 */
	changed(e: InputEvent) {
		const value = e.target.value
		this.setState({ value: value })
		if (this.props.onChange) {
			this.props.onChange(value)
		}
	}

	render() {

		const node = (
			<FormControl
				componentClass="textarea"
				name={this.state.name}
				placeholder={this.state.placeholder}
				value={this.state.value}
				onChange={(e) => this.changed(e)}
				bsSize="small"
				style={this.state.style}
				className="CommonTextArea"
			/>
		)
		return (
			<div>
				{ this.props.controlLabel && 
					<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
						{node}
					</CommonFormGroup>
				}
				{ !this.props.controlLabel && node}
			</div>
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
			header: this.props.header,
			actionType: this.props.edit ? 'edit' : 'remove',
			size: this.props.size || 'lg'
		}
		this.selected = []
		this.isControlLabel = (this.props.controlLabel || this.props.controlLabel === '')
		this.tableClass = this.props.fixed ? 'common-table' : 'common-table scroll'
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.selected = []
		this.isControlLabel = (newProps.controlLabel || newProps.controlLabel === '')
		this.setState({
			data: newProps.data,
			header: newProps.header
		})
	}

	actionBtn(_index) {
		const data = this.state.data[_index]
		return (
			<div>
				{ this.state.actionType === 'edit' && 
					<Button bsSize="small" onClick={() => this.props.edit(data, _index)}><Glyphicon glyph="pencil" /></Button>
				}
				{ this.state.actionType === 'remove' && 
					<Button bsSize="small" onClick={() => this.props.remove(data, _index)} bsStyle="danger"><Glyphicon glyph="remove" /></Button>
				}
			</div>
		)
	}
	showRemoveBtn() {
		if (this.state.actionType === 'edit') {
			this.setState({actionType: 'remove'})
		} else {
			this.setState({actionType: 'edit'})
		}
	}

	editName() {
		return this.props.edit ? '編集' : '削除'
	}

	select(_row, _value) {
		this.selected[_row] = _value[0]
		this.forceUpdate()
	}

	render() {

		// ヘッダー情報をキャッシュ
		const cashInfo = {}
		let cashInfolength = 0
		const header_obj = this.state.header
		const disabledList = {
			'link': true,
			'author': true,
			'published': false,
			'updated': false
		}

		let option = [{
			field: 'no', title: 'No', width: '20px'
		}]
		if (this.props.select) option.push({
			field: 'select', title: '選択', width: '30px'
		})
		if (this.props.edit || (this.props.remove && this.props.remove !== false)) option.push({
			field: 'edit', title: this.editName(), width: '30px'
		})
		const thNode = (_obj, _index) => {
			const field = _obj.field.replace(/\./g, '___')
			cashInfo[field] = _obj
			cashInfo[field].style = _obj.style || {}
			cashInfo[field].style.width = _obj.width
			cashInfo[field].index = _index
			cashInfolength++
			return (
				<th key={_index} style={{ width: _obj.width }} data-field={field}>
					<div style={{width: _obj.width}}>{_obj.title}</div>
				</th>
			)
		}
		let header = option.concat(header_obj)
		header = header.map((obj, i) => {
			return thNode(obj, i)
		})

		const convertValue = (value, _cashData, _index) => {
			const convertData = _cashData.convert
			const style = _cashData.style ? _cashData.style : null
			const filter = _cashData.filter
			const input = _cashData.input
			const getConvertValue = (_value) => {
				if (convertData) {
					return convertData[_value] || _value
				} else {
					return _value
				}
			}
			if (Array.isArray(value)) {
				return (
					<div className="array ellipsis" style={style}>
						{
							value.map((_value, i) => {
								if (Object.prototype.toString.call(_value) === '[object Object]') {
									let _valueCount = -1
									let __value = []
									const _valueObj = Object.keys(_value)
									const isMulti = _valueObj.length > 1
									for (let __key in _value) {
										_valueCount++
										if (typeof _value[__key] === 'string') {
											if (isMulti) {
												__value.push(<p className="multi_item value" key={_valueCount} name={__key} data-value={_value[__key]}>{getConvertValue(_value[__key])}</p>)
												if ((_valueCount + 1) !== _valueObj.length) {
													__value.push(<p className="multi_item">/</p>)
												}
											} else {
												__value.push(<div key={_valueCount} name={__key} data-value={_value[__key]}>{getConvertValue(_value[__key])}</div>)
											}
										}
									}
									if (isMulti) {
										return <div className="multi">{__value}</div>
									} else {
										return __value
									}
								} else {
									return (
										<div key={i} style={style} data-value={_value}>{getConvertValue(_value)}</div>
									)
								}
							})
						}
					</div>
				)
			} else {
				let entitiykey = _cashData.field
				if (_cashData.entitiykey) {
					entitiykey = _cashData.entitiykey.replace('{}', '[' + _index + ']')
				}
				if (filter) {
					return (
						<CommonFilterBox
							name="__tableFilter"
							value={value}
							options={filter.options}
							onChange={(data) => filter.onChange(data, _index)}
							creatable
							entitiykey={entitiykey}
							table
						/>
					)
				} else if (input) {
					return (
						<CommonInputText
							name="__tableInput"
							type="text"
							value={value}
							onChange={(data) => input.onChange(data, _index)}
							onBlur={input.onBlur ? (data) => input.onBlur(data, _index) : null }
							entitiykey={entitiykey}
							table
						/>
					)
				} else {
					return <div style={style} className="ellipsis" data-value={value}>{getConvertValue(value)}</div>
				}
			}
		}
		const body = (this.state.data && this.state.data.length > 0) && this.state.data.map((obj, i) => {

			const td = (_obj, _index) => {

				let tdCount = 0
				let array = new Array(cashInfolength)

				array[cashInfo.no.index] = <td key={tdCount} style={cashInfo.no.style}><div>{(_index + 1)}</div></td>
				tdCount++
				if (this.props.select) {
					array[cashInfo.select.index] = (
						<td key={tdCount} style={cashInfo.select.style}>
							<ButtonToolbar>
								<ToggleButtonGroup type="checkbox" value={this.selected[i]} onChange={(value)=>this.select(i, value)} >
									<ToggleButton value={i} bsStyle="success" bsSize="sm"><Glyphicon glyph="ok" /></ToggleButton>
								</ToggleButtonGroup>
							</ButtonToolbar>
						</td>
					)
					tdCount++
				}
				if (this.props.edit || this.props.remove) {
					array[cashInfo.edit.index] = <td key={tdCount} style={cashInfo.no.style}>{this.actionBtn(_index)}</td>
					tdCount++
				}

				if (cashInfo.btn1) {
					array[cashInfo.btn1.index] = <td key={tdCount} style={cashInfo.btn1.style}><div><Button bsSize="small" onClick={()=>cashInfo.btn1.onClick(_obj)}>{cashInfo.btn1.label}</Button></div></td>
					tdCount++
				}
				if (cashInfo.btn2) {
					array[cashInfo.btn2.index] = <td key={tdCount} style={cashInfo.btn2.style}><div><Button bsSize="small" onClick={()=>cashInfo.btn2.onClick(_obj)}>{cashInfo.btn2.label}</Button></div></td>
					tdCount++
				}
				if (cashInfo.btn3) {
					array[cashInfo.btn3.index] = <td key={tdCount} style={cashInfo.btn3.style}><div><Button bsSize="small" onClick={()=>cashInfo.btn3.onClick(_obj)}>{cashInfo.btn3.label}</Button></div></td>
					tdCount++
				}

				/**
				 * ReactオブジェクトはObject型と判断しない
				 * @param {*} _value 
				 */
				const checkObj = (_value) => {
					let flg = false
					if (Object.prototype.toString.call(_value) === '[object Object]') {
						if (_value['$$typeof']) {
							flg = false
						} else {
							flg = true
						}
					}
					return flg
				}
				const setCel = (__obj, _key) => {

					Object.keys(__obj).forEach(function (__key) {

						if (checkObj(__obj[__key]) === true) {

							setCel(__obj[__key], _key + __key + '.')

						} else if (!disabledList[__key]) {

							const field = _key.replace(/\./g, '___') + __key.replace(/\./g, '___')

							if (cashInfo[field]) {
								array[cashInfo[field].index] = (
									<td
										key={tdCount}
										style={cashInfo[field].colStyle ? cashInfo[field].colStyle : null}
										name={_key + __key}
									>
										{ convertValue(__obj[__key], cashInfo[field], _index) }
									</td>
								)
							} else {
								array.push(
									<td
										key={tdCount}
										style={{ 'display': 'none' }}
										name={_key + __key}
									>
										{ convertValue(__obj[__key], {}) }
									</td>
								)
							}
							tdCount++
						}

					})

					for (let l = 0, ll = array.length; l < ll; ++l) {
						array[l] = array[l] ? array[l] : <td key={l}></td>
					}

					return array
				}
				if (!_obj) _obj = {}
				array = setCel(_obj, '')
				return array
			}

			const isError = (obj && obj.is_error === true) ? 'isError' : ''
			const isTotal = (obj && obj.is_total === true) ? 'isTotal' : ''
			const isSelected = this.selected[i] === i ? 'isSelected' : ''

			return (
				<tr key={i} className={isError + ' ' + isTotal + ' ' + isSelected}>{td(obj, i)}</tr>
			)
		})

		const tableNode = (
			<div>
				{ this.props.children }
				{ (this.props.add && this.state.actionType === 'edit' || this.props.add && !this.props.edit) &&
					<Button onClick={() => this.props.add()} bsSize="sm">
						<Glyphicon glyph="plus"></Glyphicon>
					</Button>
				}
				{ (this.props.remove && this.state.actionType === 'edit') &&
					<Button onClick={() => this.showRemoveBtn()} bsSize="sm" bsStyle="danger">
						<Glyphicon glyph="minus"></Glyphicon>
					</Button>
				}
				{ (this.props.remove && this.state.actionType === 'remove' && this.props.edit) &&
					<Button onClick={() => this.showRemoveBtn()} bsSize="sm">
						キャンセル
					</Button>
				}
				<div className={this.tableClass}>
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
				{ this.isControlLabel &&
					<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
						{ tableNode }
					</CommonFormGroup>
				}
				{ !this.isControlLabel &&
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
		this.LogicCommonTable = new LogicCommonTable()
	}

	componentWillMount() {
    	ReactModal.setAppElement('body')
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

	getFormData() {
		const modal_body = document.getElementById('common_modal_body')
		const form = modal_body.children[0]
		let entry = CommonSetUpdateData(form)
		return entry
	}

	add() {
		this.props.addBtn(this.getFormData())
	}

	edit() {
		this.props.editBtn(this.getFormData())
	}

	select() {
		const modal_body = document.getElementById('common_modal_body')
		const table = modal_body.getElementsByTagName('table')
		const form = table[0].getElementsByTagName('input')
		const tableData = this.LogicCommonTable.setData({}, null, table)
		const selectData = () => {
			let array = []
			for (let i = 0, ii = form.length; i < ii; ++i) {
				const type = form[i].type
				if (type === 'checkbox') {
					const checked = form[i].checked
					if (checked) {
						array.push(tableData.entry[form[i].value])
					}
				}
			}
			return array
		}
		this.props.selectBtn(selectData())
	}

	componentWillUpdate() {
		let commonModal = document.getElementById('common_modal_body')
		const windowheihgt = window.innerHeight
		window.onresize = function () {
			if (commonModal) {
				if ((commonModal.style.height + 100) > windowheihgt) {
					commonModal.style.height = windowheihgt - 100
				}
			} else {
				commonModal = document.getElementById('common_modal_body')
			}
		}
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
							<div class="modal-body" id="common_modal_body" style={ this.props.height && {height: this.props.height}}>
								{ this.props.children }
							</div>
							<div class="modal-footer">
								<div>
									{ this.props.addBtn && 
										<Button bsStyle="primary" onClick={() => this.add()}>追加</Button>
									}
									{ this.props.selectBtn && 
										<Button bsStyle="primary" onClick={() => this.select()}>追加</Button>
									}
									{ this.props.addAxiosBtn && 
										<CommonRegistrationBtn
											url={this.props.addAxiosBtn.url}
											callback={(data) => this.props.addAxiosBtn.callback(data)}
											targetFrom={this.props.fromName}
										/>
									}
									{ this.props.editBtn && 
										<Button bsStyle="success" onClick={() => this.edit()}>更新</Button>
									}
									{ this.props.editAxiosBtn && 
										<CommonUpdateBtn
											url={this.props.editAxiosBtn.url}
											callback={(data) => this.props.editAxiosBtn.callback(data)}
											entry={this.props.editAxiosBtn.entry}
											targetFrom={this.props.fromName}
										/>
									}
									<Button onClick={() => this.close()}>閉じる</Button>
								</div>
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

/**
 * 検索条件
 */
export class CommonSearchConditionsFrom extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			open: this.props.open
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps() {
	}

	doSearch() {
		let conditions = null
		const form = document.CommonSearchConditionsFrom
		for (var i = 0, ii = form.length; i < ii; ++i) {
			const name = form[i].name
			const value = form[i].value

			if (value || value !== '') {
				conditions = conditions ? conditions + '&' : ''
				conditions = conditions + name + '=*' + value + '*'
			}

		}
		this.setState({ open: !this.state.open })
		this.props.doSearch(conditions)
	}

	render() {

		const icon = this.state.open === true ? 'menu-up' : 'menu-down'
		const header = (
			<div onClick={() => this.setState({ open: !this.state.open })}>検索条件 <Glyphicon glyph={icon} style={{ float: 'right' }} /></div>
		)

		return (
			<PanelGroup defaultActiveKey="1">
				<Panel collapsible header={header} eventKey="1" bsStyle="success" expanded={this.state.open}>
					<Form horizontal name="CommonSearchConditionsFrom">
						{this.props.children}
						<CommonFormGroup controlLabel=" ">
							<Button bsStyle="primary" onClick={() => { this.doSearch() }}>検索</Button>
						</CommonFormGroup>
					</Form>
				</Panel>
			</PanelGroup>
		)
	}

}

/**
 * ページング
 */
export class CommonPagination extends React.Component {

	constructor(props:Props) {
		super(props)
		this.state = { activePage : 1 , items : 0  }
		this.pageIndex = 0         // ページネーションを貼る最大index
		this.resultcount = 0	   // 検索結果件数
		this.url =''
	}
 
	/****
	 * ページネーションのIndex設定処理
	 * @url ページネーションを設定するURL
	 * @page 取得したいページ
	 *****/
	buildIndex(url, activePage) {

		// ページング取得に必要な設定を行う
		let param
		let pageIndex =
			activePage + this.props.maxButtons > this.pageIndex ? activePage + this.props.maxButtons : this.pageIndex
		if (pageIndex > this.pageIndex) {
			if (this.pageIndex > 1) {
				param = this.pageIndex + ',' + pageIndex
			} else {
				param = pageIndex
			}

		    // サーバにページネーションIndex作成リクエストを送信
			axios({
				url: url + '&_pagination=' + param,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {
				this.pageIndex = pageIndex
			}).catch(() => {
				this.pageIndex = pageIndex
			})
        
		} 
	}

	 handleSelect(eventKey) {		 
		this.buildIndex(this.props.url, eventKey)
		this.setState( {activePage: eventKey} )
		this.props.onChange(eventKey)	// 再検索
	}
	
	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {

		const new_url = newProps.url
		if (this.url !== new_url) {
	    	// pageIndex作成処理呼び出し
			this.buildIndex(new_url, 1)
			this.url = new_url
			this.setState({activePage:1})
		}
		// 件数取得
		axios({
			url: new_url + '&c',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			this.resultcount = Number(response.data.feed.title)
			const items =  Math.ceil(this.resultcount / this.props.maxDisplayRows)
			this.setState({ items: items })
		}).catch(() => {
			this.setState({ items: 0 })
		})
	}

	render() {
		return (
			<div className="pagination_area">
				<div className="count_area">
					{(this.state.activePage - 1) * this.props.maxDisplayRows} - {(this.state.activePage) * this.props.maxDisplayRows} / {this.resultcount} 件
				</div>
				<Pagination
					prev
					next
					first
					last
					ellipsis
					boundaryLinks
					items={this.state.items}
					maxButtons={this.props.maxButtons}
					activePage={this.state.activePage}
					onSelect={(key) => this.handleSelect(key)} />
			</div>
		)
	}
}

import Select from 'react-select'
import 'react-select/dist/react-select.css'

/**
 * セレクトボックス(フィルター機能つき)
 */
export class CommonFilterBox extends React.Component {

	constructor(props: Props) {
		super(props)
		this.addBtn = (
			<Button bsSize="sm" onClick={() => this.props.add()} className="CommonFilterBox-button">
				<Glyphicon glyph="plus"></Glyphicon>
			</Button>
		)
		this.editBtn = (
			<Button bsSize="sm" bsStyle="success" onClick={() => this.props.edit()} className="CommonFilterBox-button">
				<Glyphicon glyph="pencil"></Glyphicon>
			</Button>
		)
		this.detailBtn = (
			<Button bsSize="sm" onClick={() => this.props.detail()} className="CommonFilterBox-button">
				<Glyphicon glyph="list-alt"></Glyphicon>
			</Button>
		)
		this.state = {
			value: this.props.value,
			options: this.props.options,
			size: this.props.size,
			actionBtn: this.props.add ? this.addBtn : <span></span>
		}
		this.classFilterName = (this.props.add || this.props.edit || this.props.detail) && 'btn-type'
		this.style = this.props.style || { width: '100%' }
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {

		let actionBtn = <span></span>
		// ボタンの切り替え処理
		if (this.props.multi && newProps.value && newProps.value.length > 0) {
			if (this.props.edit) {
				actionBtn = this.editBtn
			} else if (this.props.detail) {
				actionBtn = this.detailBtn
			}
		} else if (!this.props.multi && newProps.value) {
			if (this.props.edit) {
				actionBtn = this.editBtn
			} else if (this.props.detail) {
				actionBtn = this.detailBtn
			}
		} else if (this.props.add) {
			actionBtn = this.addBtn
		}

		this.style = newProps.style || this.style

		this.setState({
			value: newProps.value,
			options: newProps.options,
			actionBtn: actionBtn
		})
	}

	/**
	 * 値の変更処理
	 */
	changed(obj) {
		let value = obj ? obj.value : null
		if (this.props.multi) {
			value = obj ? obj : []
		}
		this.setState({ value: value })

		if (this.props.onChange) {
			this.props.onChange(obj)
		}
	}

	getList (input, callback) {
		if (!input) {
			return Promise.resolve({ options: [] })
		}
		return this.props.async(input, callback)
	}

	render() {

		const SelectComponent = this.props.creatable ? Select.Creatable : Select
		const SelectNode = () => {
			if (this.props.async) {
				return (
					<Select.Async
						loadOptions={(input)=>this.getList(input)}
						name={this.props.name}
						value={this.state.value}
						onChange={(obj) => this.changed(obj)}
						className={this.classFilterName}
						multi={this.props.multi}
						placeholder={this.props.placeholder}
					/>
				)
			} else {
				return (
					<SelectComponent
						name={this.props.name}
						value={this.state.value}
						options={this.props.options}
						onChange={(obj) => this.changed(obj)}
						className={this.classFilterName}
						multi={this.props.multi}
						placeholder={this.props.placeholder}
					/>
				)
			}
		}
		const FilterBoxNode = () => {
			if (this.props.table) {
				return (
					<div style={this.style}>
						{ SelectNode() }
						{ this.state.actionBtn }
					</div>
				)
			} else {
				return (
					<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
						{ SelectNode() }
						{ this.state.actionBtn }
					</CommonFormGroup>
				)
			}
		}
		return FilterBoxNode()
	}

}

/**
 * 月次選択(フィルター機能つき)
 */
export class CommonMonthlySelect extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {
			value: this.props.value,
			size: 'sm'
		}
		this.option = this.setOptions()
	}

	setOptions = () => {
		const startYear = 2018
		const setMonth = (_array, _yyyy) => {
			for (let i = 1, ii = 13; i < ii; ++i) {
				const mm = i < 10 ? '0' + i : i
				const value = _yyyy + '/' + mm
				_array.push({
					label: value,
					value: value
				})
			}
			return _array
		}
		let array = []
		for (let i = 0, ii = 5; i < ii; ++i) {
			array = setMonth(array, (startYear + i))
		}
		return array
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		if (newProps.value) {
			this.setState({
				value: newProps.value
			})
		}
	}

	/**
	 * 値の変更処理
	 */
	changed(obj) {
		let value = obj ? obj.value : null
		this.setState({ value: value })
		if (this.props.onChange) {
			this.props.onChange(obj)
		}
	}

	render() {

		const SelectNode = (
			<Select
				name={this.props.name}
				value={this.state.value}
				options={this.option}
				onChange={(obj) => this.changed(obj)}
			/>
		)
		const FilterBoxNode = () => {
			if (this.props.table) {
				return (
					<div style={this.props.style}>
						{SelectNode}
					</div>
				)
			} else {
				return (
					<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
						{SelectNode}
					</CommonFormGroup>
				)
			}
		}
		return FilterBoxNode()
	}

}


/**
 * 表示用カレンダー
 */
export class CommonDisplayCalendar extends React.Component {

	constructor(props: Props) {
		super(props)
		this.state = {}

		this.weekString = ['日', '月', '火', '水', '木', '金', '土']

		this.date = new Date()
		this.to = this.setDate(this.date, true)

		this.visible = false

		this.year = parseInt(this.props.year) || this.date.getFullYear()
		this.month = parseInt(this.props.month) || this.date.getMonth() + 1

	}

	setInit(_year, _month) {
		this.befor = this.setDate(new Date(_year, _month - 1, 0))
		this.first = this.setDate(new Date(_year, _month - 1, 1))
		this.end = this.setDate(new Date(_year, _month, 0))
	}

	setDate(_date, _isTo) {
		const weekIndex = _date.getDay()
		const obj = {
			day: _date.getDate(),
			weekIndex: weekIndex,
			weekString: this.weekString[weekIndex]
		}
		if (_isTo) {
			obj.year = _date.getFullYear()
			obj.month = _date.getMonth() + 1
		}
		return obj
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps) {
		this.visible = true
		this.setInit(newProps.year, newProps.month)
		this.forceUpdate()
	}

	setArray() {
		let day = 0
		let nextMonthDay = 0
		const setWeek = (_index) => {
			let week = []
			// 第6週の表示制御
			let visibleLastWeek = false
			for (let i = 0, ii = 7; i < ii; ++i) {
				let value
				let disabled = false
				const setDays = (_value) => {

					let data
					if (i === 0) {
						data = <span className="sun">{_value}</span>
					} else if (i === 6) {
						data = <span className="sat">{_value}</span>
					} else {
						data = <span className="other">{_value}</span>
					}

					return data
				}
				if (_index === 0 && i < this.first.weekIndex) {
					// 前月の最終週
					disabled = true
					value = this.befor.day - this.befor.weekIndex + i
				} else if (_index === 0 && i === this.first.weekIndex) {
					// 今月の週の始まり
					day++
					value = setDays(day)
				} else if (day === this.end.day) {
					// 来月の週の始まり
					nextMonthDay++
					disabled = true
					value = nextMonthDay
					if (_index === 5 && i === 0) visibleLastWeek = true
				} else {
					// 今月の週
					day++
					value = setDays(day)
				}
				if (disabled) {
					value = <td className="disabled"><div className="day">{value}</div></td>
				} else {
					if (this.year === this.to.year && this.month === this.to.month && day === this.to.day) {
						value = <td className="toDay"><div className="day">{value}</div><div className="value">{i}</div></td>
					} else {
						value = <td><div className="day">{value}</div><div className="value">{i}</div></td>
					}
				}
				week.push(value)
			}
			return visibleLastWeek ? null : week
		}
		let rowIndex = -1
		const setRow = (_tdlist) => {
			rowIndex++
			return <tr key={rowIndex}>{_tdlist}</tr>
		}
		const setInitMonth = () => {
			const array = this.weekString.map((value, i) => {
				return (
					<th key={i}>{value}</th>
				)
			})
			return [setRow(array)]
		}
		let month = setInitMonth()
		for (let i = 0, ii = 6; i < ii; ++i) {
			const array = setWeek(i)
			if (array) {
				month.push(setRow(array))
			}
		}
		return <table className="CommonDisplayCalendar">{month}</table>
	}

	render() {
		return this.visible ? this.setArray() : <div></div>
	}

}
