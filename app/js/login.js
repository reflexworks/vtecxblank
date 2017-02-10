//キャプチャ設定
var reCaptchaWidget;
var onloadCallback = function() {
	reCaptchaWidget = grecaptcha.render('captcha', {
		'sitekey' : '6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19' 
	});
};
//キャプチャオプションを取得する
function getCaptchaOpt(){
	return 'g-recaptcha-response='+grecaptcha.getResponse(reCaptchaWidget);
}

$(function(){

  var captchaon = false;
  $('#captcha').hide();
  var param = window.location.href.slice(window.location.href.indexOf('?') + 1);
  if (param=='error') {
    $('#error_mgs').show();
  } else if (param=='error_create_service') {
    $('#error_create_service_mgs').show();
  } else if (param=='errorcaptca'){
    $('#error_mgs').show();
    captchaon = true;
    $('#captcha').show();
  }
  $('#login_btn').click(function(){
    doSubmit();
  });

  $('#password').keypress( function ( e ) {
    if ( e.which == 13 ) {
      doSubmit();
    }
  });

  var doSubmit = function () {
    $('#error_mgs').hide();
    var account = $('#account').val();
    var password = getHashPass($('#password').val());
    var wsseToken = $.createToken(account, password);
    
    var captchaOpt = captchaon ? '&' + getCaptchaOpt() : '';

    $.ajax({
      url: '/d/?_login' + captchaOpt,
      method: 'get',
      dataType: 'html',
      headers: {
        'X-WSSE': wsseToken,
      },
    }).done(function( res ) {
	      location.href = 'index.html';
    }).fail(function( jqXHR ) {
      var json = JSON.parse(jqXHR.responseText);
      if (json.feed.title=='Captcha required at next login.') {
        location.href = 'login.html?errorcaptca'; 
      }else {
        location.href = 'login.html?error'; 
      }
    });
  }
});

//ハッシュ化したパスワードを取得する
function getHashPass(pass){
	var shaObj = new jsSHA(pass, "ASCII");
	return shaObj.getHash("SHA-256", "B64");
}

