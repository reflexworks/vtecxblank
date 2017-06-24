import reflexcontext from 'reflexcontext' 

// リソースデータ取得
const data = {'feed': {'entry': [{'title': 'Hello World'}]}}

// PDF出力
reflexcontext.toPdf(data, '/pdf/hello_world.html', 'test.pdf')
