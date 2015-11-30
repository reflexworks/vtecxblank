$(function(){
	
	var thisHref;
	var doInclude = function(href){
		
		if (href && href !== '#') {

			href = href.replace('#', '')

				// 現在のページの場合、インクルードしない
			if  (thisHref === href) return false;

			if (href === 'logout') {
				// ログアウトの場合はログイン画面へ遷移する

				$.ajax({
					url: '/d/?_logout',
					method: 'get',
					dataType: 'html'
				}).done(function( res ) {
					location.href = 'login.html';
				}).fail(function( jqXHR, textStatus, errorThrown ) {
		//          console.log( 'ERROR', jqXHR, textStatus, errorThrown );
					location.href = 'login.html';
				});

			} else {
				$('#page').load(href+'.html');
				thisHref = href;
			}
		}
	}
	
	// インクルード処理
	$('#sidebar-nav').find('li').find('a').click(function(){
		doInclude($(this).attr('href'));
	});
	
	// 初期読み込み
	if (!location.hash || location.hash === '#') {
		// デフォルトページ設定
		location.hash = '#demo_input';
	}
	doInclude(location.hash);

	// サイドバーを開閉する
	$("#menu-toggle").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});

});
