module.exports = function () {

	  // リソースデータ取得
	  var data = {'feed': {'entry': [{'title': 'Hello World'}]}};

	  // PDF出力
	  ReflexContext.toPdf(data, '/pdf/hello_world.html', 'test.pdf');

}