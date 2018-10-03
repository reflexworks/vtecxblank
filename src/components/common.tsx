
import axios, { AxiosResponse, AxiosError } from 'axios'
import * as React from 'react'
import {
	FormGroup,
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
	ToggleButton,
} from 'react-bootstrap'

declare const Promise: any

/**
 * 通信中インジケータ
 */
interface IndicatorProps {
	visible: boolean
}
export class CommonIndicator extends React.Component<IndicatorProps> {

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
interface NetworkMessageProps {
	isError?: any
	isCompleted?: any
	ref?: any
}

interface NetworkMessageState {
	error: any
	isCompleted: boolean
	ref?: any
}

export class CommonNetworkMessage extends React.Component<NetworkMessageProps, NetworkMessageState> {

	private msg: any
	constructor(props: NetworkMessageProps) {
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
	componentWillReceiveProps(newProps: any) {
		this.setState({ error: newProps.isError, isCompleted: newProps.isCompleted })
	}

	/**
	 * 初期設定
	 */
	private alertOptions: any = {
		offset: 14,
		position: 'top right',
		theme: 'dark',
		transition: 'scale'
	}

	/**
	 * 成功時の表示
	 */
	showSuccess = (_messeage: Object) => {
		this.msg.success(_messeage, {
			time: 2500,
			icon: <Glyphicon glyph="ok"></Glyphicon>
		})
	}

	/**
	 * 失敗時の表示
	 */
	showAlert = (_messeage: Object) => {
		this.msg.error(_messeage, {
			time: 10000,
			icon: <Glyphicon glyph="exclamation-sign"></Glyphicon>
		})
	}

	/**
	 * 失敗時の表示（消えない）
	 */
	showFixAlert = (_messeage: Object) => {
		this.msg.error(_messeage, {
			time: 0,
			icon: <Glyphicon glyph="exclamation-sign"></Glyphicon>
		})
	}

	render() {

		const messeageNodes = () => {

			const error = this.state.error

			if (error) {
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
		}

		return (
			<div>
				{messeageNodes()}
				{this.props.isCompleted === 'registration' &&
					this.showSuccess(<span>登録に成功しました。</span>)
				}
				{this.props.isCompleted === 'update' &&
					this.showSuccess(<span>更新に成功しました。</span>)
				}
				{this.props.isCompleted === 'delete' &&
					this.showSuccess(<span>削除に成功しました。</span>)
				}
				{
					<AlertContainer ref={(a: any) => this.msg = a} {...this.alertOptions} />
				}
			</div>
		)
	}
}

/**
 * [グローバルクラス] テーブルからデータ作成
 */
class LogicCommonTable {

	setData(_entry: any, _form_name: string, _tables: any) {

		let tables = _tables || document.getElementsByName(_form_name)[0].getElementsByTagName('table')

		const getValue = (_element: any) => {

			const isArray = _element.className && _element.className.indexOf('array') !== -1 ? true : false
			let value
			if (isArray) {
				const arrayEle = _element.getElementsByTagName('div')
				const getMultiValue = (_multiObj: any) => {
					let obj: any = {}
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
					const ele: any = arrayEle[i]
					if (ele.getAttribute('class') && ele.getAttribute('class').indexOf('multi') !== -1) {
						const multiObj = ele.getElementsByTagName('p')
						const multiValue = getMultiValue(multiObj)
						value.push(multiValue)
					} else {
						const eleKey = ele.getAttribute('name')
						if (eleKey) {
							let eleObj: any = {}
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

		const setCellData = (_row: any) => {
			let cellData: any = null
			if (_row) {
				const td = _row.getElementsByTagName('td')
				for (let i = 0, ii = td.length; i < ii; ++i) {
					if (td[i] && td[i].getAttribute('name')) {
						const name = td[i].getAttribute('name')
						if (name && name !== '__tableFilter' && name !== '__tableInput' && name !== 'is_error') {
							cellData = cellData ? cellData : {}
							let value = ''
							if (td[i].getElementsByTagName('div')[0]) {
								value = getValue(td[i].getElementsByTagName('div')[0])
							}

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

		const setRowData = (_table: any) => {

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
interface RegistrationProps {
	disabled?: any
	label?: string
	targetFrom?: any
	NavItem?: any
	controlLabel?: string
	fromName?: string
	url: string
	callback?: any
	type?: any
	error?: any
	pure?: any
}
interface RegistrationState {
	isCompleted: any
	isError: any,
	isDisabled: boolean,
	disabled: boolean
}

export class CommonRegistrationBtn extends React.Component<RegistrationProps, RegistrationState> {

	private LogicCommonTable: any
	private label: any
	private navClassOrigin: any
	private navClass: any

	constructor(props: RegistrationProps) {
		super(props)
		this.state = {
			isCompleted: false,
			isError: {},
			isDisabled: false,
			disabled: this.props.disabled
		}
		this.LogicCommonTable = new LogicCommonTable()
		this.label = this.props.label || <span><Glyphicon glyph="plus" /> 新規登録</span>

		this.navClassOrigin = 'common-action-btn-span'
		this.navClass = this.navClassOrigin + ' create'
		if (this.props.disabled) {
			this.navClass = this.navClassOrigin + ' disabled'
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps: any) {
		if (newProps.disabled === true) {
			this.navClass = this.navClassOrigin + ' disabled'
		} else {
			this.navClass = this.navClassOrigin + ' create'
		}
		this.setState(newProps)
	}

	setReqestdata(_addids: string) {

		let data: any = {}
		const addids: string = ('000000' + _addids).slice(-7)

		const setValue = (element: any) => {
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
		const setLink = (entry: any, element: any) => {
			let link = entry.link ? entry.link : []
			const selfSplit = element.value.split(',')
			let selfValue: any = []
			selfSplit.map((_value: any) => {
				const selfMark = _value.split('${')
				if (selfMark.length > 1) {
					const selfKey = selfMark[1].split('}')[0]
					if (selfKey === '_addids') {
						selfValue.push(_value.replace('${_addids}', addids))
					} else {
						const childNode: any = document.getElementsByName(selfKey)[0]
						selfValue.push(_value.replace('${' + selfKey + '}', childNode.value))
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

		const setEntryData = (data: any) => {
			let entry: any = {}
			const form_name = data.getAttribute('name')
			for (var i = 0, ii = data.elements.length; i < ii; ++i) {
				let element = data.elements[i]
				if (element.name === 'link') {

					entry.link = setLink(entry, element)
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

			let feed: any = {}
			let array: any = []

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

		const url: string = this.props.url
		axios({
			url: url + '?_addids=1',
			method: 'put',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data: {}
		}).then((response: AxiosResponse) => {

			let reqData: any
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
			}).catch((error: AxiosError) => {
				if (this.props.error) {
					this.setState({ isDisabled: false })
					this.props.error(error, reqData)
				} else {
					this.setState({ isDisabled: false, isError: error })
				}
			})

		}).catch((error: AxiosError) => {
			this.setState({ isDisabled: false, isError: error })
		})
	}

	submit(e: any) {

		e.preventDefault()
		if (!this.state.isDisabled && !this.state.disabled) {
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
						<span className={this.navClass} onClick={(e) => this.submit(e)}>
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
							<Button type="submit" bsStyle="primary" onClick={(e) => this.submit(e)} disabled={this.state.disabled}>{this.label}</Button>
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

export function CommonSetUpdateData(_target_form: any) {

	const setValue = (element: any) => {
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
	const setEntryData = (data: any) => {
		let entry: any = {}
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
		entry = new LogicCommonTable().setData(entry, form_name, false)
		return entry
	}
	return setEntryData(_target_form)
}

/**
 * 更新ボタン
 */
interface UpdateBtnProps {
	disabled?: boolean
	entry?: VtecxApp.Entry
	label?: string
	targetFrom?: any
	NavItem?: any
	type?: string
	callback?: any
	error?: any
	url: string
	controlLabel?: any
}
interface UpdateBtnState {
	isCompleted: any
	isError: any
	isDisabled: boolean
	disabled: any
}
export class CommonUpdateBtn extends React.Component<UpdateBtnProps, UpdateBtnState> {

	private entry: any
	private label: any
	constructor(props: UpdateBtnProps) {
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
	componentWillReceiveProps(newProps: any) {
		this.entry = newProps.entry
		this.setState(newProps)
	}

	setReqestdata() {

		let data: any = {}

		const setFeedData = () => {
			const forms = document.forms
			let feed: any = {}
			let array: any = []
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

	submit(e: any) {

		e.preventDefault()

		if (!this.state.isDisabled) {

			if (confirm('この情報を更新します。よろしいですか？')) {

				this.setState({ isDisabled: true })

				const url = this.props.url

				let reqData: any
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
				}).then((response: AxiosResponse) => {
					this.setState({ isDisabled: false, isCompleted: 'update', isError: false })
					this.props.callback(reqData, response)
				}).catch((error: AxiosError) => {
					if (this.props.error) {
						this.setState({ isDisabled: false })
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

interface DeleteBtnProps {
	entry?: VtecxApp.Entry
	NavItem?: any
	error?: any
	callback?: any
	controlLabel?: string
}

interface DeleteBtnState {
	isCompleted: any
	isError: any
	isDisabled: boolean
}

/**
 * 削除ボタン
 */
export class CommonDeleteBtn extends React.Component<DeleteBtnProps, DeleteBtnState> {

	private entry: any

	constructor(props: DeleteBtnProps) {
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
	componentWillReceiveProps(newProps: any) {
		this.entry = newProps.entry
	}

	submit(e: any) {

		e.preventDefault()

		if (!this.state.isDisabled) {

			if (confirm('この情報を削除します。よろしいですか？')) {

				this.setState({ isDisabled: true })

				const id = this.entry.id
				const url = '/d' + id.split(',')[0]
				const revision = id.split(',')[1]

				axios({
					url: url + '?r=' + revision,
					method: 'delete',
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					}
				}).then((response: AxiosResponse) => {
					this.setState({ isDisabled: false, isCompleted: 'delete', isError: false })
					this.props.callback(response)
				}).catch((error: AxiosError) => {
					if (this.props.error) {
						this.setState({ isDisabled: false })
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

interface GeneralProps {
	label?: any
	buttonStyle?: any
	navStyle?: any
	NavItem?: any
	onClick?: any
	controlLabel?: string
}

interface GeneralState {
	isCompleted: boolean
	isError: any
	isDisabled: boolean
	label: any
	buttonStyle: any
	navStyle: any
}

export class CommonGeneralBtn extends React.Component<GeneralProps, GeneralState> {

	private data: any
	constructor(props: GeneralProps) {
		super(props)
		this.state = {
			isCompleted: false,
			isError: {},
			isDisabled: false,
			label: this.props.label,
			buttonStyle: this.props.buttonStyle ? 'btn ' + this.props.buttonStyle : 'btn',
			navStyle: this.props.navStyle ? 'common-action-btn-span ' + this.props.navStyle : 'common-action-btn-span'
		}
		this.data = ''
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

interface BackBtnProps {
	href: string
	NavItem?: any
	controlLabel?: string
}

interface BackBtnState {
	href: string
}
export class CommonBackBtn extends React.Component<BackBtnProps, BackBtnState> {

	constructor(props: BackBtnProps) {
		super(props)
		this.state = {
			href: this.props.href
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps: any) {
		this.setState({ href: newProps.href })
	}

	/**
	 * 戻る処理
	 * @param {*} e 
	 */
	submit(e: any) {
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

interface ClearBtnProps {
	entry?: VtecxApp.Entry
	callback?: any
	NavItem?: any
	controlLabel?: any
}
interface ClearBtnState {
	entry: any
}

export class CommonClearBtn extends React.Component<ClearBtnProps, ClearBtnState> {

	constructor(props: ClearBtnProps) {
		super(props)
		this.state = {
			entry: this.props.entry
		}
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps: any) {
		this.setState({ entry: newProps.entry })
	}

	/**
	 * クリア処理
	 * @param {*} e 
	 */
	action(e: any) {
		e.preventDefault()
		if (this.props.callback) {
			this.props.callback()
		}
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
interface FormGroupProps {
	validationState?: any
	size?: any
	controlLabel?: string
}

interface FormGroupState {
	validationState: any
	labelSize: any
	inputSize: any
	style: any
}

export class CommonFormGroup extends React.Component<FormGroupProps, FormGroupState>{

	constructor(props: FormGroupProps) {
		super(props)
		this.state = {
			validationState: this.props.validationState,
			labelSize: this.labelSize(),
			inputSize: this.inputSize(this.props.size),
			style: this.inputStyle(this.props.size)
		}
	}

	labelSize() {
		let size = 2
		return size
	}

	inputSize(_option: string) {
		let size = 4
		if (_option === 'sm') size = 2
		if (_option === 'md') size = 4
		if (_option === 'lg') size = 9
		return size
	}

	inputStyle(_option: string) {
		if (!_option) _option = 'md'
		return 'formgroup_' + _option
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps: any) {
		this.setState({
			validationState: newProps.validationState,
			labelSize: this.labelSize(),
			inputSize: this.inputSize(newProps.size),
			style: this.inputStyle(newProps.size),
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
						<div className={this.state.style}>
							{this.props.children}
						</div>
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
 * セレクトボックス
 */

interface SelectBoxProps {
	value?: any
	options?: any
	size: string
	onChange?: any
	placeholder?: string
	name: string
	bsSize?: any
	style?: any
	pure?: any
	controlLabel: string
	validationState?: any
}

interface SelectBoxState {
	value: string
	options: any
	size: string
}

export class CommonSelectBox extends React.Component<SelectBoxProps, SelectBoxState> {

	constructor(props: SelectBoxProps) {
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
	componentWillReceiveProps(newProps: any) {
		this.setState({ value: newProps.value, options: newProps.options })
	}

	/**
	 * 値の変更処理
	 * @param {*} e 
	 */
	changed(e: any) {
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
				{options}
			</FormControl>
		)

		return (
			<div style={this.props.style}>
				{this.props.pure && selectNode}
				{!this.props.pure &&
					<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
						{selectNode}
					</CommonFormGroup>
				}
			</div>
		)
	}

}

let _CommonEntry: any = {}
export function CommonEntry() {

	const _event = {
		init: (_init = {}) => {
			_CommonEntry = _event.setFeed(_init)
			return _CommonEntry
		},
		get: () => {
			return _CommonEntry
		},
		setValue: (_key: any, _value: any) => {

			if (_CommonEntry.feed) {
				const keys = _key.split('.')
				const setKey = (_obj: any, _index: any) => {

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
		setFeed: (_obj: any) => {
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

interface InputTextProps {
	name: string
	type?: any
	placeholder: string
	value?: string
	readonly?: any
	comparison?: any
	size: string
	entitiykey?: any
	isPrice?: boolean
	onChange?: any
	onForcus?: any
	onBlur?: any
	validate?: any
	required?: boolean
	onKeyDown?: any
	style?: Object
	className?: any
	table?: any
	customIcon?: any
	controlLabel: string
	validationState?: any
}

interface InputTextState {
	name: string
	type: string
	placeholder: string
	value: any
	readonly: string
	size: string
	entitiykey: string
}

export class CommonInputText extends React.Component<InputTextProps, InputTextState> {

	constructor(props: InputTextProps) {
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
	componentWillReceiveProps(newProps: any) {
		this.setState({
			value: newProps.value,
			readonly: newProps.readonly,
			placeholder: newProps.placeholder,
			size: newProps.size
		})
	}

	getValue(_value: any) {
		return _value
	}

	/**
	 * 値の変更処理
	 * @param {*} e 
	 */
	changed(e: any) {
		const value = e.target.value
		const entitiykey = this.state.entitiykey || this.state.name
		CommonEntry().setValue(entitiykey, value)
		this.setState({ value: value })
		if (this.props.onChange) {
			this.props.onChange(value)
		}
	}

	/**
	 * フォーカスイン時
	 * @param {*} e 
	 */
	focused(e: any) {
		const value = e.target.value
		this.setState({ value: value })
		if (this.props.onForcus) {
			this.props.onForcus(value)
		}
	}

	/**
	 * フォーカスアウト時
	 * @param {*} e 
	 */
	blured(e: any) {
		const value = this.getValue(e.target.value)
		const entitiykey = this.state.entitiykey || this.state.name
		CommonEntry().setValue(entitiykey, value)
		this.setState({ value: value ? value : '' })
		if (this.props.onBlur) {
			this.props.onBlur(value)
		} else {
			if (this.props.onChange) {
				this.props.onChange(value)
			}
		}
	}

	onKeyDown(e: any) {
		if (this.props.onKeyDown) {
			this.props.onKeyDown(e)
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
						onFocus={(e) => this.focused(e)}
						onBlur={(e) => this.blured(e)}
						onKeyDown={(e) => this.onKeyDown(e)}
						data-validate={this.props.validate}
						data-required={this.props.required}
						bsSize="small"
						className={this.state.entitiykey}
					/>
				)
			}
		}
		const InputTextNode = () => {
			return (
				<div>
					{this.state.readonly &&
						<FormControl.Static name={this.state.name} id={this.state.name}>
							{this.state.value}
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
				{!this.props.table &&
					<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
						{InputTextNode()}
					</CommonFormGroup>
				}
				{this.props.table &&
					InputTextNode()
				}
			</div>
		)
	}

}

interface TableProps {
	data?: any
	header?: any
	actionType?: any
	edit?: any
	size: string
	controlLabel: string
	fixed?: any
	remove?: any
	select?: any
	add?: any
	name: string
	validationState?: any
}

interface TableState {
	data?: any
	header?: any
	actionType?: any
	size: string
}

/**
 * テーブル
 */
export class CommonTable extends React.Component<TableProps, TableState> {

	private selected: any[]
	private isControlLabel: string
	private tableClass: any
	constructor(props: TableProps) {
		super(props)
		this.state = {
			data: this.props.data,
			header: this.props.header,
			actionType: this.props.edit ? 'edit' : 'remove',
			size: this.props.size || 'lg'
		}
		this.selected = []
		this.isControlLabel = (this.props.controlLabel || '')
		this.tableClass = this.props.fixed ? 'common-table' : 'common-table scroll'
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps: any) {

		this.isControlLabel = (newProps.controlLabel || newProps.controlLabel === '')
		this.setState({
			data: newProps.data,
			header: newProps.header
		})
	}

	actionBtn(_index: any) {
		const data = this.state.data[_index]
		return (
			<div>
				{this.state.actionType === 'edit' &&
					<Button bsSize="small" onClick={() => this.props.edit(data, _index)}><Glyphicon glyph="pencil" /></Button>
				}
				{this.state.actionType === 'remove' &&
					<Button bsSize="small" onClick={() => this.props.remove(data, _index)} bsStyle="danger"><Glyphicon glyph="remove" /></Button>
				}
			</div>
		)
	}
	showRemoveBtn(): void {
		if (this.state.actionType === 'edit') {
			this.setState({ actionType: 'remove' })
		} else {
			this.setState({ actionType: 'edit' })
		}
	}

	editName() {
		return this.props.edit ? '編集' : '削除'
	}

	select(_row: number, _value: string): void {
		this.selected[_row] = _value[0]
	}

	render() {

		// ヘッダー情報をキャッシュ
		const cashInfo: any = {}
		let cashInfolength = 0
		const header_obj = this.state.header
		const disabledList: any = {
			'link': true,
			'author': true,
			'published': false,
			'updated': false
		}

		let option = [{
			field: 'no', title: 'No', width: '20px'
		}]
		if (this.props.edit || (this.props.remove && this.props.remove !== false)) option.push({
			field: 'edit', title: this.editName(), width: '30px'
		})
		if (this.props.select) option.push({
			field: 'select', title: '選択', width: '20px'
		})

		let cashHeaderIndex: any = []
		const thNode = (_obj: any, _index: any) => {
			const field: any = _obj.field.replace(/\./g, '___')
			cashInfo[field] = _obj
			cashInfo[field].style = _obj.style || {}
			cashInfo[field].style.width = _obj.width
			cashInfo[field].index = _index
			cashInfolength++
			cashHeaderIndex[_index] = _obj.field
			return (
				<th key={_index} style={{ width: _obj.width }} data-field={field}>
					<div style={{ width: _obj.width }}>{_obj.title}</div>
				</th>
			)
		}
		let header: any = option.concat(header_obj)
		header = header.map((obj: any, i: any) => {
			return thNode(obj, i)
		})

		const convertValue = (value: any, _cashData: any, _index: any) => {
			const convertData = _cashData.convert
			const style = _cashData.style ? _cashData.style : null
			const filter: any = _cashData.filter
			const input = _cashData.input
			const getConvertValue = (_value: any, _convertIndex: any) => {
				if (convertData) {
					let convertValue
					if (Array.isArray(convertData)) {
						if (convertData[_convertIndex] !== null) {
							convertValue = convertData[_convertIndex][_value]
						} else {
							convertValue = _value
						}
					} else {
						convertValue = convertData[_value]
					}
					return convertValue || _value
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

												__value.push(
													<p className="multi_item value" key={_valueCount} id={__key} data-value={_value[__key]}>
														{getConvertValue(_value[__key], _valueCount)}
													</p>
												)


												if ((_valueCount + 1) !== _valueObj.length) {
													__value.push(<p className="multi_item">/</p>)
												}
											} else {
												__value.push(
													<div key={_valueCount} id={__key} data-value={_value[__key]}>
														{getConvertValue(_value[__key], false)}
													</div>
												)

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
										<div key={i} style={style} data-value={_value}>{getConvertValue(_value, false)}</div>
									)
								}
							})
						}
					</div>
				)
			} else {
				let entitiykey: any = _cashData.field
				if (_cashData.entitiykey) {
					entitiykey = _cashData.entitiykey.replace('{}', '[' + _index + ']')
				}

    			/**
				 * Reactオブジェクトかどうかの判定
				 * @param {*} _value 
				 */
				const checkDom = (_value: any) => {
					let flg = false
					if (Object.prototype.toString.call(_value) === '[object Object]') {
						if (_value['$$typeof']) {
							flg = true
						}
					}
					return flg
				}
				const isDom: any = checkDom(value)

				if (!isDom) {
					if (filter) {
						const options: any = filter.isRow === true ? filter.options[_index] : filter.options
						if (filter.onFocus) {
							return (
								<div onFocusCapture={() => filter.onFocus(_index)} >
									<CommonFilterBox
										name="__tableFilter"
										value={value}
										options={options}
										onChange={(data: any) => filter.onChange(data, _index)}
										creatable
										entitiykey={entitiykey}
										table
										controlLabel=''
										placeholder=''
										size=''
									/>
								</div>
							)
						} else {
							return (
								<CommonFilterBox
									name="__tableFilter"
									value={value}
									options={options}
									onChange={(data: any) => filter.onChange(data, _index)}
									creatable
									entitiykey={entitiykey}
									table
									controlLabel=''
									placeholder=''
									size=''
								/>
							)
						}
					} else if (input) {
						return (
							<CommonInputText
								name="__tableInput"
								type="text"
								value={value}
								onChange={input.onChange ? (data: any) => input.onChange(data, _index) : null}
								onBlur={input.onBlur ? (data: any) => input.onBlur(data, _index) : null}
								onForcus={input.onForcus ? (data: any) => input.onForcus(data, _index) : null}
								entitiykey={entitiykey}
								table
								isPrice={input.price}
								size=''
								placeholder=''
								controlLabel=""
							/>
						)
					} else {
						return <div style={style} className="ellipsis" data-value={value}>{getConvertValue(value, false)}</div>
					}
				} else {
					const innerValue = value.props.children
					if (value.props.className === '__is_readonly') {
						return <div style={style} className="ellipsis" data-value={innerValue}>{getConvertValue(innerValue, false)}</div>
					} else {
						return <div style={style} className="ellipsis" data-value={innerValue}>{getConvertValue(value, false)}</div>
					}
				}
			}
		}
		const body = (this.state.data && this.state.data.length > 0) && this.state.data.map((obj: any, i: any) => {
    		/**
			 * ReactオブジェクトはObject型と判断しない
			 * @param {*} _value 
			 */
			const checkObj = (_value: any) => {
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

			const td = (_obj: any, _index: any) => {

				let tdCount = 0
				let array = new Array(cashInfolength)
				let noneDisplayIndex = parseInt(cashInfolength + '')

				array[cashInfo.no.index] = <td key={tdCount} style={cashInfo.no.style}><div className="ellipsis">{(_index + 1)}</div></td>
				tdCount++
				if (this.props.select) {
					array[cashInfo.select.index] = (
						<td key={tdCount} style={cashInfo.select.style}>
							<ButtonToolbar bsStyle="success" bsSize="sm">
								<ToggleButtonGroup type="checkbox" value={this.selected[i]} onChange={(value: any) => this.select(i, value)} >
									<ToggleButton value={i}><Glyphicon glyph="ok" /></ToggleButton>
								</ToggleButtonGroup>
							</ButtonToolbar>
						</td>
					)
					tdCount++
				}
				if (this.props.edit || this.props.remove) {
					if (_obj && _obj.is_remove === false) {
						array[cashInfo.edit.index] = <td key={tdCount} style={cashInfo.no.style}></td>
					} else {
						array[cashInfo.edit.index] = <td key={tdCount} style={cashInfo.no.style}>{this.actionBtn(_index)}</td>
					}
					tdCount++
				}

				if (cashInfo.btn1) {
					array[cashInfo.btn1.index] = <td key={tdCount} style={cashInfo.btn1.style}><div><Button bsSize="small" onClick={() => cashInfo.btn1.onClick(_obj)}>{cashInfo.btn1.label}</Button></div></td>
					tdCount++
				}
				if (cashInfo.btn2) {
					array[cashInfo.btn2.index] = <td key={tdCount} style={cashInfo.btn2.style}><div><Button bsSize="small" onClick={() => cashInfo.btn2.onClick(_obj)}>{cashInfo.btn2.label}</Button></div></td>
					tdCount++
				}
				if (cashInfo.btn3) {
					array[cashInfo.btn3.index] = <td key={tdCount} style={cashInfo.btn3.style}><div><Button bsSize="small" onClick={() => cashInfo.btn3.onClick(_obj)}>{cashInfo.btn3.label}</Button></div></td>
					tdCount++
				}

				const setCel = (__obj: any, _key: any) => {

					Object.keys(__obj).forEach(function (__key) {

						if (__key !== 'is_remove') {

							if (checkObj(__obj[__key]) === true) {

								setCel(__obj[__key], _key + __key + '.')

							} else if (!disabledList[__key]) {

								const field = _key.replace(/\./g, '___') + __key.replace(/\./g, '___')

								if (cashInfo[field]) {

									// 日時をフォーマット化
									if (field === 'published' || field === 'updated') {
										let date_value = __obj[__key].replace(/-/g, '/').split('T')
										if (date_value[1]) {
											date_value = date_value[0] + ' ' + date_value[1].split('.')[0]
											__obj[__key] = date_value
										}
									}

									array[cashInfo[field].index] = (
										<td key={cashInfo[field].index} style={cashInfo[field].style} id={_key + __key}>
											{convertValue(__obj[__key], cashInfo[field], _index)}
										</td>
									)

								} else {

									array.push(
										<td key={noneDisplayIndex} style={{ 'display': 'none' }} id={_key + __key}>
											{convertValue(__obj[__key], {}, false)}
										</td>
									)

									noneDisplayIndex++
								}
							}
						}

					})

					for (let l = 0, ll = array.length; l < ll; ++l) {
						array[l] = array[l] ? array[l] : <td key={l} id={cashHeaderIndex[l]}></td>
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
				{(this.props.add && this.state.actionType === 'edit' || this.props.add && !this.props.edit) &&
					<Button onClick={() => this.props.add()} bsSize="sm" style={{ float: 'left' }}>
						<Glyphicon glyph="plus"></Glyphicon>
					</Button>
				}
				{(this.props.remove && this.state.actionType === 'edit') &&
					<Button onClick={() => this.showRemoveBtn()} bsSize="sm" bsStyle="danger" style={{ float: 'left' }}>
						<Glyphicon glyph="minus"></Glyphicon>
					</Button>
				}
				{(this.props.remove && this.state.actionType === 'remove' && this.props.edit) &&
					<Button onClick={() => this.showRemoveBtn()} bsSize="sm" style={{ float: 'left' }}>
						キャンセル
					</Button>
				}

				{this.props.children}
				<div style={{ clear: 'both' }}></div>
				<div className={this.tableClass}
				//style={this.props.fixed ? null : { 'max-height': this.tableHeight + 'px' }}
				>
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
				{this.isControlLabel &&
					<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
						{tableNode}
					</CommonFormGroup>
				}
				{!this.isControlLabel &&
					tableNode
				}
			</div>
		)

	}

}

/**
 * バリデーションタイプ
 */
export function CommonValidate() {
	return {
		hankaku: (_value: any) => {
			//return (_value.match(/^[0-9a-zA-Z-_]+$/)) ? true : false
			return (_value.match(/^[0-9a-zA-Z-]+$/)) ? true : false
		}
	}
}

/**
 * 検索条件
 */
interface SearchConditionsFormProps {
	open?: boolean
	doSearch?: any
	children?: any
}

interface SearchConditionsFormState {
	open: any
}

export class CommonSearchConditionsFrom extends React.Component<SearchConditionsFormProps, SearchConditionsFormState> {

	constructor(props: SearchConditionsFormProps) {
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
		//const form: any = 'document.CommonSearchConditionsFrom'
		let index: any = 'CommonSearchConditionsFrom'
		const form: any = document.forms[index]
		for (var i = 0, ii = form.length; i < ii; ++i) {

			const name = form[i].name
			let value = form[i].value
			const type = form[i].type
			if (type === 'radio' && !form[i].checked) {
				continue
			}
			if (type === 'checkbox' && !form[i].checked) {
				continue
			}

			if (name === 'published' || name === 'updated') {
				value = value.replace(/\//g, '.*').replace(/ /g, '.*')
			}
			if (value || value !== '') {
				if (type === 'text') {
					value = encodeURIComponent(value)
				}
				conditions = conditions ? conditions + '&' : ''
				conditions = conditions + name + '-rg-.*' + value + '.*'
			}

		}
		this.setState({ open: !this.state.open })

		this.props.doSearch(conditions)
	}

	onKeyDown(_e: any) {
		const enter = 13
		if (_e.keyCode === enter) {
			this.doSearch()
		}
	}

	render() {
		const icon = this.state.open === true ? 'menu-up' : 'menu-down'
		const header: any = (
			<div onClick={() => this.setState({ open: !this.state.open })}>
				検索条件 <Glyphicon glyph={icon} style={{ float: 'right' }} />
			</div>
		)

		const newProps = { onKeyDown: (_e: any) => this.onKeyDown(_e) }

		const childrenWithProps = React.Children.map(this.props.children, (child: any) => {
			switch (typeof child) {
			case 'string':
				return child
			case 'object':
				return React.cloneElement(child, newProps)
			default:
				return null
			}
		})

		return (
			<PanelGroup>
				<Panel eventKey="1" bsStyle="success" expanded={this.state.open}>
					<Panel.Heading>
						<Panel.Title>{header}</Panel.Title>
					</Panel.Heading>
					<Panel.Body collapsible>
						<Form horizontal name="CommonSearchConditionsFrom">
							{childrenWithProps}
							<CommonFormGroup controlLabel=" ">
								<Button bsStyle="primary" onClick={() => { this.doSearch() }}>検索</Button>
							</CommonFormGroup>
						</Form>
					</Panel.Body>
				</Panel>
			</PanelGroup>
		)
	}

}

/**
 * ページング
 */
interface PaginationProps {
	maxButtons: number
	url: string
	onChange?: any
	maxDisplayRows: number
	activePage: number
}

interface PaginationState {
	activePage: number
	items: number
}

/**
 * ページング
 */
export class CommonPagination extends React.Component<PaginationProps, PaginationState> {

	private activePage: number
	private items: number
	private lastPageIndex: number
	private endPageIndex: any

	private resultcount: number
	private url: string
	private paginationFirst: any
	private paginationLast: any
	private paginationNumber: any
	constructor(props: PaginationProps) {
		super(props)
		this.activePage = 1
		this.items = 0
		this.lastPageIndex = 50
		// 前回貼ったページの最終index
		this.endPageIndex = 0
		this.resultcount = 0	   // 検索結果件数
		this.url = ''

	}

	/****
	 * ページネーションのIndex設定処理
	 *****/
	buildIndex() {

		// ページング取得に必要な設定を行う
		let param
		if (this.endPageIndex < this.activePage) {
			if (this.endPageIndex) {
				if (this.lastPageIndex <= this.activePage) {
					this.lastPageIndex = this.lastPageIndex + 50
				}
				param = (parseInt(this.endPageIndex) + 1) + ',' + this.lastPageIndex
			} else {
				param = this.lastPageIndex
			}

			// サーバにページネーションIndex作成リクエストを送信
			axios({
				url: this.url + '&_pagination=' + param,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((_response: AxiosResponse) => {
				if (_response && _response.data) {
					this.endPageIndex = _response.data.feed.title
				}
			})
		}
	}

	handleSelect(eventKey: number) {

		this.activePage = eventKey

		this.buildIndex()

		this.setPaginationNode()

		// 検索実行
		this.props.onChange(this.activePage, this.url + '&n=' + this.activePage)

		this.forceUpdate()
	}

	/**
	 * 親コンポーネントがpropsの値を更新した時に呼び出される
	 * @param {*} newProps 
	 */
	componentWillReceiveProps(newProps: any) {

		const new_url = newProps.url + '&l=' + this.props.maxDisplayRows
		let activePage = this.activePage
		if (newProps.activePage) {
			activePage = newProps.activePage
		}
		if (newProps.reload) this.url = ''

		if (this.url !== new_url) {

			this.url = new_url
			this.endPageIndex = 0
			//this.activePage = 1
			// pageIndex作成処理呼び出し
			//this.pageIndex = 0

			this.handleSelect(activePage)

			// 件数取得
			axios({
				url: newProps.url + '&c&l=*',
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response: AxiosResponse) => {
				this.resultcount = Number(response.data.feed.title)
				const items = Math.ceil(this.resultcount / this.props.maxDisplayRows)
				this.items = items
				this.setPaginationNode()
				this.forceUpdate()
			}).catch(() => {
				this.items = 0
				this.setPaginationNode()
				this.forceUpdate()
			})
		}
	}

	setPaginationNode() {

		const activePage = this.activePage
		const lastPage = this.items

		const centerPage = Math.ceil(this.props.maxButtons / 2)
		let startPage = activePage - centerPage + 1
		if (startPage < 1) startPage = 1

		let endPage = activePage + centerPage
		if (endPage > lastPage) endPage = lastPage + 1
		if ((endPage - startPage) < this.props.maxButtons) {
			const plus = this.props.maxButtons - (endPage - startPage)
			if (startPage === 1) {
				endPage = endPage + plus
			} else {
				startPage = startPage - plus
				if (startPage < 1) startPage = 1
			}
		}

		this.paginationFirst = []
		if (activePage === 1) {
			this.paginationFirst.push(<Pagination.First disabled />)
			this.paginationFirst.push(<Pagination.Prev disabled />)
		} else {
			this.paginationFirst.push(<Pagination.First onClick={() => this.handleSelect(1)} />)
			this.paginationFirst.push(<Pagination.Prev onClick={() => this.handleSelect((this.activePage - 1))} />)
		}
		if (startPage > 1) {
			this.paginationFirst.push(<Pagination.Item onClick={() => this.handleSelect(1)}>{1}</Pagination.Item>)
			this.paginationFirst.push(<Pagination.Ellipsis />)
		}

		this.paginationNumber = []
		for (let i = startPage, ii = endPage; i < ii; ++i) {
			if (i > lastPage) {
				break
			}
			if (i === activePage) {
				this.paginationNumber.push(<Pagination.Item active>{i}</Pagination.Item>)
			} else {
				this.paginationNumber.push(<Pagination.Item onClick={() => this.handleSelect(i)}>{i}</Pagination.Item>)
			}
		}

		let lastViewPage = lastPage
		if (this.lastPageIndex < lastPage) {
			lastViewPage = this.lastPageIndex
			if (activePage >= lastViewPage) {
				lastViewPage = lastViewPage + 50
			}
		}
		this.paginationLast = []
		if (endPage <= lastPage) {
			this.paginationLast.push(<Pagination.Ellipsis />)
			this.paginationLast.push(<Pagination.Item onClick={() => this.handleSelect(lastViewPage)}>{lastViewPage}</Pagination.Item>)
		}
		if (this.lastPageIndex < lastPage) {
			this.paginationLast.push(<Pagination.Ellipsis />)
		}
		if (activePage === lastPage) {
			this.paginationLast.push(<Pagination.Next disabled />)
			this.paginationLast.push(<Pagination.Last disabled />)
		} else {
			this.paginationLast.push(<Pagination.Next onClick={() => this.handleSelect((this.activePage + 1))} />)
			this.paginationLast.push(<Pagination.Last onClick={() => this.handleSelect(lastViewPage)} />)
		}
	}

	render() {
		return (
			<div className="pagination_area">
				<div className="count_area">
					{(this.activePage - 1) * this.props.maxDisplayRows} - {(this.activePage) * this.props.maxDisplayRows} / {this.resultcount} 件
    			</div>
				<Pagination>
					{this.paginationFirst}
					{this.paginationNumber}
					{this.paginationLast}
				</Pagination>
			</div>
		)
	}
}


interface TableMenuProps {
	className: string
	left_area: any
	right_area: any
}

interface TableMenuState {
}

/**
 * テーブルのメニュー
 */
export class CommonTableMenu extends React.Component<TableMenuProps, TableMenuState> {

	private className: string
	constructor(props: TableMenuProps) {
		super(props)
		this.className = this.props.className ? 'CommonTableMenu ' + this.props.className : 'CommonTableMenu'
	}

	render() {
		return (
			<div className={this.className}>
				{/*<div class="left_area">
					{this.props.left_area}
				</div>
		
				<div class="right_area">
					{this.props.right_area}
				</div>
				*/}
				<div className="left_area">
					{this.props.left_area}
				</div>
				<div className="right_area">
					{this.props.right_area}
				</div>
				<div className="clear"></div>
			</div>
		)
	}
}



import ReactSelect, * as ReactSelectModule from 'react-select'
import 'react-select/dist/react-select.css'
/**
 * セレクトボックス(フィルター機能つき)
 */

interface FilterBoxProps {
	value?: any
	options?: any
	size: string
	detail?: any
	style?: Object
	add?: any
	edit?: any
	select?: any
	multi?: any
	onChange?: any
	creatable?: any
	async?: any
	name: string
	placeholder?: string
	table?: Object
	controlLabel: string
	validationState?: any
	entitiykey?: any
}

interface FilterBoxState {
	value: string
	options: any
	size: string
	actionBtn: any
}

export class CommonFilterBox extends React.Component<FilterBoxProps, FilterBoxState> {

	private classFilterName: string
	private style: Object
	private addBtn: any
	private editBtn: any
	private detailBtn: any
	private selectBtn: any

	constructor(props: FilterBoxProps) {
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
		this.selectBtn = (
			<Button bsSize="sm" onClick={() => this.props.select()} className="CommonFilterBox-button">
				<Glyphicon glyph="zoom-in"></Glyphicon>
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
	componentWillReceiveProps(newProps: any) {

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
		} else if (this.props.select) {
			actionBtn = this.selectBtn
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
	changed(obj: any) {
		let value = obj ? obj.value : null
		if (this.props.multi) {
			value = obj ? obj : []
		}
		this.setState({ value: value })

		if (this.props.onChange) {
			this.props.onChange(obj)
		}
	}

	getList(input: string, callback: any) {
		if (!input) {
			return Promise.resolve({ options: [] })
		}
		return this.props.async(input, callback)
	}

	render() {

		const SelectNode = () => {
			if (this.props.async) {
				return (
					<ReactSelectModule.Async
						loadOptions={(input: any) => this.getList(input, false)}
						name={this.props.name}
						value={this.state.value}
						options={this.props.options}
						onChange={(obj: any) => this.changed(obj)}
						className={this.classFilterName}
						multi={this.props.multi}
						placeholder={this.props.placeholder}
					/>
				)
			} else {
				if (this.props.creatable) {
					return (
						<ReactSelectModule.Creatable
							name={this.props.name}
							value={this.state.value}
							options={this.props.options}
							onChange={(obj: any) => this.changed(obj)}
							className={this.classFilterName}
							multi={this.props.multi}
							placeholder={this.props.placeholder}
						/>
					)
				} else {
					return (
						<ReactSelect
							name={this.props.name}
							value={this.state.value}
							options={this.props.options}
							onChange={(obj: any) => this.changed(obj)}
							className={this.classFilterName}
							multi={this.props.multi}
							placeholder={this.props.placeholder}
						/>
					)
				}
			}
		}
		const FilterBoxNode = () => {
			if (this.props.table) {
				return (
					<div style={this.style}>
						{SelectNode()}
						{this.state.actionBtn}
					</div>
				)
			} else {
				return (
					<CommonFormGroup controlLabel={this.props.controlLabel} validationState={this.props.validationState} size={this.state.size}>
						{SelectNode()}
						{this.state.actionBtn}
					</CommonFormGroup>
				)
			}
		}
		return FilterBoxNode()
	}

}

export function CommonBackInternalWork(_befor_url: any) {
	const forms = document.forms[0]
	let isBack = true
	for (let i = 0, ii = forms.length; i < ii; ++i) {
		const node = forms[i]
		if (node.className.indexOf('quantity') !== -1) {
			if (!node.value || node.value === '') {
				isBack = false
			}
		}
	}
	if (document.getElementById('InternalWorkForm')) {
		if (!isBack) {
			if (confirm('未入力の項目がありますが移動してもよろしいでしょうか？')) {
				location.hash = _befor_url ? _befor_url : '#'
			}
		} else {
			location.hash = _befor_url ? _befor_url : '#'
		}
	}
}

import { setTimeout } from 'timers'
export function CommonGetList(_url: string, _activePage: any, _conditionsKey: string) {
	return new Promise((resolve: any) => {
		let retryCount = 0
		const maxRetryCount = 30
		const get = () => {

			const url = _url + '&n=' + _activePage

			// 今回の検索条件を保存する
			CommonBeforConditions().set(_conditionsKey, _activePage, url)

			axios({
				url: url,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((response: AxiosResponse) => {

				if (response.status === 204) {
					resolve({ isDisabled: false, isError: response, feed: { entry: [] } })
				} else {
					// 「response.data.feed」に１ページ分のデータ(1~50件目)が格納されている
					// activePageが「2」だったら51件目から100件目が格納されている
					resolve({ isDisabled: false, isError: null, feed: response.data.feed })
				}

			}).catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.feed) {
					const title = error.response.data.feed.title
					if (title === 'Please make a pagination index in advance.') {
						if (retryCount < maxRetryCount) {
							retryCount++
							setTimeout(() => {
								get()
							}, 1000)
						} else {
							alert('一覧のindex作成に取得に失敗しました。\n\n' + title)
							resolve({ isDisabled: false, isError: null, feed: { entry: [] } })
						}
					} else {
						resolve({ isDisabled: false, isError: error, feed: { entry: [] } })
					}
				} else {
					resolve({ isDisabled: false, isError: error, feed: { entry: [] } })
				}
			})
		}
		get()
	})
}
let _commonBeforConditions: any = {}
export function CommonBeforConditions() {
	return {
		init: () => {
			_commonBeforConditions = {}
		},
		set: (_key: any, _activePage: any, _conditions: any) => {
			let activePage = _activePage
			let array: any = []
			_conditions.split('&').map((_value: any) => {
				if (_value.indexOf('n=') !== -1) {
					activePage = parseInt(_value.split('=')[1])
				} else {
					array.push(_value)
				}
			})
			return _commonBeforConditions[_key] = {
				conditions: array.join('&'),
				activePage: activePage
			}
		},
		get: (_key: any, _url: any) => {
			let res: any = {
				conditions: null,
				activePage: 1
			}
			if (_commonBeforConditions[_key]) {
				res = JSON.parse(JSON.stringify(_commonBeforConditions[_key]))
				res.conditions = res.conditions.replace(_url, '')
			}
			return res
		}
	}
}
