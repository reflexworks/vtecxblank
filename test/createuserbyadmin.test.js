import should from 'should'
import axios from 'axios'
import jsSHA from 'jssha'
import getAuthToken from './getAuthToken.js'

describe('CreateUserByAdmin', function () {

	let uid

	/**
	 * user作成時に/#/addusertestフォルダが作成されるための準備
	 */
	it('put_settings', function (done) {
		
		let reqdata = {
			'feed': {
				'entry': [{
					'link':
					[{ '___rel': 'self', '___href': '/_settings/adduser' }],
					'content': { '______text': '/#/addusertest' }
				}]
			}
		}

		axios({
			url: 'https://admin.vte.cx/d/',
			method: 'put',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Authorization': 'Token '+process.env.ACCESSTOKENADMIN
			},
			data : reqdata			
		}).then((result) => {
			console.log(result.data.feed.title)
			done()
		}).catch((error) => {
			console.log('can\'t updated /_settings/adduser reason:'+error.response.status+' '+error.response.statusText+' '+JSON.stringify(error.response.data))
			done()
		})
	})

	it('createuser', function (done) {

		const password = process.env.PASSWORD
		const shaObj = new jsSHA('SHA-256', 'TEXT')
		shaObj.update(password)
		const hashpass = shaObj.getHash('B64')
		
		let reqdata = {
			'feed': {
				'entry': [{
					'contributor':
					[{ 'uri': 'urn:vte.cx:auth:'+process.env.ACCOUNT+','+hashpass, 'name': 'nickname' }]
				}]
			}
		}

		axios({
			url: 'https://admin.vte.cx/d/?_adduserByAdmin',
			method: 'post',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Authorization': 'Token '+process.env.ACCESSTOKENADMIN
			},
			data : reqdata			
		}).then((result) => {
			result.data.feed.title.should.be.a.Number
			uid = result.data.feed.title
			console.log(result.data.feed.title)
			console.log(process.env.ACCOUNT + ' user is created.')
			done()
		}).catch((error) => {
			console.log('can\'t created '+process.env.ACCOUNT+' user. reason:'+error.response.status+' '+error.response.statusText+' '+JSON.stringify(error.response.data))
			done()
		})
	})

	let cookie = {}

	it('login', function (done) {

		const authToken = getAuthToken(process.env.ACCOUNT,process.env.PASSWORD)

		axios({
			url: 'https://admin.vte.cx/d/?_login',
			method: 'get',
			headers: {
				'X-WSSE': authToken,
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((result) => {
			result.data.feed.title.should.exactly('Logged in.')
			console.log(result.data.feed.title)
			cookie = result.headers['set-cookie'][0].split(';')[0]
			console.log('cookie='+cookie)
			done()
		}).catch((error) => {
			should.fail('login failed. reason:'+error.response.status+' '+error.response.statusText+' '+JSON.stringify(error.response.data))
			done()
		})

	})

	it('getuid', function (done) {

		axios({
			url: 'https://admin.vte.cx/d/?_uid',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Cookie': cookie
			}
		}).then((result) => {
			uid = result.data.feed.title
			console.log('uid='+result.data.feed.title)
			done()
		}).catch((error) => {
			should.fail('?_uid failed. reason:'+error.response.status+' '+error.response.statusText+' '+JSON.stringify(error.response.data))
			done()
		})

	})

})
