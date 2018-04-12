import vtecxapi from 'vtecxapi' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/quotationstyles.js'
import {
	getStamp,
	addFigure,
} from './common'

const getTdNode = (_col,_tdStyle,_value,_spanStyle) => {

	const td_style = _tdStyle ? _tdStyle : 'tdLeft'
	const span_style = _spanStyle ? _spanStyle : 'fontsize6'

	return (
		<td colspan={_col} style={pdfstyles[td_style]}>
			<span style={pdfstyles[span_style]}>{_value}</span>
			<br />
		</td>
	)
}

const quotation_code = vtecxapi.getQueryString('quotation_code')
const quotation_code_sub = vtecxapi.getQueryString('quotation_code_sub')
const getQuotation = () => {
	const data = vtecxapi.getEntry('/quotation/' + quotation_code + '-' + quotation_code_sub)
	const entry = data.feed.entry[0]
	return entry
}

let entry = getQuotation()

const getBilltoAndBillfrom = () => {
	
	const stamp = getStamp(entry.billfrom.billfrom_name)
	return (
		<tr>
			<td style={pdfstyles.spaceLeft}>
			</td>

			<td colspan="5" style={pdfstyles.fontsize10UL}>
				<div>{entry.billto.billto_name}　御中</div>
			</td>

			<td colspan="3" style={pdfstyles.fontsize10R}>
				<div>{entry.billfrom.billfrom_name}</div>
			
				<div>
					<span>〒</span>
					<span>{entry.contact_information.zip_code}</span>
					<span>　</span>
					<span>{entry.contact_information.prefecture}{entry.contact_information.address1}{entry.contact_information.address2}</span>
					<br />
					<span>TEL : </span>
					<span>{entry.contact_information.tel}</span>
					<div>
						{stamp && <img src={stamp} width="65.0" height="65.0" />}
						{entry.creator && <span>担当者:{entry.creator}</span>}
						{!entry.creator && <span>担当者:</span>}
								
					</div>	
					<br/>
				</div>
			</td>
					
			<td style={pdfstyles.spaceRight}>
			</td>
		</tr>
		
	)
}

const getBasicCondition = (_basicCondition) => {
	return(
		_basicCondition.map((basic_condition) => {
			if (basic_condition.condition) {
				return (
					basic_condition.condition.map((condition, idx) => {
						
						const length = basic_condition.condition.length
						const half = Math.floor(length / 2)

						//length > 1 && (length % 2) conditionの数が３つ以上で奇数
						//length > 1 && !(length % 2) conditionの数が３つ以上で偶数
						//length===2 conditionが２つ
						//else conditionが１つだけ
						
						if (length > 2 && (length % 2)) {
							switch (idx) {
							case 0:
								return (
									<tr key={idx}>
										<td style={pdfstyles.spaceLeft}></td>				
										{getTdNode(2, 'tdLeftNoBottom','')}
										{getTdNode(6, 'tdLeft',condition.content)}
										<td style={pdfstyles.spaceRight}></td>
									</tr>
								)

							case half:
								return (	
									<tr key={idx} >
										<td style={pdfstyles.spaceLeft}></td>				
										{getTdNode(2, 'tdLeftNoTopBottom',basic_condition.title)}
										{getTdNode(6, 'tdLeft',condition.content)}
										<td style={pdfstyles.spaceRight}></td>
									</tr>
								)
							case length - 1:
								return (			
									<tr key={idx} >
										<td style={pdfstyles.spaceLeft}></td>
										{getTdNode(2, 'tdLeftNoTop','')}
										{getTdNode(6, 'tdLeft',condition.content)}
										<td style={pdfstyles.spaceRight}></td>
									</tr>
								)
							default:
								return (			
									<tr key={idx} >
										<td style={pdfstyles.spaceLeft}></td>
										{getTdNode(2, 'tdLeftNoTopBottom','')}
										{getTdNode(6, 'tdLeft',condition.content)}
										<td style={pdfstyles.spaceRight}></td>
									</tr>
								)
							}
						} else if (length > 2 && !(length % 2)) {
							switch (idx) {
							case 0:
								return (		
									<tr key={idx} >
										<td style={pdfstyles.spaceLeft}></td>
										{getTdNode(2, 'tdLeftNoBottom', '')}
										{getTdNode(6, 'tdLeft',condition.content)}
										<td style={pdfstyles.spaceRight}></td>
									</tr>
								)
							case half:
								return (
									<tr key={idx} >
										<td style={pdfstyles.spaceLeft}></td>
										{getTdNode(2, 'tdLeftTwoLineNoTopBottom',basic_condition.title)}
										{getTdNode(6, 'tdLeft',condition.content)}
										<td style={pdfstyles.spaceRight}></td>
									</tr>
								)
							case length - 1:
								return (		
									<tr key={idx} >
										<td style={pdfstyles.spaceLeft}></td>
										{getTdNode(2, 'tdLeftNoTop','')}
										{getTdNode(6, 'tdLeft',condition.content)}
										<td style={pdfstyles.spaceRight}></td>
									</tr>
								)
							default:
								return (			
									<tr key={idx} >
										<td style={pdfstyles.spaceLeft}></td>
										{getTdNode(2, 'tdLeftNoTopBottom','')}
										{getTdNode(6, 'tdLeft',condition.content)}
										<td style={pdfstyles.spaceRight}></td>
									</tr>
								)
							}
						} else if (length === 2) {
							switch (idx) {
							case 0:
								return (
									<tr key={idx} >
										<td style={pdfstyles.spaceLeft}></td>
										{getTdNode(2, 'tdLeftTwoLineNoBottom',basic_condition.title)}
										{getTdNode(6, 'tdLeft',condition.content)}
										<td style={pdfstyles.spaceRight}></td>
									</tr>
								)
													
							case length - 1:
								return (
													
									<tr key={idx} >
										<td style={pdfstyles.spaceLeft}></td>
										{getTdNode(2, 'tdLeftNoTop','')}
										{getTdNode(6, 'tdLeft',condition.content)}
										<td style={pdfstyles.spaceRight}></td>
									</tr>
								)
							}
						} else {
							return (
								<tr key={idx} >
									<td style={pdfstyles.spaceLeft}></td>
									{getTdNode(2, 'tdLeft',basic_condition.title)}
									{getTdNode(6, 'tdLeft',condition.content)}
									<td style={pdfstyles.spaceRight}></td>
								</tr>
							)
						}
									
					})
				)
			}
		})
	)
}

