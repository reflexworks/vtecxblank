//import vtecxapi from 'vtecxapi' 

export function CommonGetFlag(_obj) {
	let flg
	if (_obj && _obj.feed.entry) {
		flg = true
	} else {
		flg = false
	}
	return flg
}

export function addFigure(numVal) {

	numVal = '' + numVal

	// 空の場合そのまま返却
	if (numVal === ''){
		return ''
	}

	/**
	 * 全角から半角への変革関数
	 * 入力値の英数記号を半角変換して返却
	 */
	const toHalfWidth = (strVal) => {
		// 半角変換
		const halfVal = strVal.replace(/[！-～]/g, (tmpStr) => {
			// 文字コードをシフト
			return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 )
		})
		return halfVal
	}

	// 全角から半角へ変換し、既にカンマが入力されていたら事前に削除
	numVal = toHalfWidth(numVal).replace(/,/g, '').trim()

	// 数値でなければnullを返却
	if ( !/^[+|-]?(\d*)(\.\d+)?$/.test(numVal) ){
		return null
	}

	// 整数部分と小数部分に分割
	let numData = numVal.toString().split('.')

	// 整数部分を3桁カンマ区切りへ
	numData[0] = Number(numData[0]).toString().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')

	// 小数部分と結合して返却
	return numData.join('.')
}

//見積書と請求書で使用
//渡された請求元の名前での判子の種類を決める
export function getStamp(_billfromName){
	let stamp = ''
	if (_billfromName.match('コネクトロジスティクス')) {
		stamp = '/img/connectlogi.png'
	} else if (_billfromName.match('CONNECTコーポレーション')) {
		stamp = '/img/connectcorp.png'
	} else if (_billfromName.match('CONNECT・EC')) {
		stamp = '/img/connectec.png'
	} else if (_billfromName.match('ネクストジェネレーション')) {
		stamp = '/img/nextgen.png'
	} else if (_billfromName.match('コネクトエクスプレス')) {
		stamp = '/img/express.png'		
	} else {
		stamp = ''
	}
	return(stamp)
}

//見積書と請求書で使用
//銀行名と口座種類に変換する
export function convertPayee (payee){
	switch (payee.bank_info) {
	case '1':
		payee.bank_info = 'みずほ銀行'	
		break
	case '2':
		payee.bank_info = '三菱東京UFJ銀行'	
		break
	case '3':
		payee.bank_info = '三井住友銀行'	
		break
	case '4':
		payee.bank_info = 'りそな銀行'	
		break
	case '5':
		payee.bank_info = '埼玉りそな銀行'	
		break
	case '6':
		payee.bank_info = '楽天銀行'	
		break
	case '7':
		payee.bank_info = 'ジャパンネット銀行'	
		break
	case '8':
		payee.bank_info = '巣鴨信用金庫'	
		break
	case '9':
		payee.bank_info = '川口信用金庫'	
		break
	case '10':
		payee.bank_info = '東京都民銀行'	
		break
	case '11':
		payee.bank_info = '群馬銀行'	
		break
	}

	if (payee.account_type === '0') {
		payee.account_type = '普通'
	} else {
		payee.account_type = '当座'
	}
	return (payee)
}