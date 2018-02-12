import vtecxapi from 'vtecxapi' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'

function formatName(user) {
	return user.firstName + ' ' + user.lastName
}

const user = {
	firstName: 'Harper',
	lastName: 'Perez'
}

const element = (
	<html>
		<body>
			<div className="_page" style={{ pagesize: 'A4', orientation: 'portrait'}}>
				<table>
					<tr>
						<td>
							<p> Hello, {formatName(user)}! </p> 
						</td>
					</tr>
				</table>
			</div>
		</body>
	</html>
)

const html = ReactDOMServer.renderToStaticMarkup(element)
 
// PDF出力
vtecxapi.toPdf({}, html, 'test.pdf')