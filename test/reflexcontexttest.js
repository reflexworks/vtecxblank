var reflexContext = require('reflexContext');

reflexContext.get({
        url: '/d/registration'
    }).then(function(data){
        // ������
        console.log(data);
    }, function(err){
        // ���s��
        console.log('err', err);
    });
   
