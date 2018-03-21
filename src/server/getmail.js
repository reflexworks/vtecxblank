import vtecxapi from 'vtecxapi' 

const settings = new Object()
 
// 基本設定(例：yahooメール)
settings['mail.pop3.host']='pop.mail.yahoo.co.jp'
settings['mail.pop3.port'] = '995'
// タイムアウト設定
settings['mail.pop3.connectiontimeout'] = '60000'
//SSL関連設定
settings['mail.pop3.socketFactory.class']='javax.net.ssl.SSLSocketFactory'
settings['mail.pop3.socketFactory.fallback']='false'
settings['mail.pop3.socketFactory.port'] = '995'

settings['username']='xxxxx@yahoo.co.jp'
settings['password']='xxxxx'

const result = vtecxapi.getMail(settings)
vtecxapi.log(JSON.stringify(result))


