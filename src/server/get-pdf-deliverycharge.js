import vtecxapi from 'vtecxapi' 
import React from 'react'
//import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/deliverychargestyles.js'
import { CommonGetFlag } from './common'

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

const getCustomerFromBillto = (_billto_code) => {
	const data = vtecxapi.getFeed('/customer?billto.billto_code=' + _billto_code)
	return CommonGetFlag(data) ? data.feed.entry : null
}

const header = (_customer, _quotationData) => {

	return  (
		<table cols="5" style={pdfstyles.header_table}>
			<tr>
				<td rowspan="2"></td>
				<td style={pdfstyles.header_title}>{_customer.customer_name}　御中</td>
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

const remarkTable = (_deliverychargeData) => {

	const remarks = _deliverychargeData.feed.entry[0].remarks

	if (remarks) {
		let array = []
		remarks.map((_obj) => {
			array.push(
				<tr>
					<td></td>
					<td style={pdfstyles.remark}><div>※　{_obj.content}</div></td>
					<td></td>
				</tr>
			)
		})
		const table = (
			<table cols="3" style={pdfstyles.remark_table}>
				<tr>
					<td></td>
					<td style={pdfstyles.remark_table_top_blank}><div></div></td>
					<td></td>
				</tr>
				{array}
			</table>
		)
		return table
	} else {
		return null
	}
}

const getShipmentService = () => {
	const data = vtecxapi.getFeed('/shipment_service', true)
	let res = {}
	data.feed.entry.map((_obj) => {
		if (_obj.zone) {
			let zones = {}
			_obj.zone.map((_obj) => {
				zones[_obj.zone_code] = _obj.pref_codes
			})
			res[_obj.shipment_service.code] = zones
		}
	})
	return res
}

const deliverychargeTable = (_data) => {

	const shipment_service = getShipmentService()

	let res = {
		data: [],
		maxPage: 0
	}
	const table = (_obj) => {

		const type = _obj.shipment_service_type
		const code = _obj.shipment_service_code
		const name = () => {
			if (_obj.shipment_service_service_name) {
				return _obj.shipment_service_name + ' / ' + _obj.shipment_service_service_name
			} else {
				return _obj.shipment_service_name
			}
		}

		const charge_by_zone = _obj.delivery_charge_details[0].charge_by_zone
		const charge_by_zone_size = charge_by_zone ? 70 / charge_by_zone.length : '10,30,30'
		const zones = shipment_service[code]

		let table_style_widths = []
		if (charge_by_zone) {
			charge_by_zone.map(() => {
				table_style_widths.push(charge_by_zone_size)
			})
			table_style_widths.join(',')
		} else {
			table_style_widths = charge_by_zone_size
		}
		const table_style = {
			width: '100%',
			widths: '10,5,5,'+ table_style_widths +',10',
			bordercolor: '#000000',
			'border-spacing': '1px'
		}
		const table_cols = 4 + (charge_by_zone ? charge_by_zone.length : 3)
		const colspan_all = table_cols - 2

		const getTableHeader = () => {

			const getTd = (_value, _colspan, _rowspan, _isBlank) => {
				return <td
					colspan={_colspan ? _colspan : 1}
					rowspan={_rowspan ? _rowspan : 1}
					style={_isBlank ? pdfstyles.deliverycharge_table_th_blank : pdfstyles.deliverycharge_table_th}>
					<div>{_isBlank ? '' : _value}</div>
				</td>
			}
			let array = []

			if (charge_by_zone) {

				array.push(getTd('地域帯', 2))

				let array2 = []
				array2.push(<td
					colspan={2}	
					height={80}	
					style={pdfstyles.deliverycharge_table_th}>
					<div></div>
				</td>)

				charge_by_zone.map((_charge_by_zone) => {
					array.push(getTd(_charge_by_zone.zone_name))

					let zoneArray = []
					zones[_charge_by_zone.zone_code].map((_obj) => {
						zoneArray.push(<div>{_obj.pref_code}</div>)
					})
					array2.push(getTd(zoneArray, null, 2))
				})

				let array3 = []
				array3.push(getTd('サイズ'))
				array3.push(getTd('重量'))

				return [
					<tr key={0}>
						<td></td>
						{array}
						<td></td>
					</tr>,
					<tr key={1}>
						<td></td>
						{array2}
						<td></td>
					</tr>,
					<tr key={2}>
						<td></td>
						{array3}
						<td></td>
					</tr>
				]
			} else {
				if (type === '2') {
					array.push(getTd('サイズ'))
					array.push(getTd('重量'))
					array.push(getTd('配送料'))
					array.push(getTd('記事'))
					array.push(getTd('', null, null, true))
					return (
						<tr>
							<td></td>
							{array}
							<td></td>
						</tr>
					)
				}
			}
		}

		const getTableContent = () => {

			const getTd = (_value, _isBlank) => {
				return <td
					style={_isBlank ? pdfstyles.deliverycharge_table_th_blank : pdfstyles.deliverycharge_table_td}>
					<div>{_value ? _value : _isBlank ? '' : '-'}</div>
				</td>
			}

			const getTr = (_delivery_charge_details) => {
				let td = []
				td.push(getTd(_delivery_charge_details.size))
				td.push(getTd(_delivery_charge_details.weight))

				if (_delivery_charge_details.charge_by_zone) {
					_delivery_charge_details.charge_by_zone.map((_charge_by_zone) => {
						td.push(getTd(_charge_by_zone.price))
					})
				} else {
					if (type === '2') {
						td.push(getTd(_delivery_charge_details.price))
						td.push((
							<td
								style={pdfstyles.deliverycharge_table_td_note}>
								<div>{_delivery_charge_details.note ? _delivery_charge_details.note : ''}</div>
							</td>
						))
						td.push(getTd('', true))
					} else {
						td = (
							<td style={pdfstyles.deliverycharge_table_td} colspan="5">
								<div>地域帯が設定されていません。</div>
							</td>
						)
					}
				}
				return (
					<tr>
						<td></td>
						{td}
						<td></td>
					</tr>
				)
			}

			let tr = []
			_obj.delivery_charge_details.map((_delivery_charge_details) => {
				tr.push(getTr(_delivery_charge_details))
			})
			return tr
		}

		return (
			<table cols={table_cols} style={table_style}>
				<tr>
					<td></td>
					<td colspan={colspan_all} style={pdfstyles.deliverycharge_title_table_top_blank}><div></div></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td colspan={colspan_all} style={pdfstyles.deliverycharge_title}>
						<div>{name()}</div>
					</td>
					<td></td>
				</tr>
				{getTableHeader()}
				{getTableContent()}
			</table>
		)
	}

	_data.feed.entry[0].delivery_charge.sort((a, b) => {
		return a.shipment_service_type - b.shipment_service_type
	})

	let max_table_size = 47
	let total_size = 0
	let table_array = []
	_data.feed.entry[0].delivery_charge.map((_obj) => {

		let table_size = 1
		const type = _obj.shipment_service_type
		if (type === '1') {
			table_size = 10
		}
		table_size = table_size + _obj.delivery_charge_details.length
		
		if (max_table_size < (total_size + table_size)) {
			res.data.push(table_array)
			res.maxPage++
			table_array = []
			total_size = 0
		}
		table_array.push(table(_obj))
		total_size = total_size + table_size

	})

	if (table_array.length) {
		res.data.push(table_array)
		res.maxPage++
	}

	return res
}

export const DeliveryCharge = (_start_page, _quotationData) => {

	const quotationData = _quotationData
	const customerData = getCustomerFromBillto(quotationData.billto.billto_code)

	let res = {
		html: [''],
		size: 0
	}
	let index = _start_page

	const pageHeader = (_obj) => {
		return [pageTitle('配送料'),header(_obj.customer, quotationData)]
	}

	const pageHeaderSub = (_obj, _pageIndex, _maxPage) => {
		return  (
			<table cols="3" style={pdfstyles.header_table_sub}>
				<tr>
					<td></td>
					<td style={pdfstyles.header_title_sub}>
						<div>{_obj.customer.customer_name}　御中　( {_pageIndex} / {_maxPage} )</div>
					</td>
					<td></td>
				</tr>
			</table>
		)
	}

	if (customerData) {

		const setPage = (_content) => {
			const page = '_page-' + index
			res.html.push(
				<div className="_page" id={page} style={pdfstyles._page}>
					{_content}
				</div>
			)
			res.size++
			//pageData.pageList.page.push({word: ''})
			index++
		}
		const setTopPage = (_customer, _deliverychargeData) => {
			setPage([pageHeader(_customer), remarkTable(_deliverychargeData)])
		}
		const setContentPage = (_customer, _pageIndex, _maxPage, _table) => {
			setPage([pageHeaderSub(_customer, _pageIndex, _maxPage), _table])
		}

		customerData.map((_obj) => {

			const deliverychargeData = vtecxapi.getEntry('/customer/'+ _obj.customer.customer_code +'/deliverycharge')

			if (CommonGetFlag(deliverychargeData)) {

				// 表紙の設定
				setTopPage(_obj, deliverychargeData)

				// 配送料ページの設定
				const req = deliverychargeTable(deliverychargeData)
				let _pageIndex = 1
				req.data.map((_array) => {
					setContentPage(_obj, _pageIndex, req.maxPage, _array)
					_pageIndex++
				})

			}
		})
	}
	return res
}
/*
const pageData = {
	pageList: {
		page:[]
	}
}

const element = (
	<html>
		<body>
			{DeliveryCharge(1).html}
		</body>
	</html>
)

let html = ReactDOMServer.renderToStaticMarkup(element)

// HTML出力
//vtecxapi.doResponseHtml(html)

// PDF出力
vtecxapi.toPdf(pageData, html, null)
*/