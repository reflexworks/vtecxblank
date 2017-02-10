$(function(){

	setHobbyList();
	
	$('#add').click(function(){
		
		$('#messeage_s, #messeage_e').hide();
		
		var data = {'feed': {'entry': []}};
		var inputData = {};
		var userData = {
			'id': parseInt($('#id').val()),
			'email': $('#email').val()
		}
		var favoriteData = {
			'food': $('#food').val(),
			'music': $('#music').val()
		};
		var hobbyData = getHobbyData();
		inputData.userinfo = userData;
		inputData.favorite = favoriteData;
		inputData.hobby = hobbyData;
		data.feed.entry.push(inputData);

		$.ajax({
			url: '/d/registration',
			method: 'post',
			dataType: 'json',
			data: JSON.stringify(data)
		}).done(function( res ) {
			$('#messeage_s').show().html('登録に成功しました。一覧で確認してください。');
		}).fail(function( jqXHR, textStatus, errorThrown ) {
			$('#messeage_e').show().html('登録に失敗しました。\nエラーメッセージ：' + jqXHR.responseText);
		});
		
		return false;
	});
});
// 趣味一覧初期処理
function setHobbyList(){
	var hobbyTepmTr = '<tr>'+
		'<td><select class="form-control"><option></option><option>屋内</option><option>屋外</option><option>その他</option></select></td>'+
		'<td><input type="text" class="form-control"></td>'+
	'</tr>';
	$('#hobby').find('tbody').html(hobbyTepmTr);
	$('#add_list').click(function(){
		$('#hobby').find('tbody').append(hobbyTepmTr);
	});
}
// 趣味情報の取得
function getHobbyData() {
	var array = [];
	var $list = $('#hobby').find('tbody').find('tr');
	for (var i = 0, ii = $list.length; i < ii; ++i) {
		var typeVal = $list.eq(i).find('select').val();
		var nameVal = $list.eq(i).find('input[type="text"]').val();
		if (typeVal) {
			array.push({'type': typeVal, 'name': nameVal});
		}
	}
	return array;
}
