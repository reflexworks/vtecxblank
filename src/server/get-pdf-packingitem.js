//import vtecxapi from 'vtecxapi' 
import React from 'react'
//import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/packingitemstyles.js'

const getPackingItems = (entry) =>{
	return (
		entry.packing_items.map((packing_items,idx) => {
			return (
				<tr key={idx} style={pdfstyles.fontsize6}>
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
		})
	)
	
}

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

export const PackingItems = (_start_page, _quotationData) => {
	const page = '_page-' + _start_page
	const tables = (
		<div className="_page" id={page} style={pdfstyles._page}>
		
			{pageTitle('梱包資材')}
			{header(_quotationData)}

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

				{_quotationData.packing_items &&
					getPackingItems(_quotationData)
				
				}

			
			</table>

		</div>
	)
	let res = {
		html: tables,
		size: 1
	}
	return res
}