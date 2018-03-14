import vtecxapi from 'vtecxapi' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/invoicestyles.js'
import { addFigure } from './common'
import { getInvoiceItemDetails } from './get-invoice-itemdetails.js'

/*
function divln(str,n) {
	const r=new RegExp('.{1,'+n+'}','g')
	return str.match(r).map((token,i)=>{
	 return(<div key={i.toString()}>{token}</div>)
	})
}
*/
/**
 * 数値の3桁カンマ区切り
 * 入力値をカンマ区切りにして返却
 */

export const pageTitle = (_title) => {
	return (
		<table cols="1" style={pdfstyles.page_title_table}>
			<tr>
				<td style={pdfstyles.page_title_blank}><div></div></td>
			</tr>
			<tr>
				<td style={pdfstyles.page_title}>{_title} 御請求書</td>
			</tr>
			<tr>
				<td style={pdfstyles.page_title_blank}><div></div></td>
			</tr>
		</table>
	)
}

const invoice_code = vtecxapi.getQueryString('invoice_code')
const customer_code = vtecxapi.getQueryString('customer_code')
const working_yearmonth = vtecxapi.getQueryString('working_yearmonth')

const getInvoice = () => {
	const data = vtecxapi.getEntry('/invoice/' + invoice_code)
	let entry = data.feed.entry[0]
	return entry
}

const createArray = () => {
	let array = []
	if (serviceItem_details) {
		if (entry.item_details) {
			array = serviceItem_details.concat(entry.item_details)
		} else {
			array = serviceItem_details
		}
	} else if (entry.item_details){
		array = entry.item_details
	}
	return(array)
}

const entry = getInvoice()
const serviceItem_details = getInvoiceItemDetails(customer_code, entry.invoice.quotation_code, working_yearmonth)
const allItem = createArray()

const getSubTotal = () =>{
	const noTaxList = allItem.filter((entry) => {
		return entry.is_taxation === '0'
	})
	//税抜が１つも無かった
	if (!(noTaxList.length)) {
		return ('0')
	//税抜が１つだけ
	} else if (noTaxList.length === 1) {
		return(noTaxList[0].amount)
	}else{
		const noTaxTotal = noTaxList.reduce((prev, current) => {
			return { 'amount': '' + (Number(prev.amount) + Number(current.amount)) }
		})
		return(noTaxTotal.amount)
	}
}

const getTaxTotal = () =>{
	const TaxList = allItem.filter((entry) => {
		return entry.is_taxation === '1'
	})
	//税込が１つも無かった
	if (!(TaxList.length)) {
		return ('0')
	//税込が１つだけ
	} else if (TaxList.length === 1) {
		return(TaxList[0].amount)
	}else{
		const TaxTotal = TaxList.reduce((prev, current) => {
			return { 'amount': '' + (Number(prev.amount) + Number(current.amount)) }
		})
		return(TaxTotal.amount)
	}
}

//消費税無の合計値
const subTotal = getSubTotal()
//消費税無合計値に0.08かける
const taxation = Math.floor(subTotal * 0.08)	

const taxTotal = getTaxTotal()
const total_amount = (Number(subTotal) + Number(taxTotal) + Number(taxation))

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
	

	return(
		<tr>
			<td style={pdfstyles.spaceLeft}>
			</td>

			<td colspan="1">
				<div style={pdfstyles.fontsize10UL}>{entry.billto.billto_name}　御中</div>
				<div style={pdfstyles.fontsize9}>{entry.invoice.invoice_yearmonth}月度ご請求書分</div>
				<br/>
			</td>

			<td colspan="6" style={pdfstyles.fontsize10R}>
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
						{!stamp  && <br/>}
						{ entry.creator && <span>担当者:{entry.creator}</span> }
					</div>
				</div>	
			</td>
					
			<td style={pdfstyles.spaceRight}>
			</td>
		</tr>
	
	)
}

