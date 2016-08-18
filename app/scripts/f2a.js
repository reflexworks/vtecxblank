
function f2a(templ,src) {

	var arrayval = [];
	for ( var i = 0; i < 15; i++) {
		arrayval[i] = null;
	}

    var N = t2m(templ);
	arrayval[14] = [];
	for ( var i = 0; i < src.feed.entry.length; i++) {
		arrayval[14][i] = e2a(N, 'entry', src.feed.entry[i]);
	}
//    console.log(arrayval);
	return arrayval;
}

function e2a(M, parent, value) {
	var result = [];

	for ( var key in value) {
		if ((typeof value[key]) == "object") {
			if (value[key].length != undefined) {
				var a = [];
				for ( var i = 0; i < value[key].length; i++) {
					a[i] = e2a(M[parent], key, value[key][i]);
				}
				result[M[parent][key]._[0]] = a;
			/*			
			} else {
			if (value[key] instanceof Array) {
				var b = [];
				for ( var i = 0; i < value[key].length; i++) {
    				var a = [];
					a.push(value[key][i]);
					b[i]= a;
				}
				result[M[parent][key]._[0]] = b;
			*/
			} else {
				result[M[parent][key]._[0]] = e2a(M[parent], key, value[key]);
			}
		} else {
    		if (M[parent][key]) {
    			result[M[parent][key]._[0]] = value[key];
    		}
		}
	}

	var i = 0;
	for (var v in M[parent]) {
		if (v != '_') {
			if (result[i]==undefined){
				result[i] = null;
			}
			i++;
		}
	}

	return result;
};


var FIELD_PATTERN = /^( *)([a-zA-Z_$][0-9a-zA-Z_$.]*)(?:\(([a-zA-Z$]+)\))?((?:\[([0-9]+)?\]|\{([\-0-9]*)~?([\-0-9]+)?\})?)(\!?)(?:=(.+))?$/

function t2m(templ) {
	var ATOM_ENTRY_TEMPLATE = [
		"author{}",
		" name",
		" uri",
		" email",
		"category{}",
		" ___term",
		" ___scheme",
		" ___label",
		"content",
		" ___src",				// 下に同じ
		" ___type",				// この項目はContentクラスのvalidate(group)において$contentグループに属しているかのチェックをしている
		" ______text",				// 同上
		"contributor{}",
		" name",
		" uri",
		" email",
		"id",
		"link{}",
		" ___href",
		" ___rel",
		" ___type",
		" ___title",
		" ___length", 
		"published",
		"rights",
		"rights____type",
		"summary",
		"summary____type",
		"title",
		"title____type",
		"subtitle",
		"subtitle____type",
		"updated"
	  ];

	var template = ATOM_ENTRY_TEMPLATE;

	for ( var i = 0; i < templ.length; i++) {
		if (templ[i].length>0) {
			template.push(templ[i]);
		}
	}

	var result = {
		'entry' : {}
	};

	var k = 0;
	for ( var i = 0; i < template.length; i++) {
        var prop = template[i].replace(FIELD_PATTERN, "$2");
        var indp = template[i].replace(FIELD_PATTERN, "$1").length;
		var p = template[i].replace(/^\s+|\[\]|{}|!|\s+$/g,'');
		if (indp == 0) {
            result['entry'][prop] = t2m2(template, i, p)[prop];
            result['entry'][prop]['_'] = [];
            result['entry'][prop]['_'][0] = k;
            result['entry'][prop]['_'][1] = p;
			k++;            
        }
	};
	return result;
}

function t2m2(template, i, ancestor) {
	var result = {};
    var parent = template[i].replace(FIELD_PATTERN, "$2");
    var indp   = template[i].replace(FIELD_PATTERN, "$1").length;
    var k      = 0;
    var l      = template.length;
    result[parent] = {};
    for ( var j = i + 1; j < l; j++) {
        var prop = template[j].replace(FIELD_PATTERN, "$2");
        var indc = template[j].replace(FIELD_PATTERN, "$1").length;
        if ( indc == (indp + 1) )  {
			var p = ancestor+'.'+template[j].replace(/^\s+|\[\]|{}|\s+$/g,'');
            result[parent][prop] = t2m2(template, j, ancestor)[prop];
            result[parent][prop]['_'] = [];
            result[parent][prop]['_'][0] = k;
            result[parent][prop]['_'][1] = p;
            k++;
        } else if (indc <= indp) {
            return result;
        }
    }
    return result;
}
