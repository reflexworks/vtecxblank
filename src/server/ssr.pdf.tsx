import * as vtecxapi from 'vtecxapi'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/pdfstyles'

interface User {
  firstName: string
  lastName: string
}

function formatName(user: User) {
  return user.firstName + ' ' + user.lastName
}

const user: User = {
  firstName: 'Harper',
  lastName: 'Perez',
}

const element = (
  <html>
    <body>
      <div className="_page" style={pdfstyles._page}>
        <table style={pdfstyles._table}>
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
vtecxapi.toPdf(1, html, 'test.pdf')
