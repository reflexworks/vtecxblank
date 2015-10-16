$(function(){
	$.ajax({
		url: '/d/registration?f&l=50&n=1',
		method: 'get',
		dataType: 'json'
	}).done(function( res ) {
		if(res) {
			setTable(res);
		}
	}).fail(function( jqXHR ) {
	    location.href = 'login.html';
	});
});
function setTable(res){
	var temp = function(i, a, b, c, d){
		var setVal = function(v){
			return (v ? v : '<span style="color:#ccc;">(入力なし)</span>')
		}
		return '<tr>'+
			'<td>'+ ( i + 1 ) +'</td>'+
			'<td>'+ setVal(a) +'</td>'+
			'<td>'+ setVal(b) +'</td>'+
			'<td>'+ setVal(c) +'</td>'+
			'<td>'+ setVal(d) +'</td>'+
		'</tr>';
	}
	var array = [];
	for (var i = 0, ii = res.feed.entry.length; i < ii; ++i) {
		var entry = res.feed.entry[i];
		var userinfo = entry.userinfo;
		var favorite = entry.favorite;
		var id;
		var email;
		var food;
		var music;
		if (userinfo) {
			id = userinfo.id;
			email = userinfo.email;
		}
		if (favorite) {
			food = favorite.food;
			music = favorite.music;
		}
		array.push(temp(i, id, email, food, music));
	}
	$('#list').find('tbody').html(array.join(''));
}
