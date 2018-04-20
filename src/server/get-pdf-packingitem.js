//import vtecxapi from 'vtecxapi' 
import React from 'react'
//import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/packingitemstyles.js'
import {
	getStamp
} from './common'

export const pageTitle = (_title) => {
	return (
		<table cols="1" style={pdfstyles.page_title_table}>
			<tr>
				<td style={pdfstyles.page_title_blank}><div></div></td>
			</tr>
			<tr>
				<td style={pdfstyles.page_title}>{_title} 御見積り</td>
			</tr>
			<tr>
				<td style={pdfstyles.page_title_blank}><div></div></td>
			</tr>
		</table>
	)
}

const header = (_quotationData) => {

	return  (
		<table cols="5" style={pdfstyles.header_table}>
			<tr>
				<td rowspan="2"></td>
				<td style={pdfstyles.header_title}>{_quotationData.billto.billto_name}　御中</td>
				<td rowspan="2"></td>
				<td style={pdfstyles.billfrom_info} rowspan="2">
					<div>見積番号：{_quotationData.quotation.quotation_code}-{_quotationData.quotation.quotation_code_sub}</div>
					<div>見積月：{_quotationData.quotation.quotation_date}</div>
					<div>見積日より1ヶ月間有効</div>
					<div>{_quotationData.billfrom ? _quotationData.billfrom.billfrom_name : ''}</div>
					<div>〒{_quotationData.contact_information.zip_code}</div>
					<div>
						{_quotationData.contact_information.prefecture}
						{_quotationData.contact_information.address1}
						{_quotationData.contact_information.address2}
					</div>
					<div>電話：{_quotationData.contact_information.tel}</div>
					<div>担当者：{_quotationData.creator}</div>
				</td>
				<td rowspan="2"></td>
			</tr>
			<tr>
				<td style={pdfstyles.header_comment}>
					<br />
					{/*
					<div>締め支払：毎月末締め、翌月20日払（日本郵政ご利用の場合）</div>
					<div>締め支払：毎月末締め、翌月末払い</div>
					<div>支払条件：銀行振込</div>
					*/}
				</td>
			</tr>
		</table>
	)
}


const setTr = (packing_items) =>{
	return (
		<tr style={pdfstyles.fontsize6}>
			<td style={pdfstyles.spaceLeft}>
			</td>
										
			<td colspan="1" style={pdfstyles.tdLeft}>
				<span style={pdfstyles.fontsize6}>{packing_items.item_code}</span>
				<br />
			</td>
										
			<td colspan="1" style={pdfstyles.tdLeft}>
				<span style={pdfstyles.fontsize6}>{packing_items.item_name}</span>
				<br />
			</td>
			
			<td colspan="1" style={pdfstyles.tdLeft}>
				<span style={pdfstyles.fontsize6}>{packing_items.material}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.thickness}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.inside_width}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.inside_depth}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.inside_height}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.outer_width}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.outer_depth}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.outer_height}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.outer_total}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.regular_price}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.regular_unit_price}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.special_price}</span>
				<br />
			</td>

			<td colspan="1" style={pdfstyles.tdRight}>
				<span style={pdfstyles.fontsize6}>{packing_items.special_unit_price}</span>
				<br />
			</td>
			
			<td style={pdfstyles.spaceRight}>
			</td>
		</tr>
	)
	
}

