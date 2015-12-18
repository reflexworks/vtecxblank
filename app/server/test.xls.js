module.exports = function() {

	  var data = {"feed" : {"entry" : [{"userinfo" : {"id" : 123,"email" : "foo@bar.com"}},{"favorite" : {"food" : "ラーメン","music" : ["ジャズ","ポップス","ロック"]}}]}};

	  // XLS出力
	  ReflexContext.toXls(data, '/xls/person_template.xls', 'test.xls');

}