import vtecxapi from 'vtecxapi' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/quotationstyles.js'

export const pageTitle = (_title) => {
	return (
		<table cols="1" style={pdfstyles.page_title_table}>
			<tr>
				<td style={pdfstyles.page_title_blank}><div></div></td>
			</tr>
			<tr>
				<td style={pdfstyles.page_title}>{_title} 御見積</td>
			</tr>
			<tr>
				<td style={pdfstyles.page_title_blank}><div></div></td>				
			</tr>
		</table>
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
	let stamp = ''
	
	if (entry.billfrom.billfrom_name.match('コネクトロジスティクス')) {
		stamp = '/img/connectlogi.png'
	} else if (entry.billfrom.billfrom_name.match('コネクトコーポレーション')) {
		stamp = '/img/connectcorp.png'
	} else if (entry.billfrom.billfrom_name.match('CONNECT・EC')) {
		stamp = '/img/connectec.png'
	} else if (entry.billfrom.billfrom_name.match('ネクストジェネレーション')) {
		stamp = '/img/nextgen.png'
	} else if (entry.billfrom.billfrom_name.match('コネクトエクスプレス')) {
		stamp = '/img/express.png'		
	}

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
						{ entry.creator && <span>担当者:{entry.creator}</span> }
								
					</div>	
					<br/>
				</div>
			</td>
					
			<td style={pdfstyles.spaceRight}>
			</td>
		</tr>
		
	)
}

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
													
									<tr key={idx}>
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
													
									<tr key={idx} >
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
													
									<tr key={idx} >
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
													
									<tr key={idx} >
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
									<tr key={idx} >
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
													
									<tr key={idx} >
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
													
									<tr key={idx} >
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
													
									<tr key={idx} >
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
									<tr key={idx} >
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
													
									<tr key={idx} >
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
								<tr key={idx} >
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

const quotationPage = () => {
	const quotation_1 = (
		<div className="_page" id="_page-1" style={pdfstyles._page}>
		
			<table cols="10" style={pdfstyles.widths}>

				{/*タイトル*/}					
				<tr>
					<td>
					</td>

					<td colspan="8" style={pdfstyles.borderTop}>
						<span style={pdfstyles.title}>御見積書</span>
					</td>

					<td>
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
				{
					getBilltoAndBillfrom() 
				}
				

				{/*御見積申し上げます*/}
				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>
					<td colspan="6">
						<br />
						<div style={pdfstyles.fontsize10}>御社、物流業務を下記の通りに御見積り申し上げます。</div>
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
						<span style={pdfstyles.fontsize8}>基本条件</span>
					</td>
					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>

				{/*基本条件(セル)*/}										
				{entry.basic_condition &&
					getBasicCondition() 
				}
				
				<tr>
					<td colspan="10">
					</td>
				</tr>					
			</table>
		</div>
	)
	const quotation_2 = (
		<div className="_page" id="_page-2" style={pdfstyles._page}>
			<table cols="10" style={pdfstyles.widths}>
				
				{/*テーブルヘッダ*/}
				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>
					<td colspan="8" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize8}>見積明細</span>
					</td>
					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>
				
				{/*項目一覧*/}
				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>
					<td colspan="2" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize8}>項目</span>
					</td>

					<td colspan="2" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize8}>単位</span>
					</td>
					
					<td colspan="1" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize8}>単価</span>
					</td>

					<td colspan="3" style={pdfstyles.tableTd}>
						<span style={pdfstyles.fontsize8}>備考</span>
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

					<td colspan="8">
						<br/>
						<div style={pdfstyles.fontsize8}>備考</div>
					</td>
										
					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>		
				{entry.remarks &&
					getRemarks()
				}
			
			</table>
		</div>
	)
	const tables = [quotation_1, quotation_2]
	let res = {
		html: tables,
		size: tables.length
	}
	return res
}


let pageData = {
	pageList: {
		page:[]
	}
}
const element = () => {

	const quotation = quotationPage()
	const quotation_size = quotation.size

	const total_size = quotation_size
	for (let i = 0, ii = total_size; i < ii; ++i) {
		pageData.pageList.page.push({word: ''})
	}

	return (
		<html>
			<body>
				{quotation.html}
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