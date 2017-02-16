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
	} else if (param === '500') {
		alert('通信エラーが発生しました。\nステータスコード：500');
	}

 	// パスワード変更メール送信
	$('#forgot_btn').click(function(){

		var email = $('#email').val();
		
		if (isSuccess(email)) {
			var data_array = [];
			var data = {'contributor': [{'uri': 'urn:vte.cx:auth:'+ email}]};
			data_array.push(data);
			var reqData = getFeed(data_array);
			$.ajax({
				type: 'post',
				url: '/d/?_passreset&' + getCaptchaOpt(),
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
						location.href = 'forgot_password.html?error';
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

// 入力した値が正常かどうか判定する
function isSuccess(e){
	if (e) {
		return true;
	}
	return false;
}

// 送信完了フォームを表示する
function showSendMesseage(){
	$('#forgot_form').hide();
	$('#forgot_send_form').show();
}