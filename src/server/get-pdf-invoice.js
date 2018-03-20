import vtecxapi from 'vtecxapi' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/invoicestyles.js'
import { getInvoiceItemDetails } from './get-invoice-itemdetails.js'
import {
	addFigure,
	getStamp,
	convertPayee,
} from './common'

import moment from 'moment'
const invoice_code = vtecxapi.getQueryString('invoice_code')
const customer_code = vtecxapi.getQueryString('customer_code')
const working_yearmonth = vtecxapi.getQueryString('working_yearmonth')

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

const getInvoice = () => {
	const data = vtecxapi.getEntry('/invoice/' + invoice_code)
	let entry = data.feed.entry[0]
	return entry
}

const createArray = (_customerEntry,_invoiceEntry) => {
	if (_customerEntry.customer.customer_code && _invoiceEntry.invoice.quotation_code && working_yearmonth) {
		const serviceItem_details = getInvoiceItemDetails(_customerEntry.customer.customer_code, _invoiceEntry.invoice.quotation_code, working_yearmonth)
		let array = []
		if (serviceItem_details) {
			if (_invoiceEntry.item_details) {
				array = serviceItem_details.concat(_invoiceEntry.item_details)
			} else {
				array = serviceItem_details
			}
		} else if (_invoiceEntry.item_details) {
			array = _invoiceEntry.item_details
		}
		return (array)
	} else {
		return('')
	}
}

