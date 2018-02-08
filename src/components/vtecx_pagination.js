/* @flow */
import axios from 'axios'
import React from 'react'
import {
	Grid,
	Row,
	Col,
	Pagination
} from 'react-bootstrap'

type State = {
	activePage: number,
	items: number
}

type Props = {
	url: string,
	onChange: Function,
	maxDisplayRows: number,    // 1ページにおける最大表示件数（例：50件/1ページ）
	maxButtons : number     	 // pageIndexにおける最大表示件数-1
}

export default class VtecxPagination extends React.Component {
	state: State
	pageIndex: number
	resultcount: number
	url: string

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
	buildIndex(url:string,activePage:number) {

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

	 handleSelect(eventKey:number) {		 
		this.buildIndex(this.props.url, eventKey)
		this.setState( {activePage: eventKey} )
		this.props.onChange(eventKey)	// 再検索
	}
	
	 componentDidMount() {
		 if (this.url !== this.props.url) {

	    // pageIndex作成処理呼び出し
			this.buildIndex(this.props.url, 1)

			// 件数取得
			axios({
				url: this.props.url + '&c',
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

			this.url = this.props.url
			this.setState({activePage:1})
		}
	}

	render() {
		return (
			  <Grid>
				<Row>
					<Col sm={3}><p>{(this.state.activePage-1)*this.props.maxDisplayRows}-{(this.state.activePage)*this.props.maxDisplayRows}/{this.resultcount}件</p></Col>
					<Col sm={9}>
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
							onSelect={(key)=>this.handleSelect(key)} />
					</Col>
				</Row>
			  </Grid>
		)
	}
}
