import vtecxapi from 'vtecxapi' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/quotationstyles.js'

const invoice = {
	number: '00002',
	date: '2017/8/31',
	customer_name: 'サンプル',
	jobtitle: '',
	src_name: 'CONNECTロジスティクス 株式会社',
	src_zip: '332-0027',
	src_address: '埼玉県川口市緑町9-35',
	src_tel: '048-299-8213',
	subtotal: '1,000,000',
	salestax: '80,000',
	total: '1,080,000',
	content: '講演日：2017/8/25'
}

invoice.item = []
const item = {
	name: '講演',
	description: 'LT',
	quantity: '1',
	unit_price: '1,000,000',
	line_total: '1,000,000'
}


invoice.item.push(item)


const url = vtecxapi.getQueryString('quotation_code')
const url2 = vtecxapi.getQueryString('quotation_code_sub')
let result = vtecxapi.getFeed('/quotation?f&quotation.quotation_code=' + url + '&quotation.quotation_code_sub=' + url2)

const entry = result.feed.entry[0]

/*
let tempArray = entry.item_details.map((item_details) => {
	return item_details.item_name
}).filter((x, i, self) => {
	return self.indexOf(x) === i
})

let sortItem_details = []

entry.item_details.map(() => {
	sortItem_details.push(
		tempArray.map((temp) => {
			return (
				entry.item_details.map((item_details) => {
					if (item_details.item_name === temp ) {
						return item_details
					}
				})
			)
		}
		)	
	)
})
*/



