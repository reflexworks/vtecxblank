import reflexcontext from 'reflexcontext' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/pdfstyles.js'

function formatName(user) {
	return user.firstName + ' ' + user.lastName
}

const user =  {
	firstName: 'React',
	lastName: '!'
}

const element = (
	<html>
		<body>
			<div className="_page" style={pdfstyles._page}>
				<table>
					<tr>
						<td>
							<p> We love {formatName(user)} </p> 
						</td>
					</tr>
				</table>
				<img src="/img/vtec_logo.png" width="110.0" height="40.0" /> 
			</div>
		</body>
	</html>
)

const html = ReactDOMServer.renderToStaticMarkup(element)
 
// HTML出力
//reflexcontext.doResponseHtml(html)

// PDF出力
reflexcontext.toPdf({}, html, 'test.pdf')


