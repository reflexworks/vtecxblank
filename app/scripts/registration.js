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

 	var param = window.location.href.slice(window.location.href.indexOf('?') + 1);
 	if (param === 'error') {
		$('#error_mgs').show();
	} else if (param === 'error_already') {
		$('#error_already_mgs').show();
	} else if (param === '500') {
		alert('通信エラーが発生しました。\nステータスコード：500');
	}

	// 新規アカウント登録
	$('#regist_btn').click(function(){

		var email = $('#email').val();
		var password = $('#password').val();
		
	    if (!checkLoginPassword(password)) {
	    	$('#error_check_mgs').show();
	    	return false;
	    } else {
	    	$('#error_check_mgs').hide();
	    }

	    if (isSuccess(email, password)) {
			var data_array = [];
			var data = {'contributor': [{'uri': 'urn:vte.cx:auth:'+ email +','+ getHashPass(password) +''}]};
			data_array.push(data)
			var reqData = getFeed(data_array);
			$.ajax({
				type: 'post',
				url: '/d/?_adduser&' + getCaptchaOpt(),
				dataType: 'json',
				data: JSON.stringify(reqData),
				success: function(data, status, xhr){
					showSendMesseage();
				},
				error: function(jqXHR, textStatus, errorThrow){
					var status = jqXHR.status;
					if (status === 500) {
						location.href = 'registration.html?500';
					} else {
						var resText = jqXHR.responseJSON.feed.title;
						if (resText.indexOf('User is already registered') !== -1) {
							location.href = 'registration.html?error_already';
						} else {
							location.href = 'registration.html?error';
						}
					}
				}
			});
		} else {
			$('#error_mgs').show();
		}
		return false;
	});

});

//feed形式のdataを返す
//dataの型は配列にすること
function getFeed(array){
	return {'feed': {'entry': array}};
}

//パスワードのバリデーションチェックを行う
function checkLoginPassword(pass) {
	if (pass.match('^(?=.*?[0-9])(?=.*?[a-zA-Z])(?=.*?[!-/@_])[A-Za-z!-9@_]{8,}$')) {
		return true;
	} else {
		return false;
	}
}

//ハッシュ化したパスワードを取得する
function getHashPass(pass){
	var shaObj = new jsSHA(pass, "ASCII");
	return shaObj.getHash("SHA-256", "B64");
}

// 入力した値が正常かどうか判定する
function isSuccess(e, p){
	if (e && p) {
		return true;
	}
	return false;
}

// 仮登録送信完了フォームを表示する
function showSendMesseage(){
	$('#regist_form').hide();
	$('#regist_send_form').show();
}
