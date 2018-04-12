import should from 'should'
import axios from 'axios'
import getAuthToken from './getAuthToken.js'

describe('Servicetoproduction', function () {

	let cookie = {}
	let cookie2 = {}

	it('loginToService', function (done) {

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

	/**
     * toproduction
     */
	it('updatetoproduction', function (done) {
		axios({
			url: 'https://admin.vte.cx/d/?_servicetoproduction='+process.env.SERVICE,
			//url: 'https://admin.vte.cx/d/?_servicetostaging='+process.env.SERVICE,
			method: 'put',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Cookie': cookie
			}
		}).then((result) => {
			result.data.feed.title.should.containEql('The service has been \'production\' status.')
			console.log(result.data.feed.title)
			done()
		}).catch((error) => {
			console.log('can\'t toproduction. reason:'+error.response.status+' '+error.response.statusText+' '+JSON.stringify(error.response.data))
			done()
		})
	})


})