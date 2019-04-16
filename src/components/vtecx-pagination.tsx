import * as React from 'react'
import axios, { AxiosResponse } from 'axios'
import { Pagination } from 'react-bootstrap'

/* コンポーネントのPropsの型宣言 */
interface VtecxPaginationProps {
  url: string
  selectPage: any
  reload: boolean
  maxDisplayRows: number
  maxButtons: number
}

export default class VtecxPagination extends React.Component<VtecxPaginationProps> {
  activePage: number
  items: number
  lastPageIndex: number
  endPageIndex: number
  resultcount: number
  url: string
  pageIndex: number
  paginationFirst: any
  paginationNumber: any
  paginationLast: any

  constructor(props: VtecxPaginationProps) {
    super(props)
    this.url = ''
    this.activePage = 1
    this.items = 0
    this.lastPageIndex = 50
    // 前回貼ったページの最終index
    this.endPageIndex = 0
    // 検索結果件数
    this.resultcount = 0
  }

  /****
   * ページネーションのIndex設定処理
   * @url ページネーションを設定するURL
   * @page 取得したいページ
   *****/
  buildIndex(): void {
    // ページング取得に必要な設定を行う
    let param
    if (this.endPageIndex < this.activePage) {
      if (this.endPageIndex) {
        if (this.lastPageIndex <= this.activePage) {
          this.lastPageIndex = this.lastPageIndex + 50
        }
        param = this.endPageIndex + 1 + ',' + this.lastPageIndex
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

  handleSelect(eventKey: number): void {
    this.activePage = eventKey

    this.buildIndex()

    this.setPaginationNode()

    // 検索実行
    this.props.selectPage(this.url + '&n=' + this.activePage)

    this.forceUpdate()
  }

  /**
   * 親コンポーネントがpropsの値を更新した時に呼び出される
   * @param {*} newProps
   */
  componentWillReceiveProps(newProps: VtecxPaginationProps): void {
    const new_url = newProps.url + '&l=' + this.props.maxDisplayRows

    if (newProps.reload) this.url = ''

    if (this.url !== new_url) {
      this.url = new_url
      this.endPageIndex = 0
      this.activePage = 1
      // pageIndex作成処理呼び出し
      this.pageIndex = 0

      this.handleSelect(this.activePage)

      // 件数取得
      axios({
        url: newProps.url + '&c&l=*',
        method: 'get',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then((response: AxiosResponse) => {
          this.resultcount = Number(response.data.feed.title)
          const items = Math.ceil(this.resultcount / this.props.maxDisplayRows)
          this.items = items
          this.setPaginationNode()
          this.forceUpdate()
        })
        .catch(() => {
          this.items = 0
          this.setPaginationNode()
          this.forceUpdate()
        })
    }
  }

  setPaginationNode(): void {
    const activePage = this.activePage
    const lastPage = this.items

    const centerPage = Math.ceil(this.props.maxButtons / 2)
    let startPage = activePage - centerPage + 1
    if (startPage < 1) startPage = 1

    let endPage = activePage + centerPage
    if (endPage > lastPage) endPage = lastPage + 1
    if (endPage - startPage < this.props.maxButtons) {
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
      this.paginationFirst.push(
        <Pagination.Prev onClick={() => this.handleSelect(this.activePage - 1)} />
      )
    }
    if (startPage > 1) {
      this.paginationFirst.push(
        <Pagination.Item onClick={() => this.handleSelect(1)}>{1}</Pagination.Item>
      )
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
        this.paginationNumber.push(
          <Pagination.Item onClick={() => this.handleSelect(i)}>{i}</Pagination.Item>
        )
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
      this.paginationLast.push(
        <Pagination.Item onClick={() => this.handleSelect(lastViewPage)}>
          {lastViewPage}
        </Pagination.Item>
      )
    }
    if (this.lastPageIndex < lastPage) {
      this.paginationLast.push(<Pagination.Ellipsis />)
    }
    if (activePage === lastPage) {
      this.paginationLast.push(<Pagination.Next disabled />)
      this.paginationLast.push(<Pagination.Last disabled />)
    } else {
      this.paginationLast.push(
        <Pagination.Next onClick={() => this.handleSelect(this.activePage + 1)} />
      )
      this.paginationLast.push(<Pagination.Last onClick={() => this.handleSelect(lastViewPage)} />)
    }
  }

  render() {
    return (
      <div>
        <VtecxPaginationMenu
          left_area={
            <span>
              {this.props.children}
              <span className="count_area">
                {(this.activePage - 1) * this.props.maxDisplayRows} -{' '}
                {this.activePage * this.props.maxDisplayRows} / {this.resultcount} 件
              </span>
            </span>
          }
          right_area={
            <Pagination>
              {this.paginationFirst}
              {this.paginationNumber}
              {this.paginationLast}
            </Pagination>
          }
        />
      </div>
    )
  }
}

/* コンポーネントのPropsの型宣言 */
interface VtecxPaginationMenuProps {
  left_area: any
  right_area: any
}

/**
 * ページネーションメニュー
 */
export class VtecxPaginationMenu extends React.Component<VtecxPaginationMenuProps> {
  constructor(props: VtecxPaginationMenuProps) {
    super(props)
  }

  render() {
    return (
      <div className="VtecxPaginationMenu pagination_area">
        <div className="left_area">{this.props.left_area}</div>
        <div className="right_area">{this.props.right_area}</div>
        <div className="clear" />
      </div>
    )
  }
}
