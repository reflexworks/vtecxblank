var reflexContext = require('reflexContext');
/* @flow */ 
reflexContext.get({
        url: '/d/registration'
    }).then(function(data){
        console.log(data);
    }, function(err){
        console.log('err', err);
    });
     
  