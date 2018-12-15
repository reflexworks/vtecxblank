/* メール送信サンプル
   これを実行するには、properties.xmlにメール送信設定を行う必要があります。
*/
import * as vtecxapi from 'vtecxapi'

const mailentry = {
  entry: {
    title: 'sendmail テスト',
    summary: 'hello text mail',
    content: {
      ______text:
        '<html><body>hello html mail <img src="CID:/_html/img/ajax-loader.gif"></body></html>',
    },
  },
}

const to = ['xxxx@xxx']
const cc = ['xxxx@xxx']
const bcc = ['xxxx@xxx']
const attachments = ['/_html/img/vtec_logo.png']

vtecxapi.sendMail(mailentry, to, cc, bcc, attachments)
