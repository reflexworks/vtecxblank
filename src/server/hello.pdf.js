import vtecxapi from 'vtecxapi' 

// リソースデータ取得
const data = {'feed': {'entry': [{'title': 'Hello World'}]}}

// PDF出力
vtecxapi.toPdf(data, '/pdf/hello_world.html', 'test.pdf')