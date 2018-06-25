import '../styles/index.css'
import '../styles/demo.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios from 'axios'
import {
	Form,
	//Col,
	FormGroup,
	ControlLabel,
	FormControl,
	Button,
	Alert,
	Table
} from 'react-bootstrap'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
	//hello: string
}

class CompletedForm extends React.Component<ComponentProps> {

	origin: string
	adminUrl: string

	authError: string
	uid: string

	isPostData1: string
	isPostData1Messeage: any
	postData1Obj: any

	isPostData2: string
	isPostData2Messeage: any
	postData2Obj: any

	isPostData3: string
	isPostData3Messeage: any
	postData3Obj: any

	isPostData4: string
	isPostData4Messeage: any
	postData4Obj: any

	isGetData1: string
	isGetData1Messeage: any
	getList1Tabel: any

	isGetData2: string
	isGetData2Messeage: any
	tdList2: any[]

	isPutData1: string
	isPutData1Messeage: any
	isGetPutData1Messeage: any

	isGetData3: string
	isGetData3Messeage: any
	tdList3: any[]

	isPutData2: string
	isPutData2Messeage: any
	isGetPutData2Messeage: any

	isDeleteData1: string
	isDeleteData1Messeage: any

	constructor(props: ComponentProps) {
		super(props)

		this.origin = location.origin
		this.adminUrl = this.origin + '/d/@/admin.html'

		this.authError = ''
		this.uid = ''

		this.postData1Obj = {
			feed: {
				entry: [{
					sample: 'テスト内容1'
				}]
			}
		}

		this.postData2Obj = {
			feed: {
				entry: [{
					sample: 'テスト内容2'
				}]
			}
		}

		this.postData3Obj = {
			feed: {
				entry: [{
					sample: 'テスト内容3'
				}]
			}
		}

		this.postData4Obj = {
			feed: {
				entry: [{
					sample: 'テスト内容4'
				}]
			}
		}

		this.tdList2 = []

		this.tdList3 = []

		this.getUid()
	}