const getAllItemDetails = (item_details) => {

	let categoryList = item_details.map((item_details) => {
		return item_details.category
	}).filter((x, i, self) => {
		return self.indexOf(x) === i
	})
	
	let result = []	
	categoryList.map((categoryList) => {

		const item_details_ofcategory  = item_details.filter((entry) => {
			return entry.category === categoryList
		})

		const size = item_details_ofcategory.length			
		item_details_ofcategory.map((item_details, idx) => {
			if (idx === 0) {
				let categoryName = ''
				switch (categoryList) {
				case 'monthly': categoryName = '月次'
					break
				case 'daily': categoryName = '日次'
					break
				case 'period': categoryName = '期次'
					break
				case 'packing_item': categoryName = '資材'
					break
				case 'shipping': categoryName = '配送料(出荷)'
					break
				case 'collecting': categoryName = '配送料(集荷)'
					break
				case 'others': categoryName = 'その他'
					break
				}

				result.push(
					<tr style={pdfstyles.fontsize6}>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colspan="7" style={pdfstyles.tableTdLeft}>
							<span>{categoryName}</span>
							<br />
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>
				)

				result.push(
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>

						<td colspan="1" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize6}>ご請求内容(作業内容)</span>
						</td>

						<td colspan="1" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize6}>数量</span>
						</td>
										
						<td colspan="1" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize6}>単位</span>
						</td>

						<td colspan="1" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize6}>単価</span>
						</td>

						<td colspan="2" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize6}>金額</span>
						</td>

						<td colspan="1" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize6}>備考</span>
						</td>
										
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>
				)
			}


			if (categoryList === 'monthly' || categoryList === 'daily') {

				result.push(
					<tr key={idx} style={pdfstyles.fontsize6}>
						<td style={pdfstyles.spaceLeft}>
						</td>
						{/*10,15*/}
						<td colspan="1" style={pdfstyles.tdLeft}>
							<span style={pdfstyles.fontsize6}>{item_details.item_name}{ item_details.unit_name}</span>
							<br />
						</td>
						{/*10*/}
						<td colspan="1" style={pdfstyles.tdRight}>
							<span style={pdfstyles.fontsize6}>{item_details.quantity}</span>
							<br />
						</td>
						{/*14*/}
						<td colspan="1" style={pdfstyles.tdCenter}>
							<span style={pdfstyles.fontsize6}>{item_details.unit}</span>
							<br />
						</td>
						{/*13*/}
						<td colspan="1" style={pdfstyles.tdRight}>
							<span style={pdfstyles.fontsize6}>{addFigure(item_details.unit_price)}</span>
							<br />
						</td>
						{/*13*/}		
						<td colspan="2" style={pdfstyles.tdRight}>
							<span style={pdfstyles.fontsize6}>{addFigure(item_details.amount)}</span>
							<br />
						</td>
						{/*19*/}
						<td colspan="1" style={pdfstyles.tdRemarks}>
							<span style={pdfstyles.fontsize6}>{item_details.remarks}</span>
							<br />
						</td>
						{/*3*/}
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>
				)
			} else {
				result.push(
					<tr key={idx} style={pdfstyles.fontsize6}>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colspan="1" style={pdfstyles.tdLeft}>
							<span style={pdfstyles.fontsize6}>{item_details.item_name}</span>
							<br />
						</td>
						<td colspan="1" style={pdfstyles.tdRight}>
							<span style={pdfstyles.fontsize6}>{item_details.quantity}</span>
							<br />
						</td>
						<td colspan="1" style={pdfstyles.tdCenter}>
							<span style={pdfstyles.fontsize6}>{item_details.unit}{item_details.unit_name}</span>
							<br />
						</td>
						<td colspan="1" style={pdfstyles.tdRight}>
							<span style={pdfstyles.fontsize6}>{addFigure(item_details.unit_price)}</span>
							<br />
						</td>
						<td colspan="2" style={pdfstyles.tdRight}>
							<span style={pdfstyles.fontsize6}>{addFigure(item_details.amount)}</span>
							<br />
						</td>
						<td colspan="1" style={pdfstyles.tdRemarks}>
							<span style={pdfstyles.fontsize6}>{item_details.remarks}</span>
							<br />
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>
				)
			}	


			if (idx === (size-1)) {
				result.push(
					<tr>
						<td colspan="9" >
							<br />
						</td>
					</tr>
				)
			}

					
		})
			
	})
	return (result)
}

const getRemarks = () => {
	return (
		entry.remarks.map((remarks, idx) => {
			let result = []

			if (idx === 0) {
				result.push(
					<tr style={pdfstyles.fontsize6}>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colspan="7" style={pdfstyles.tableTdLeft}>
							<span>備考</span>
							<br />
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>
				)	
			}
			
			result.push(
				<tr key={idx}>
					<td style={pdfstyles.spaceLeft}>	
					</td>

					<td colspan="7" style={pdfstyles.tdLeft}>
						<span style={pdfstyles.fontsize6}>{remarks.content}</span>
					</td>
									
					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>
			)	
			return (result)
		})
	)
}

const convertPayee = (payee) => {
	switch (payee.bank_info) {
	case '1':
		payee.bank_info = 'みずほ銀行'	
		break
	case '2':
		payee.bank_info = '三菱東京UFJ銀行'	
		break
	case '3':
		payee.bank_info = '三井住友銀行'	
		break
	case '4':
		payee.bank_info = 'りそな銀行'	
		break
	case '5':
		payee.bank_info = '埼玉りそな銀行'	
		break
	case '6':
		payee.bank_info = '楽天銀行'	
		break
	case '7':
		payee.bank_info = 'ジャパンネット銀行'	
		break
	case '8':
		payee.bank_info = '巣鴨信用金庫'	
		break
	case '9':
		payee.bank_info = '川口信用金庫'	
		break
	case '10':
		payee.bank_info = '東京都民銀行'	
		break
	case '11':
		payee.bank_info = '群馬銀行'	
		break
	}

	if (payee.account_type === '0') {
		payee.account_type = '普通'
	} else {
		payee.account_type = '当座'
	}
	return (payee)
}

