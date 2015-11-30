var person_pdf_get = function() {

	var json = '{"feed" : {"entry" : [{"favorite" : {"food" : "ラーメン"}}]}}';
	var data = JSON.parse(json);

	// pdfテンプレートの指定があればpdf出力
	var parameter = ReflexContext.parameter("_templatepdf");
	if (parameter) { 	
		ReflexContext.toPdf(data);
	}

}