const searchSameValue = (item_details,searchName) => {
	const count = item_details.filter((item_details) => {
		return(item_details.item_name === searchName)
	})
	return count.length
}

const getItemDetails = (item_details) => {

	let result = []
	for (let i = 0; i < item_details.length; ++i) {
		const sameValue = searchSameValue(item_details, item_details[i].item_name)
		const half = Math.floor(sameValue / 2)
		switch (sameValue) {
		case 1:
			result.push(
				<tr style={pdfstyles.fontsize8}>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(2, 'tdLeft', item_details[i].item_name)}
					{getTdNode(1, 'tdLeft', item_details[i].unit_name)}
					{getTdNode(1, 'tdLeft', item_details[i].unit)}
					{getTdNode(1, 'tdRight', addFigure(item_details[i].unit_price))}
					{getTdNode(3, 'tdRemarks', item_details[i].remarks)}
					<td style={pdfstyles.spaceRight}></td>
				</tr>
			)
			break
		case 2:
			result.push(
				<tr style={pdfstyles.tdLeftTwoLineNoBottom}>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(2, 'tdLeftNoBottom', item_details[i].item_name)}
					{getTdNode(1, 'tdLeft', item_details[i].unit_name)}
					{getTdNode(1, 'tdLeft', item_details[i].unit)}
					{getTdNode(1, 'tdRight', addFigure(item_details[i].unit_price))}
					{getTdNode(3, 'tdRemarks', item_details[i].remarks)}
					<td style={pdfstyles.spaceRight}></td>
				</tr>
			)
			result.push(
				<tr style={pdfstyles.fontsize8}>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(2, 'tdLeftNoTop')}
					{getTdNode(1, 'tdLeft', item_details[i + 1].unit_name)}
					{getTdNode(1, 'tdLeft', item_details[i + 1].unit)}
					{getTdNode(1, 'tdRight', addFigure(item_details[i + 1].unit_price))}
					{getTdNode(3, 'tdRemarks', item_details[i + 1].remarks)}
					<td style={pdfstyles.spaceRight}></td>
				</tr>
			)
			break
		//３つ以上
		default:
			//３つ以上で奇数
			if (sameValue > 2 && sameValue % 2 === 1) {			
				for (let j = 0; j < sameValue; ++j) {
					switch (j) {
					case 0:
						result.push(
							<tr style={pdfstyles.fontsize8}>
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoBottom', '')}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit_name)}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit)}
								{getTdNode(1, 'tdRight', addFigure(item_details[i+j].unit_price))}
								{getTdNode(3, 'tdRemarks', item_details[i + j].remarks)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break
					case half:
						result.push(
							<tr style={pdfstyles.fontsize8}>
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoTopBottom', item_details[i + j].item_name)}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit_name)}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit)}
								{getTdNode(1, 'tdRight', addFigure(item_details[i+j].unit_price))}
								{getTdNode(3, 'tdRemarks', item_details[i + j].remarks)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break
					case sameValue - 1:
						result.push(
							<tr style={pdfstyles.fontsize8}>
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoTop', '')}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit_name)}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit)}
								{getTdNode(1, 'tdRight', addFigure(item_details[i+j].unit_price))}
								{getTdNode(3, 'tdRemarks', item_details[i + j].remarks)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break
					default:
						result.push(
							<tr style={pdfstyles.fontsize8}>
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoTopBottom', '')}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit_name)}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit)}
								{getTdNode(1, 'tdRight', addFigure(item_details[i+j].unit_price))}
								{getTdNode(3, 'tdRemarks', item_details[i + j].remarks)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break
					}
				}
			//
			} else {
				//３つ以上偶数
				for (let j = 0; j < sameValue; ++j) {
					switch (j) {
					case 0:
						result.push(
							<tr style={pdfstyles.fontsize8}>
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoBottom')}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit_name)}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit)}
								{getTdNode(1, 'tdRight', addFigure(item_details[i+j].unit_price))}
								{getTdNode(3, 'tdRemarks', item_details[i + j].remarks)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break
					case half:
						result.push(
							<tr style={pdfstyles.fontsize8}>
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftTwoLineNoTopBottom', item_details[i + j].item_name)}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit_name)}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit)}
								{getTdNode(1, 'tdRight', addFigure(item_details[i+j].unit_price))}
								{getTdNode(3, 'tdRemarks', item_details[i + j].remarks)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break
					case sameValue - 1:
						result.push(
							<tr style={pdfstyles.fontsize8}>
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoTop')}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit_name)}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit)}
								{getTdNode(1, 'tdRight', addFigure(item_details[i+j].unit_price))}
								{getTdNode(3, 'tdRemarks', item_details[i + j].remarks)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break
					default:
						result.push(
							<tr style={pdfstyles.fontsize8}>
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoTopBottom')}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit_name)}
								{getTdNode(1, 'tdLeft', item_details[i + j].unit)}
								{getTdNode(1, 'tdRight', addFigure(item_details[i+j].unit_price))}
								{getTdNode(3, 'tdRemarks', item_details[i + j].remarks)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break
					}
				}
			}
			break
		}		
		i += (sameValue - 1)
	}
	return result
	
}

const getRemarks = () => {
	let result = []
	
	entry.remarks.map((remarks, idx) => {
		
		if (idx === 0) {
			result.push(
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(8,'tableTdLeft','備考')}
					<td style={pdfstyles.spaceRight}></td>
				</tr>
			)	
		}

		result.push(
			<tr key={idx}>
				<td style={pdfstyles.spaceLeft}></td>
				{getTdNode(8,'tdLeft',remarks.content)}
				<td style={pdfstyles.spaceRight}></td>
			</tr>
		)	
	})	
	return result
}
 
const quotationTitlePage = (_pageNumber,_basicCondition) => {
	let quotation_title = (
		<div className="_page" id={'_page-' + _pageNumber} style={pdfstyles._page}>
			<table cols="10" style={pdfstyles.widths}>
				

				{/*タイトル*/}					
				<tr>
					<td colspan="10" style={pdfstyles.borderTop}>
						<span style={pdfstyles.title}>御見積書</span>
					</td>
				</tr>
				
				{/*見積書情報*/}
				<tr>
					<td style={pdfstyles.spaceLeft}></td>

					<td colspan="8" style={pdfstyles.borderRight}>
						<div>見積書コード : {entry.quotation.quotation_code}-{entry.quotation.quotation_code_sub}</div>
						<div>見積月: {entry.quotation.quotation_date}</div>
						<br />
					</td>

					<td style={pdfstyles.spaceRight}></td>
				</tr>

				{/*請求先名 請求元*/}
				{ 
					getBilltoAndBillfrom() 
				}
				

				{/*御見積申し上げます*/}
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="6">
						<br />
						<div style={pdfstyles.fontsize10}>御社、物流業務を下記の通りに御見積り申し上げます。</div>
						<br />
					</td>

					<td colspan="3"style={pdfstyles.spaceRight}></td>
				</tr>

				{/*基本条件(ヘッダ)*/}
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="8" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize8}>基本条件</span>
					</td>
					<td style={pdfstyles.spaceRight}></td>
				</tr>

				{/*基本条件(セル)*/}										
				{_basicCondition &&
					getBasicCondition(_basicCondition) 
				}
			
				<tr><td colspan="10"></td></tr>
			</table>
		</div>		
	)

	const tables = [quotation_title]
	let res = {
		html: tables,
		size: tables.length
	}
	return res
}

const addBasicPage = (_pageNumber,_totalPage, _basicCondition) => {
	const header = entry.billto.billto_name + '(' + _pageNumber + '/'+ _totalPage +  ')'
	const quotation_add_basic = (
		<div className="_page" id={'_page-' + _pageNumber} style={pdfstyles._page}>
			<table cols="10" style={pdfstyles.widths}>
				<tr>
					{getTdNode('10','header_title',header,'fontsize6')}
				</tr>
				{/*基本条件(ヘッダ)*/}
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="8" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize8}>基本条件</span>
					</td>
					<td style={pdfstyles.spaceRight}></td>
				</tr>

				{/*基本条件(セル)*/}										
				{_basicCondition &&
					getBasicCondition(_basicCondition) 
				}
			</table>
		</div>
	)

	const tables = [quotation_add_basic]
	let res = {
		html: tables,
		size: tables.length
	}
	return res
}

const quotationItemPage = (_pageNumber,_totalPage,_itemDetails,) => {
	const header = entry.billto.billto_name + '(' + _pageNumber + '/'+ _totalPage +  ')'
	const quotation_details = (
		<div className="_page" id={'_page-' + _pageNumber} style={pdfstyles._page}>
			<table cols="10" style={pdfstyles.widths}>
				<tr>
					{getTdNode('10','header_title',header,'fontsize6')}
				</tr>
				{/*テーブルヘッダ*/}
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="8" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>見積明細</span>
					</td>
					<td style={pdfstyles.spaceRight}></td>
				</tr>
				
				{/*項目一覧*/}
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="2" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>項目</span>
					</td>

					<td colspan="2" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>単位</span>
					</td>
					
					<td colspan="1" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>単価</span>
					</td>

					<td colspan="3" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize6}>備考</span>
					</td>
					
					<td style={pdfstyles.spaceRight}></td>
				</tr>
				
				{/*項目*/}
				{
					getItemDetails(_itemDetails)
				}
				<tr>
					<td colspan='10'>
						
					</td>
				</tr>
			</table>
		</div>
	)

	const tables = [quotation_details]
	let res = {
		html: tables,
		size: tables.length
	}
	return res
}

const quotationRemarksPage = (_pageNumber) => {
	const header = entry.billto.billto_name + '(' + _pageNumber + '/'+ _pageNumber +  ')'
	const quotation_details = (
		<div className="_page" id={'_page-' + _pageNumber} style={pdfstyles._page}>
			<table cols="10" style={pdfstyles.widths}>
				<tr>
					{getTdNode('10','header_title',header,'fontsize6')}
				</tr>
				{/*備考*/}
				{ entry.remarks && 
					getRemarks()
				}				
			</table>
		</div>
	)

	const tables = [quotation_details]
	let res = {
		html: tables,
		size: tables.length
	}
	return res
}

//文字数が多すぎてMAXの行数を使ってもページ内に収まらない場合は収まるように切り取る
const checkBasicLimit = (_basicCondition, _lmax) => {
	if (_basicCondition.title.length > _lmax * 15) {
		_basicCondition.title = _basicCondition.title.slice(0,_lmax*15)
	}
	_basicCondition.condition.map((_condition) => {
		if(_condition.content.length > _lmax * 30){
			_condition.content = _condition.content.slice(0,_lmax*30)
		}
	})
	return(_basicCondition)
}

const getBasicLine = (_basicCondition) => {
	let conditionLength = 0
	if (_basicCondition.condition) {
		_basicCondition.condition.map((_condition) => {
			const content = _condition.content ? String(_condition.content) : null
			conditionLength += content ? Math.ceil(content.length / 102) : 1
			
		})
	}

	const title = _basicCondition.title ? String(_basicCondition.title) : null
	const titleLength = title ? Math.ceil(_basicCondition.title.length / 21) : 1
	return (titleLength > conditionLength ? titleLength: conditionLength)
}

const getBasicLimit = (_array, _startIndex, _lmax,) => {
	
	let length = 0
	let lastIndex = _startIndex + _lmax
	let result 
	for (let i = _startIndex; i < lastIndex; ++i){
		if (_array.length <= i) {
			result = i 
			break
		} else {
			_array[i] = checkBasicLimit(_array[i], _lmax)
			const resultLength = getBasicLine(_array[i])
			length += resultLength
			if (length > _lmax) {
				result = i
				break
			}
		}
	}

	if (!result) result = lastIndex
	return  result
}

const checkItemLimit = (_itemDetails,_lmax) =>{
	if (_itemDetails.item_name.length > _lmax * 21) {
		_itemDetails.item_name = _itemDetails.item_name.slice(0,_lmax*21)
	}
	if (_itemDetails.item_name.length > _lmax * 21) {
		_itemDetails.item_name = _itemDetails.item_name.slice(0,_lmax * 21)
	}
	if (_itemDetails.item_name.length > _lmax * 8) {
		_itemDetails.item_name = _itemDetails.item_name.slice(0,_lmax * 8)
	}
	if (_itemDetails.item_name.length > _lmax * 12) {
		_itemDetails.item_name = _itemDetails.item_name.slice(0,_lmax * 12)
	}
	if (_itemDetails.item_name.length > _lmax * 34) {
		_itemDetails.item_name = _itemDetails.item_name.slice(0,_lmax * 34)
	}

	return(_itemDetails)
}

//データ内で必要な行数チェック
const getItemLine = (_itemDetails) => {
	
	let length = []
	length[0] = _itemDetails.item_name ? Math.ceil(_itemDetails.item_name.length / 15) : 1
	length[1] = _itemDetails.unit_name ? Math.ceil(_itemDetails.unit_name.length / 15) : 1
	length[2] = _itemDetails.unit  ? Math.ceil(_itemDetails.unit.length / 8) : 1
	length[3] = _itemDetails.unit_price ? Math.ceil(_itemDetails.unit_price.length / 12) : 1
	length[4] = _itemDetails.remarks ? Math.ceil(_itemDetails.remarks.length / 34) : 1

	//最大値を返す
	let result = Math.max.apply(null, length)
	return result
}

//データをひとつずつ見て、１ページ内に収まりきるところを調べる
const getRecordLimit = (_array, _startIndex, _lmax) => {

	let length = 0
	let result = 0
	let lastIndex = _startIndex + _lmax
	for (let i = _startIndex; i < lastIndex; ++i){
		if (_array.length <= i) {
			//添字が配列の数と同じ、もしくは上回ったら終了
			result = i
			break
		} else {
			_array[i] = checkItemLimit(_array[i],_lmax)
			const resultLength = getItemLine(_array[i],_lmax)
			length += resultLength
			if (length > _lmax) {
				result = i
				break
			}
		}
	}
	if (!result) result = lastIndex
	return  result
}

const sortArray = (_array) => {
	//明細の並び替え
	let item_nameList = _array.map((item_details) => {
		return item_details.item_name
	}).filter((x, i, self) => {
		return self.indexOf(x) === i
	})
	let result = []
	item_nameList.map((item_nameList) => {
		const item_details_ofName = _array.filter((_itemDetails) => {
			return _itemDetails.item_name === item_nameList
		})
		result = result.concat(item_details_ofName)
	})
	return result
}

let pageData = {
	pageList: {
		page:[]
	}
}

const element = () => {

	//1ページ目の基本条件行数制限
	const titleBasicMax = 30
	//１ページ内に表示できる明細の行数
	const pageItemMax = 45
	//明細の並び替え、同じ項目同士で固める
	const sortItem = entry.item_details ? sortArray(entry.item_details) : ''
	let quotation = []
	//最初のページ用の基本条件
	let pageNumber = 1

	if (entry.basic_condition) {
		//タイトル用基本条件切り取り
		const titleBasicIndex = getBasicLimit(entry.basic_condition, 0, titleBasicMax, 1)
		const title_basic = titleBasicIndex ? entry.basic_condition.slice(0, titleBasicIndex) : ''
		quotation.push(quotationTitlePage(1, title_basic))
		pageNumber++

		const addBasicMax = 45
		let addBasicStart = pageNumber //2
		let addBasicLast
		let addBasicDataList = [] //追加ページ用基本条件
		//まだ基本条件を全て表示しきれてないならページ追加して表示する
		if (titleBasicIndex < entry.basic_condition.length) {
			let startIndex = titleBasicIndex
			for (; ; pageNumber++) {
				const endIndex = getBasicLimit(entry.basic_condition, startIndex, addBasicMax)
				addBasicDataList[pageNumber] = entry.basic_condition.slice(startIndex, endIndex)
				if (endIndex >= entry.basic_condition.length) {
					addBasicLast = pageNumber
					pageNumber++
					break
				}
				startIndex = endIndex
			}//for
		}//if

		let itemPageStart = pageNumber
		let itemPageLast
		let itemList = []
		let startIndex = 0 //item用
		for (; ; pageNumber++) {
			const endIndex = getRecordLimit(sortItem, startIndex, pageItemMax)
			itemList[pageNumber] = sortItem.slice(startIndex, endIndex)
			if (endIndex >= sortItem.length) {
				itemPageLast = pageNumber
				pageNumber++
				break
			}
			startIndex = endIndex
		}
		
		if (entry.remarks) {
			quotation.push(quotationRemarksPage(pageNumber))
			pageNumber++
		}

		if (addBasicStart === addBasicLast) {
			//１枚で済む
			quotation.push(addBasicPage(addBasicStart, pageNumber-1, addBasicDataList[addBasicStart]))
		} else {
			for (let i = addBasicStart; i < (addBasicLast + 1); ++i) {
				quotation.push(addBasicPage(i, pageNumber - 1, addBasicDataList[i]))
			}
		}
		if (itemPageStart === itemPageLast) {
			//１枚で済む
			quotation.push(quotationItemPage(itemPageStart, pageNumber-1, itemList[itemPageStart]))
		} else {
			for (let i = itemPageStart; i < itemPageLast + 1; ++i) {
				quotation.push(quotationItemPage(i, pageNumber-1, itemList[i]))
			}
		}
	} else {
		quotation.push(quotationTitlePage(1))
		pageNumber++
		if (entry.item_details) {
			let itemPageStart = pageNumber
			let itemPageLast
			let itemList = []
			let startIndex = 0 //item用
			for (; ; pageNumber++) {
				const endIndex = getRecordLimit(sortItem, startIndex, pageItemMax)
				itemList[pageNumber] = sortItem.slice(startIndex, endIndex)
				if (endIndex >= sortItem.length) {
					itemPageLast = pageNumber
					pageNumber++
					break
				}
				startIndex = endIndex
			}
			if (entry.remarks) {
				quotation.push(quotationRemarksPage(pageNumber))
				pageNumber++
			}
			if (itemPageStart === itemPageLast) {
				//１枚で済む
				quotation.push(quotationItemPage(itemPageStart, pageNumber - 1, itemList[itemPageStart]))
			} else {
				for (let i = itemPageStart; i < itemPageLast + 1; ++i) {
					quotation.push(quotationItemPage(i, pageNumber - 1, itemList[i]))
				}
			}
		}
	}

	let quotation_size = 0
	quotation.map((_quotation) => {
		quotation_size = (Number(quotation_size) + Number(_quotation.size))
	})
	const total_size = quotation_size
	for (let i = 0, ii = total_size; i < ii; ++i) {
		pageData.pageList.page.push({word: ''})
	}
	return (
		<html>
			<body>
				{quotation.map((_quotation) => {
					return (_quotation.html)
				})
				}
			</body>
		</html>
	)	
}

let html = ReactDOMServer.renderToStaticMarkup(element())

const file_name = () => {
	const preview = vtecxapi.getQueryString('preview')
	if (preview === '') {
		return 'preview-' + quotation_code + '-' + quotation_code_sub + '.pdf'
	} else {
		return 'quotation-' + quotation_code + '-' + quotation_code_sub + '.pdf'
	}
}

// PDF出力
vtecxapi.toPdf(pageData, html, file_name())