const getPayee = () => {
	const length = entry.billfrom.payee.length
	const half =  Math.floor(length / 2)
	return (
		entry.billfrom.payee.map((payee,idx) => {
			convertPayee(payee)

			if (length > 2 && (length % 2)) {
				switch (idx) {
				case 0:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}>
							</td>

							<td colspan="1" style={pdfstyles.tableTdNoBottom}>
								<span></span>	
							</td>

							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>	
							</td>
								
							<td colspan="2" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
							</td>

							<td style={pdfstyles.spaceRight}>
							</td>
						</tr>
					)
				case half:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}>
							</td>
								
							<td colspan="1" style={pdfstyles.tableTdNoTopBottom}>
								<span style={pdfstyles.fontsize6}>振込先</span>	
							</td>

							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>	
							</td>
								
							<td colspan="2" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
							</td>

							<td style={pdfstyles.spaceRight}>
							</td>
						</tr>
					)	
				case length - 1:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}>
							</td>
								
							<td colspan="1" style={pdfstyles.tableTdNoTop}>
								<span></span>	
							</td>

							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>	
							</td>
								
							<td colspan="2" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
							</td>

							<td style={pdfstyles.spaceRight}>
							</td>
						</tr>
					)
				default:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}>
							</td>
								
							<td colspan="1" style={pdfstyles.tableTdNoTopBottom}>
								<span></span>	
							</td>

							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>	
							</td>
								
							<td colspan="2" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
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
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}>
							</td>
								
							<td colspan="1" style={pdfstyles.tableTdNoBottom}>
								<span></span>	
							</td>

							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>
								
							</td>
								
							<td colspan="2" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
							</td>

							<td style={pdfstyles.spaceRight}>
							</td>
						</tr>
					)
					
					
				case half:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}>
							</td>
								
							<td colspan="1" style={pdfstyles.tdCenterTwoLineNoTopBottom}>
								<span style={pdfstyles.fontsize6}>振込先</span>	
							</td>

							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>	
							</td>
								
							<td colspan="2" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
							</td>

							<td style={pdfstyles.spaceRight}>
							</td>
						</tr>
					)
				case length - 1:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}>
							</td>
								
							<td colspan="1" style={pdfstyles.tableTdNoTop}>
								<span></span>	
							</td>

							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>	
							</td>
								
							<td colspan="2" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
							</td>

							<td style={pdfstyles.spaceRight}>
							</td>
						</tr>
					)
				default:
					return (	
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}>
							</td>
								
							<td colspan="1" style={pdfstyles.tableTdNoTopBottom}>
								<span></span>	
							</td>

							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>	
							</td>
								
							<td colspan="2" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
							</td>
								
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
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
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}>
							</td>
						
							<td colspan="1" style={pdfstyles.tdCenterTwoLineNoBottom}>
								<span style={pdfstyles.fontsize6}>振込先</span>	
							</td>

							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>	
							</td>
						
							<td colspan="2" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>	
							</td>
						
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
							</td>
						
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
							</td>
						
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
							</td>

							<td style={pdfstyles.spaceRight}>
							</td>
						</tr>
					)	
					
				case length - 1:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}>
							</td>
						
							<td colspan="1" style={pdfstyles.tdCenterTwoLineNoTop}>
								<span></span>	
							</td>

							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>	
							</td>
						
							<td colspan="2" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>	
							</td>
						
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
							</td>
						
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
							</td>
						
							<td colspan="1" style={pdfstyles.tdLeft}>
								<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
							</td>

							<td style={pdfstyles.spaceRight}>
							</td>
						</tr>
					)
				}		
			} else {
				return (	
					<tr key={idx}>
						<td style={pdfstyles.spaceLeft}>
						</td>
						
						<td colspan="1" style={pdfstyles.tableTd}>
							<span style={pdfstyles.fontsize6}>振込先</span>	
						</td>

						<td colspan="1" style={pdfstyles.tdLeft}>
							<span style={pdfstyles.fontsize6}>{payee.bank_info}</span>	
						</td>
						
						<td colspan="2" style={pdfstyles.tdLeft}>
							<span style={pdfstyles.fontsize6}>{payee.branch_office}</span>	
						</td>
						
						<td colspan="1" style={pdfstyles.tdLeft}>
							<span style={pdfstyles.fontsize6}>{payee.account_type}</span>	
						</td>
						
						<td colspan="1" style={pdfstyles.tdLeft}>
							<span style={pdfstyles.fontsize6}>{payee.account_number}</span>	
						</td>
						
						<td colspan="1" style={pdfstyles.tdLeft}>
							<span style={pdfstyles.fontsize6}>{payee.account_name}</span>	
						</td>

						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>
				)	
			}
			
		})
	)	
}

