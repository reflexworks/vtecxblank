import * as vtecxapi from 'vtecxapi'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'

const element = (
	<h3> Hello, World!</h3>
)

const html = ReactDOMServer.renderToStaticMarkup(element)

vtecxapi.doResponseHtml(html)
