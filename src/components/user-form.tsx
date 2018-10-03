
import * as React from 'react'
import {
	Form,
	PanelGroup,
	Panel,
} from 'react-bootstrap'

import {
	CommonInputText,
	CommonTable,
} from './common'

interface UserFormProps {
	entry: VtecxApp.Entry
	name: string
	registration: boolean
}

interface UserFormState {
}

export default class UserForm extends React.Component<UserFormProps, UserFormState> {

	private entry: VtecxApp.Entry
	private registration: boolean

	constructor(props: UserFormProps) {
		super(props)
		this.state = {}

		this.entry = this.props.entry
		this.entry.userinfo = this.entry.userinfo || {}
		this.entry.favorite = this.entry.favorite || {}
		this.entry.hobby = []
		this.registration = this.props.registration
	}

	/**
     * 親コンポーネントがpropsの値を更新した時に呼び出される
     * @param {*} newProps
     */
	componentWillReceiveProps(newProps: any) {
		this.entry = newProps.entry
	}

	/**
     * 画面描画の前処理
     */
	componentWillMount() {
	}

	changeUser(_data: any, _key: string) {

		if (this.entry.userinfo) {
			switch (_key) {
			case 'name':
				this.entry.userinfo.name = _data
				break
			case 'email':
				this.entry.userinfo.email = _data
				break
			case 'id':
				this.entry.userinfo.id = _data
				break
			}
			this.forceUpdate()
		}
	}

	changeFavorite(_data: any, _key: string) {

		if (this.entry.favorite) {
			switch (_key) {
			case 'food':
				this.entry.favorite.food = _data
				break
			case 'music':
				this.entry.favorite.music = _data
				break
			}
			this.forceUpdate()
		}
	}

	changeHobby(_data: any, _row: number, _key: string) {

		if (this.entry.hobby) {
			switch (_key) {
			case 'type':
				this.entry.hobby[_row].type = _data ? _data.value : ''
				break
			case 'name':
				this.entry.hobby[_row].name = _data
				break
			}
			this.forceUpdate()
		}

	}

	addArray() {
		if (!this.entry.hobby) {
			this.entry.hobby = []
		}
		this.entry.hobby.push({
			type: '0',
			name: '',
		})
		this.forceUpdate()
	}

	removeList(_index: any, row: number) {

		if (this.entry.hobby) {
			let array = []
			const oldEntry = this.entry.hobby
			for (let i = 0, ii = oldEntry.length; i < ii; ++i) {
				if (i !== row) array.push(oldEntry[i])
			}
			this.entry.hobby = array

			this.forceUpdate()
		}
	}
	render() {

		return (

			<Form name={this.props.name} horizontal data-submit-form>
				<PanelGroup defaultActiveKey="1">
					{this.entry.userinfo &&
						<Panel eventKey="1" bsStyle="info" defaultExpanded={true}>
							<Panel.Heading>
								<Panel.Title>ユーザ情報</Panel.Title>
							</Panel.Heading>
							<Panel.Body collapsible>

								<CommonInputText
									controlLabel="ID"
									name="userinfo.id"
									size=''
									type="text"
									placeholder="ID"
									value={this.entry.userinfo.id}
									onChange={(data: string) => this.changeUser(data, 'id')}
									required
									readonly={!this.registration}
								/>

								<CommonInputText
									controlLabel="ユーザ名"
									name="userinfo.name"
									size=''
									type="text"
									placeholder="ユーザ名"
									value={this.entry.userinfo.name}
									onChange={(data: string) => this.changeUser(data, 'name')}
									required
								/>
								<CommonInputText
									controlLabel="email"
									name="userinfo.email"
									size=''
									type="email"
									placeholder="vtecxblank@gmail.com"
									value={this.entry.userinfo.email}
									onChange={(data: string) => this.changeUser(data, 'email')}
									required
								/>

							</Panel.Body>
						</Panel>
					}
					{this.entry.favorite &&
						<Panel eventKey="2" bsStyle="info" defaultExpanded={true}>
							<Panel.Heading>
								<Panel.Title>お気に入り</Panel.Title>
							</Panel.Heading>
							<Panel.Body collapsible>

								<CommonInputText
									controlLabel="好きな食べ物"
									name="favorite.food"
									size=''
									type="text"
									placeholder="好きな食べ物"
									value={this.entry.favorite.food}
									onChange={(data: string) => this.changeFavorite(data, 'food')}
									required
								/>

								<CommonInputText
									controlLabel="好きな音楽"
									name="favorite.music"
									size=''
									type="text"
									placeholder="好きな音楽"
									value={this.entry.favorite.music}
									onChange={(data: string) => this.changeFavorite(data, 'music')}
									required
								/>

							</Panel.Body>
						</Panel>
					}
					{this.entry.hobby &&
						<Panel eventKey="2" bsStyle="info" defaultExpanded={true}>
							<Panel.Heading>
								<Panel.Title>趣味</Panel.Title>
							</Panel.Heading>
							<Panel.Body collapsible>
								<CommonTable
									controlLabel='趣味'
									name='hobby'
									size=''
									data={this.entry.hobby}
									header={[{
										field: 'type', title: 'タイプ', width: '80px',
										filter: {
											options: [{
												label: '屋内',
												value: '0',
											}, {
												label: '屋外',
												value: '1'
											}],
											onChange: (data: any, rowindex: number) => { this.changeHobby(data, rowindex, 'type') },
										}
									}, {
										field: 'name', title: '名前', width: '50px',
										input: {
											onChange: (data: string, rowindex: number) => { this.changeHobby(data, rowindex, 'name') },
										},
										placeholder: 'hobby',
									}]}
									fixed
									add={() => this.addArray()}
									remove={(index: any, row: number) => this.removeList(index, row)}
								/>
							</Panel.Body>
						</Panel>
					}
				</PanelGroup>
			</Form>
		)
	}
}