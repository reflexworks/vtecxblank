import vtecxapi from 'vtecxapi' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/quotationstyles.js'
import {
	getStamp,
	addFigure,
} from './common'

const quotation_code = vtecxapi.getQueryString('quotation_code')
const quotation_code_sub = vtecxapi.getQueryString('quotation_code_sub')
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
	let result = []
	result.push(
		<tr>
			<td style={pdfstyles.spaceLeft}></td>
			{getTdNode(8,'tableTd','基本条件')}
			<td style={pdfstyles.spaceRight}></td>
		</tr>
	)
	_basicCondition.map((basic_condition) => {
		if (basic_condition&&basic_condition.condition) {
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
						result.push(
							<tr key={idx}>
								<td style={pdfstyles.spaceLeft}></td>				
								{getTdNode(2, 'tdLeftNoBottom','')}
								{getTdNode(6, 'tdLeft',condition.content)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break
					case half:
						result.push(	
							<tr key={idx} >
								<td style={pdfstyles.spaceLeft}></td>				
								{getTdNode(2, 'tdLeftNoTopBottom',basic_condition.title)}
								{getTdNode(6, 'tdLeft',condition.content)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break	
					case length - 1:
						result.push(			
							<tr key={idx} >
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoTop','')}
								{getTdNode(6, 'tdLeft',condition.content)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break	
					default:
						result.push(			
							<tr key={idx} >
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoTopBottom','')}
								{getTdNode(6, 'tdLeft',condition.content)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break	
					}
				} else if (length > 2 && !(length % 2)) {
					switch (idx) {
					case 0:
						result.push(
							<tr key={idx} >
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoBottom', '')}
								{getTdNode(6, 'tdLeft', condition.content)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break
					case half:
						result.push(
							<tr key={idx} >
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftTwoLineNoTopBottom',basic_condition.title)}
								{getTdNode(6, 'tdLeft',condition.content)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break	
					case length - 1:
						result.push(		
							<tr key={idx} >
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoTop','')}
								{getTdNode(6, 'tdLeft',condition.content)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break	
					default:
						result.push(			
							<tr key={idx} >
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoTopBottom','')}
								{getTdNode(6, 'tdLeft',condition.content)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break	
					}
				} else if (length === 2) {
					switch (idx) {
					case 0:
						result.push(
							<tr key={idx} >
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftTwoLineNoBottom',basic_condition.title)}
								{getTdNode(6, 'tdLeft',condition.content)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break							
					case length - 1:
						result.push(
													
							<tr key={idx} >
								<td style={pdfstyles.spaceLeft}></td>
								{getTdNode(2, 'tdLeftNoTop','')}
								{getTdNode(6, 'tdLeft',condition.content)}
								<td style={pdfstyles.spaceRight}></td>
							</tr>
						)
						break	
					}
				} else {
					result.push(
						<tr key={idx} >
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(2, 'tdLeft',basic_condition.title)}
							{getTdNode(6, 'tdLeft',condition.content)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				}
									
			})
		}
	})

	return result


	
}

const searchSameValue = (item_details,searchName) => {
	const count = item_details.filter((item_details) => {
		return(item_details.item_name === searchName)
	})
	return count.length
}

const getItemDetails = (item_details) => {

	let result = []
	result.push(
		<tr>
			<td style={pdfstyles.spaceLeft}></td>
			{getTdNode('8', 'tableTd', '見積明細', 'fontsize6')}
			<td style={pdfstyles.spaceRight}></td>
		</tr>
	)
	result.push(	
		<tr>
			<td style={pdfstyles.spaceLeft}></td>
			{getTdNode('2', 'tableTd', '項目', 'fontsize6')}
			{getTdNode('2', 'tableTd', '単位', 'fontsize6')}
			{getTdNode('1', 'tableTd', '単価', 'fontsize6')}
			{getTdNode('3', 'tableTd', '備考', 'fontsize6')}
			<td style={pdfstyles.spaceRight}></td>
		</tr>
	)
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

const quotationTitlePage = (_data) => {
	const basic = _data&&_data.basic_condition ? _data.basic_condition : ''
	const item = _data&&_data.item ? _data.item : ''
	const remarks = _data&&_data.remarks ? _data.remarks : ''
	let quotation_title = (
		<div className="_page" id={'_page-' + '1'} style={pdfstyles._page}>
			<table cols="10" style={pdfstyles.widths}>
				
				<tr>
					<td colspan="10" style={pdfstyles.borderTop}>
						<span style={pdfstyles.title}>御見積書</span>
					</td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}></td>

					<td colspan="8" style={pdfstyles.borderRight}>
						<div>見積書コード : {entry.quotation.quotation_code}-{entry.quotation.quotation_code_sub}</div>
						<div>見積月: {entry.quotation.quotation_date}</div>
						<br />
					</td>

					<td style={pdfstyles.spaceRight}></td>
				</tr>

				{ 
					getBilltoAndBillfrom() 
				}
				
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="6">
						<div style={pdfstyles.fontsize10}>御社、物流業務を下記の通りに御見積り申し上げます。</div>
						<br />
					</td>
					<td colspan="3"style={pdfstyles.spaceRight}></td>
				</tr>
		
				{ basic &&
					getBasicCondition(basic) 
				}
				{ basic && 
					<tr>
						<td colspan="10">
							<br />
						</td>	
					</tr>	
				}

				{ item &&
					getItemDetails(item)
				}

				{ item &&
					<tr>
						<td colspan="10">
							<br/>
						</td>
					</tr>	
				}

				{ remarks && 
					getRemarks(remarks)
				}
			
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

const addPage = (_data, _pageNumber, _totalPage) => {
	const basic = _data.basic_condition ? _data.basic_condition : ''
	const item = _data.item ? _data.item : ''
	const remarks = _data.remarks ? _data.remarks : ''
	const header = entry.billto.billto_name + '(' + _pageNumber + '/'+ _totalPage +  ')'
	const quotation_add = (
		<div className="_page" id={'_page-' + _pageNumber} style={pdfstyles._page}>
			<table cols="10" style={pdfstyles.widths}>
				<tr>
					{getTdNode('10','header_title',header,'fontsize6')}
				</tr>

				{ basic &&
					getBasicCondition(basic) 
				}
				{ basic &&
					<tr>
						<td colspan="10">
							<br />
						</td>	
					</tr>	
				}

				{ item &&
					getItemDetails(item)
				}

				{ item &&
					<tr>
						<td colspan="10">
							<br/>
						</td>
					</tr>	
				}

				{ remarks && 
					getRemarks(remarks)
				}
			</table>
		</div>
	)

	const tables = [quotation_add]
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

const getBasicLimit = (basic_condition) => {
	let result = []
	let startIndex = 0
	let endIndex = 0
	let length = 0
	for (let i = 0; ; i++){
		let MAX = 35
		if (i !== 0) {
			MAX = 45
		}
		for (let j = startIndex; j< MAX; ++j){
			if (basic_condition.length <= j) {
				endIndex = j
				break
			} else {
				basic_condition[j] = checkBasicLimit(basic_condition[j],MAX)
				const resultLength = getBasicLine(basic_condition[j])
				length += resultLength
				if (length > MAX) {
					endIndex = j
					break
				}
			}
			endIndex = j
		}			
		result[i] = basic_condition.slice(startIndex,endIndex)
		if (endIndex >= basic_condition.length) {
			break
		}
		startIndex = endIndex
	}
	return result

}

const checkItemLimit = (_itemDetails,_lmax) =>{
	if (_itemDetails.item_name&&(_itemDetails.item_name.length > _lmax * 21)) {
		_itemDetails.item_name = _itemDetails.item_name.slice(0,_lmax*21)
	}
	if (_itemDetails.unit_name&&(_itemDetails.unit_name.length > _lmax * 21)) {
		_itemDetails.unit_name = _itemDetails.unit_name.slice(0,_lmax * 21)
	}
	if (_itemDetails.unit&&(_itemDetails.unit.length > _lmax * 8)) {
		_itemDetails.unit = _itemDetails.unit.slice(0,_lmax * 8)
	}
	if (_itemDetails.unit_price&&(_itemDetails.unit_price.length > _lmax * 12)) {
		_itemDetails.unit_price= _itemDetails.unit_price.slice(0,_lmax * 12)
	}
	if (_itemDetails.remarks&&(_itemDetails.remarks.length > _lmax * 34)) {
		_itemDetails.remarks = _itemDetails.remarks.slice(0,_lmax * 34)
	}

	return(_itemDetails)
}

//データ内で必要な行数チェック
const getItemLine = (_itemDetails) => {
	
	let length = []
	length[0] = _itemDetails.item_name ? Math.ceil(_itemDetails.item_name.length / 15) : 1
	length[1] = _itemDetails.unit_name ? Math.ceil(_itemDetails.unit_name.length / 12) : 1
	length[2] = _itemDetails.unit  ? Math.ceil(_itemDetails.unit.length / 8) : 1
	length[3] = _itemDetails.unit_price ? Math.ceil(_itemDetails.unit_price.length / 12) : 1
	length[4] = _itemDetails.remarks ? Math.ceil(_itemDetails.remarks.length / 20) : 1

	//最大値を返す
	let result = Math.max.apply(null, length)
	return result
}

const getItemLimit = (_item,_remainderLine) => {
	let result = []
	let startIndex = 0
	let endIndex = 0
	let length = 0

	for (let i = 0; ; i++){
		let MAX = 55
		if (i === 0) {
			MAX = _remainderLine
		}
		for (let j = startIndex; j < MAX; ++j){
			if (_item.length <= j) {
				//添字が配列の数と同じ、もしくは上回ったら終了
				endIndex= j
				break
			} else {
				_item[j] = checkItemLimit(_item[j],MAX)
				const resultLength = getItemLine(_item[j],MAX)
				length += resultLength
				if (length > MAX) {
					endIndex = j
					break
				}
			}
			endIndex = j
		}

		let slice = _item.slice(startIndex, endIndex)
		result.push(slice)
		if (endIndex >= _item.length) {
			break
		}
		startIndex = endIndex
	}
	return result
}

const checkRemarksLimit = (_remarks, _lmax) => {
	if (_remarks.content.length > _lmax * 30) {
		_remarks.content = _remarks.content.slice(0,_lmax*30)
	}
	return _remarks
}

//データ内で必要な行数チェック
const getRemarksLine = (_remarks) => {
	const result = Math.ceil(_remarks.content.length /50)
	return result
}

const getRemarksLimit = (_remarks,_remainderLine) => {
	let result = []
	let startIndex = 0
	let endIndex = 0
	let length = 0
	for (let i = 0; ; i++){
		let MAX = 45
		if (i === 0) {
			MAX = _remainderLine
		}
		for (let j = startIndex; j < MAX; j++){
			if (_remarks.length <= j) {
				//添字が配列の数と同じ、もしくは上回ったら終了
				endIndex = j
				break
			} else {
				_remarks[j] = checkRemarksLimit(_remarks[j],MAX)
				const resultLength = getRemarksLine(_remarks[j], MAX)
				length += resultLength
				if (length > MAX) {
					endIndex = j
					break
				}
			}
			endIndex = j
		}
		endIndex++
		let slice = _remarks.slice(startIndex, endIndex)
		result.push(slice)
		if (endIndex >= _remarks.length) {
			break
		}
		startIndex = endIndex
	}
	return result

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

	//明細の並び替え、同じ項目同士で固める
	const sortItem = entry.item_details ? sortArray(entry.item_details) : ''
	let quotation = []
	let dataList = []
	let page = -1

	if (entry&&entry.basic_condition) {
		const basic_array = getBasicLimit(entry.basic_condition)
		//basic_arrayの数だけ行う
		if (basic_array.length) {
			basic_array.map((_basic) => {
				page++
				if (!dataList[page]) {
					dataList[page] = {
						basic_condition: null
					}
				}
				dataList[page].basic_condition = _basic
			})
		}
	}

	if (page < 0) {
		page++
	}

	if (sortItem) {
		let item_max_size = 50
		if (page === 0) {
			item_max_size = 32
		}
		//今のページに基本条件がある？
		if (dataList[page]&&dataList[page].basic_condition) {
			let basicLength = 0
			for (let i = 0; i < dataList[page].basic_condition.length; i++) {
				const resultLength = getBasicLine(dataList[page].basic_condition[i])
				basicLength += resultLength
			}
			//基本条件の行数分、使える行数が減る
			item_max_size = item_max_size - basicLength
		}

		const item_array = getItemLimit(sortItem, item_max_size)
		//今のページを見て、ページの行数が超えそうなら次ページへ。
		if (item_array.length) {
			item_array.map((_item) => {
				if (!dataList[page]) {
					dataList[page] = {
						item: null
					}
				}

				dataList[page].item = _item
				page++
			})
		}
		page--
	}

	if (entry.remarks) {
		let remarks_max_size = 50
		if (page === 0) {
			remarks_max_size = 29
		}
		if (dataList[page]) {
			let itemLength = 0
			if (dataList[page].item) {
				for (let i = 0; i < dataList[page].item.length; i++) {
					const resultLength = getItemLine(dataList[page].item[i])
					itemLength += resultLength
				}
			}
			remarks_max_size = remarks_max_size - itemLength
		}
		const remarks_array = getRemarksLimit(entry.remarks, remarks_max_size)
		if (remarks_array.length) {
			remarks_array.map((_remarks) => {
				if (!dataList[page]) {
					dataList[page] = {
						remarks: null
					}
				}
				dataList[page].remarks = _remarks
				page++
			})
		}
		
	}
	if (dataList) {
		quotation.push(quotationTitlePage(dataList[0]))
		for (let i = 1; i < page; i++) {
			quotation.push(addPage(dataList[i], i + 1, page))
		}
	} else {
		quotation.push(quotationTitlePage())
	}	
		
	let quotation_size = 0
	quotation.map((_quotation) => {
		quotation_size = (Number(quotation_size) + Number(_quotation.size))
	})
	const total_size = quotation_size
	for (let i = 0, ii = total_size; i < ii; ++i) {
		pageData.pageList.page.push({ word: '' })
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