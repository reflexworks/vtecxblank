var xlsperson_get = function() {

	// xlsテンプレートの指定があればxls出力
	var parameter = ReflexContext.parameter("_templatexls");
	if (parameter) { 
		ReflexContext.toXls(feed);
	}

}