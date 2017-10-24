import reflexcontext from 'reflexcontext' 
import React from 'react'
import ReactDOMServer from 'react-dom/server'

const element = (
	<h3> Hello, World! </h3> 
)

const html = ReactDOMServer.renderToStaticMarkup(element)

reflexcontext.doResponseHtml(html)



