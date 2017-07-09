import reflexcontext from 'reflexcontext' 

const ok = function (response) {
	reflexcontext.log('resultJSON=' + JSON.stringify(response))
}

const error = function(response) {
	reflexcontext.log('resultJSON error='+JSON.stringify(response))
}

// registration配下のfeed検索(?f)
reflexcontext.fetch('/d/registration?f',{method:'GET'}).then(ok,error)

