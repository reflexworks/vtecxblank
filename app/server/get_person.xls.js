module.exports = function() {

	var json = '{"feed" : {"entry" : [{"userinfo" : {"id" : 123,"email" : "foo@bar.com"}},{"favorite" : {"food" : "ラーメン","music" : ["ジャズ","ポップス","ロック"]}}]}}';
	var data = JSON.parse(json);

	// xlsテンプレートの指定があればxls出力
	var parameter = ReflexContext.parameter("_templatexls");
	if (parameter) { 
		ReflexContext.toXls(data);
	}

}