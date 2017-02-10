$(function(){

	// 新規アカウント登録
	$('#change_btn').click(function(){

		var password = $('#password').val();
		var re_password = $('#re_password').val();
		
	    if (!checkLoginPassword(password)) {
	    	$('#error_check_mgs').show();
	    	return false;
	    } else {
	    	$('#error_check_mgs').hide();
	    }

	    if (isSuccess(password, re_password)) {
			var data_array = [];
			var data = {'contributor': [{'uri': 'urn:vte.cx:auth:,'+ getHashPass(password) +''}]};
			data_array.push(data)
			var reqData = getFeed(data_array);
			$.ajax({
				type: 'put',
				url: '/d/?_changephash',
				dataType: 'json',
				data: JSON.stringify(reqData),
				success: function(data, status, xhr){
					showSendMesseage();
				},
				error: function(jqXHR, textStatus, errorThrow){
					$('#error_mgs').show();
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
function isSuccess(p, rp){
	if (p && rp && p === rp) {
		return true;
	}
	return false;
}

// パスワード変更完了フォームを表示する
function showSendMesseage(){
	$('#change_form').hide();
	$('#compleate_change_form').show();
}