	getUid(): any {
		axios({
			url: '/d/?_uid',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data) {
				this.uid = _response.data.feed.title
				this.authError = 'UID取得：' + this.uid
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				if (error.response.status === 403 || error.response.status === 401) {
					this.authError = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}

	changePostData1Value(_e: any): any {
		this.postData1Obj.feed.entry[0].sample = _e.target.value
		this.forceUpdate()
	}

	postData1(): any {

		axios({
			url: '/d/_user/' + this.uid,
			method: 'post',
			data: this.postData1Obj,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data) {
				this.isPostData1 = 'success'
				const url: string = this.origin + '/d' + _response.data.feed.title + '?e&x'
				this.isPostData1Messeage = <span>既にエントリ項目が設定されているため登録が成功しました。<br />登録先：<a href={url} target="_blank" rel="noreferrer noopener">{url}</a></span>
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isPostData1 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isPostData1Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else {
					this.isPostData1Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}


	changePostData2Value(_e: any): any {
		this.postData2Obj.feed.entry[0].sample = _e.target.value
		this.forceUpdate()
	}

	postData2(): any {

		axios({
			url: '/d/_user/' + this.uid,
			method: 'post',
			data: this.postData2Obj,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data) {
				this.isPostData2 = 'success'
				const url: string = this.origin + '/d' + _response.data.feed.title + '?e&x'
				this.isPostData2Messeage = <span>登録に成功しました。<br />登録先：<a href={url} target="_blank" rel="noreferrer noopener">{url}</a></span>
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isPostData2 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isPostData2Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else {
					this.isPostData2Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}


	changePostData3Value(_e: any): any {
		this.postData3Obj.feed.entry[0].sample = _e.target.value
		this.forceUpdate()
	}

	postData3(): any {

		axios({
			url: '/d/sample_list',
			method: 'post',
			data: this.postData3Obj,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data) {
				this.isPostData3 = 'success'
				const url: string = this.origin + '/d' + _response.data.feed.title + '?e&x'
				this.isPostData3Messeage = <span>既にエンドポイントが作成されているため登録に成功しました。<br />登録先：<a href={url} target="_blank" rel="noreferrer noopener">{url}</a></span>
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isPostData3 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isPostData3Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else {
					this.isPostData3Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}

	changePostData4Value(_e: any): any {
		this.postData4Obj.feed.entry[0].sample = _e.target.value
		this.forceUpdate()
	}

	postData4(): any {

		axios({
			url: '/d/sample_list',
			method: 'post',
			data: this.postData4Obj,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data) {
				this.isPostData4 = 'success'
				const url: string = this.origin + '/d' + _response.data.feed.title + '?e&x'
				this.isPostData4Messeage = <span>登録に成功しました。<br />登録先：<a href={url} target="_blank" rel="noreferrer noopener">{url}</a></span>
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isPostData4 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isPostData4Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else {
					this.isPostData4Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}

	getList1(): any {

		axios({
			url: '/d/sample_list?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data && _response.status !== 201) {
				this.isGetData1 = 'success'
				const url: string = this.origin + '/d/sample_list?f&x'
				this.isGetData1Messeage = <span>取得に成功しました。取得元：<a href={url} target="_blank" rel="noreferrer noopener">{url}</a></span>

				let tdList: any = []
				_response.data.feed.entry.map((_entry: any, _index: number) => {
					tdList.push(
						<tr>
							<td>{_index + 1}</td>
							<td>{_entry.link[0].___href}</td>
							<td>{_entry.sample}</td>
						</tr>
					)
				})
				this.getList1Tabel = (
					<Table>
						<thead>
							<tr>
								<th>#</th>
								<th>URL</th>
								<th>sample項目の内容</th>
							</tr>
						</thead>
						<tbody>
							{tdList}
						</tbody>
					</Table>
				)
			} else {
				this.isGetData1Messeage = '/d/sample_listにデータが登録されていません。'
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isGetData1 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isGetData1Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else {
					this.isGetData1Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}


	getList2(): any {

		axios({
			url: '/d/sample_list?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data && _response.status !== 201) {
				this.isGetData2 = 'success'
				const url: string = this.origin + '/d/sample_list?f&x'
				this.isGetData2Messeage = <span>取得に成功しました。取得元：<a href={url} target="_blank" rel="noreferrer noopener">{url}</a></span>

				this.tdList2 = _response.data.feed.entry

			} else {
				this.isGetData2Messeage = '/d/sample_listにデータが登録されていません。'
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isGetData2 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isGetData2Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else {
					this.isGetData2Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}

	getList2Tabel(): any {
		let tdList: any = []
		this.tdList2.map((_entry: any, _index: number) => {
			tdList.push(
				<tr>
					<td>{_index + 1}</td>
					<td>{_entry.id}</td>
					<td><input type="text" className="form-control" value={_entry.sample} onChange={(_e: any) => this.changeTdList2(_e, _index)} /></td>
					<td><Button bsStyle="success" onClick={() => this.putData1(_index)}>更新</Button></td>
				</tr>
			)
		})
		return (
			<Table>
				<thead>
					<tr>
						<th>#</th>
						<th>リクエストデータのID</th>
						<th>sample項目の内容</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{tdList}
				</tbody>
			</Table>
		)
	}

	changeTdList2(_e: any, _index: number): any {
		this.tdList2[_index].sample = _e.target.value
		this.forceUpdate()
	}

	putData1(_index: number): any {

		const data = {
			feed: {
				entry: [JSON.parse(JSON.stringify(this.tdList2[_index]))]
			}
		}

		axios({
			url: '/d/',
			method: 'put',
			data: data,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data) {
				this.isPutData1 = 'success'
				const url: string = this.origin + '/d' + data.feed.entry[0].link[0].___href + '?e&x'
				this.isPutData1Messeage = <span>更新に成功しました。<br />更新先：<a href={url} target="_blank" rel="noreferrer noopener">{url}</a><br /><br />更新前の対象データのid: {data.feed.entry[0].id}</span>
				this.getPutData1('/d' + data.feed.entry[0].link[0].___href + '?e', false)
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isPutData1 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isPutData1Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else if (error.response.status === 409) {
					this.isPutData1Messeage = JSON.stringify(error.response.data)
					this.getPutData1('/d' + data.feed.entry[0].link[0].___href + '?e', true)
				} else {
					this.isPutData1Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})

	}

	getPutData1(_url: string, _isError: boolean) {
		axios({
			url: _url,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_isError) {
				this.isGetPutData1Messeage = <div>↓<br />更新対象データのidは<b>{_response.data.feed.entry[0].id}</b>です。<br />リビジョン番号が一致していないため競合エラーとなり更新できませんでした。</div>
			} else {
				this.isGetPutData1Messeage = <div>↓<br />更新後の対象データのid：<b>{_response.data.feed.entry[0].id}</b></div>
			}
			this.forceUpdate()
		}, (error: any) => {

			this.isGetPutData1Messeage = ''

			if (error.response) {
				this.isPutData1 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isPutData1Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else {
					this.isPutData1Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}


	getList3(): any {

		axios({
			url: '/d/sample_list?f',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data && _response.status !== 201) {
				this.isGetData3 = 'success'
				const url: string = this.origin + '/d/sample_list?f&x'
				this.isGetData3Messeage = <span>取得に成功しました。取得元：<a href={url} target="_blank" rel="noreferrer noopener">{url}</a></span>

				this.tdList3 = _response.data.feed.entry

			} else {
				this.isGetData3Messeage = '/d/sample_listにデータが登録されていません。'
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isGetData3 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isGetData3Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else {
					this.isGetData3Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}

	getList3Tabel(): any {
		let tdList: any = []
		this.tdList3.map((_entry: any, _index: number) => {
			tdList.push(
				<tr>
					<td>{_index + 1}</td>
					<td>{_entry.id}</td>
					<td><input type="text" className="form-control" value={_entry.sample} onChange={(_e: any) => this.changeTdList3(_e, _index)} /></td>
					<td><Button bsStyle="success" onClick={() => this.putData2(_index)}>更新</Button></td>
					<td><Button bsStyle="danger" onClick={() => this.deleteData1(_index)}>削除</Button></td>
				</tr>
			)
		})
		return (
			<Table>
				<thead>
					<tr>
						<th>#</th>
						<th>リクエストデータのID</th>
						<th>sample項目の内容</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{tdList}
				</tbody>
			</Table>
		)
	}

	changeTdList3(_e: any, _index: number): any {
		this.tdList3[_index].sample = _e.target.value
		this.forceUpdate()
	}

	putData2(_index: number): any {

		const data = {
			feed: {
				entry: [JSON.parse(JSON.stringify(this.tdList3[_index]))]
			}
		}

		this.isGetPutData2Messeage = ''

		axios({
			url: '/d/',
			method: 'put',
			data: data,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data) {
				this.isPutData2 = 'success'
				const url: string = this.origin + '/d' + data.feed.entry[0].link[0].___href + '?e&x'
				this.isPutData2Messeage = <span>更新に成功しました。<br />更新先：<a href={url} target="_blank" rel="noreferrer noopener">{url}</a><br /><br />更新前の対象データのid: {data.feed.entry[0].id}</span>
				this.getPutData2('/d' + data.feed.entry[0].link[0].___href + '?e', false)
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isPutData2 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isPutData2Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else if (error.response.status === 409) {
					this.isPutData2Messeage = JSON.stringify(error.response.data)
					this.getPutData2('/d' + data.feed.entry[0].link[0].___href + '?e', true)
				} else if (error.response.status === 404) {
					this.isPutData2Messeage = <span>{JSON.stringify(error.response.data)}<br /><br />対象のデータが存在しません。</span>
				} else {
					this.isPutData2Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})

	}

	getPutData2(_url: string, _isError: boolean) {

		axios({
			url: _url,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_isError) {
				this.isGetPutData2Messeage = <div>↓<br />更新対象データのidは<b>{_response.data.feed.entry[0].id}</b>です。<br />リビジョン番号が一致していないため競合エラーとなり更新できませんでした。</div>
			} else {
				this.isGetPutData2Messeage = <div>↓<br />更新後の対象データのid：<b>{_response.data.feed.entry[0].id}</b></div>
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isPutData2 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isPutData2Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else {
					this.isPutData2Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}

	deleteData1(_index: number) {

		const data = JSON.parse(JSON.stringify(this.tdList3[_index]))

		axios({
			url: '/d' + data.link[0].___href + '?r=' + data.id.split(',')[1],
			method: 'delete',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((_response: any) => {
			if (_response.data) {
				this.isDeleteData1 = 'success'
				const url: string = this.origin + '/d/sample_list?f&x'
				this.isDeleteData1Messeage = <span>削除に成功しました。<br />削除確認先：<a href={url} target="_blank" rel="noreferrer noopener">{url}</a></span>
			}
			this.forceUpdate()
		}, (error: any) => {

			if (error.response) {
				this.isDeleteData1 = 'danger'
				if (error.response.status === 403 || error.response.status === 401) {
					this.isDeleteData1Messeage = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
				} else if (error.response.status === 409) {
					this.isDeleteData1Messeage = JSON.stringify(error.response.data)
					this.getPutData2('/d' + data.link[0].___href + '?e', true)
				} else {
					this.isDeleteData1Messeage = JSON.stringify(error.response.data)
				}
			}
			this.forceUpdate()
		})
	}

	render() {
		return (
			<div>
				<header>
					<div className="contents_in">
						<a href="http://reflexworks.jp/contact.html#company"><img src="../img/logo_vt.svg" alt="有限会社バーチャルテクノロジー" /></a>
					</div>
				</header>
				<div id="wrapper">
					<div className="vtecx-demo">
						<div className="vtecx-demo-container">
							<div className="vtecx-demo-content">
								このデモを動かすには
								<a href="https://admin.vte.cx/" target="_blank" rel="noreferrer noopener">https://admin.vte.cx</a>に会員登録する必要があります。
								<br />
								会員登録後、
								<a href="https://admin.vte.cx/tutorial.html" target="_blank" rel="noreferrer noopener">チュートリアル</a>に従いサービス作成と、ダウンロードしたvtecxblankプロジェクトのデプロイを実行してください。
								<br />
								<br />
								また、この画面は上記チュートリアルで「手順：8」によりローカル起動(localhost:8000)されている、もしくはサービス自身のURLのdemo.htmlから閲覧していることが前提です。
							</div>
						</div>
						<div className="vtecx-demo-container">
							<div className="vtecx-demo-content">
								<h2>認証を行う</h2>
								<Alert bsStyle="info" className="functionlist">
									この章では/src/components/demo.tsxの以下の関数を使用しています。
									<ul>
										<li>認証ロジック：getUid()</li>
									</ul>
								</Alert>
								<div className="block">
									<div>
										まずは以下のメッセージを確認してください。<br />
										<code>{this.authError}</code><br />
										「 <b>{'{"'}feed{'"'}: {'{"'}title{'"'}:{'"'}Access denied.{'"}}'}</b> 」
										もしくは「 <b>{'{"'}feed{'"'}: {'{"'}title{'"'}:{'"'}Authentication error.{'"}}'}</b> 」と表示されている場合、
										この後の手順を実行するためにはログイン認証が必要です。
										<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>に移動し、サービスを作成したアカウントでログインを実行してください。
										<br />
										ログインができたらこのページをリロードするとメッセージ内容が変化します。
									</div>
									<div className="supplement">
										認証エラーメッセージ：例）<br />
										<div>{'{"'}feed{'"'}: {'{"'}title{'"'}:{'"'}Access denied.{'"}}'}：アクセス権限の無い状態でアクセスした場合に発生します。</div>
										<div>{'{"'}feed{'"'}: {'{"'}title{'"'}:{'"'}Authentication error.{'"}}'}：認証に失敗している場合に発生します。</div>
									</div>
								</div>
								<div className="block">
									「 <b>UID取得：{'{'} 数値 {'}'}</b> 」が表示されている場合、既に認証済みです。

									<div className="supplement">
										このUIDとはユーザの識別子です。
										{(this.uid !== '') &&
											<span>（あなたのユーザ識別子は <b>{this.uid}</b> となります。）</span>
										}
										<br />
										ユーザの識別子はそのサービスで一意となり、それぞれのユーザに以下のディレクトリがシステムにより初期登録されます。
										<br />

										<code>
											/_user/{(this.uid !== '') ? this.uid : '{UID}'}<br />
											/_user/{(this.uid !== '') ? this.uid : '{UID}'}/accesskey<br />
											/_user/{(this.uid !== '') ? this.uid : '{UID}'}/auth<br />
											/_user/{(this.uid !== '') ? this.uid : '{UID}'}/group
										</code>
										<p className="comment">※ UIDは「サービス専用管理画面 {'>'} ユーザ管理 」からでも確認できます。</p>
									</div>
									<br />
									サービスとの通信を行うためには認証をする必要があるためご注意ください。
								</div>
							</div>
						</div>
						<div className="vtecx-demo-container">
							<div className="vtecx-demo-content">
								<h2>エントリ項目を登録する</h2>
								<Alert bsStyle="info" className="functionlist">
									この章では/src/components/demo.tsxの以下の関数を使用しています。
									<ul>
										<li>送信データ：postData1Obj</li>
										<li>テキストエリア：changePostData1Value()</li>
										<li>送信ボタン：postData1()</li>
									</ul>
								</Alert>
								<div className="block">
									認証ができたら「送信」ボタンを押下してみてください。<br />
									以下のフォームに入力したデータをJSON形式でサービスに送信する機能です。
									<hr />
									<Form inline>
										<FormGroup>
											<ControlLabel>sample</ControlLabel>{' '}
											<FormControl type="text" placeholder="自由入力"
												onChange={(_e: any) => this.changePostData1Value(_e)}
												value={this.postData1Obj.feed.entry[0].sample}
											/>
										</FormGroup>
										<Button onClick={() => this.postData1()}>送信</Button>
									</Form>

									<hr />
									{(this.isPostData1) &&
										<Alert bsStyle={this.isPostData1}>
											{this.isPostData1Messeage}
										</Alert>
									}
									<br />
									<br />
									{/*{"feed":{"title":"Entry is required."}}*/}
									「 <b>{'{"'}feed{'"'}: {'{"'}title{'"'}:{'"'}JSON parse error: sample is not defined in the schema template.{'"}}'}</b> 」と表示されませんでしたか？
									<br />
									このエラーは「エントリスキーマ設定にsampleという項目がありません。」という意味となります。
									<br />
									<br />
									<br />

									上記フォームでは以下のJSON形式のデータをサービスにリクエストしています。
									<code>
										{JSON.stringify(this.postData1Obj)}
									</code>
									feed項目とentry項目の構成はvte.cxで決まった構成となります。entry項目は配列です。
									<br />
									その中にJSON形式でカスタマイズした項目をユーザ自身が設定します。
									<br />
									<br />
									今回はカスタマイズ項目として「sample」項目を設定しているのですが、それがエントリスキーマ設定にないのでこのようなエラーが発生しています。
									<br />
									<br />
									<br />

									<div>エントリ項目の登録は「 <b>サービス専用管理画面 {'>'} エントリスキーマ管理</b> 」から行えます。</div>
									<ul>
										<li>サービス専用管理画面を開くには以下のリンクをクリックしてください。</li>
										<li>
											<a href={this.adminUrl} target="_blank" rel="noreferrer noopener">{this.adminUrl}</a>
											<br /><br /><p className="comment">サービス専用管理画面を開くにはログインが必要です。</p>
											<p className="comment">上記リンクで開けない場合は、<a href="https://admin.vte.cx/" target="_blank" rel="noreferrer noopener">https://admin.vte.cx</a>のサービス一覧から開いてください。</p>
										</li>
									</ul>
								</div>
								<div className="block">
									【 新規エントリ項目追加 】<br />
									以下のように入力し「追加」ボタンをクリックしてください。
									<ul>
										<li>
											<p>項目名(英語)：「sample」</p>
											<p>項目名(日本語)：任意の名称（省略可）</p>
											<p>型：「指定なし」</p>
											<p>親項目選択：「最上位」</p>
											<img src="https://admin.vte.cx/img/demo_1.png" />
										</li>
										<li>
											<p>エントリ項目一覧に追加されれば完了です。</p>
											<img src="https://admin.vte.cx/img/demo_2.png" />
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="vtecx-demo-container">
							<div className="vtecx-demo-content">
								<h2>データを登録する</h2>
								<Alert bsStyle="info" className="functionlist">
									この章では/src/components/demo.tsxの以下の関数を使用しています。
									<ul>
										<li>送信データ：postData2Obj</li>
										<li>テキストエリア：changePostData2Value()</li>
										<li>送信ボタン：postData2()</li>
									</ul>
								</Alert>
								<div className="block">
									もう一度「送信」ボタンを押下してみてください。<br />
									エントリスキーマ管理で「sample」項目が登録されていれば、データ登録に成功するはずです。
									<hr />
									<Form inline>
										<FormGroup>
											<ControlLabel>sample</ControlLabel>{' '}
											<FormControl type="text" placeholder="自由入力"
												onChange={(_e: any) => this.changePostData2Value(_e)}
												value={this.postData2Obj.feed.entry[0].sample}
											/>
										</FormGroup>
										<Button onClick={() => this.postData2()}>送信</Button>
									</Form>

									<hr />
									{(this.isPostData2) &&
										<Alert bsStyle={this.isPostData2}>
											{this.isPostData2Messeage}
										</Alert>
									}
									<ul>
										<li>
											<p>データが登録されている様子 例）</p>
											<img src="https://admin.vte.cx/img/demo_3.png" style={{ width: '500px' }} />
										</li>
										<li>
											ユーザがカスタマイズした項目以外はシステムが登録時に自動的に付与する項目です。
											<div className="supplement">
												<div>author：作成者情報</div>
												<div>id：更新用データ(後に説明します。)</div>
												<div>link：データの保存場所情報</div>
												<div>published：作成日</div>
												<div>updated：更新日</div>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="vtecx-demo-container">
							<div className="vtecx-demo-content">
								<h2>エンドポイントを登録する</h2>
								<Alert bsStyle="info" className="functionlist">
									この章では/src/components/demo.tsxの以下の関数を使用しています。
									<ul>
										<li>送信データ：postData3Obj</li>
										<li>テキストエリア：changePostData3Value()</li>
										<li>送信ボタン：postData3()</li>
									</ul>
								</Alert>
								<div className="block">
									次は以下の「送信」ボタンを押下してみてください。<br />
									また、エラーが発生するはずです。
									<hr />
									<Form inline>
										<FormGroup>
											<ControlLabel>登録先：/sample_list</ControlLabel>{' '}
											<FormControl type="text" placeholder="自由入力"
												onChange={(_e: any) => this.changePostData3Value(_e)}
												value={this.postData3Obj.feed.entry[0].sample}
											/>
										</FormGroup>
										<Button onClick={() => this.postData3()}>送信</Button>
									</Form>

									<hr />
									{(this.isPostData3) &&
										<Alert bsStyle={this.isPostData3}>
											{this.isPostData3Messeage}
										</Alert>
									}
									<br />
									<br />

									「 <b>{'{"'}feed{'"'}: {'{"'}title{'"'}:{'"'}Parent path is required. /sample_list{'"}}'}</b> 」と表示されませんでしたか？
									<br />
									このエラーは「登録先の/sample_listが存在しません。」という意味となります。
									<br />
									<br />
									<br />

									上記フォームでは以下のようなリクエストを行っています。
									<code>
										POST /d/sample_list
									</code>
									「/d」はvte.cxのデータストアへアクセスするために必要な宛先です。
									<br />
									その後にユーザ自身が登録したい宛先を設定します。
									<br />
									<br />
									今回は宛先を「/sample_list」と設定しているのですが、それがエンドポイント設定にないのでこのようなエラーが発生しています。
									<br />
									<br />
									<br />

									<div>エンドポイントの登録は「 <b>サービス専用管理画面 {'>'} エンドポイント管理</b> 」から行えます。</div>
									<ul>
										<li>サービス専用管理画面を開くには以下のリンクをクリックしてください。</li>
										<li>
											<a href={this.adminUrl} target="_blank" rel="noreferrer noopener">{this.adminUrl}</a>
											<br /><br /><p className="comment">サービス専用管理画面を開くにはログインが必要です。</p>
											<p className="comment">上記リンクで開けない場合は、<a href="https://admin.vte.cx/" target="_blank" rel="noreferrer noopener">https://admin.vte.cx</a>のサービス一覧から開いてください。</p>
										</li>
									</ul>
								</div>

								<div className="block">
									【 新規エンドポイント作成 】<br />
									以下のように入力し「追加」ボタンをクリックしてください。
									<ul>
										<li>
											<p>エンドポイント：「sample_list」</p>
											<p>エンドポイント(日本語)：任意の名称（省略可）</p>
											<p>コメント1：任意の内容（省略可）</p>
											<p>コメント2：任意の内容（省略可）</p>
											<img src="https://admin.vte.cx/img/demo_4.png" />
										</li>
										<li>
											<p>エンドポイント一覧に追加されれば完了です。</p>
											<img src="https://admin.vte.cx/img/demo_5.png" />
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="vtecx-demo-container">
							<div className="vtecx-demo-content">
								<h2>任意の宛先にデータを登録する</h2>
								<Alert bsStyle="info" className="functionlist">
									この章では/src/components/demo.tsxの以下の関数を使用しています。
									<ul>
										<li>送信データ：postData4Obj</li>
										<li>テキストエリア：changePostData4Value()</li>
										<li>送信ボタン：postData4()</li>
									</ul>
								</Alert>
								<div className="block">
									もう一度「送信」ボタンを押下してみてください。<br />
									エンドポイント管理で「/sample_list」が登録されていれば、データ登録に成功するはずです。
									<hr />
									<Form inline>
										<FormGroup>
											<ControlLabel>登録先：/sample_list</ControlLabel>{' '}
											<FormControl type="text" placeholder="自由入力"
												onChange={(_e: any) => this.changePostData4Value(_e)}
												value={this.postData4Obj.feed.entry[0].sample}
											/>
										</FormGroup>
										<Button onClick={() => this.postData4()}>送信</Button>
									</Form>

									<hr />
									{(this.isPostData4) &&
										<Alert bsStyle={this.isPostData4}>
											{this.isPostData4Messeage}
										</Alert>
									}
									<ul>
										<li>
											<p>データが登録されている様子 例）</p>
											<img src="https://admin.vte.cx/img/demo_6.png" style={{ width: '500px' }} />
										</li>
										<li>
											id項目とlink項目に注目してください。上記のエントリスキーマ登録時のデータとは違い、エンドポイント管理で登録した宛先になっていることが確認できます。
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="vtecx-demo-container">
							<div className="vtecx-demo-content">
								<h2>データ一覧を取得する</h2>
								<Alert bsStyle="info" className="functionlist">
									この章では/src/components/demo.tsxの以下の関数を使用しています。
									<ul>
										<li>取得ボタン：getList1()</li>
										<li>テーブルオブジェクト：getList1Tabel</li>
									</ul>
								</Alert>
								<div className="block">
									「取得」ボタンを押下してみてください。<br />
									「/sample_list」に登録されているデータ一覧を取得し、そのデータを元にテーブルを作成します。
									<hr />
									<Form inline>
										<FormGroup>
											<ControlLabel>取得先：/sample_list</ControlLabel>{' '}
										</FormGroup>
										<Button onClick={() => this.getList1()}>取得</Button>
									</Form>

									<hr />
									{(this.isGetData1) &&
										<Alert bsStyle={this.isGetData1}>
											{this.isGetData1Messeage}
										</Alert>
									}
									{this.getList1Tabel}
									<ul>
										<li>取得URLに「 <b>?f</b> 」パラメータを追加することで「 <b>/d/sample_list配下のデータを取得する</b> 」ことができます。</li>
										<li>このテーブルは以下のようなロジックで作成されています。（_response.dataの中に通信結果が格納されています。）
											<img src="https://admin.vte.cx/img/demo_7.png" />
										</li>
										<li>feed項目配下のentry項目が配列になっているため、entry項目を繰り返しループすることで1行づつentry情報を参照することができます。
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="vtecx-demo-container">
							<div className="vtecx-demo-content">
								<h2>データを更新する</h2>
								<Alert bsStyle="info" className="functionlist">
									この章では/src/components/demo.tsxの以下の関数を使用しています。
									<ul>
										<li>取得ボタン：getList2()</li>
										<li>テーブルオブジェクト：getList2Tabel()</li>
										<li>1行の情報リスト：tdList2</li>
										<li>更新ボタン：putData1()</li>
									</ul>
								</Alert>
								<div className="block">
									「取得」ボタンを押下してください。<br />
									「/sample_list」に登録されているデータ一覧を取得し、そのデータを元にテーブルを作成します。
									「sample」項目の内容を書き換えて「更新」ボタンを押下するとデータの更新ができます。
									<hr />
									<Form inline>
										<FormGroup>
											<ControlLabel>取得先：/sample_list</ControlLabel>{'     '}
										</FormGroup>
										<Button onClick={() => this.getList2()}>取得</Button>
									</Form>

									<hr />
									{(this.isGetData2) &&
										<Alert bsStyle={this.isGetData2}>
											{this.isGetData2Messeage}
										</Alert>
									}
									{this.getList2Tabel()}
									{(this.isPutData1) &&
										<Alert bsStyle={this.isPutData1}>
											{this.isPutData1Messeage}
											{this.isGetPutData1Messeage}
										</Alert>
									}
									<ul>
										<li>更新に成功した場合、idの「,(カンマ)」の後ろの数字がカウントアップしていることがわかります。
											<br />
											このカウントアップした値を「<b>リビジョン番号</b>」と呼びます。<br />
											<code>
												idの構成: {'{ 更新データのURL }'},{'{ リビジョン番号 }'}<br /><br />
												例） /sample_list/5700305828184064,1
											</code>
											リクエストデータとサービスのデータストアのデータのリビジョン番号を照合し、<b>一致していない場合エラーとなります。</b>
										</li>
										<li>では、どのようなエラーが発生するのか確認してみましょう。<br />もう一度続けて先程更新したデータと同じデータの「更新」ボタンを押下してみてください。</li>
										<li>「 <b>{'{"'}feed{'"'}: {'{"'}title{'"'}:{'"'}Optimistic locking failed. Key = {'{ 更新データのURL }'}{'"}}'}</b> 」と表示されませんでしたか？
											<br />
											これが競合エラーが発生したメッセージとなります。
										</li>
										<li>競合が発生した場合は、<b>リクエストデータのリビジョン番号とサービスのデータストアのリビジョン番号を合わせなければなりません。</b>
											<br />
											上記「取得」ボタンを押下するとサービスのデータストアと同期するため、また更新ができるようになります。
										</li>
										<li>アプリを作成する場合は、クライアントサイドは「 <b>更新に成功したらリビジョン番号をカウントアップする</b> 」ということを忘れないでください。</li>
									</ul>
								</div>

							</div>
						</div>

						<div className="vtecx-demo-container">
							<div className="vtecx-demo-content">
								<h2>データを削除する</h2>
								<Alert bsStyle="info" className="functionlist">
									この章では/src/components/demo.tsxの以下の関数を使用しています。
									<ul>
										<li>取得ボタン：getList3()</li>
										<li>テーブルオブジェクト：getList3Tabel()</li>
										<li>1行の情報リスト：tdList3</li>
										<li>更新ボタン：putData2()</li>
										<li>削除ボタン：deleteData1()</li>
									</ul>
								</Alert>
								<div className="block">
									「取得」ボタンを押下してください。<br />
									「/sample_list」に登録されているデータ一覧を取得し、そのデータを元にテーブルを作成します。<br />
									「削除」ボタンを押下するとデータの削除ができます。
									<hr />
									<Form inline>
										<FormGroup>
											<ControlLabel>取得先：/sample_list</ControlLabel>{'     '}
										</FormGroup>
										<Button onClick={() => this.getList3()}>取得</Button>
									</Form>

									<hr />
									{(this.isGetData3) &&
										<Alert bsStyle={this.isGetData3}>
											{this.isGetData3Messeage}
										</Alert>
									}
									{this.getList3Tabel()}
									{(this.isPutData2) &&
										<Alert bsStyle={this.isPutData2}>
											{this.isPutData2Messeage}
											{this.isGetPutData2Messeage}
										</Alert>
									}
									{(this.isDeleteData1) &&
										<Alert bsStyle={this.isDeleteData1}>
											{this.isDeleteData1Messeage}
										</Alert>
									}
									<ul>
										<li>削除に成功したメッセージが表示された場合、「取得」ボタンを押下してください。
											<br />
											「/d/sample_list」には対象のデータが無いため、リストから除去されます。
										</li>
										<li>削除は以下のリクエストを実行しています。
											<code>
												DELETE {'{ 削除データのURL }'}?r={'{ 削除データのリビジョン番号 }'}<br /><br />
												例） /d/sample_list/5750197846016000?r=1
											</code>
										</li>
										<li>削除にも更新時と同じように「<b>リビジョン番号</b>」を使用します。<br />
											リクエストデータとサービスのデータストアのデータのリビジョン番号を照合し、<b>一致していない場合エラーとなります。</b>
										</li>
										<li>では、どのようなエラーが発生するのか確認してみましょう。<br />今度は以下の手順で実行してみてください。
											<hr />
											1. 「更新」ボタンを押下<br />
											2. 更新したデータの「削除」ボタンを押下
											<hr />
										</li>
										<li>「 <b>{'{"'}feed{'"'}: {'{"'}title{'"'}:{'"'}Optimistic locking failed. Key = {'{ 更新データのURL }'}{'"}}'}</b> 」と表示され競合エラーとなります。
										</li>
										<li>競合が発生した場合は、<b>リクエストデータのリビジョン番号とサービスのデータストアのリビジョン番号を合わせなければなりません。</b>
											<br />
											上記「取得」ボタンを押下するとサービスのデータストアと同期するため、また削除ができるようになります。
										</li>
									</ul>
								</div>

							</div>
						</div>
					</div>
				</div>
				<div id="footer">
					<p className="copyright">Copyrights&copy;2018 Virtual Technology,Ltd. ALL Rights Reserved.</p>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<CompletedForm />, document.getElementById('container'))