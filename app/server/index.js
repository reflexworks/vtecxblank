import main from './main'

//alert(main());

var reflexcontext = require('reflexcontext')

reflexcontext.log('result='+main())

/*
var ok = function (response) {
	reflexcontext.log('resultJSON=' + JSON.stringify(response))
}

var err = function(response) {
	ReflexContext.log('check3')
    reflexcontext.log('resultJSONErr='+JSON.stringify(response))
    ReflexContext.log('check4')
}

reflexcontext.fetch('/d/registration',{method:'GET'}).then(ok,err)
*/
reflexcontext.sendErrorMsg(400, 'error error!!!')