const element = (
	<html>
		<body>
			<div className="_page" id="_page-1" style={pdfstyles._page}>
			
				<table cols="10" style={pdfstyles.widths}>
				
					{/*タイトル*/}
					<tr>
						<td style={pdfstyles.titleLeft}>
						</td>

						<td colspan="8" style={pdfstyles.borderTop}>
							<span style={pdfstyles.title}>御見積り</span>
						</td>

						<td style={pdfstyles.titleRight}>
						</td>
					</tr>

					{/*見積元情報*/}
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>

						<td colspan="8" style={pdfstyles.borderRight}>
							<div>見積書コード : {entry.quotation.quotation_code}</div>
							<div>見積月: {entry.quotation.quotation_date}</div>
							<br />
						</td>

						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					{/*請求先名*/}
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>

						<td colspan="3" style={pdfstyles.fontsize12UL}>
							<div>株式会社{entry.billto.billto_name}御中</div>
						</td>

						<td colspan="2" style={pdfstyles.fontsize12UL}>
						</td>

						<td colspan="3" style={pdfstyles.fontsize10R}>
							<div>{invoice.src_name}</div>
                
							<div>
								<span>〒</span>
								<span>{invoice.src_zip}</span>
								<br />
								<span>{invoice.src_address}</span>
							</div>
							<div>
								<span>TEL : </span>
								<span>{invoice.src_tel}</span>
							</div>
						</td>
						
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					{/*御見積申し上げます*/}					
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colspan="6">
							<br />
							<div>御社、物流業務を下記の通りに御見積もり申し上げます。</div>
							<br />
						</td>

						<td colspan="2">
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					{/*基本条件(ヘッダ)*/}
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colspan="8" style={pdfstyles.tableTd}>
							<span>基本条件</span>
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					{/*基本条件(セル)*/}					
					{
						//basic_conditionの数だけ基本条件を表示する。
						//basic_condition.condition.contentの数だけ行を表示する。
						entry.basic_condition.map((basic_condition) => {
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
												
												<tr key={idx} style={pdfstyles.fontsize10}>
													<td style={pdfstyles.spaceLeft}>
													</td>
												
													<td colspan="2" style={pdfstyles.tdLeftNoBottom}>
														<span></span>
														<br />
													</td>
												
													<td colspan="6" style={pdfstyles.tdLeft}>
														<span style={pdfstyles.fontsize8}>{condition.content}</span>
														<br />
													</td>

													<td style={pdfstyles.spaceRight}>
													</td>
												</tr>
											)
										case half:
											return (
												
												<tr key={idx} style={pdfstyles.fontsize10}>
													<td style={pdfstyles.spaceLeft}>
													</td>
												
													<td colspan="2" style={pdfstyles.tdLeftNoTopBottom}>
														<span style={pdfstyles.fontsize8}>{basic_condition.title}</span>
														<br />
													</td>
												
													<td colspan="6" style={pdfstyles.tdLeft}>
														<span style={pdfstyles.fontsize8}>{condition.content}</span>
														<br />
													</td>

													<td style={pdfstyles.spaceRight}>
													</td>
												</tr>
											)
										case length - 1:
											return (
												
												<tr key={idx} style={pdfstyles.fontsize10}>
													<td style={pdfstyles.spaceLeft}>
													</td>
												
													<td colspan="2" style={pdfstyles.tdLeftNoTop}>
														<span></span>
														<br />
													</td>
												
													<td colspan="6" style={pdfstyles.tdLeft}>
														<span style={pdfstyles.fontsize8}>{condition.content}</span>
														<br />
													</td>

													<td style={pdfstyles.spaceRight}>
													</td>
												</tr>
											)
										default:
											return (
												
												<tr key={idx} style={pdfstyles.fontsize10}>
													<td style={pdfstyles.spaceLeft}>
													</td>
												
													<td colspan="2" style={pdfstyles.tdLeftNoTopBottom}>
														<span style={pdfstyles.fontsize8}></span>
														<br />
													</td>
												
													<td colspan="6" style={pdfstyles.tdLeft}>
														<span style={pdfstyles.fontsize8}>{condition.content}</span>
														<br />
													</td>

													<td style={pdfstyles.spaceRight}>
													</td>
												</tr>
											)
										}
									}else if (length > 2 && !(length % 2)) {
										switch (idx) {
										case 0:
											return (
												
												<tr key={idx} style={pdfstyles.fontsize10}>
													<td style={pdfstyles.spaceLeft}>
													</td>
												
													<td colspan="2" style={pdfstyles.tdLeftNoBottom}>
														<span></span>
														<br />
													</td>
												
													<td colspan="6" style={pdfstyles.tdLeft}>
														<span style={pdfstyles.fontsize8}>{condition.content}</span>
														<br />
													</td>

													<td style={pdfstyles.spaceRight}>
													</td>
												</tr>
											)
										case half:
											return (
												
												<tr key={idx} style={pdfstyles.fontsize10}>
													<td style={pdfstyles.spaceLeft}>
													</td>
												
													<td colspan="2" style={pdfstyles.tdLeftTwoLineNoTopBottom}>
														<span style={pdfstyles.fontsize8}>{basic_condition.title}</span>
														<br />
													</td>
												
													<td colspan="6" style={pdfstyles.tdLeft}>
														<span style={pdfstyles.fontsize8}>{condition.content}</span>
														<br />
													</td>

													<td style={pdfstyles.spaceRight}>
													</td>
												</tr>
											)
										case length - 1:
											return (
												
												<tr key={idx} style={pdfstyles.fontsize10}>
													<td style={pdfstyles.spaceLeft}>
													</td>
												
													<td colspan="2" style={pdfstyles.tdLeftNoTop}>
														<span></span>
														<br />
													</td>
												
													<td colspan="6" style={pdfstyles.tdLeft}>
														<span style={pdfstyles.fontsize8}>{condition.content}</span>
														<br />
													</td>

													<td style={pdfstyles.spaceRight}>
													</td>
												</tr>
											)
										default:
											return (
												
												<tr key={idx} style={pdfstyles.fontsize10}>
													<td style={pdfstyles.spaceLeft}>
													</td>
												
													<td colspan="2" style={pdfstyles.tdLeftNoTopBottom}>
														<span style={pdfstyles.fontsize8}></span>
														<br />
													</td>
												
													<td colspan="6" style={pdfstyles.tdLeft}>
														<span style={pdfstyles.fontsize8}>{condition.content}</span>
														<br />
													</td>

													<td style={pdfstyles.spaceRight}>
													</td>
												</tr>
											)
										}					
									}else if (length === 2) {
										switch (idx) {
										case 0:
											return (
												<tr key={idx} style={pdfstyles.fontsize10}>
													<td style={pdfstyles.spaceLeft}>
													</td>
												
													<td colspan="2" style={pdfstyles.tdLeftTwoLineNoBottom}>
														<span style={pdfstyles.fontsize8}>{basic_condition.title}</span>
														<br />
													</td>
												
													<td colspan="6" style={pdfstyles.tdLeft}>
														<span style={pdfstyles.fontsize8}>{condition.content}</span>
														<br />
													</td>

													
													<td style={pdfstyles.spaceRight}>
													</td>
												</tr>
											)
												
										case length - 1:
											return (
												
												<tr key={idx} style={pdfstyles.fontsize10}>
													<td style={pdfstyles.spaceLeft}>
													</td>
												
													<td colspan="2" style={pdfstyles.tdLeftNoTop}>
														<span></span>
														<br />
													</td>
												
													<td colspan="6" style={pdfstyles.tdLeft}>
														<span style={pdfstyles.fontsize8}>{condition.content}</span>
														<br />
													</td>

													<td style={pdfstyles.spaceRight}>
													</td>
												</tr>
											)
										}		
									} else {
										return (
											<tr key={idx} style={pdfstyles.fontsize10}>
												<td style={pdfstyles.spaceLeft}>
												</td>
											
												<td colspan="2" style={pdfstyles.tdLeft}>
													<span style={pdfstyles.fontsize8}>{basic_condition.title}</span>
													<br />
												</td>
											
												<td colspan="6" style={pdfstyles.tdLeft}>
													<span style={pdfstyles.fontsize8}>{condition.content}</span>
													<br />
												</td>

												<td style={pdfstyles.spaceRight}>
												</td>
											</tr>
										)
									}
								})
							)
						})	
					}
					

					<tr>
						<td colspan="10" style={pdfstyles.borderBottom}>
						</td>
					</tr>
					
				</table>
			</div>
					
			<div className="_page" id="_page-2" style={pdfstyles._page}>
				<table cols="10" style={pdfstyles.widths}>
					
					{/*上部*/}
					<tr>
						<td style={pdfstyles.titleLeft}>
						</td>

						<td colspan="8" style={pdfstyles.borderTopTwo}>
						</td>

						<td style={pdfstyles.titleRight}>
						</td>
					</tr>

					{/*ヘッダ*/}
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colspan="8" style={pdfstyles.tableTd}>
							<span>見積り明細</span>
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>
					
					{/*項目一覧*/}
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colspan="2" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize10}>項目</span>
						</td>

						<td colspan="2" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize10}>単位</span>
						</td>
						
						<td colspan="1" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize10}>単価</span>
						</td>

						<td colspan="3" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize10}>備考</span>
						</td>
						
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					{entry.item_details.map((item_details,idx) => {
						return(
							<tr key={idx} style={pdfstyles.fontsize8}>
								<td style={pdfstyles.spaceLeft}>
								</td>

								<td colspan="2" style={pdfstyles.tdLeft}>
									<span>{item_details.item_name}</span>
									<br />
								</td>

								<td colspan="1" style={pdfstyles.tdLeft}>
									<span>{item_details.unit_name}</span>
									<br />
								</td>

								<td colspan="1" style={pdfstyles.tdLeft}>
									<span>{item_details.unit}</span>
									<br />
								</td>

								<td colspan="1" style={pdfstyles.tdRight}>
									<span>{item_details.unit_price}</span>
									<br />
								</td>

								<td colspan="3" style={pdfstyles.tdRemarks}>
									<span style={pdfstyles.fontsize8}>{item_details.remarks}</span>
									<br />
								</td>
									
								<td style={pdfstyles.spaceRight}>
								</td>
							</tr>
						)	
					})
						
					}
										
					{/*備考*/}
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>

						<td colspan="8" style={pdfstyles.fontsize12}>
							<br/>
							<div>備考</div>
						</td>
						
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>
					{
						entry.remarks.map((remarks,idx) => {
							
							return(
								<tr key={idx}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="8" style={pdfstyles.fontsize8UL}>
										<div>{remarks.content}</div>
									</td>
									
									<td style={pdfstyles.spaceRight}>
									</td>
								</tr>
							)	
						})
					}
					

					<tr>
						<td colspan="10" style={pdfstyles.borderBottom}>
						</td>
					</tr>
				</table>
			</div>
		</body>
	</html>

)

let html = ReactDOMServer.renderToStaticMarkup(element)

// HTML出力
//vtecxapi.doResponseHtml(html)

// PDF出力
vtecxapi.toPdf({'pageList' :
    {'page' :
		[
			{'word': ''},
        	{'word' : ''}
		]
    }
}, html, 'test.pdf')


