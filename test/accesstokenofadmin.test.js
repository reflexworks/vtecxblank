import should from 'should'
import axios from 'axios'
import getAuthToken from './getAuthToken.js'

describe('AccesstokenOfAdmin', function () {
	let cookie = {}

	it('login', function (done) {

		const authToken = getAuthToken(process.env.ADMINACCOUNT,process.env.ADMINPASSWORD)

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

	it('accesstoken', function (done) {

		axios({
			url: 'https://admin.vte.cx/d/?_accesstoken',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Cookie': cookie
			}
		}).then((result) => {
			console.log('admin account\'s accesstoken='+result.data.feed.title)
			done()
		}).catch((error) => {
			should.fail('?_accesstoken failed. reason:'+error.response.status+' '+error.response.statusText+' '+JSON.stringify(error.response.data))
			done()
		})

	})

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

	it('accesstoken', function (done) {

		axios({
			url: 'https://admin.vte.cx/d/?_accesstoken',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Cookie': cookie
			}
		}).then((result) => {
			console.log('service account\'s accesstoken='+result.data.feed.title)
			done()
		}).catch((error) => {
			should.fail('?_accesstoken failed. reason:'+error.response.status+' '+error.response.statusText+' '+JSON.stringify(error.response.data))
			done()
		})

	})

	
})
