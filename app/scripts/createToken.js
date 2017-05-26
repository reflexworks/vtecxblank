/**
 * 認証用トークン作成サービス
 */
import jsSHA from 'jssha'

export default function createToken(username, password) {

// aardwulf systems
// This work is licensed under a Creative Commons License.
// http://www.aardwulf.com/tutor/base64/
// TITLE
// TempersFewGit v 2.1 (ISO 8601 Time/Date script) 
//
// OBJECTIVE
// Javascript script to detect the time zone where a browser
// is and display the date and time in accordance with the 
// ISO 8601 standard.
//
// AUTHOR
// John Walker 
// http://321WebLiftOff.net
// jfwalker@ureach.com
//
// ENCOMIUM
// Thanks to Stephen Pugh for his help.
//
// CREATED
// 2000-09-15T09:42:53+01:00 
//
// REFERENCES
// For more about ISO 8601 see:
// http://www.w3.org/TR/NOTE-datetime
// http://www.cl.cam.ac.uk/~mgk25/iso-time.html
//
// COPYRIGHT
// This script is Copyright  2000 JF Walker All Rights 
// Reserved but may be freely used provided this colophon is 
// included in full.
//

	function encode64(r){var a,t,e,n,s,h='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',o='',c='',d='',f=0;do a=r.charCodeAt(f++),t=r.charCodeAt(f++),c=r.charCodeAt(f++),e=a>>2,n=(3&a)<<4|t>>4,s=(15&t)<<2|c>>6,d=63&c,isNaN(t)?s=d=64:isNaN(c)&&(d=64),o=o+h.charAt(e)+h.charAt(n)+h.charAt(s)+h.charAt(d),a=t=c='',e=n=s=d='';while(f<r.length);return o}function isodatetime(){var time,r=new Date,a=r.getYear();2e3>a&&(a+=1900);var t=r.getMonth()+1,e=r.getDate(),n=r.getHours(),s=r.getUTCHours(),h=n-s;h>12&&(h-=24),-12>=h&&(h+=24);var o,c,d=Math.abs(h),f=r.getMinutes(),u=r.getUTCMinutes(),i=r.getSeconds();return f!=u&&30>u&&0>h&&d--,f!=u&&u>30&&h>0&&d--,o=f!=u?':30':':00',c=10>d?'0'+d+o:''+d+o,c=0>h?'-'+c:'+'+c,9>=t&&(t='0'+t),9>=e&&(e='0'+e),9>=n&&(n='0'+n),9>=f&&(f='0'+f),9>=i&&(i='0'+i),time=a+'-'+t+'-'+e+'T'+n+':'+f+':'+i+c,time}function b64_sha1(r){return binb2b64(core_sha1(str2binb(r),r.length*chrsz))}function safe_add(r,a){var t=(65535&r)+(65535&a),e=(r>>16)+(a>>16)+(t>>16);return e<<16|65535&t}function rol(r,a){return r<<a|r>>>32-a}function sha1_ft(r,a,t,e){return 20>r?a&t|~a&e:40>r?a^t^e:60>r?a&t|a&e|t&e:a^t^e}function sha1_kt(r){return 20>r?1518500249:40>r?1859775393:60>r?-1894007588:-899497514}function binb2b64(r){for(var a='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',t='',e=0;e<4*r.length;e+=3)for(var n=(r[e>>2]>>8*(3-e%4)&255)<<16|(r[e+1>>2]>>8*(3-(e+1)%4)&255)<<8|r[e+2>>2]>>8*(3-(e+2)%4)&255,s=0;4>s;s++)t+=8*e+6*s>32*r.length?b64pad:a.charAt(n>>6*(3-s)&63);return t}function core_sha1(r,a){r[a>>5]|=128<<24-a%32,r[(a+64>>9<<4)+15]=a;for(var t=Array(80),e=1732584193,n=-271733879,s=-1732584194,h=271733878,o=-1009589776,c=0;c<r.length;c+=16){for(var d=e,f=n,u=s,i=h,_=o,b=0;80>b;b++){16>b?t[b]=r[c+b]:t[b]=rol(t[b-3]^t[b-8]^t[b-14]^t[b-16],1);var g=safe_add(safe_add(rol(e,5),sha1_ft(b,n,s,h)),safe_add(safe_add(o,t[b]),sha1_kt(b)));o=h,h=s,s=rol(n,30),n=e,e=g}e=safe_add(e,d),n=safe_add(n,f),s=safe_add(s,u),h=safe_add(h,i),o=safe_add(o,_)}return Array(e,n,s,h,o)}function str2binb(r){for(var a=Array(),t=(1<<chrsz)-1,e=0;e<r.length*chrsz;e+=chrsz)a[e>>5]|=(r.charCodeAt(e/chrsz)&t)<<32-chrsz-e%32;return a}var chrsz=8,b64pad='='
  
	var _count_str = 0        
	var getWsseObj = function(Password, Token) {
		var PasswordDigest, Nonce, Created, shaObj, nonceEncoded
		var r = new Array
		var datatime = isodatetime()

		_count_str++

		if (!Token) Token = ''
		Nonce = b64_sha1(datatime + 'There is more than words' + _count_str)
		nonceEncoded = encode64(Nonce)
		Created = datatime

		shaObj = new jsSHA('SHA-256', 'TEXT')
		shaObj.update(Token + Nonce + Created + Password)
		PasswordDigest = shaObj.getHash('B64')

		r[0] = nonceEncoded
		r[1] = Created
		r[2] = PasswordDigest
		return r
	}

    // WSSEオブジェクト作成：固定値のAPIキーなし
	var getWsse = function(username, password){
		var w = getWsseObj(password, null)
		return 'UsernameToken Username="' + username + '", PasswordDigest="' + w[2] + '", Created="' + w[1] + '", Nonce="' + w[0] + '"'
	}
	return getWsse(username, password)
}