//「税抜」のデータの金額を合計して小計金額を出す
const getSubTotal = (_allItem) =>{
	const noTaxList = _allItem.filter((_item) => {
		return _item.is_taxation === '0'
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

//「税込」のデータの金額を合計して税込の合計金額を出す
const getTaxTotal = (_allItem) =>{
	const TaxList = _allItem.filter((_item) => {
		return _item.is_taxation === '1'
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

//請求先の請求締日が月末なら請求年月の月末を返す。20日なら請求年月の20日を返す
const getBillingClosingDate = (shipping_yearmonth,billing_closing_date) => {
	//20日
	const twentyMonthDate = new Date(shipping_yearmonth.slice(0, 4) + '-' + shipping_yearmonth.slice(-2) + '-20')
	//月末
	const endMonthDate = new Date(twentyMonthDate.getFullYear(), twentyMonthDate.getMonth() + 1, 0)
	//0：月末 1：20日
	if (billing_closing_date === '0') {
		return(moment(endMonthDate).format('YYYY/MM/DD'))		
	} else {
		return(moment(twentyMonthDate).format('YYYY/MM/DD'))
	}
}

const getBilltoAndBillfrom = (_invoiceEntry) => {
	
	const stamp = getStamp(_invoiceEntry.billfrom.billfrom_name)
	
	return(
		<tr>
			<td style={pdfstyles.spaceLeft}>
			</td>

			<td colspan="1">
				<div style={pdfstyles.fontsize10UL}>{_invoiceEntry.billto.billto_name}　御中</div>
				<div style={pdfstyles.fontsize9}>{_invoiceEntry.invoice.invoice_yearmonth.replace(/\//,'年',)}月度ご請求分</div>
				<br/>
			</td>

			<td colspan="6" style={pdfstyles.fontsize10R}>
				<div>{_invoiceEntry.billfrom.billfrom_name}</div>
			
				<div>
					<span>〒</span>
					<span>{_invoiceEntry.contact_information.zip_code}</span>
					<span>　</span>
					<span>{_invoiceEntry.contact_information.prefecture}{_invoiceEntry.contact_information.address1}{_invoiceEntry.contact_information.address2}</span>
					<br />
					<span>TEL : </span>
					<span>{_invoiceEntry.contact_information.tel}</span>
					<div>
						{stamp && <img src={stamp} width="65.0" height="65.0" />}
						{!stamp  && <br/>}
					</div>
				</div>	
			</td>
					
			<td style={pdfstyles.spaceRight}>
			</td>
		</tr>
	
	)
}

const getAllItemDetails = (_itemDetails) => {

	let categoryList = _itemDetails.map((_itemDetails) => {
		return _itemDetails.category
	}).filter((x, i, self) => {
		return self.indexOf(x) === i
	})
	
	let result = []	
	categoryList.map((categoryList) => {

		const item_details_ofcategory  = _itemDetails.filter((_itemDetails) => {
			return _itemDetails.category === categoryList
		})

		const size = item_details_ofcategory.length			
		item_details_ofcategory.map((_itemDetails, idx) => {
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
					<tr>
						<td style={pdfstyles.spaceLeft}></td>
						{getTdNode(7,'tableTdLeft',categoryName)}
						<td style={pdfstyles.spaceRight}></td>
					</tr>
				)

				result.push(
					<tr>
						<td style={pdfstyles.spaceLeft}></td>
						{ getTdNode(1, 'tableTd','ご請求内容') }
						{ getTdNode(1, 'tableTd','数量') }
						{ getTdNode(1, 'tableTd','単位')}
						{ getTdNode(1, 'tableTd','単価')}
						{ getTdNode(2, 'tableTd','金額')}
						{ getTdNode(1, 'tableTd','備考') }
						<td style={pdfstyles.spaceRight}></td>
					</tr>
				)
			}

			if (categoryList === 'monthly' || categoryList === 'daily') {
				result.push(
					<tr key={idx}>
						<td style={pdfstyles.spaceLeft}></td>
						{getTdNode(1, 'tdLeft',  _itemDetails.item_name + (_itemDetails.unit_name ? _itemDetails.unit_name : ''))}
						{getTdNode(1, 'tdRight',  _itemDetails.quantity)}
						{getTdNode(1, 'tdCenter',  _itemDetails.unit)}
						{getTdNode(1, 'tdRight',  _itemDetails.unit_price)}
						{getTdNode(2,'tdRight',addFigure(_itemDetails.amount))}
						{getTdNode(1,'tdRemarks',_itemDetails.remarks)}
						<td style={pdfstyles.spaceRight}></td>
					</tr>
				)
			} else {
				result.push(
					<tr key={idx}>
						<td style={pdfstyles.spaceLeft}></td>
						{getTdNode(1,'tdLeft',_itemDetails.item_name)}
						{getTdNode(1,'tdRight',_itemDetails.quantity)}
						{getTdNode(1,'tdCenter',_itemDetails.unit + (_itemDetails.unit_name ? _itemDetails.unit_name : ''))}
						{getTdNode(1,'tdRight',_itemDetails.unit_price)}
						{getTdNode(2,'tdRight',addFigure(_itemDetails.amount))}
						{getTdNode(1,'tdRemarks',_itemDetails.remarks)}
						<td style={pdfstyles.spaceRight}></td>
					</tr>
				)
			}	

			if (idx === (size-1)) {
				result.push(
					<tr>
						<td colspan="9" ><br /></td>
					</tr>
				)
			}
		})
	})
	return (result)
}

const getRemarks = (_remarks) => {
	return (
		_remarks.map((remarks, idx) => {
			let result = []
			if (idx === 0) {
				result.push(
					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>

						{getTdNode(8,'tableTdLeft','備考')}
						
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>
				)	
			}
			
			result.push(
				<tr key={idx}>
					<td style={pdfstyles.spaceLeft}>	
					</td>

					{getTdNode(8,'tdLeft',remarks.content)}
									
					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>
			)	
			return (result)
		})
	)
}

const getPayee = (_payee) => {
	const length = _payee.length
	const half =  Math.floor(length / 2)
	return (
		_payee.map((payee,idx) => {
			convertPayee(payee)

			if (length > 2 && (length % 2)) {
				switch (idx) {
				case 0:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							<td colspan="1" style={pdfstyles.tableTdNoBottom}></td>
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(2,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(1,'tdLeft',payee.account_number)}
							{getTdNode(2,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				case half:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(1,'tableTdNoTopBottom','振込先')}
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(2,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(1,'tdLeft',payee.account_number)}
							{getTdNode(2,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)	
				case length - 1:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							<td colspan="1" style={pdfstyles.tableTdNoTop}></td>
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(2,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(1,'tdLeft',payee.account_number)}
							{getTdNode(2,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				default:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							<td colspan="1" style={pdfstyles.tableTdNoTopBottom}></td>
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(2,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(1,'tdLeft',payee.account_number)}
							{getTdNode(2,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				}
			
			} else if (length > 2 && !(length % 2)) {
				switch (idx) {
				case 0:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							<td colspan="1" style={pdfstyles.tableTdNoBottom}></td>
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(2,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(1,'tdLeft',payee.account_number)}
							{getTdNode(2,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}>
							</td>
						</tr>
					)
					
					
				case half:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(1,'tdCenterTwoLineNoTopBottom','振込先')}
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(2,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(1,'tdLeft',payee.account_number)}
							{getTdNode(2,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				case length - 1:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>	
							<td colspan="1" style={pdfstyles.tableTdNoTop}></td>
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(2,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(1,'tdLeft',payee.account_number)}
							{getTdNode(2,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				default:
					return (	
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							<td colspan="1" style={pdfstyles.tableTdNoTopBottom}></td>
							{getTdNode(1,'tdCenterTwoLineNoBottom','振込先')}
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(2,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(1,'tdLeft',payee.account_number)}
							{getTdNode(2,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)	
				}

			}else if (length === 2) {
				switch (idx) {
				case 0:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(1,'tdCenterTwoLineNoBottom','振込先')}
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(2,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(1,'tdLeft',payee.account_number)}
							{getTdNode(2,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}>
							</td>
						</tr>
					)	
					
				case length - 1:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							<td colspan="1" style={pdfstyles.tdCenterTwoLineNoTop}></td>
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(2,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(1,'tdLeft',payee.account_number)}
							{getTdNode(2,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				}		
			} else {
				return (	
					<tr key={idx}>
						<td style={pdfstyles.spaceLeft}></td>
						{getTdNode(1,'tableTd','振込先')}
						{getTdNode(1,'tdLeft',payee.bank_info)}
						{getTdNode(2,'tdLeft',payee.branch_office)}
						{getTdNode(1,'tdLeft',payee.account_type)}
						{getTdNode(1,'tdLeft',payee.account_number)}
						{getTdNode(2,'tdLeft',payee.account_name)}
						<td style={pdfstyles.spaceRight}></td>
					</tr>
				)	
			}	
		})
	)	
}

const invoicePage = (_customerEntry,_invoiceEntry) => {

	const allItem = createArray(_customerEntry,_invoiceEntry)
	//税抜合計値
	const subTotal = allItem ? getSubTotal(allItem):'0'
	//税抜合計値に0.08かける
	const taxation = subTotal ? Math.floor(subTotal * 0.08)	:'0'
	//税込合計値
	const taxTotal = allItem ? getTaxTotal(allItem): '0'
	//全ての金額を合計した合計請求金額
	const total_amount = (Number(subTotal) + Number(taxTotal) + Number(taxation))

	_invoiceEntry.invoice.invoice_yearmonth


	const invoice_1  = (
		<div className="_page" id="_page-1" style={pdfstyles._page}>
		
			<table cols="9" style={pdfstyles.widths}>

				{/*タイトル*/}
				<tr>
					{getTdNode(9,'borderTop','御請求書','title')}
				</tr>
				
				{/*請求書情報*/}
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(7,'borderRight','日付:' + getBillingClosingDate(_invoiceEntry.invoice.invoice_yearmonth,_invoiceEntry.billto.billing_closing_date) ,'fontsize10')}
					<td style={pdfstyles.spaceRight}></td>
				</tr>
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(7,'borderRight','請求番号:' + _invoiceEntry.invoice.invoice_code,'fontsize10')}
					<td style={pdfstyles.spaceRight}></td>
				</tr>

				{/*請求先名 請求元*/}
				{ _invoiceEntry.billto && _invoiceEntry.billfrom &&
					getBilltoAndBillfrom(_invoiceEntry)
				}
				
				{/*合計請求金額*/}
				<tr>
					<td style={pdfstyles.spaceLeft}><br />	</td>

					<td colspan='6' >
						<span style={pdfstyles.fontsize8}>下記の通り、ご請求を申し上げます。</span>
						<br/>
						<br/>
						<span style={pdfstyles.totalAmountText}>合計請求金額　</span>
						<span style={pdfstyles.totalAmount}>¥{addFigure(total_amount)}</span>
						<br/>
					</td>

					<td colspan='1'>
						<br />
						<br/>
						<span style={pdfstyles.fontsize10R}>顧客コード:{_customerEntry.customer.customer_code}</span>
					</td>
					
					<td style={pdfstyles.spaceRight}><br/></td>
				</tr>
				
				<tr>
					<td colspan='9'><br/></td>
				</tr>

				{/*項目一覧*/}

				{  allItem &&
					getAllItemDetails(allItem)					
				}

				<tr>
					<td style={pdfstyles.spaceLeft}></td>

					<td colspan="4"></td>
					{getTdNode(2,'tableTdRight','小計金額')}
					{getTdNode(1,'tdRight','¥'+ addFigure(subTotal))}

					<td style={pdfstyles.spaceRight}></td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}></td>

					<td colspan="4"></td>			
					{getTdNode(2,'tableTdRight','消費税')}
					{getTdNode(1,'tdRight','¥'+ addFigure(taxation))}
					
					<td style={pdfstyles.spaceRight}></td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					
					<td colspan="4"></td>
					{getTdNode(2,'tableTdRight','合計金額')}
					{getTdNode(1,'tdRight','¥'+ addFigure(total_amount))}

					<td style={pdfstyles.spaceRight}></td>
				</tr>

			</table>
		</div>
	)

	const invoice_2 = (
		<div className="_page" id="_page-2" style={pdfstyles._page}>
			<table cols="10" style={pdfstyles.payeeWidths}>
				
				{/*備考*/}
				<tr>
					<td colspan="10"><br/></td>
				</tr>

				{_invoiceEntry.remarks &&
					getRemarks(_invoiceEntry.remarks)
				}

				<tr>
					<td colspan="10"><br/></td>
				</tr>
				
				{_invoiceEntry.billfrom.payee &&
					getPayee(_invoiceEntry.billfrom.payee)
				}

				<tr>
					<td colspan="10"><br/></td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					
					<td colspan="6"></td>
					{getTdNode(1,'tableTdCenter','支払日')}
					{getTdNode(1,'tdLeft',_invoiceEntry.invoice.payment_date)}
					
					<td style={pdfstyles.spaceRight}></td>
				</tr>
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


//customer_codeの有無で処理を分ける。有るときはそれを使ってinvoicePageを行う
//無いときは請求先コードで絞った顧客情報を元にinvoicepageを行う
const element = () => {
	const invoice_entry = getInvoice()
	//締日用
	const billto_data = vtecxapi.getEntry('/billto/' + invoice_entry.billto.billto_code)
	invoice_entry.billto = billto_data.feed.entry[0].billto

	let customer_data
	if (customer_code) {
		customer_data = vtecxapi.getEntry('/customer/' + customer_code)
	} else {
		const billto_code  = invoice_entry.billto.billto_code 
		customer_data = vtecxapi.getFeed('/customer?billto.billto_code=' + billto_code, true)
	}

	let invoice =[]
	customer_data.feed.entry.map((customer_entry) => {
		invoice.push(invoicePage(customer_entry, invoice_entry))
	})

	let invoice_size = 0
	invoice.map((_invoice) => {
		invoice_size = (Number(invoice_size) + Number(_invoice.size))
	})
	
	const total_size = invoice_size
	for (let i = 0, ii = total_size; i < ii; ++i) {
		pageData.pageList.page.push({word: ''})
	}

	return (
		<html>
			<body>
				{invoice.map((_invoice) => {
					return(_invoice.html)
				})}
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

/*
function divln(str,n) {
	const r=new RegExp('.{1,'+n+'}','g')
	return str.match(r).map((token,i)=>{
	 return(<div key={i.toString()}>{token}</div>)
	})
}
*/