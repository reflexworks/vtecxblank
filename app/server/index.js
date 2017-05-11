import main from './main';

//alert(main());

var reflexcontext = require('reflexcontext');

reflexcontext.log('result='+main());

var ok = function(response) {
    ReflexContext.log('check1');
        reflexcontext.log('resultJSON='+JSON.stringify(response));
    ReflexContext.log('check2');
}

var err = function(response) {
    ReflexContext.log('check3');
        reflexcontext.log('resultJSONErr='+JSON.stringify(response));
    ReflexContext.log('check4');
}

    reflexcontext.fetch('/d/registration/1?e',{method:'GET'}).then(ok,err);

reflexcontext.sendError(200,'error!!!');