const invoicePage = () => {
	const invoice_1 = (
		<div className="_page" id="_page-1" style={pdfstyles._page}>
		
			<table cols="9" style={pdfstyles.widths}>

				{/*タイトル*/}
				<tr>
					<td>
					</td>

					<td colspan="7" style={pdfstyles.borderTop}>
						<span style={pdfstyles.title}>御請求書</span>
					</td>

					<td>
					</td>
				</tr>
				
				{/*請求書情報*/}
				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>

					<td colspan="7" style={pdfstyles.borderRight}>
						<div>請求書コード : {entry.invoice.invoice_code}</div>
						<br />
					</td>

					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>

				{/*請求先名 請求元*/}
				{ entry.billto && entry.billfrom &&
					getBilltoAndBillfrom()
				}

				<tr>
					<td style={pdfstyles.spaceLeft}>
						<br />	
					</td>

					<td colspan='7' >
						<span style={pdfstyles.fontsize8}>下記の通り、ご請求を申し上げます。</span>
						<br/>
						<br />
						<span style={pdfstyles.totalAmountText}>合計請求金額　</span>
						<span style={pdfstyles.totalAmount}>¥{addFigure(total_amount)}</span>
						<br />
					</td>
					
					<td style={pdfstyles.spaceRight}>
						<br />
					</td>
				</tr>
				
				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>

					<td colspan='1'>
					</td>
					<td colspan='1' >
					</td>

					<td colspan='6' style={pdfstyles.spaceRight}>
							
					</td>
				</tr>

				<tr>
					<td colspan='3' style={pdfstyles.spaceLeft}>
						<br/>	
					</td>
					<td colspan='6' style={pdfstyles.spaceRight}>
						<br/>	
					</td>
				</tr>

				{/*項目一覧*/}

				{  allItem &&
					getAllItemDetails(allItem)					
				}


				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>

					<td colspan="4"></td>

					<td colspan="2" style={pdfstyles.tableTdRight}>
						<span style={pdfstyles.fontsize6}>小計金額</span>	
					</td>
					
					<td colspan="1" style={pdfstyles.tdRight}>
						<span style={pdfstyles.fontsize6}>¥{addFigure(subTotal)}</span>
					</td>

					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>

					<td colspan="4"></td>			
					
					<td colspan="2" style={pdfstyles.tableTdRight}>
						<span style={pdfstyles.fontsize6}>消費税</span>	
					</td>
					
					<td colspan="1" style={pdfstyles.tdRight}>
						<span style={pdfstyles.fontsize6}>¥{addFigure(taxation)}</span>
					</td>

					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>
					
					<td colspan="4"></td>
					<td colspan="2" style={pdfstyles.tableTdRight}>
						<span style={pdfstyles.fontsize6}>合計金額</span>	
					</td>
					
					<td colspan="1" style={pdfstyles.tdRight}>
						<span style={pdfstyles.fontsize6}>¥{total_amount}</span>
					</td>

					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>

			</table>
		</div>
	)

	const invoice_2 = (
		<div className="_page" id="_page-2" style={pdfstyles._page}>
			<table cols="9" style={pdfstyles.payeeWidths}>
				

				{/*備考*/}
				<tr>
					<td colspan="9">
						<br/>
					</td>
				</tr>

				{entry.remarks &&
					getRemarks()
				}

				<tr>
					<td colspan="9">
						<br/>
					</td>
				</tr>
				
				{entry.billfrom.payee &&
					getPayee()
				}
			</table>
		</div>
	)
	const tables = [invoice_1, invoice_2]
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

	const invoice = invoicePage()
	const invoice_size = invoice.size

	const total_size = invoice_size
	for (let i = 0, ii = total_size; i < ii; ++i) {
		pageData.pageList.page.push({word: ''})
	}

	return (
		<html>
			<body>
				{invoice.html}
			</body>
		</html>
	)	
}

let html = ReactDOMServer.renderToStaticMarkup(element())

const file_name = () => {
	const preview = vtecxapi.getQueryString('preview')
	if (preview === '') {
		return 'preview-' + invoice_code + '/' + customer_code + '/' + working_yearmonth + '.pdf'
	} else {
		return 'invoice-' + invoice_code +'.pdf'
	}
}

// PDF出力
vtecxapi.toPdf(pageData, html, file_name())