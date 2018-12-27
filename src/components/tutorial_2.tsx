import '../styles/index.css'
import '../styles/tutorial.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios, { AxiosResponse, AxiosError } from 'axios'
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

import TutorialPagination from './tutorial_pagination'

interface Entry {
  id?: string
  link?: Link[]
  sample: string
}

interface Link {
  ___rel: string
  ___href: string
}

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
  //hello: string
}

class TutorialForm extends React.Component<ComponentProps> {
  origin: string
  adminUrl: string

  authError: string
  uid: string

  isGetData1: string
  isGetData1Messeage: any
  getList1Tabel: any
  conditionsValue: string

  constructor(props: ComponentProps) {
    super(props)

    this.origin = location.origin
    this.adminUrl = this.origin + '/d/@/admin.html'

    this.authError = ''
    this.uid = ''

    this.getUid()
  }

  getUid(): void {
    axios({
      url: '/d/?_uid',
      method: 'get',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (_response: AxiosResponse) => {
        if (_response.data) {
          this.uid = _response.data.feed.title
          this.authError = 'UID取得：' + this.uid
        }
        this.forceUpdate()
      },
      (error: AxiosError) => {
        if (error.response) {
          if (error.response.status === 403 || error.response.status === 401) {
            this.authError = JSON.stringify(error.response.data)
          }
        }
        this.forceUpdate()
      }
    )
  }

  getList1(): void {
    let get_url = '/d/sample_list?f'
    if (this.conditionsValue) {
      get_url = get_url + '&sample=' + this.conditionsValue
    }
    axios({
      url: get_url,
      method: 'get',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (_response: AxiosResponse) => {
        if (_response.data && _response.status !== 204) {
          this.isGetData1 = 'success'
          const url: string = this.origin + get_url + '&x'
          this.isGetData1Messeage = (
            <span>
              取得に成功しました。取得元：
              <a href={url} target="_blank" rel="noreferrer noopener">
                {url}
              </a>
            </span>
          )
          let tdList: any = []
          _response.data.feed.entry.map((_entry: Entry, _index: number) => {
            _entry.link = _entry.link || []
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
              <tbody>{tdList}</tbody>
            </Table>
          )
        } else {
          this.isGetData1 = 'danger'
          this.isGetData1Messeage = '指定した条件のにデータが見つかりませんでした。'
        }
        this.forceUpdate()
      },
      (error: AxiosError) => {
        if (error.response) {
          this.isGetData1 = 'danger'
          if (error.response.status === 403 || error.response.status === 401) {
            this.isGetData1Messeage = (
              <span>
                認証エラーです。
                <a href="login.html" target="_blank" rel="noreferrer noopener">
                  ログイン画面
                </a>
                で認証してください。
              </span>
            )
          } else {
            this.isGetData1Messeage = JSON.stringify(error.response.data)
          }
        }
        this.forceUpdate()
      }
    )
  }

  render() {
    return (
      <div>
        <header>
          <div className="contents_in">
            <a href="http://reflexworks.jp/contact.html#company">
              <img src="../img/logo_vt.svg" alt="有限会社バーチャルテクノロジー" />
            </a>
          </div>
        </header>
        <div id="wrapper">
          <div className="vtecx-demo">
            <div className="vtecx-demo-container">
              <div className="vtecx-demo-content">
                このデモを動かすには
                <a href="https://admin.vte.cx/" target="_blank" rel="noreferrer noopener">
                  {'https://admin.vte.cx'}
                </a>
                に会員登録する必要があります。
                <br />
                会員登録後、
                <a
                  href="https://admin.vte.cx/tutorial.html"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  チュートリアル
                </a>
                に従いサービス作成と、ダウンロードしたvtecxblankプロジェクトのデプロイを実行してください。
                <br />
                <br />
                また、この画面は上記チュートリアルで「手順：8」によりローカル起動(localhost:8000)されている、もしくはサービス自身のURLのtutorial_2.htmlから閲覧していることが前提です。
              </div>
            </div>
            <div className="vtecx-demo-container">
              <div className="vtecx-demo-content">
                <h1>チュートリアル：応用編</h1>
                <p>
                  ここではvte.cxでより高度なアプリケーションを作成する上で必要な機能を紹介していきます。
                </p>
              </div>
            </div>
            <div className="vtecx-demo-container">
              <div className="vtecx-demo-content">
                <h2>ページネーションを行う</h2>
                <Alert bsStyle="info" className="functionlist">
                  この章では/src/components/tutorial_pagination.tsxを使用しています。
                </Alert>
                <div className="block">
                  <div>
                    vte.cxではページング機能をコンポーネントで提供しています。
                    <br />
                    <code>
                      {"import VtecxPagination from './vtecx-pagination'"}
                      <br />
                      <br />
                      {'<VtecxPagination'}
                      <br />
                      {'　　url="/d/sample_list?f"'}
                      <br />
                      {'　　selectPage={(_url) => this.getSampleList(_url)}'}
                      <br />
                      {'　　maxDisplayRows={50}'}
                      <br />
                      {'　　maxButtons={5}'}
                      <br />
                      {'　　reload={this.isReload}'}
                      <br />
                      {'/>'}
                    </code>
                    <br />
                  </div>
                  <div>
                    　　<b>url</b>：一覧取得先のURL。?fパラメータを必ず指定してください。
                  </div>
                  <div>
                    　　<b>selectPage</b>
                    ：ページ選択した際に実行する関数を指定する(function形式)。_urlに指定したページ情報が追加された一覧取得先のURLが返却されます。
                  </div>
                  <div>
                    　　<b>maxDisplayRows</b>：1ページ辺りの最大表示件数
                  </div>
                  <div>
                    　　<b>maxButtons</b>：ページ数表示ボタンの最大表示数。5の場合、「{'<<'}
                    {'<'}1,2,3,4,5{'>'}
                    {'>>'}」となる
                  </div>
                  <div>
                    　　<b>reload</b>
                    ：一覧を再表示するためのフラグです。カーソル(pageindex)を貼り直します。true or
                    false
                  </div>
                  <br />
                  <br />
                  <hr />
                  <TutorialPagination />
                  <hr />
                  <h4>コンポーネントの詳細説明</h4>
                  <br />
                  <div>コンポーネントは以下の3つのリクエストを実行しています。</div>
                  <code>
                    /d/sample_list?f&l=50&_pagination=50
                    <br />
                    /d/sample_list?f&l=50&n=1
                    <br />
                    /d/sample_list?f&c&l=*
                  </code>
                  <br />
                  <hr />
                  <b>1番目のリクエスト</b>
                  はページネーションのためにカーソル(pageindex)を作成するリクエストです。
                  <br />
                  <br />
                  <code>/d/sample_list?f&l=50&_pagination=50</code>
                  <br />
                  <div>パラメータ説明</div>
                  <br />
                  <div>
                    　　<b>f</b>：一覧取得リクエスト
                  </div>
                  <div>
                    　　<b>l=50</b>：1ページ辺りの最大取得件数
                  </div>
                  <div>
                    　　<b>_pagination=50</b>：一覧のカーソル(pageindex)作成リクエスト
                  </div>
                  <br />
                  これを行うことで「<b>1ページ最大50件のページネーションを50ページまでは行える</b>
                  」ようになります。
                  <br />
                  大量のカーソル一覧(pageindex)を張るのは時間がかかるため、初回は50ページまでとし、50ページ以降のカーソルは実際に51ページ以降の表示リクエストが来た段階で以下のリクエストをコンポーネントが実行します。
                  <br />
                  <br />
                  50ページ以降のカーソル作成リクエスト
                  <code>/d/sample_list?f&l=50&_pagination=51,100</code>
                  今度は100ページまでカーソル作成リクエストを行います。このように50区切りでカーソル作成リクエストを複数回実行することで１回に負荷が集中しないようにしています。
                  <br />
                  <br />
                  <hr />
                  <b>2番目のリクエスト</b>は実際に指定ページの一覧を取得するリクエストです。
                  <br />
                  <br />
                  <code>/d/sample_list?f&l=50&n=1</code>
                  <br />
                  <div>パラメータ説明</div>
                  <br />
                  <div>
                    　　<b>f</b>：一覧取得リクエスト
                  </div>
                  <div>
                    　　<b>l=50</b>：1ページ辺りの最大取得件数
                  </div>
                  <div>
                    　　<b>n=1</b>：1ページ目の一覧データ取得リクエスト
                  </div>
                  <br />
                  これを行うことで「<b>1ページ最大50件のページネーションの1ページ目を取得する</b>
                  」ことができます。
                  <br />
                  「n」の数値を変更することで指定のページが取得できます。
                  <br />
                  <br />
                  例えば10ページ目の取得リクエスト
                  <code>/d/sample_list?f&l=50&n=10</code>
                  これで「1ページ最大50件のページネーションの10ページ目を取得する」ことができます。
                  <br />
                  <br />
                  しかし、上記リクエストを行うと以下のエラーが発生する場合があります。
                  <code>
                    {'{"feed" : {"title" : "Please make a pagination index in advance."}}'}
                  </code>
                  これは「まだそのページのカーソル(pageindex)が作成されていません。」というメッセージとなります。
                  <br />
                  このエラーは度々起こります。
                  1番目のリクエストでカーソル作成リクエストを行っていますが、これは非同期で行っているため、カーソル(pageindex)が作成完了する前にレスポンスが返却されています。
                  よって、カーソルが作成される前にページ取得リクエストを実行すると上記エラーが発生します。
                  <br />
                  <br />
                  これを回避するにはカーソルが作成されるまで待機する必要がありますが、
                  <br />
                  チュートリアルのサンプルソースでは<b>リトライ実行</b>することで解決しています。
                  <br />
                  実際にどのような処理を行っているのかはサンプルソース(/src/components/tutorial_pagination.tsx)を参照して下さい。「
                  <b>1秒間隔で30回リトライする</b>」処理が実行されるようになっています。
                  <br />
                  <br />
                  <hr />
                  <b>3番目のリクエスト</b>は一覧の総件数を取得するリクエストです。
                  <br />
                  <br />
                  <code>/d/sample_list?f&c&l=*</code>
                  <br />
                  <div>パラメータ説明</div>
                  <br />
                  <div>
                    　　<b>f</b>：一覧取得リクエスト
                  </div>
                  <div>
                    　　<b>c</b>：件数取得リクエスト
                  </div>
                  <div>
                    　　<b>l=*</b>
                    ：アスタリスクを指定することで1ページ辺りの取得総件数を無制限にする
                  </div>
                  <br />
                  これを行うことで「<b>1ページ辺り無制限の一覧データの件数を取得する</b>
                  」ことができます。
                  <br />
                </div>
              </div>
            </div>

            <div className="vtecx-demo-container">
              <div className="vtecx-demo-content">
                <h2>条件検索を行う</h2>
                <div className="block">
                  条件検索はAND検索となります。通信メソッドは「GET」を使用します。
                  <br />
                  <br />
                  検索を行うには以下のようにURLパラメータに指定します。
                  <br />
                  ?fに続いて&で「 <b>項目名=検索内容</b> 」を繋いで行きます。
                  <br />
                  <br />
                  <code>/d/sample_list?f&sample=テスト</code>
                  <br />
                  <hr />
                  上記検索を下記フォームで行います。検索内容は自由入力です。
                  <br />
                  入力した値を「 <b>完全一致で検索</b>{' '}
                  」します。（何も入力しないと全件検索を行います。）
                  <br />
                  <br />
                  <br />
                  <Form inline>
                    <FormGroup>
                      <ControlLabel>取得先：/sample_list</ControlLabel>{' '}
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>　　検索条件：sample項目</ControlLabel>{' '}
                      <FormControl
                        onChange={(_e: any) => {
                          this.conditionsValue = _e.target.value
                        }}
                      />
                    </FormGroup>
                    <Button onClick={() => this.getList1()}>検索実行</Button>
                  </Form>
                  <br />
                  {this.isGetData1 && (
                    <Alert bsStyle={this.isGetData1}>{this.isGetData1Messeage}</Alert>
                  )}
                  {this.getList1Tabel}
                  <br />
                  <br />
                  <hr />
                  <br />
                  また、以下のような検索を行うことができます。
                  <br />
                  <br />
                  <br />
                  <h4>検索項目が2つ以上の検索</h4>
                  検索項目が2つ以上になる場合は以下のように指定します。
                  <code>/d/sample_list?f&sample=テスト&sample2=テスト2</code>
                  <br />
                  <hr />
                  <h4>親項目+子項目の検索</h4>
                  <code>/d/sample_list?f&sample.test=テスト</code>
                  <br />
                  <hr />
                  <h4>「{'='} (等しい)」の検索</h4>
                  「=」の代わりに「-eq-」を使用することもできます。「 <b>項目名-eq-値</b>{' '}
                  」という形式になります。
                  <code>/d/sample_list?f&sample-eq-テスト</code>
                  <br />
                  <hr />
                  <h4>「{'<'} (未満)」の検索</h4>
                  「-lt-」を使用します。「 <b>項目名-lt-値</b>{' '}
                  」という形式になります。値は「数値」である必要があります。
                  <code>/d/sample_list?f&sample-lt-10</code>
                  <br />
                  <hr />
                  <h4>「{'<='} (以下)」の検索</h4>
                  「-le-」を使用します。「 <b>項目名-le-値</b>{' '}
                  」という形式になります。値は「数値」である必要があります。
                  <code>/d/sample_list?f&sample-le-10</code>
                  <br />
                  <hr />
                  <h4>「{'>'} (より大きい)」の検索</h4>
                  「-gt-」を使用します。「 <b>項目名-gt-値</b>{' '}
                  」という形式になります。値は「数値」である必要があります。
                  <code>/d/sample_list?f&sample-gt-10</code>
                  <br />
                  <hr />
                  <h4>「{'>='} (以上)」の検索</h4>
                  「-ge-」を使用します。「 <b>項目名-ge-値</b>{' '}
                  」という形式になります。値は「数値」である必要があります。
                  <code>/d/sample_list?f&sample-ge-10</code>
                  <br />
                  <hr />
                  <h4>「{'!='} (等しくない)」の検索</h4>
                  「-ne-」を使用します。「 <b>項目名-ne-値</b>{' '}
                  」という形式になります。値は「数値」である必要があります。
                  <code>/d/sample_list?f&sample-ne-10</code>
                  <br />
                  <hr />
                  <h4>「{'regex'} (正規表現に合致する)」の検索</h4>
                  「-rg-」を使用します。「 <b>項目名-rg-正規表現</b> 」という形式になります。
                  <code>/d/sample_list?f&sample-rg-[A-Z]</code>
                  <br />
                  <hr />
                  <h4>あいまい検索</h4>
                  上記正規表現による検索を使用し、あいまい検索を行うことができます。
                  <br />
                  指定した値が含まれる検索を行う場合は以下のように指定します。「{' '}
                  <b>項目名-rg-.*値.*</b> 」という形式になります。
                  <code>/d/sample_list?f&sample-rg-.*テスト.*</code>
                  <br />
                  <hr />
                  <h4>前方一致の検索</h4>
                  「-fm-」を使用します。「 <b>項目名-fm-値</b> 」という形式になります。
                  <br />
                  例えば「テスト」と「テトラポット」を前方一致で検索したい場合は、以下のように指定します。
                  <code>/d/sample_list?f&sample-fm-テ</code>
                  <br />
                  <hr />
                  <h4>後方一致の検索</h4>
                  「-bm-」を使用します。「 <b>項目名-bm-値</b> 」という形式になります。
                  <br />
                  例えば「テスト」と「テトラポット」を後方一致で検索したい場合は、以下のように指定します。
                  <code>/d/sample_list?f&sample-bm-ト</code>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="footer">
          <p className="copyright">
            Copyrights&copy;2018 Virtual Technology,Ltd. ALL Rights Reserved.
          </p>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<TutorialForm />, document.getElementById('container'))
