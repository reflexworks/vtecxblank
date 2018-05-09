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
	const data = vtecxapi.getEntry('/invoice/' + invoiceKey)
	let entry = data.feed.entry[0]
	return entry
}

//追加した請求明細などを取得
const getInvoiceDetails = (_customerCode) => {
	const data = vtecxapi.getFeed('/invoice_details/' + invoiceKey + '?customer.customer_code=' + _customerCode)
	if (data) {
		//カテゴリnoneを除外
		let tempData = data.feed.entry[0]
		let itemList = []

		tempData.item_details.map((item) => {
			if (item.category !== 'none') {
				itemList.push(item)
			}   
		})
		data.feed.entry[0].item_details = itemList
		return data.feed.entry[0]
	} else {
		return''
	}
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
	
	const data = vtecxapi.getFeed('/invoice_remarks/' + invoiceKey + '?customer.customer_code=' + _customerCode)	
	if (data) {
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
			prev.amount = prev.amount.replace(/,/g, '')
			prev.amount = Math.round(prev.amount)
			current.amount = current.amount.replace(/,/g, '')
			current.amount = Math.round(current.amount)
			return { 'amount': '' + (Number(prev.amount) + Number(current.amount)) }
		})
		return(noTaxTotal.amount)
	}
}

//「税込」のデータの金額を合計して税込の合計金額を出す
const getTaxTotal = (_allItem) => {
    
	const TaxList = _allItem.filter((_item) => {
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
			prev.amount = prev.amount.replace(/,/g, '')
			prev.amount = Math.round(prev.amount)
			current.amount = current.amount.replace(/,/g, '')
			current.amount = Math.round(current.amount)
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

			<td colspan="3">
				<div style={pdfstyles.fontsize10UL}>{name} 御中</div>

				<div style={pdfstyles.fontsize9}>{_invoiceEntry.invoice.invoice_yearmonth.replace(/\//,'年',)}月度ご請求分</div>
				<br/>
			</td>

			<td colspan="6" style={pdfstyles.fontsize10R}>
				<div>{_invoiceEntry.billfrom.billfrom_name}</div>
            
				<div>
					<span>〒</span>
					<span>{_invoiceEntry.contact_information.zip_code}</span>
					<span></span>
					<span>{_invoiceEntry.contact_information.prefecture}{_invoiceEntry.contact_information.address1}{_invoiceEntry.contact_information.address2}</span>
					<br />
					<span>TEL : </span>
					<span>{_invoiceEntry.contact_information.tel}</span>
					<div>
						{stamp && <img src={stamp} width="65.0" height="65.0" />}
						{!stamp && <br/>}
					</div>
				</div>  
			</td>
                    
			<td style={pdfstyles.spaceRight}>
			</td>
		</tr>
	)
}

const getAllItemDetails = (_itemDetails) => {

	/*
	let categoryList = _itemDetails.map((_itemDetails) => {
		return _itemDetails.category
	}).filter((x, i, self) => {
		return self.indexOf(x) === i
	})
    */
	let categoryList = ['monthly','daily','period','packing_item','shipping','collecting','ems','others']
	let result = [] 
	categoryList.map((categoryList) => {

		const item_details_ofcategory = _itemDetails.filter((_itemDetails) => {
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
							{getTdNode(9, 'tableTdLeft', categoryName)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)

					result.push(
						<tr>
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(3, 'tableTd', 'ご請求内容')}
							{getTdNode(1, 'tableTd', '数量')}
							{getTdNode(1, 'tableTd', '単位')}
							{getTdNode(1, 'tableTd', '単価')}
							{getTdNode(1, 'tableTd', '金額')}
							{getTdNode(2, 'tableTd', '備考')}
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
							{getTdNode(3, 'tdLeft', _itemDetails.item_name)}
							{getTdNode(1, 'tdRight', addFigure(_itemDetails.quantity))}
							{getTdNode(1, 'tdCenter', _itemDetails.unit)}
							{getTdNode(1, 'tdRight', addFigure(String(_itemDetails.unit_price)))}
							{getTdNode(1, 'tdRight', addFigure(_itemDetails.amount))}
							{getTdNode(2, 'tdLeft', _itemDetails.remarks)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				} else {
					result.push(
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(3, 'tdLeft', _itemDetails.item_name)}
							{getTdNode(1, 'tdRight', addFigure(_itemDetails.quantity))}
							{getTdNode(1, 'tdCenter', _itemDetails.unit)}
							{getTdNode(1, 'tdRight', addFigure(String(_itemDetails.unit_price)))}
							{getTdNode(1, 'tdRight', addFigure(_itemDetails.amount))}
							{getTdNode(2, 'tdLeft', _itemDetails.remarks)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				}
				
				if (idx === (size - 1)) {
					result.push(
						<tr>
							<td colspan="11" ><br /></td>
						</tr>
					)
				}
			}
		})
	})
	return (result)
}

const getAmount = ( _totalAmount,_subTotal,_taxation, _taxTotal) => {
	let result = []
	
	result.push(
		<tr>
			<td style={pdfstyles.spaceLeft}></td>
			<td colspan="6"></td>
			{getTdNode(2,'tableTdCenter','小計金額')}
			{getTdNode(1,'tdRight','¥'+ addFigure(_subTotal))}
			<td style={pdfstyles.spaceRight}></td>
		</tr>
	)
	
	result.push(

		<tr>
			<td style={pdfstyles.spaceLeft}></td>
			<td colspan="6"></td>           
			{getTdNode(2,'tableTdCenter','消費税')}
			{getTdNode(1,'tdRight','¥'+ addFigure(_taxation))}
			<td style={pdfstyles.spaceRight}></td>
		</tr>
	)
	result.push(	
		<tr>
			<td style={pdfstyles.spaceLeft}></td>
			<td colspan="6"></td>           
			{getTdNode(2,'tableTdCenter','EMS・立替金など')}
			{getTdNode(1,'tdRight','¥'+ addFigure(_taxTotal))}
			<td style={pdfstyles.spaceRight}></td>
		</tr>
	)
	result.push(	
		<tr>
			<td style={pdfstyles.spaceLeft}></td>       
			<td colspan="6"></td>
			{getTdNode(2,'tableTdCenter','合計請求金額')}
			{getTdNode(1,'tdRight','¥'+ addFigure(_totalAmount))}
			<td style={pdfstyles.spaceRight}></td>
		</tr>
	)
	result.push(
		<tr>
			<td colspan="11"><br /></td>
		</tr>
	)
	return result
}	

const getRemarks = (_remarks) => {
	let result = []
	if (!_remarks[0].content) {
		return result
	}
	_remarks.map((remarks, idx) => {
		if (idx === 0) {
			result.push(
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(9, 'tableTdLeft', '備考')}
					<td style={pdfstyles.spaceRight}></td>
				</tr>
			)
		}
		result.push(
			<tr key={idx}>
				<td style={pdfstyles.spaceLeft}></td>
				{getTdNode(9, 'tdLeft', remarks.content)}
				<td style={pdfstyles.spaceRight}></td>
			</tr>
		)
	})
	result.push(
		<tr>
			<td colspan="11"><br /></td>
		</tr>
	)
	return result
}

const getPayee = (_payee) => {
	const length = _payee.length
	const half = Math.floor(length / 2)
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
							{getTdNode(1,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(2,'tdLeft',payee.account_number)}
							{getTdNode(3,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				case half:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							{getTdNode(1,'tableTdNoTopBottom','振込先')}
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(1,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(2,'tdLeft',payee.account_number)}
							{getTdNode(3,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)   
				case length - 1:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							<td colspan="1" style={pdfstyles.tableTdNoTop}></td>
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(1,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(2,'tdLeft',payee.account_number)}
							{getTdNode(3,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				default:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							<td colspan="1" style={pdfstyles.tableTdNoTopBottom}></td>
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(1,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(2,'tdLeft',payee.account_number)}
							{getTdNode(3,'tdLeft',payee.account_name)}
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
							{getTdNode(1,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(2,'tdLeft',payee.account_number)}
							{getTdNode(3,'tdLeft',payee.account_name)}
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
							{getTdNode(1,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(2,'tdLeft',payee.account_number)}
							{getTdNode(3,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				case length - 1:
					return (
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>   
							<td colspan="1" style={pdfstyles.tableTdNoTop}></td>
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(1,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(2,'tdLeft',payee.account_number)}
							{getTdNode(3,'tdLeft',payee.account_name)}
							<td style={pdfstyles.spaceRight}></td>
						</tr>
					)
				default:
					return (    
						<tr key={idx}>
							<td style={pdfstyles.spaceLeft}></td>
							<td colspan="1" style={pdfstyles.tableTdNoTopBottom}></td>
							{getTdNode(1,'tdLeft',payee.bank_info)}
							{getTdNode(1,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(2,'tdLeft',payee.account_number)}
							{getTdNode(3,'tdLeft',payee.account_name)}
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
							{getTdNode(1,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(2,'tdLeft',payee.account_number)}
							{getTdNode(3,'tdLeft',payee.account_name)}
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
							{getTdNode(1,'tdLeft',payee.branch_office)}
							{getTdNode(1,'tdLeft',payee.account_type)}
							{getTdNode(2,'tdLeft',payee.account_number)}
							{getTdNode(3,'tdLeft',payee.account_name)}
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
						{getTdNode(1,'tdLeft',payee.branch_office)}
						{getTdNode(1,'tdLeft',payee.account_type)}
						{getTdNode(2,'tdLeft',payee.account_number)}
						{getTdNode(3,'tdLeft',payee.account_name)}
						<td style={pdfstyles.spaceRight}></td>
					</tr>
				)   
			}   
		})
	)   
}

const getPaymentDate = (_paymentDate) => {
	let result = []
	result.push(
		<tr>
			<td style={pdfstyles.spaceLeft}></td>
			<td colspan="6"></td>
			{getTdNode(2, 'tableTdCenter', 'お支払い期限','fontsize8')}
			{getTdNode(1, 'tdLeft', _paymentDate,'fontsize8')}
			<td style={pdfstyles.spaceRight}></td>
		</tr>
	)
	result.push(
		<tr>
			<td colspan='11'><br/></td>
		</tr>
	)
	return result
}
//顧客毎の最初のページ
const invoiceTitle = (_customerEntry,_invoiceEntry,item,_total_amount,_subTotal,_taxation,_taxTotal,_payee,payment_date,_remarks) => {

	const allItem = item
	const invoice_1 = (
		<div className="_page" id={'page-'+pageNumber} style={pdfstyles._page}>
			<table cols="11" style={pdfstyles.widths}>

				<tr>
					{getTdNode(11,'borderTop','御請求書','title')}
				</tr>
				
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(9,'borderRight','日付:' + getBillingClosingDate(_invoiceEntry.invoice.invoice_yearmonth,_invoiceEntry.billto.billing_closing_date) ,'fontsize10')}
					<td style={pdfstyles.spaceRight}></td>
				</tr>
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(9,'borderRight','請求番号:' + invoiceKey,'fontsize10')}
					<td style={pdfstyles.spaceRight}></td>
				</tr>

				{ _invoiceEntry.billto && _invoiceEntry.billfrom &&
                    getBilltoAndBillfrom(_invoiceEntry,_customerEntry)
				}
                
				<tr>
					<td style={pdfstyles.spaceLeft}><br />  </td>

					<td colspan='6' >
						<span style={pdfstyles.fontsize8}>下記の通り、ご請求を申し上げます。</span>
						<br/>
						<br/>
						<span style={pdfstyles.totalAmountText}>合計請求金額　</span>
						<span style={pdfstyles.totalAmount}>¥{addFigure(_total_amount)}</span>
						<br/>
					</td>

					<td colspan='3' style={pdfstyles.borderRight}>
						<br />
						<span style={pdfstyles.fontsize10R}>　　　　　　請求先コード:{_invoiceEntry.billto.billto_code}</span>
						<span style={pdfstyles.fontsize10R}>顧客コード:{_customerEntry.customer.customer_code}</span>
					</td>
                    
					<td style={pdfstyles.spaceRight}><br/></td>
				</tr>
                
				<tr>
					<td colspan='11'><br/></td>
				</tr>

				{ allItem &&
                    getAllItemDetails(allItem)                  
				}

				{ _subTotal &&
					getAmount(_total_amount,_subTotal,_taxation,_taxTotal)
				}
                
				{_payee && customer_code &&
                    getPayee(_payee)
				}
				<tr>
					<td colspan="11"><br /></td>
				</tr>

				{payment_date && customer_code &&
                    getPaymentDate(_invoiceEntry.invoice.payment_date)
				}

				{_remarks &&
                    getRemarks(_remarks)
				}

			</table>
		</div>
	)
	++pageNumber
    
	let tables = [invoice_1]

	let res = {
		html: tables,
		size: tables.length,
		resTotalAmount: _total_amount,
		resCustomerName:_customerEntry.customer.customer_name,
		resCustomerCode:_customerEntry.customer.customer_code,
	}
	return res
}

const addInvoicePage = (_customerEntry,_invoiceEntry,item,_total_amount,_subTotal,_taxation,_taxTotal,_payee,payment_date,_remarks) => {

	const allItem = item
    
	const invoice_1 = (
		<div className="_page" id={'page-'+pageNumber} style={pdfstyles._page}>
			<table cols="11" style={pdfstyles.widths}>

				{/*項目一覧*/}
				{ allItem &&
                    getAllItemDetails(allItem)                  
				}

				{ _subTotal &&
					getAmount(_total_amount,_subTotal,_taxation,_taxTotal)
				}
                
				{_payee && customer_code &&
                    getPayee(_payee)
				}
				<tr>
					<td colspan="11"><br /></td>
				</tr>

				{payment_date && customer_code &&
                    getPaymentDate(_invoiceEntry.invoice.payment_date)
				}

				{_remarks &&
                    getRemarks(_remarks)
				}

			</table>
		</div>
	)
	++pageNumber
    
	let tables = [invoice_1]

	let res = {
		html: tables,
		size: tables.length,
	}
	return res
}

//備考、口座、合計金額等
const payeeAndRemarksPage =(remarks,payment_date,payee,total_amount,subTotal,taxation,taxTotal,) => {
	const invoice_1 = (
		<div className="_page" id={'page-' + pageNumber} style={pdfstyles._page}>
			<table cols="11" style={pdfstyles.widths}>
                
				{ subTotal && 
					getAmount(total_amount,subTotal,taxation,taxTotal)
				}

				{payee && customer_code &&
                    getPayee(payee)
				}
				<tr>
					<td colspan="11"><br /></td>
				</tr>

				{payment_date && customer_code &&
                    getPaymentDate(payment_date)
				}

				{remarks &&
                    getRemarks(remarks)
				}

			</table>
		</div>
	)
	++pageNumber

	let tables = [invoice_1]
	let res = {
		html: tables,
		size: tables.length,
	}
	return res
}

const getAllCustomerTotalAmount = (_invoiceCustomer) => {
	
	let result = []

	result.push(
		<tr>
			<td style={pdfstyles.spaceLeft}></td>
			{ getTdNode(3, 'tableTd','ご請求内容(顧客毎)') }
			{ getTdNode(3, 'tableTd','顧客コード') }
			{ getTdNode(3, 'tableTd','金額')}
			<td style={pdfstyles.spaceRight}></td>
		</tr>

	)
	_invoiceCustomer.map((invoiceCustomer) => {
		result.push(
			<tr>
				<td style={pdfstyles.spaceLeft}></td>
				{getTdNode(3, 'tdLeft', invoiceCustomer.customer_name) }
				{ getTdNode(3, 'tdRight',invoiceCustomer.customer_code) }
				{ getTdNode(3, 'tdRight','¥' + addFigure(invoiceCustomer.total_amount))}
				<td style={pdfstyles.spaceRight}></td>
			</tr>
		)
	})
    
	return (result)
}
const invoiceTotal = (_invoiceCustomer,_invoiceEntry,total_amount) => {

	const stamp = getStamp(_invoiceEntry.billfrom.billfrom_name)
	
	const invoice_1 = (
		<div className="_page" id='page-1' style={pdfstyles._page}>
			<table cols="11" style={pdfstyles.widths}>

				{/*タイトル*/}
				<tr>
					{getTdNode(11,'borderTop','御請求書','title')}
				</tr>
                
				{/*請求書情報*/}
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(9,'borderRight','日付:' + getBillingClosingDate(_invoiceEntry.invoice.invoice_yearmonth,_invoiceEntry.billto.billing_closing_date) ,'fontsize10')}
					<td style={pdfstyles.spaceRight}></td>
				</tr>
				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					{getTdNode(9,'borderRight','請求番号:' + _invoiceEntry.invoice.invoice_code,'fontsize10')}
					<td style={pdfstyles.spaceRight}></td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}>
					</td>

					<td colspan="3">
						<div style={pdfstyles.fontsize10UL}>{_invoiceEntry.billto.billto_name} 御中</div>

						<div style={pdfstyles.fontsize9}>{_invoiceEntry.invoice.invoice_yearmonth.replace(/\//,'年',)}月度ご請求分</div>
						<br/>
					</td>

					<td colspan="6" style={pdfstyles.fontsize10R}>
						<div>{_invoiceEntry.billfrom.billfrom_name}</div>
					
						<div>
							<span>〒</span>
							<span>{_invoiceEntry.contact_information.zip_code}</span>
							<span></span>
							<span>{_invoiceEntry.contact_information.prefecture}{_invoiceEntry.contact_information.address1}{_invoiceEntry.contact_information.address2}</span>
							<br />
							<span>TEL : </span>
							<span>{_invoiceEntry.contact_information.tel}</span>
							<div>
								{stamp && <img src={stamp} width="65.0" height="65.0" />}
								{!stamp && <br/>}
							</div>
						</div>  
					</td>
							
					<td style={pdfstyles.spaceRight}>
					</td>
				</tr>
                
				{/*合計請求金額*/}
				<tr>
					<td style={pdfstyles.spaceLeft}><br />  </td>
                    
					<td colspan='6' >
						<span style={pdfstyles.fontsize8}>下記の通り、ご請求を申し上げます。</span>
						<br/>
						<br/>
						<span style={pdfstyles.totalAmountText}>合計請求金額　</span>
						<span style={pdfstyles.totalAmount}>¥{addFigure(total_amount)}</span>
						<br/>
					</td>
					<td colspan='3' style={pdfstyles.borderRight}>
						<br />
						<br/>
						<span style={pdfstyles.fontsize10R}>請求先コード:{_invoiceEntry.billto.billto_code}</span>
					</td>
					<td style={pdfstyles.spaceRight}><br/></td>
				</tr>
                
				<tr>
					<td colspan='11'><br/><br/></td>
				</tr>

				{getAllCustomerTotalAmount(_invoiceCustomer)}
                
				<tr>
					<td colspan='11'><br/></td>
				</tr>

				<tr>
					<td style={pdfstyles.spaceLeft}></td>
					<td colspan="6"></td>
					{getTdNode(2,'tableTdCenter','合計請求金額')}
					{getTdNode(1,'tdRight','¥'+ addFigure(total_amount))}
					<td style={pdfstyles.spaceRight}></td>
				</tr>

				<tr>
					<td colspan='11'><br/></td>
				</tr>

				<tr>
					<td colspan='11'><br/></td>
				</tr>
                
				{_invoiceEntry &&
                    getPayee(_invoiceEntry.billfrom.payee)
				}

				<tr>
					<td colspan="11"><br/></td>
				</tr>
            
				{
					getPaymentDate(_invoiceEntry.billto.payment_date)
				}

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

const sortArray = (_array) => {
	//明細の並び替え
	/*let categoryList = _array.map((item_details) => {
		return item_details.category
	}).filter((x, i, self) => {
		return self.indexOf(x) === i
	})
	*/
	let categoryList = ['monthly','daily','period','packing_item','shipping','collecting','ems','others']
	let result = []
	categoryList.map((categoryList) => {
		const item_details_ofName = _array.filter((_itemDetails) => {
			return _itemDetails.category === categoryList
		})
		result = result.concat(item_details_ofName)
	})

	result.map((item_details) => {
		item_details.category
		if (categoryList === 'monthly' || categoryList === 'daily') {
			item_details.item_name = item_details.unit_name ? item_details.item_name + item_details.unit_name : item_details.item_name
		} else {
			item_details.unit = item_details.unit_name ? item_details.unit_name : item_details.unit        
		}
	})
	return result
}

const checkItemLimit = (_itemDetails, _lmax) => {
	if (_itemDetails.item_name.length > _lmax * 40) {
		_itemDetails.item_name = _itemDetails.item_name.slice(0, _lmax * 40)
	}
	if (_itemDetails.quantity.length > _lmax * 10) {
		_itemDetails.quantity = _itemDetails.quantity.slice(0, _lmax * 10)
	}
	if (_itemDetails.unit.length > _lmax * 8) {
		_itemDetails.unit = _itemDetails.unit.slice(0, _lmax * 8)
	}
	if (_itemDetails.unit_price.length > _lmax * 12) {
		_itemDetails.unit_price = _itemDetails.unit_price.slice(0, _lmax * 12)
	}
	if (_itemDetails.amount.length > _lmax * 12) {
		_itemDetails.amount = _itemDetails.amount.slice(0, _lmax * 12)
	}
	if (_itemDetails.remarks.length > _lmax * 34) {
		_itemDetails.remarks = _itemDetails.remarks.slice(0, _lmax * 34)
	}

	return(_itemDetails)
}

//データ内で必要な行数チェック
const getItemLine = (_itemDetails) => {
    
	let length = []
	length[0] = _itemDetails.item_name ? Math.ceil(_itemDetails.item_name.length / 15) : 1
	length[1] = _itemDetails.quantity ? Math.ceil(_itemDetails.quantity.length / 15) : 1
	length[2] = _itemDetails.unit ? Math.ceil(_itemDetails.unit.length / 20) : 1
	length[3] = _itemDetails.unit_price ? Math.ceil(_itemDetails.unit_price.length / 12) : 1
	length[4] = _itemDetails.amount ? Math.ceil(_itemDetails.amount.length / 34) : 1
	length[5] = _itemDetails.remarks ? Math.ceil(_itemDetails.remarks.length / 34) : 1
	//最大値を返す
	let result = Math.max.apply(null, length)
	return result
}

const getRecordLimit = (_array, _startIndex, _lmax) => {

	let length = 0
	let result = 0
	let lastIndex = _startIndex + _lmax
	for (let i = _startIndex; i < lastIndex; ++i) {
		if (_array.length <= i) {
			//添字が配列の数と同じ、もしくは上回ったら終了
			result = i
			break
		} else {
			if (i > 0) {
				if (_array[i].category !== _array[i - 1].category) {
					length += 2
					//新しいカテゴリに入って限界数を超えてしまう場合は１つ前で打ち切る
					if (length > _lmax) {
						result = i - 1
						break
					}
				}
			}

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
	return result
}

let pageData = {
	pageList: {
		page:[]
	}
}

//customer_codeの有無で処理を分ける。有るときはそれを使ってinvoicePageを行う
//無いときは請求先コードで絞った顧客情報を元にinvoicepageを行う
const element = () => {
	let invoice_entry = getInvoice()
	const payee = invoice_entry.billfrom.payee
	const payeeLine = payee.length
	
	const payment_date = invoice_entry.invoice.payment_date
	//締日用
	const billto_data = vtecxapi.getEntry('/billto/' + invoice_entry.billto.billto_code)
	invoice_entry.billto = billto_data.feed.entry[0].billto
	const titleRecordLimit = 25
	const addRecordLimit = 40
	const customerLimit = 20
	let customerCount = 0
	let customer_entry
	if (customer_code) {
		customer_entry = vtecxapi.getEntry('/customer/' + customer_code)
	} else {
		const billto_code = invoice_entry.billto.billto_code
		customer_entry = vtecxapi.getFeed('/customer?billto.billto_code=' + billto_code, true)
		//顧客数が20以上だったらページ数増
		customerCount = Math.floor(customer_entry.feed.entry.length / 20)
		pageNumber += customerCount
	}
	
	let invoice = []
	let totalBillto = []
	
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
		const remarksLine = (remarks.length + 1)
		item = sortArray(item)
		//税抜合計値 
		const subTotal = item ? getSubTotal(item):'0'
		//税抜合計値に0.08かける
		const taxation = subTotal ? Math.floor(subTotal * 0.08) :'0'
		//税込合計値
		const taxTotal = item ? getTaxTotal(item): '0'
		//全ての金額を合計した合計請求金額
		const total_amount = (Number(subTotal) + Number(taxTotal) + Number(taxation))
		//請求先毎用
		const total_customer = {
			total_amount: total_amount,
			customer_code: customer_entry.customer.customer_code,
			customer_name: customer_entry.customer.customer_name,
		}
		totalBillto.push(total_customer)
		const titleItemIndex = getRecordLimit(item, 0, titleRecordLimit)
		const title_item = titleItemIndex ? item.slice(0, titleItemIndex) : ''
		
		if (titleItemIndex < item.length) {
			//追加ページが必要
			invoice.push(invoiceTitle(customer_entry, invoice_entry, title_item, total_amount))
	
			const addItemStart = pageNumber
			let addItemLast = pageNumber
			let addItemList = []
			let startIndex = titleItemIndex
			for (let i = addItemStart; ; i++) {
				const endIndex = getRecordLimit(item, startIndex, addRecordLimit)
				addItemList[i] = item.slice(startIndex, endIndex)
				if (endIndex >= item.length) {
					addItemLast = i
					break
				}
				startIndex = endIndex
			}//for
			
			if (addItemStart === addItemLast) {
				//追加は１枚で済む
				let addItem = addItemList[addItemStart]
				const payee_remarksLine = payeeLine + remarksLine
				const remainingLine = addRecordLimit - addItem.length
				if (customer_code) {
					if ((payee_remarksLine + 9) <= remainingLine) {
						//小計も口座も備考も全て入る
						invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal, payee, payment_date, remarks))
					} else if ((8 + payeeLine) <= remainingLine) {
						//6 + payeeLen+1 + 1	
						//小計金額と口座と支払日を入れる(備考だけ次ページ) 備考が無ければtitleで終了
						invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal, payee, payment_date))
						if (remarks) {
							if (remarks[0].content) {
								invoice.push(payeeAndRemarksPage(remarks))
							}
						}	
					} else if ((6 + payeeLine) <= remainingLine) {
						//小計金額と口座情報を入れる(支払日と備考は次ページ)
						invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal, payee))
						invoice.push(payeeAndRemarksPage(remarks, payment_date))
					} else if (5 <= remainingLine) {
						//小計金額だけ入れる(口座と支払日と備考は次ページ)
						invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal))
						invoice.push(payeeAndRemarksPage(remarks, payment_date, payee))
					} else {
						//明細から下を全て次ページで描画
						invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount))
						invoice.push(payeeAndRemarksPage(remarks, payment_date, payee, total_amount, subTotal, taxation, taxTotal))
					}
				} else {
					if ((6 + remarksLine) < remainingLine) {
						//小計も備考も全部入る
						invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal,'','', remarks))
					} else if (5 < remainingLine) {
						//小計だけ入れる(備考は次ページ)
						invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal))
						if (remarks) {
							if (remarks[0].content){
								invoice.push(payeeAndRemarksPage(remarks))
							}
						}	
					} else {
						//明細から下を全て次ページで描画
						invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount))
						invoice.push(payeeAndRemarksPage(remarks,'','', total_amount, subTotal, taxation, taxTotal))
					}
				}
				
			} else {
				//複数枚追加する必要がある
				for (let i = addItemStart; i < (addItemLast + 1); ++i) {
					if (i === addItemLast) {
						//追加明細ラストページ
						const addItem = addItemList[i]
						const payee_remarksLine = payeeLine + remarksLine
						const remainingLine = addRecordLimit - addItem.length
						if (customer_code) {
							if ((payee_remarksLine + 9) <= remainingLine) {
								//小計も口座も備考も全て入る
								invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal, payee, payment_date, remarks))
							} else if ((8 + payeeLine) <= remainingLine) {
								//6 + payeeLen+1 + 1	
								//小計金額と口座と支払日を入れる(備考だけ次ページ) 備考が無ければtitleで終了
								invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal, payee, payment_date))
								if (remarks) {
									if (remarks[0].content) {
										invoice.push(payeeAndRemarksPage(remarks))
									}
								}	
							} else if ((6 + payeeLine) <= remainingLine) {
								//小計金額と口座情報を入れる(支払日と備考は次ページ)
								invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal, payee))
								invoice.push(payeeAndRemarksPage(remarks, payment_date))
							} else if (5 <= remainingLine) {
								//小計金額だけ入れる(口座と支払日と備考は次ページ)
								invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal))
								invoice.push(payeeAndRemarksPage(remarks, payment_date, payee))
							} else {
								//明細から下を全て次ページで描画
								invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount))
								invoice.push(payeeAndRemarksPage(remarks, payment_date, payee, total_amount, subTotal, taxation, taxTotal))
							}
						} else {
							if ((6 + remarksLine) < remainingLine) {
								//小計も備考も全部入る
								invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal,'','', remarks))
							} else if (5 < remainingLine) {
								//小計だけ入れる(備考は次ページ)
								invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount, subTotal, taxation, taxTotal))
								if (remarks) {
									if (remarks[0].content){
										invoice.push(payeeAndRemarksPage(remarks))
									}
								}	
							} else {
								//明細から下を全て次ページで描画
								invoice.push(addInvoicePage(customer_entry, invoice_entry, addItem, total_amount))
								invoice.push(payeeAndRemarksPage(remarks,'','', total_amount, subTotal, taxation, taxTotal))
							}
						}
						//invoice.push(addInvoicePage(customer_entry, invoice_entry, addItemList[i]))
					} else {
						invoice.push(addInvoicePage(customer_entry, invoice_entry, addItemList[i]))
					}
				}
			}
		} else {
			//最初のページで明細がすべて収まる場合はここに来る
			const payee_remarksLine = payeeLine + remarksLine
			const remainingLine = titleRecordLimit - title_item.length
			if (customer_code) {
				if ((payee_remarksLine + 9) <= remainingLine) {
					//小計も口座も備考も全て入る
					invoice.push(invoiceTitle(customer_entry, invoice_entry, title_item, total_amount, subTotal, taxation, taxTotal, payee, payment_date, remarks))
				} else if ((8 + payeeLine) <= remainingLine) {
					//6 + payeeLen+1 + 1	
					//小計金額と口座と支払日を入れる(備考だけ次ページ) 備考が無ければtitleで終了
					invoice.push(invoiceTitle(customer_entry, invoice_entry, title_item, total_amount, subTotal, taxation, taxTotal, payee, payment_date))
					if (remarks) {
						invoice.push(payeeAndRemarksPage(remarks))
					}
				} else if ((6 + payeeLine) <= remainingLine) {
					//小計金額と口座情報を入れる(支払日と備考は次ページ)
					invoice.push(invoiceTitle(customer_entry, invoice_entry, title_item, total_amount, subTotal, taxation, taxTotal, payee))
					invoice.push(payeeAndRemarksPage(remarks, payment_date))
				} else if (5 <= remainingLine) {
					//小計金額だけ入れる(口座と支払日と備考は次ページ)
					invoice.push(invoiceTitle(customer_entry, invoice_entry, title_item, total_amount, subTotal, taxation, taxTotal))
					invoice.push(payeeAndRemarksPage(remarks, payment_date, payee))
				} else {
					//明細から下を全て次ページで描画
					invoice.push(invoiceTitle(customer_entry, invoice_entry, title_item, total_amount))
					invoice.push(payeeAndRemarksPage(remarks, payment_date, payee, total_amount, subTotal, taxation, taxTotal))
				}
			} else {
				if ((6 + remarksLine) < remainingLine) {
					//小計も備考も全部入る
					invoice.push(invoiceTitle(customer_entry, invoice_entry, title_item, total_amount, subTotal, taxation, taxTotal,'','', remarks))
				} else if (5 < remainingLine) {
					//小計だけ入れる(備考は次ページ)
					invoice.push(invoiceTitle(customer_entry, invoice_entry, title_item, total_amount, subTotal, taxation, taxTotal))
					if (remarks) {
						if (remarks[0].content){
							invoice.push(payeeAndRemarksPage(remarks))
						}
					}	
				} else {
					//明細から下を全て次ページで描画
					invoice.push(invoiceTitle(customer_entry, invoice_entry, title_item, total_amount))
					invoice.push(payeeAndRemarksPage(remarks,'','', total_amount, subTotal, taxation, taxTotal))
				}
			}
		}//if titleItemIndex < item.length
	})
	
	//請求先毎だったら合計表を出す
	if (!customer_code) {
		let total_amount = 0
		totalBillto.map((_customer) => {
			total_amount = (Number(total_amount) + Number(_customer.total_amount)) 
		})
		if (customerCount >= 1) {
			 //customerCountの数だけ合計表を出す
			invoice.push(invoiceTotal(totalBillto,invoice_entry,total_amount))
			for (let i = 0; i < customerCount; i++){
				let startindex = i * customerLimit
				let lastindex = ((i + 1) * customerLimit - 1)
				invoice.push(invoiceTotal(totalBillto.slice(startindex,lastindex),invoice_entry,total_amount))
			}

		} else {
			//合計表は1枚で済む
			invoice.push(invoiceTotal(totalBillto,invoice_entry,total_amount))
		}
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
