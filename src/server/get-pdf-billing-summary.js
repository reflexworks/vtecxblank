import vtecxapi from 'vtecxapi' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/billingsummarystyle.js'
import { getSummary } from './billingsummary'
import { addFigure } from './common'

const shipping_yearmonth = vtecxapi.getQueryString('shipping_yearmonth')  //201801
const billto_code = vtecxapi.getQueryString('billto_code')  // 0000124
const customer_code = vtecxapi.getQueryString('customer_code')  // 0000182

const summaryPage = () => {

	let res = {
		html: [],
		size: 0
	}
	const tables = () => {

		const summarys = (_data, _title) => {
			if (_data.billing_summary.record.length) {

				let cash_header = {}
				let header1 = [<th style={pdfstyles.summary_table_th} key={0}></th>]
				let header2 = [<th style={pdfstyles.summary_table_th} key={0}><div>サイズ</div></th>]
				let is_end_header = false

				let befor_size

				const records = _data.billing_summary.record
				let record_array = []
				let record_array_index = -1

				let sizeTotalData = {}
				let sub_total = {}
				for (let i = 0, ii = records.length; i < ii; ++i) {
					const record = _data.billing_summary.record[i]

					if (!sizeTotalData[record.size]) {
						sizeTotalData[record.size] = {
							quantity: 0,
							sub_total: 0
						}
					}
					sizeTotalData[record.size].quantity = sizeTotalData[record.size].quantity + parseInt(record.quantity)
					sizeTotalData[record.size].sub_total = sizeTotalData[record.size].sub_total + parseInt(record.subtotal)

					if (!is_end_header && !cash_header[record.zone_name]) {
						cash_header[record.zone_name] = true
						header1.push(<th colspan="3" style={pdfstyles.summary_table_th} key={( i + 1 )}><div>{record.zone_name}</div></th>)
						header2.push(
							<th style={pdfstyles.summary_table_th}
								key={(i + 1)}>
								<div>個数</div>
							</th>
						)
						header2.push(
							<th style={pdfstyles.summary_table_th}
								key={(i + 1)}>
								<div>単価</div>
							</th>
						)
						header2.push(
							<th style={pdfstyles.summary_table_th}
								key={(i + 1)}>
								<div>小計</div>
							</th>
						)
					} else if (!is_end_header) {
						is_end_header = true
					}
					if (befor_size !== record.size) {
						record_array_index++
						if (!record_array[record_array_index]) {
							record_array[record_array_index] = []
						}
						befor_size = record.size
						record_array[record_array_index].push(
							<td style={pdfstyles.summary_table_td} key={record_array[record_array_index].length}><div>{record.size}</div></td>
						)
					}
					record_array[record_array_index].push(
						<td style={pdfstyles.summary_table_td}
							key={record_array[record_array_index].length}>
							<div>{record.quantity}</div>
						</td>
					)
					record_array[record_array_index].push(
						<td style={pdfstyles.summary_table_td}
							key={record_array[record_array_index].length}>
							<div>{addFigure(record.delivery_charge)}</div>
						</td>
					)
					record_array[record_array_index].push(
						<td style={pdfstyles.summary_table_td}
							key={record_array[record_array_index].length}>
							<div>{addFigure(record.subtotal)}</div>
						</td>
					)

					if (!sub_total[record.zone_name] && sub_total[record.zone_name] !== 0) {
						sub_total[record.zone_name] = 0
					}
					sub_total[record.zone_name] = sub_total[record.zone_name] + parseInt(record.subtotal)
				}

				const table_col_size = header2.length + 2

				let summary_table = pdfstyles.summary_table
				const getWidths = () => {
					const col_size = 98 / header2.length
					let array = []
					for (let i = 0, ii = header2.length; i < ii; ++i) {
						array.push(col_size)
					}
					return array.join(',')
				}
				summary_table.widths = '1,'+ getWidths() +',1'

				let tr_array = []
				record_array.map((_td) => {
					tr_array.push(<tr><td></td>{_td}<td></td></tr>)
				})

				let sub_total_td = [<td key={0} style={pdfstyles.summary_table_th}><div>合計</div></td>]
				Object.keys(sub_total).forEach((_key) => {
					sub_total_td.push(<td key={0} style={pdfstyles.summary_table_td}><div></div></td>)
					sub_total_td.push(<td key={0} style={pdfstyles.summary_table_td}><div></div></td>)
					sub_total_td.push(<td key={0} style={pdfstyles.summary_table_td}><div>{addFigure(sub_total[_key])}</div></td>)
				})
				tr_array.push(<tr><td></td>{sub_total_td}<td></td></tr>)

				const table = (
					<table cols={table_col_size} style={summary_table}>
						<tr>
							<td></td>
							<td style={pdfstyles.header_sub_sub} colspan={table_col_size - 2}>
								<div>{_title}</div>
							</td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							{header1}
							<td></td>
						</tr>
						<tr>
							<td></td>
							{header2}
							<td></td>
						</tr>
						{tr_array}
					</table>
				)

				const total = () => {
					let array = []
					array.push(
						<tr>
							<th colspan="5" style={pdfstyles.total_table_blank}><div></div></th>
						</tr>
					)
					array.push(
						<tr>
							<th style={pdfstyles.total_table_comment}>
								<div>※ サイズ別の合計金額を右記に記します。</div>
							</th>
							<th style={pdfstyles.total_table_th}><div>サイズ</div></th>
							<th style={pdfstyles.total_table_th}><div>総個数</div></th>
							<th style={pdfstyles.total_table_th}><div>合計金額</div></th>
							<th></th>
						</tr>
					)
					let total_sub_total = 0
					Object.keys(sizeTotalData).forEach((_key) => {
						const size_data = sizeTotalData[_key]
						total_sub_total = total_sub_total + size_data.sub_total
						array.push(
							<tr>
								<td></td>
								<td style={pdfstyles.total_table_td}><div>{_key}</div></td>
								<td style={pdfstyles.total_table_td}><div>{size_data.quantity}</div></td>
								<td style={pdfstyles.total_table_td}><div>{addFigure(size_data.sub_total)}</div></td>
								<td></td>
							</tr>
						)
					})
					array.push(
						<tr>
							<td></td>
							<td colspan="3" style={pdfstyles.total_table_td_bold}><div>¥ {addFigure(total_sub_total)}</div></td>
							<td></td>
						</tr>
					)
					return array
				}
				const total_table = (
					<table cols="5" style={pdfstyles.total_table}>
						<tr>
							<td></td>
							<td colspan="3"></td>
							<td></td>
						</tr>
						{total()}
					</table>
				)
				return [table, total_table]
			} else {
				return null
			}
		}

		const list = ['YH1_0', 'ECO1_0', 'ECO2_0', 'YH1_1', 'ECO1_1', 'ECO2_1']
		let array = []
		list.map((_key) => {
			const keys = _key.split('_')
			const shipment_service_code = keys[0]
			const shipment_class = keys[1]
			const table_data = getSummary(shipping_yearmonth, billto_code, shipment_service_code, customer_code, shipment_class)
			if (table_data.feed.entry[0].billing_summary.record.length) {
				array.push({
					shipment_service_code: shipment_service_code,
					shipment_class: shipment_class,
					table_data: table_data
				})
			}
		})

		let obj = {}
		let isClass0 = true
		let isClass1 = true
		const classNameTable = (_className) => {
			let summary_table = JSON.parse(JSON.stringify(pdfstyles.summary_table))
			summary_table.widths = '1,98,1'
			return (
				<table cols="3" style={summary_table}>
					<tr>
						<td></td>
						<td style={pdfstyles.class_title}>
							<div>{_className}</div>
						</td>
						<td></td>
					</tr>
					<tr>
						<td colspan="3" style={pdfstyles.class_title_blank}><div></div></td>
					</tr>
				</table>
			)
		}

		let cashCount = {}
		array.map((_data) => {

			// 顧客の数だけループする
			_data.table_data.feed.entry.map((_entry) => {

				const customer_code = _entry.customer.customer_code
				if (!cashCount[customer_code]) {
					cashCount[customer_code] = {
						yh_count: 0,
						eco_count: 0
					}
				}

				let table_name
				if (_data.shipment_service_code === 'YH1') table_name = 'ヤマト運輸/宅急便発払'
				if (_data.shipment_service_code === 'ECO1') table_name = 'エコ配ALLJP/エコプラス便'
				if (_data.shipment_service_code === 'ECO2') table_name = 'エコ配ALLJP/コレクト便'
				if (!obj[customer_code]) {
					obj[customer_code] = {
						table0: [],
						table1: [],
						customer_name: _entry.customer.customer_name
					}
				}

				if (_data.shipment_service_code === 'YH1') cashCount[customer_code].yh_count++
				if (_data.shipment_service_code.indexOf('ECO') !== -1) cashCount[customer_code].eco_count++

				if (_data.shipment_class === '0' && isClass0) {
					isClass0 = false
					obj[customer_code].table0.push(classNameTable('【 発送 】'))
				}
				if (_data.shipment_class === '1' && isClass1) {
					isClass1 = false
					obj[customer_code].table1.push(classNameTable('【 集荷 】'))
				}
				obj[customer_code]['table' + _data.shipment_class].push(summarys(_entry, table_name))
			})
		})

		const setTable = () => {
			// 1ページに収まりきるか
			const isOnePage = (_obj) => {
				// NG
				// yh1個 eco3個
				// yh1個 eco4個
				// yh2個 eco1個
				// yh2個 eco2個
				// yh2個 eco3個
				// yh2個 eco4個
				if (_obj.yh_count === 1) {
					if (_obj.eco_count > 2) {
						return false
					}
				} else if (_obj.yh_count === 2){
					if (_obj.eco_count > 0) {
						return false
					}
				}
				return true
			}
			let array = []
			Object.keys(obj).forEach((_key) => {
				res.size++
				if (isOnePage(cashCount[_key])) {
					const page = '_page-' + JSON.stringify(res.size)
					array.push(
						<div className="_page" id={page} style={pdfstyles._page}>
							<table cols="3" style={pdfstyles.header_table}>
								<tr>
									<td></td>
									<td style={pdfstyles.header_sub}><div>請求明細(簡易)： {obj[_key].customer_name} 御中</div></td>
									<td></td>
								</tr>
							</table>
							{obj[_key].table0}
							{obj[_key].table1}
						</div>
					)
				} else {
					let page = '_page-' + JSON.stringify(res.size)
					array.push(
						<div className="_page" id={page} style={pdfstyles._page}>
							<table cols="3" style={pdfstyles.header_table}>
								<tr>
									<td></td>
									<td style={pdfstyles.header_sub}><div>請求明細(簡易)： {obj[_key].customer_name} 御中 (1 / 2)</div></td>
									<td></td>
								</tr>
							</table>
							{obj[_key].table0}
						</div>
					)
					res.size++

					page = '_page-' + JSON.stringify(res.size)
					array.push(
						<div className="_page" id={page} style={pdfstyles._page}>
							<table cols="3" style={pdfstyles.header_table}>
								<tr>
									<td></td>
									<td style={pdfstyles.header_sub}><div>請求明細(簡易)： {obj[_key].customer_name} 御中 (2 / 2)</div></td>
									<td></td>
								</tr>
							</table>
							{obj[_key].table1}
						</div>
					)
				}
			})
			return array
		}
		return setTable()
	}
	res.html = tables()
	return res
}

let pageData = {
	pageList: {
		page:[]
	}
}
const element = () => {

	const summary = summaryPage()
	const summary_size = summary.size

	const total_size = summary_size
	for (let i = 0, ii = total_size; i < ii; ++i) {
		pageData.pageList.page.push({word: ''})
	}

	return (
		<html>
			<body>
				{summary.html}
			</body>
		</html>
	)	
}

let html = ReactDOMServer.renderToStaticMarkup(element())
/*
const file_name = () => {
	const preview = vtecxapi.getQueryString('preview')
	const getName = () => {
		if (customer_code) {
			return shipping_yearmonth + '-' + billto_code + '-' + customer_code + '.pdf'
		} else {
			return shipping_yearmonth + '-' + billto_code + '.pdf'
		}
	}
	if (preview === '') {
		return 'preview-billing-summary-' + getName()
	} else {
		return 'billing-summary-' + getName()
	}
}

// PDF出力
vtecxapi.toPdf(pageData, html, file_name())
*/
vtecxapi.toPdf(pageData, html, null)