const packingItemsTable = (_data) => {

	let res = {
		data: [],
		maxPage: 0
	}
	const table = (_tr) => {

		return (
			<table cols="17" style={pdfstyles.widths}>
				{/*タイトル*/}					
				<tr>
					<td ></td>
					<td colspan="15" style={pdfstyles.packingitems_table_blank}><div></div></td>
					<td ></td>
				</tr>	
				
				{/*項目一覧*/}
				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>
					<td colspan="1" style={pdfstyles.tableTdNoBottom}>
					</td>

					<td colspan="1" style={pdfstyles.tableTdNoBottom}>
					</td>
					
					<td colspan="1" style={pdfstyles.tableTdNoBottom}>
					</td>

					<td colspan="8" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>製品寸法</span>
					</td>

					<td colspan="2" style={pdfstyles.tableTdNoBottom}>
						<span style={pdfstyles.fontsize6}>通常</span>
					</td>

					<td colspan="2" style={pdfstyles.tableTdNoBottom}>
						<span style={pdfstyles.fontsize6}>特別</span>
					</td>

					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>
				
				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>
					<td colspan="1" style={pdfstyles.tableTdNoTopBottom}>
						<span style={pdfstyles.fontsize6}>品番</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTdNoTopBottom}>
						<span style={pdfstyles.fontsize6}>商品名称</span>
					</td>
					
					<td colspan="1" style={pdfstyles.tableTdNoTopBottom}>
						<span style={pdfstyles.fontsize6}>材質</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTdNoBottom}>
						<span style={pdfstyles.fontsize6}>厚み</span>
					</td>

					<td colspan="3" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>内寸</span>
					</td>

					<td colspan="3" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>外寸</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTdNoBottom}>
						<span style={pdfstyles.fontsize6}>三辺</span>
					</td>

					<td colspan="2" style={pdfstyles.tableTdNoTopBottom}>
						<span style={pdfstyles.fontsize6}>販売価格</span>	
					</td>

					<td colspan="2" style={pdfstyles.tableTdNoTopBottom}>
						<span style={pdfstyles.fontsize6}>販売価格</span>	
					</td>

					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>
				
				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>
					<td colspan="1" style={pdfstyles.tableTdNoTop}>
					</td>

					<td colspan="1" style={pdfstyles.tableTdNoTop}>
					</td>
					
					<td colspan="1" style={pdfstyles.tableTdNoTop}>
					</td>

					<td colspan="1" style={pdfstyles.tableTdNoTop}>
						<span style={pdfstyles.fontsize6}>(mm)</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>幅</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>奥行</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>高さ</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>幅</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>奥行</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>高さ</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTdNoTop}>
						<span style={pdfstyles.fontsize6}>合計</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTdNoTop}>
					</td>

					<td colspan="1" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>単価</span>
					</td>

					<td colspan="1" style={pdfstyles.tableTdNoTop}>
					</td>

					<td colspan="1" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>単価</span>
					</td>						

					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>
				{_tr}
			</table>
		)
	}

	/**
	 * 文字量により改行が発生した場合のlength計算
	 * @param {*} _packing_items 
	 */
	const setLength = (_packing_items) => {
		const check = (_value) => {
			// 半角50文字以上は「改行する」とする
			if (_value && String(_value).length) {
				// 全角抽出
				let zen = _value.match(/[^ -~｡-ﾟ]/g)
				zen = zen && zen.length ? zen.length * 2 : 0
				// 半角抽出
				let han = _value.match(/[ -~｡-ﾟ]/g)
				han = han && han.length ? han.length : 0
				const length = zen + han
				if (length > 50) return 1
			}
			return 0
		}
		let size = check(_packing_items.item_name)
		size = size === 0 ? check(_packing_items.material) : size
		return size
	}

	let max_table_size
	let total_size = 0
	let table_array = []

	_data.map((_obj) => {

		let table_size = 1
		const length = setLength(_obj)

		table_size = table_size + length
		
		const table_total = total_size + table_size
		if (res.maxPage === 0) {
			// 1ページ目はヘッダを考慮した最大サイズ
			max_table_size = 20
		} else {
			// 2ページ目以降は配送料のみの最大サイズ
			max_table_size = 28
		}
		if (max_table_size < table_total) {
			res.data.push(table(table_array))
			res.maxPage++
			table_array = []
			total_size = 0
		}
		table_array.push(setTr(_obj))
		total_size = total_size + table_size

	})

	if (table_array.length) {
		res.data.push(table(table_array))
		res.maxPage++
	}
	res.maxSize = max_table_size
	res.totalSize = total_size

	return res
}

export const PackingItems = (_start_page, _quotationData) => {

	if (!_quotationData.packing_items || _quotationData.packing_items.length === 0) {
		return null
	}

	const stamp = getStamp(_quotationData.billfrom.billfrom_name)
	const pageStamp = () => {
		return (
			<img style={pdfstyles.stamp} src={stamp} width="65.0" height="65.0" />
		)
	}

	let res = {
		html: [],
		size: 0
	}

	let index = _start_page

	const setPage = (_content) => {
		const page = '_page-' + index
		res.html.push(
			<div className="_page" id={page} style={pdfstyles._page}>
				{_content}
			</div>
		)
		res.size++
		index++
	}

	const pageHeader = () => {
		return [pageTitle('梱包資材'), header(_quotationData)]
	}
	const globalPageHeader = (_content) => {
		return  (
			<table cols="3" style={pdfstyles.header_table_sub}>
				<tr>
					<td></td>
					<td style={pdfstyles.header_title_sub}>
						{_content}
					</td>
					<td></td>
				</tr>
			</table>
		)
	}
	const pageHeaderSub = (_pageIndex, _maxPage) => {
		return (
			globalPageHeader(<div>{_quotationData.billto.billto_name}　御中　( {_pageIndex} / {_maxPage} )</div>)
		)
	}

	const setContentPage = (_pageIndex, _maxPage, _table) => {
		let page = []
		if (index === _start_page) {
			page.push(pageHeader())

		}
		page.push(pageHeaderSub(_pageIndex, _maxPage))
		page.push(_table)

		if (index === _start_page && stamp) {
			page.push(pageStamp())
		}
		setPage(page)

	}

	// 資材ページの設定
	const req = packingItemsTable(_quotationData.packing_items)

	let _pageIndex
	for (let i = 0, ii = req.data.length; i < ii; ++i) {
		const _array = req.data[i]
		_pageIndex = i + 1
		setContentPage(_pageIndex, req.maxPage, _array)
	}

	return res

}