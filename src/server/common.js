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
