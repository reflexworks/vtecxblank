import '../styles/index.css'
import '../styles/tutorial.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios, { AxiosResponse, AxiosError } from 'axios'
import {
	Button,
	Table
} from 'react-bootstrap'
import VtecxPagination from './vtecx-pagination'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
	//hello: string
}

interface Entry {
	id?: string
	link?: Link[]
	sample: string
}

interface Link {
	___rel: string
	___href: string
}

export default class TutorialPagination extends React.Component<ComponentProps> {

	url: string
	maxDisplayRows: number
	maxButtons: number
	isReload: boolean

	sampleTabel: any

	authError: any

	constructor(props: ComponentProps) {
		super(props)

		this.url = '/d/sample_list?f'
		this.maxDisplayRows = 50
		this.maxButtons = 5
		this.isReload = true

		this.sampleTabel = []

	}

	getSampleList(_url: string): void {

		// リロードフラグをfalseにしてください。
		this.isReload = false

		// ページネーションのためのIndex作成中に待機するためのリトライカウントです。
		// 詳しくは下記エラーを参照してください。
		let retryCountLimit = 30

		const get = (): void => {
			axios({
				url: _url,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then((_response: AxiosResponse) => {

				this.authError = null

				if (_response && _response.data) {
					this.sampleTabel = _response.data.feed.entry.map((_data: Entry, _index: number) => {
						return (
							<tr key={_index}>
								<td>{_index + 1}</td>
								<td>{_data.sample}</td>
							</tr>
						)
					})
				} else {
					this.authError = '一覧の登録件数が0件です。'
				}
				this.forceUpdate()
			}, (_error: AxiosError) => {

				if (_error.response) {
					if (_error.response.status === 403 || _error.response.status === 401) {
						this.authError = <span>認証エラーです。<a href="login.html" target="_blank" rel="noreferrer noopener">ログイン画面</a>で認証してください。</span>
					} else {
						if (_error.response.data && _error.response.data.feed) {
							const title = _error.response.data.feed.title

							if (title === 'Please make a pagination index in advance.') {
								// このエラーが発生した場合は、まだページネーションの為のIndexが作成されていない段階です。
								// Index作成リクエストはページネーションコンポーネントで自動的に行っていますが、
								// 指定のページを取得するためにはデータストアにIndexが作成されるのを待機しなければならない時間が生じます。
								// この場合、指定の回数リトライを実行することで、Indexが作成された時点で取得が成功します。
								// このロジックでは1秒感覚で最大30回リトライを実行しています。
								if (retryCountLimit !== 0) {
									retryCountLimit--
									setTimeout(() => {
										get()
									}, 1000)
									return false
								} else {
									this.authError = '一覧のindex作成に取得に失敗しました。'
								}
							}
						} else {
							this.authError = JSON.stringify(_error.response.data)
						}
					}
				}
				this.forceUpdate()
			})
		}
		get()

	}

	reloadSampleList(): void {

		// リロードフラグをtrueにしてください。
		this.isReload = true

		// 必要に応じてtableオブジェクトを初期化してください。
		this.sampleTabel = []

		// this.forceUpdate()もしくはthis.setState(...)をトリガーに一覧取得を行います。
		this.forceUpdate()
	}

	render() {
		return (
			<div>

				<VtecxPagination
					url={this.url}
					selectPage={(_url: string) => this.getSampleList(_url)}
					maxDisplayRows={this.maxDisplayRows}
					maxButtons={this.maxButtons}
					reload={this.isReload}
				>
					<Button onClick={() => this.reloadSampleList()}>リロード</Button>
					<span>{this.authError}</span>

				</VtecxPagination>

				<Table bordered condensed className="top readonly">
					<thead>
						<tr>
							<th>#</th>
							<th>sample項目</th>
						</tr>
					</thead>
					<tbody>
						{this.sampleTabel}
					</tbody>
				</Table>
			</div>
		)
	}
}
ReactDOM.render(<TutorialPagination />, document.getElementById('container'))