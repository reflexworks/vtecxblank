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
