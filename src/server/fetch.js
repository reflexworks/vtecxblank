import vtecxapi from 'vtecxapi' 

const ok = function (response) {
	vtecxapi.log('resultJSON=' + JSON.stringify(response))
}

const error = function(response) {
	vtecxapi.log('resultJSON error='+JSON.stringify(response))
}

// registration配下のfeed検索(?f)
vtecxapi.fetch('/d/registration?f',{method:'GET'}).then(ok,error)

