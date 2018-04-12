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
const invoice_code_sub = vtecxapi.getQueryString('invoice_code_sub')
const invoiceKey = invoice_code + '-' + invoice_code_sub
const customer_code = vtecxapi.getQueryString('customer_code')
const working_yearmonth = vtecxapi.getQueryString('working_yearmonth')
let cashData = {}
let pageNumber = customer_code ? 1 : 2

/*
	顧客ごとに表示ボタン
	・タイトル
	・明細
	・明細金額合計
	・備考
	・口座
	
	請求先毎に表示ボタン
	・請求先で絞った全ての顧客への請求金額
	・口座
    ・以下を顧客の数だけ表示
    ・タイトル
	・明細
	・明細金額合計
	・備考
*/
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

//請求書本体（請求先、請求元）の情報を取得
const getInvoice = () => {
	const data = vtecxapi.getEntry('/invoice/' + invoiceKey )
	let entry = data.feed.entry[0]
	return entry
}

//追加した請求明細などを取得
const getInvoiceDetails = (_customerCode) => {
	const data = vtecxapi.getFeed('/invoice_details/' + invoiceKey + '?customer.customer_code=' + _customerCode)
	return data.feed.entry ? data.feed.entry[0]:''
}

//顧客と庫内作業と見積書コードを元に明細を取得（invoice-formのgetService()と同じ)
const getServiceItem = (_invoiceEntry, _customerEntry) => {
	const serviceItem = getInvoiceItemDetails(_customerEntry.customer.customer_code, _invoiceEntry.invoice.quotation_code, working_yearmonth)
	if (serviceItem) {
		for (let i = 0; i < serviceItem.length; ++i) {
			const item_details = serviceItem[i]
			const category = item_details.category
			const item_name = item_details.item_name
			const unit = item_details.unit
			const key = category + item_name + unit
			cashData[key] = i
		}
	}
	return serviceItem
}

//編集された「サービス明細の備考」を取得して、サービス明細とマージする
const getInvoiceRemarks = (_customerCode, serviceItem) => {
	const data = vtecxapi.getFeed('/invoice_remarks/' + invoiceKey + '?f&customer.customer_code=' + _customerCode)
	if (data.feed.entry) {
		const invoice_remarks = data.feed.entry[0]
		invoice_remarks.item_details.map((_item_details) => {
			const category = _item_details.category
			const item_name = _item_details.item_name
			const unit = _item_details.unit
			const key = category + item_name + unit
			const index = cashData[key]
			if (index || index === 0) {
				const idx = cashData[key]
				serviceItem[idx].remarks = _item_details.remarks
			}
		})
	}	
	return serviceItem
}

//「税抜」のデータの金額を合計して小計金額を出す
const getSubTotal = (_allItem) => {
	const noTaxList = _allItem.filter((_item) => {
		return (_item.is_taxation === '0')
	})
	//税抜が１つも無かった
	if (!(noTaxList.length)) {
		return ('0')
	//税抜が１つだけ
	} else if (noTaxList.length === 1) {
		noTaxList[0].amount = noTaxList[0].amount.replace(/,/g,'')
		return(noTaxList[0].amount)
	}else{
		const noTaxTotal = noTaxList.reduce((prev, current) => {
			current.amount = current.amount.replace(/,/g,'')
			return { 'amount': '' + (Number(prev.amount) + Number(current.amount)) }
		})
		return(noTaxTotal.amount)
	}
}

