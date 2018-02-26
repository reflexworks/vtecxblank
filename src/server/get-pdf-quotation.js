import vtecxapi from 'vtecxapi' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/quotationstyles.js'


const quotation_code = vtecxapi.getQueryString('quotation_code')
const quotation_code_sub = vtecxapi.getQueryString('quotation_code_sub')
let result = vtecxapi.getFeed('/quotation?f&quotation.quotation_code=' + quotation_code + '&quotation.quotation_code_sub=' + quotation_code_sub)

let entry = result.feed.entry[0]

const getBasicCondition = () => {
	return(
		entry.basic_condition.map((basic_condition) => {
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
						} else if (length > 2 && !(length % 2)) {
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
						} else if (length === 2) {
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
			}
		})
	)

}


const getItemDetails = () => {

	let item_nameList = entry.item_details.map((item_details) => {
		return item_details.item_name
	}).filter((x, i, self) => {
		return self.indexOf(x) === i
	})
	
	let sortItem_details = []
	item_nameList.map((item_nameList) => {
		entry.item_details.map((item_details) => {
			if (item_nameList === item_details.item_name) {
				if (!sortItem_details[item_nameList]) {
					sortItem_details[item_nameList] = []
				}
				return sortItem_details[item_nameList].push(item_details)
			}
		})
	})
	
	return (
		item_nameList.map((item_nameList) => {
			let length = sortItem_details[item_nameList].length
			let half = Math.floor(length / 2)
			return (	
				sortItem_details[item_nameList].map((item_details, idx) => {
					if (length > 2 && (length % 2)) {
						switch (idx) {
						case 0:
							return (						
								<tr key={idx} style={pdfstyles.fontsize8}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="2" style={pdfstyles.tdLeftNoBottom}>
										<span></span>
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
						case half:
							return (
								<tr key={idx} style={pdfstyles.fontsize8}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="2" style={pdfstyles.tdLeftNoTopBottom}>
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
						case length - 1:
							return (
								<tr key={idx} style={pdfstyles.fontsize8}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="2" style={pdfstyles.tdLeftNoTop}>
										<span></span>
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
						default:
							return (
								<tr key={idx} style={pdfstyles.fontsize8}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="2" style={pdfstyles.tdLeftNoTopBottom}>
										<span></span>
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
						}
					} else if (length > 2 && !(length % 2)) {
						switch (idx) {
						case 0:
							return (
								<tr key={idx} style={pdfstyles.fontsize8}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="2" style={pdfstyles.tdLeftNoBottom}>
										<span></span>
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
						case half:
							return (
								<tr key={idx} style={pdfstyles.fontsize8}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="2" style={pdfstyles.tdLeftTwoLineNoTopBottom}>
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
						case length - 1:
							return (
								<tr key={idx} style={pdfstyles.fontsize8}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="2" style={pdfstyles.tdLeftNoTop}>
										<span></span>
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
						default:
							return (
								<tr key={idx} style={pdfstyles.fontsize8}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="2" style={pdfstyles.tdLeftNoTopBottom}>
										<span></span>
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
						}
					} else if (length === 2) {
						switch (idx) {
						case 0:
							return(	
								<tr key={idx} style={pdfstyles.tdLeftTwoLineNoBottom}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="2" style={pdfstyles.tdLeftNoBottom}>
										<span style={pdfstyles.fontsize8}>{item_details.item_name}</span>
										<br />
									</td>

									<td colspan="1" style={pdfstyles.tdLeft}>
										<span style={pdfstyles.fontsize8}>{item_details.unit_name}</span>
										<br />
									</td>

									<td colspan="1" style={pdfstyles.tdLeft}>
										<span style={pdfstyles.fontsize8}>{item_details.unit}</span>
										<br />
									</td>

									<td colspan="1" style={pdfstyles.tdRight}>
										<span style={pdfstyles.fontsize8}>{item_details.unit_price}</span>
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
						case length - 1:
							return (
								<tr key={idx} style={pdfstyles.fontsize8}>
									<td style={pdfstyles.spaceLeft}>
									</td>

									<td colspan="2" style={pdfstyles.tdLeftNoTop}>
										<span></span>
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
						}
					} else {
						return (
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
					}
				})
			)
		})


		

	)
}

const getRemarks = () => {
	return (
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
	)
}



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
					
					{/*見積書情報*/}
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>

						<td colspan="8" style={pdfstyles.borderRight}>
							<div>見積書コード : {entry.quotation.quotation_code}-{entry.quotation.quotation_code_sub}</div>
							<div>見積月: {entry.quotation.quotation_date}</div>
							<br />
						</td>

						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					
					{/*請求先名 請求元*/}
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>

						<td colspan="3" style={pdfstyles.fontsize12UL}>
							<div>{entry.billto.billto_name}御中</div>
						</td>

						<td colspan="2" style={pdfstyles.fontsize12UL}>
						</td>

						<td colspan="3" style={pdfstyles.fontsize10R}>
							<div style={pdfstyles.fontsize12}>{entry.billfrom.billfrom_name}</div>
                
							<div>
								<span>〒</span>
								<span>{entry.contact_information.zip_code}</span>
								<br />
								<span>{entry.contact_information.prefecture}{entry.contact_information.address1}{entry.contact_information.address2}</span>
							</div>
							<div>
								<span>TEL : </span>
								<span>{entry.contact_information.tel}</span>
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
					{entry.basic_condition &&
						getBasicCondition() 
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

					{/*テーブルヘッダ*/}
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
					
					{/*項目*/}
					{entry.item_details &&
						getItemDetails()
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
					{entry.remarks &&
						getRemarks()
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
			{ 'word': '' },
			//{'word' : ''},
		]
    }
}, html, 'Quotation.pdf')