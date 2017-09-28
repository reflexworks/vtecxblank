import reflexcontext from 'reflexcontext' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/pdfstyles2.js'

const invoice = { number : '00001', date: '2017/8/31',customer_name:'お客さま',jobtitle:'講演料',src_name:'(有)バーチャルテクノロジー',src_zip:'105-0014',src_address:'東京都港区芝3-2-11-1003',src_tel:'03-3451-4179',subtotal:'1,000,000',salestax:'80,000',total:'1,080,000',content:'講演日：2017/8/25'}
invoice.item = []
const item = { name : '講演',description:'LT',quantity:'1',unit_price:'1,000,000',line_total:'1,000,000'}
invoice.item.push(item)

const element = (
	<html>
		<body>
			<div className="_page" style={pdfstyles._page}>
				<table cols="7" style={pdfstyles.widths}>
					<tr>
						<td style={pdfstyles.titleLeft}>
						</td> 
						<td colSpan="5" style={pdfstyles.borderTop}>
							<span style={pdfstyles.title}>御請求書21</span>
						</td>
						<td style={pdfstyles.titleRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colSpan="5" style={pdfstyles.borderRight}>
							<div>御請求No : {invoice.number}</div>
							<div>発行日: {invoice.date}</div>
							<br />
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colSpan="2" style={pdfstyles.fontsize12}>
							<span>{invoice.customer_name}</span>
							<span>　御中</span>
							<br />
						</td>
						<td colSpan="2">
						</td>
						<td colSpan="1" align="right" valign="middle">
							<img src="/img/vtec_logo.png" width="110.0" height="40.0"/> 
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colSpan="2" style={pdfstyles.fontsize12UL}>
							<div>件　名：{invoice.jobtitle}</div>
						</td>
						<td colSpan="3" style={pdfstyles.fontsize10R}>
							<div>{invoice.src_name}</div>
                
							<div>
								<span>〒</span>
								<span>{invoice.src_zip}</span>
								<br/>
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

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colSpan="4" align="left">
							<br />
							<br />
							<div>下記の通り御請求申し上げます。</div>
							<br />
							<div style={pdfstyles.fontsize15U}>御請求金額：￥
								<span style={pdfstyles.fontsize15U}>{invoice.total}</span>
								<span style={pdfstyles.fontsize15U}> -</span>
							</div>
							<br />
							<br />
						</td>
						<td colSpan="1" align="right" id="stamp">
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td style={pdfstyles.tableTd}>
							<span>No</span>
						</td>
						<td style={pdfstyles.tableTd}>
							<span>品名</span>
						</td>
						<td style={pdfstyles.tableTd}>
							<span>数量</span>
						</td>
						<td style={pdfstyles.tableTd}>
							<span>単価(円)</span>
						</td>
						<td style={pdfstyles.tableTd}>
							<span>金額(円)</span>
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td style={pdfstyles.tdCenter}>
							<span>1</span>
						</td>
						<td style={pdfstyles.tdLeft}>
							<span>{invoice.item[0].name}</span>　
							<span>{invoice.item[0].description}</span>
						</td>
						<td style={pdfstyles.tdCenter}>
							<span>{invoice.item[0].quantity}</span>　
						</td>
						<td style={pdfstyles.tdRight}>
							<span></span>
							<span>{invoice.item[0].unit_price}</span>
						</td>
						<td style={pdfstyles.tdRight}>
							<span></span>
							<span>{invoice.item[0].line_total}</span>
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colSpan="5" style={pdfstyles.td}>
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colSpan="3" style={pdfstyles.tdRight}>
							<span>小計</span>
						</td>
						<td colSpan="2" style={pdfstyles.tdRight}>
                			￥{invoice.subtotal}-
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colSpan="3" style={pdfstyles.tdRight}>
							<span>消費税</span>
						</td>
						<td colSpan="2" style={pdfstyles.tdRight}>
                			￥{invoice.salestax}-
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td colSpan="3" style={pdfstyles.tdRight}>
							<span>御請求金額</span>
						</td>
						<td colSpan="2" style={pdfstyles.tdRight}>
			                ￥{invoice.total}-
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td height="25" colSpan="5" >
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td  colSpan="5" style={pdfstyles.tdLeftb}>
							<span>備考</span>
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr style={pdfstyles.fontsize10}>
						<td style={pdfstyles.spaceLeft}>
						</td>
						<td  colSpan="5" style={pdfstyles.tdLeft}>
							{invoice.content}
							<br />
						</td>
						<td style={pdfstyles.spaceRight}>
						</td>
					</tr>

					<tr>
						<td colSpan="7" style={pdfstyles.borderBottom}>
						</td>
					</tr>
					
				</table>
			</div>
		</body>
	</html>

)

let html = ReactDOMServer.renderToStaticMarkup(element)

//html = html.replace('left:15px;right:15px;top:15px;bottom:15px;','left:15;right:15;top:15;bottom:15;')

// HTML出力
//reflexcontext.doResponseHtml(html)

// PDF出力
reflexcontext.toPdf({}, html, 'test.pdf')