//「税込」のデータの金額を合計して税込の合計金額を出す
const getTaxTotal = (_allItem) => {
	
	const TaxList = _allItem.filter((_item) => {
		vtecxapi.log('taxitemtax='+JSON.stringify(_item.is_taxation))
		if(_item.is_taxation) return _item.is_taxation === '1'
	})
	//税込が１つも無かった
	if (!(TaxList.length)) {
		return ('0')
	//税込が１つだけ
	} else if (TaxList.length === 1) {
		TaxList[0].amount = TaxList[0].amount.replace(/,/g,'')
		return(TaxList[0].amount)
	}else{
		const TaxTotal = TaxList.reduce((prev, current) => {
			current.amount = current.amount.replace(/,/g,'')
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

const getBilltoAndBillfrom = (_invoiceEntry,_customerEntry) => {
	
	const stamp = getStamp(_invoiceEntry.billfrom.billfrom_name)
	
	const name = customer_code ? _invoiceEntry.billto.billto_name : _customerEntry.customer.customer_name
	return(
		<tr>
			<td style={pdfstyles.spaceLeft}>
			</td>

			<td colspan="1">
				<div style={pdfstyles.fontsize10UL}>{name}　御中</div>
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
				case 'ems': categoryName = 'EMS・立替金など'
					break		
				case 'none': categoryName = ''
					break
				}
				if (categoryName !== '') {
					result.push(
						<tr>
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(7, 'tableTdLeft', categoryName)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)

					result.push(
						<tr>
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(1, 'tableTd', 'ご請求内容')}
							{getTdNode(1, 'tableTd', '数量')}
							{getTdNode(1, 'tableTd', '単位')}
							{getTdNode(1, 'tableTd', '単価')}
							{getTdNode(2, 'tableTd', '金額')}
							{getTdNode(1, 'tableTd', '備考')}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				}
			}	

			if (categoryList !== 'none'){
				if (categoryList === 'monthly' || categoryList === 'daily') {
					result.push(
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(1, 'tdLeft', _itemDetails.item_name + (_itemDetails.unit_name ? _itemDetails.unit_name : ''))}
							{getTdNode(1, 'tdRight', addFigure(_itemDetails.quantity))}
							{getTdNode(1, 'tdCenter', _itemDetails.unit)}
							{getTdNode(1, 'tdRight', addFigure(String(_itemDetails.unit_price)))}
							{getTdNode(2, 'tdRight', addFigure(_itemDetails.amount))}
							{getTdNode(1, 'tdLeft', _itemDetails.remarks)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				} else {
					result.push(
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(1, 'tdLeft', _itemDetails.item_name)}
							{getTdNode(1, 'tdRight', addFigure(_itemDetails.quantity))}
							{getTdNode(1, 'tdCenter', _itemDetails.unit + (_itemDetails.unit_name ? _itemDetails.unit_name : ''))}
							{getTdNode(1, 'tdRight', addFigure(String(_itemDetails.unit_price)))}
							{getTdNode(2, 'tdRight', addFigure(_itemDetails.amount))}
							{getTdNode(1, 'tdLeft', _itemDetails.remarks)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				}

				if (idx === (size - 1)) {
					result.push(
						<tr>
							<td colspan="9" ><br /></td>
						</tr>
					)
				}
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

const invoicePage = (_customerEntry,_invoiceEntry,item,remarks) => {

	vtecxapi.log('start='+pageNumber)
	const allItem = item

	vtecxapi.log('allItem='+JSON.stringify(allItem))
	//税抜合計値	
	const subTotal = allItem ? getSubTotal(allItem):'0'
	//税抜合計値に0.08かける
	const taxation = subTotal ? Math.floor(subTotal * 0.08)	:'0'
	//税込合計値
	const taxTotal = allItem ? getTaxTotal(allItem): '0'
	//全ての金額を合計した合計請求金額
	const total_amount = (Number(subTotal) + Number(taxTotal) + Number(taxation))

	const invoice_1  = (
		<div className="_page" id={'page-'+pageNumber} style={pdfstyles._page}>
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
					getBilltoAndBillfrom(_invoiceEntry,_customerEntry)
				}
				
				{/*合計請求金額*/}
				<tr>
					<td style={pdfstyles.spaceLeft}><br />	</td>

					<td colspan='5' >
						<span style={pdfstyles.fontsize8}>下記の通り、ご請求を申し上げます。</span>
						<br/>
						<br/>
						<span style={pdfstyles.totalAmountText}>合計請求金額　</span>
						<span style={pdfstyles.totalAmount}>¥{addFigure(total_amount)}</span>
						<br/>
					</td>

					<td colspan='2' style={pdfstyles.borderRight}>
						<br />
						<span style={pdfstyles.fontsize10R}>　請求先コード:{_invoiceEntry.billto.billto_code}</span>
						<span style={pdfstyles.fontsize10R}>顧客コード:{_customerEntry.customer.customer_code}</span>
					</td>
					
					<td style={pdfstyles.spaceRight}><br/></td>
				</tr>
				
				<tr>
					<td colspan='9'><br/></td>
				</tr>

				{/*項目一覧*/}
				{ allItem &&
					getAllItemDetails(allItem)					
				}

				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="3"></td>
					{getTdNode(3,'tableTdCenter','小計金額')}
					{getTdNode(1,'tdRight','¥'+ addFigure(subTotal))}
					<td style={pdfstyles.spaceRight}></td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="3"></td>			
					{getTdNode(3,'tableTdCenter','消費税')}
					{getTdNode(1,'tdRight','¥'+ addFigure(taxation))}
					<td style={pdfstyles.spaceRight}></td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="3"></td>			
					{getTdNode(3,'tableTdCenter','EMS・立替金など')}
					{getTdNode(1,'tdRight','¥'+ addFigure(taxTotal))}
					<td style={pdfstyles.spaceRight}></td>
				</tr>
				
				<tr>
					<td style={pdfstyles.spaceLeft}></td>		
					<td colspan="3"></td>
					{getTdNode(3,'tableTdCenter','合計請求金額')}
					{getTdNode(1,'tdRight','¥'+ addFigure(total_amount))}
					<td style={pdfstyles.spaceRight}></td>
				</tr>

			</table>
		</div>
	)
	++pageNumber
	vtecxapi.log('after1page='+pageNumber)
	
	let tables = [invoice_1]

	
	const invoice_2 = (
		<div className="_page" id={'page-' + pageNumber} style={pdfstyles._page}>
			<table cols="10" style={pdfstyles.payeeWidths}>
				
				{/*備考*/}
				<tr>
					<td colspan="10"><br /></td>
				</tr>

				{remarks &&
						getRemarks(remarks)
				}

				<tr>
					<td colspan="10"><br /></td>
				</tr>
				
				{_invoiceEntry.billfrom.payee && customer_code &&
						getPayee(_invoiceEntry.billfrom.payee)
				}
				<tr>
					<td colspan="10"><br /></td>
				</tr>

				{_invoiceEntry.billfrom.payee && customer_code &&
						<tr>
							<td style={pdfstyles.spaceLeft}></td>
							<td colspan="6"></td>
							{getTdNode(1, 'tableTdCenter', 'お支払い期限')}
							{getTdNode(1, 'tdLeft', _invoiceEntry.invoice.payment_date)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
				}
			</table>
		</div>
	)
	tables.push(invoice_2)
	++pageNumber
	
	let res = {
		html: tables,
		size: tables.length,
		resTotalAmount: total_amount,
		resCustomerName:_customerEntry.customer.customer_name,
		resCustomerCode:_customerEntry.customer.customer_code,
	}
	return res
}

let pageData = {
	pageList: {
		page:[]
	}
}


const getAllCustomerTotalAmount = (_invoiceCustomer) => {
	let result = []

	result.push(
		<tr>
			<td style={pdfstyles.spaceLeft}></td>
			{ getTdNode(3, 'tableTd','ご請求内容(顧客毎)') }
			{ getTdNode(3, 'tableTd','顧客コード') }
			{ getTdNode(2, 'tableTd','金額')}
			<td style={pdfstyles.spaceRight}></td>
		</tr>

	)
	_invoiceCustomer.map((invoiceCustomer) => {
		result.push(
			<tr>
				<td style={pdfstyles.spaceLeft}></td>
				{getTdNode(3, 'tdLeft', invoiceCustomer.resCustomerName) }
				{ getTdNode(3, 'tdRight',invoiceCustomer.resCustomerCode) }
				{ getTdNode(2, 'tdRight','¥' + addFigure(invoiceCustomer.resTotalAmount))}
				<td style={pdfstyles.spaceRight}></td>
			</tr>
		)
	})
	
	return (result)
}
const invoiceTotal = (_invoiceEntry, _invoiceCustomer) => {

	const stamp = getStamp(_invoiceEntry.billfrom.billfrom_name)
	let total_amount = 0
	_invoiceCustomer.map((_invoiceCustomer) => {
		total_amount = (Number(total_amount) + Number(_invoiceCustomer.resTotalAmount))	
	})
	const invoice_1  = (
		<div className="_page" id='page-1' style={pdfstyles._page}>
			<table cols="10" style={pdfstyles.totalAmountWidths}>

				{/*タイトル*/}
				<tr>
					{getTdNode(10,'borderTop','御請求書','title')}
				</tr>
				
				{/*請求書情報*/}
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(8,'borderRight','日付:' + getBillingClosingDate(_invoiceEntry.invoice.invoice_yearmonth,_invoiceEntry.billto.billing_closing_date) ,'fontsize10')}
					<td style={pdfstyles.spaceRight}></td>
				</tr>
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(8,'borderRight','請求番号:' + _invoiceEntry.invoice.invoice_code,'fontsize10')}
					<td style={pdfstyles.spaceRight}></td>
				</tr>


				<tr>
					<td style={pdfstyles.spaceLeft}></td>

					<td colspan="5">
						<div style={pdfstyles.fontsize10UL}>{_invoiceEntry.billto.billto_name}　御中</div>
						<div style={pdfstyles.fontsize9}>{_invoiceEntry.invoice.invoice_yearmonth.replace(/\//,'年',)}月度ご請求分</div>
						<br/>
					</td>

					<td colspan="3" style={pdfstyles.fontsize10R}>
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
				{/*請求先名 請求元*/}
				{ /*_invoiceEntry.billto && _invoiceEntry.billfrom &&
					getBilltoAndBillfrom(_invoiceEntry)
				*/}
				
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
					<td colspan='2' style={pdfstyles.borderRight}>
						<br />
						<br/>
						<span style={pdfstyles.fontsize10R}>請求先コード:{_invoiceEntry.billto.billto_code}</span>
					</td>
					<td style={pdfstyles.spaceRight}><br/></td>
				</tr>
				
				<tr>
					<td colspan='10'><br/><br/></td>
				</tr>

				{getAllCustomerTotalAmount(_invoiceCustomer)}
				
				<tr>
					<td colspan='10'><br/></td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="6"></td>
					{getTdNode(1,'tableTdCenter','合計請求金額')}
					{getTdNode(1,'tdRight','¥'+ addFigure(total_amount))}
					<td style={pdfstyles.spaceRight}></td>
				</tr>

				<tr>
					<td colspan='10'><br/></td>
				</tr>

				<tr>
					<td colspan='10'><br/></td>
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
					{getTdNode(1,'tableTdCenter','お支払い期限')}
					{getTdNode(1,'tdLeft',_invoiceEntry.invoice.payment_date)}
					<td style={pdfstyles.spaceRight}></td>
				</tr>

			</table>	
		</div>
	)

	const tables = [invoice_1]
	let res = {
		html: tables,
		size: tables.length
	}
	return res
			
}

//customer_codeの有無で処理を分ける。有るときはそれを使ってinvoicePageを行う
//無いときは請求先コードで絞った顧客情報を元にinvoicepageを行う
const element = () => {
	let invoice_entry = getInvoice()
	//締日用
	const billto_data = vtecxapi.getEntry('/billto/' + invoice_entry.billto.billto_code)
	invoice_entry.billto = billto_data.feed.entry[0].billto
	
	//const titleRecordLimit = 20

	let customer_entry
	if (customer_code) {
		customer_entry = vtecxapi.getEntry('/customer/' + customer_code)
	} else {
		const billto_code  = invoice_entry.billto.billto_code 
		customer_entry = vtecxapi.getFeed('/customer?billto.billto_code=' + billto_code, true)
	}

	let invoice = []
	
	customer_entry.feed.entry.map((customer_entry) => {
		cashData = {}
		//サービス明細取得
		let serviceItem = getServiceItem(invoice_entry, customer_entry)
		//サービス明細と編集した備考をマージする
		serviceItem = getInvoiceRemarks(customer_entry.customer.customer_code, serviceItem)
		//追加した明細を取得、サービス明細と追加明細をマージする
		const invoice_details = getInvoiceDetails(customer_entry.customer.customer_code)
		let item = []
		if (invoice_details.item_details) {
			item = serviceItem.concat(invoice_details.item_details)	
		} else if(serviceItem){
			item = serviceItem
		} else {
			item = []
		}
		let remarks = invoice_details.remarks ? invoice_details.remarks : ''
		invoice.push(invoicePage(customer_entry,invoice_entry,item,remarks))
	})
	
	//請求先毎だったら合計を出す
	if (!customer_code) {
		invoice.push(invoiceTotal(invoice_entry, invoice))
	}

	let invoice_size = 0
	invoice.map((_invoice) => {
		invoice_size = (Number(invoice_size) + Number(_invoice.size))
	})
	let total_size = invoice_size
	for (let i = 0, ii = total_size; i < ii; ++i) {
		pageData.pageList.page.push({word: ''})
	}
	
	return (
		<html>
			<body>
				{invoice.map((_invoice) => {
					return (_invoice.html)
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
		if(customer_code){
			return 'preview-' + invoice_code + '/' + customer_code + '/' + working_yearmonth + '.pdf'
		} else {
			return 'preview-' + invoice_code + '/' + working_yearmonth + '.pdf'
		}
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