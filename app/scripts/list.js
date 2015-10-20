var _url = '/d/registration'; // 取得URL
var _pageindex = 0;
var _activePage = 1;
var _maxSize = 10;

$(function(){
	// 一覧取得処理
	getFeed(1);
});

function getFeed(page){

	// 初期処理
	initialSetting(page).then(function(){
		// 件数取得とページング生成
		getCount();
		// リストデータ取得と一覧生成
		getList(page);
	});

}

function initialSetting(page) {
	var d = new $.Deferred();

	//　ページング取得に必要な設定を行う
	var param;
	var pageindex = page + 9 > _pageindex ? page + 9 : _pageindex;
	if (pageindex > _pageindex) {
		if (_pageindex > 1) {
			param = _pageindex + ',' + pageindex;
		} else {
			param = pageindex;
		}
		$.getJSON(_url + '?f&l=' + _maxSize + '&_pagination=' + param, function(){
			_pageindex = pageindex;
			d.resolve();
		}); 
	} else {
		d.resolve();
	}
	return d.promise();
}

function getCount(){
	// 通信先の件数を取得する
	$.ajax({
		url: _url + '?c',
		method: 'get',
		dataType: 'json'
	}).done(function(res) {
		var count = res.feed.title;
		//ページネーション作成
		setPagination('.pagination', count);
	}).fail(function( jqXHR, textStatus, errorThrown ) {
	});
}

function setPagination(id, countData){

	var $pagination = $(id);
	var pagesize = _maxSize;
	var activePage = _activePage;
	var maxpage = Math.ceil(parseInt(countData) / pagesize);
	var startPage = (activePage - 5) < 0 ? 0 : activePage - 5;
	var endPage = (startPage + 10) > maxpage ? maxpage : startPage + 10;
	if ((endPage - startPage) < 10) {
		startPage = endPage - 10;
	}
	if (startPage < 0) startPage = 0;
	var setPage = function(i){
		return '<li class="page" data-page="'+ (i+1) +'"><a href="#">'+ (i+1) +'</a></li>';
	}
	var setPageobj = function (pages){
		return ''+
		'<li class="skip_previous disabled"><a href="#" aria-label="Previous"><span aria-hidden="true"><i class="glyphicon glyphicon-step-backward"></i></span></a></li>'+
		'<li class="previous disabled"><a href="#" aria-label="Previous"><span aria-hidden="true"><i class="glyphicon glyphicon-triangle-left"></i></span></a></li>'+
		pages+
		'<li class="next disabled"><a href="#" aria-label="Next"><span aria-hidden="true"><i class="glyphicon glyphicon-triangle-right"></i></span></a></li>'+
		'<li class="skip_next disabled"><a href="#" aria-label="Next"><span aria-hidden="true"><i class="glyphicon glyphicon-step-forward"></i></span></a></li>'+
		 '';
	};
	var array = [];
	for (var i = startPage, ii = endPage; i < ii; ++i) {
		array.push(setPage(i));
	}
	$pagination.html(setPageobj(array.join('')));
	$('.all_count').html(countData);
	$('.start_count').html(((activePage - 1) * pagesize)+1);
	$('.end_count').html(activePage*pagesize > parseInt(countData) ? parseInt(countData) : activePage*pagesize);
	
	// クラス設定
	if (activePage > 1) {
		$pagination.find('li.skip_previous, li.previous').removeClass('disabled');
	}
	if (maxpage > 1 && activePage < maxpage) {
		$pagination.find('li.skip_next, li.next').removeClass('disabled');
	}
	for (var i = 0, ii = $pagination.length; i < ii; ++i) {
		$pagination.eq(i)
			.find('li.page[data-page="'+ activePage +'"]').addClass('active');
	}
	// クリック設定
	$pagination.find('li').click(function(){
		var className = $(this).attr('class');
		var pageNo = $(this).attr('data-page');
		var notDisabled = false;
		var getPage;
		if (className.indexOf('page') != -1) {
			// 現在のページではない場合
			if (className.indexOf('active') == -1) {
				getPage = parseInt(pageNo);
				notDisabled = true;
			}
		} else {
			// 非活性ではない場合
			if (className.indexOf('disabled') == -1) {
				if (className.indexOf('skip_previous') != -1) {
					getPage = 1;
				} else if (className.indexOf('previous') != -1) {
					getPage = activePage - 1;
				} else if (className.indexOf('skip_next') != -1) {
					getPage = maxpage;
				} else if (className.indexOf('next') != -1) {
					getPage = activePage + 1;
				}
				notDisabled = true;
			}
		}
		if (notDisabled) {
			_activePage = getPage;
			getFeed(getPage);
		}
		return false;
	});
}

function getList(page){
	// 一覧取得
	$.ajax({
		url: _url + '?f&l='+ _maxSize +'&n='+page,
		method: 'get',
		dataType: 'json'
	}).done(function(res) {
		if(res) {
			// 一覧作成
			setTable(res);
		}
	}).fail(function( jqXHR ) {
    	location.href = 'login.html';	        	
	});
}

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
