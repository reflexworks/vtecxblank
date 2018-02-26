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

export const PackingItems = (_start_page, _quotationData) => {
	const page = '_page-' + _start_page
	const tables = (
		<div className="_page" id={page} style={pdfstyles._page}>
		
			<table cols="17" style={pdfstyles.widths}>

				{/*タイトル*/}					
				<tr>
					<td ></td>

					<td colspan="15" ></td>

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
