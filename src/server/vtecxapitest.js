import vtecxapi from 'vtecxapi' 

vtecxapi.log('Test OK')
vtecxapi.log('title','Test OK')
vtecxapi.log('title','subtitle','TestOK')

const querystring1 = vtecxapi.getQueryString()
vtecxapi.log('querystring1',querystring1)
const querystring2 = vtecxapi.getQueryString('param')
vtecxapi.log('querystring2',querystring2)
const uriquerystring = vtecxapi.getUriAndQuerystring()
vtecxapi.log('uriquerystring',uriquerystring)
const pathinfo = vtecxapi.getPathinfo()
vtecxapi.log('uriquerystring', pathinfo)
const contenttype = vtecxapi.getContentType()
vtecxapi.log('contenttype', contenttype)
const feed = vtecxapi.getFeed('/registration')
vtecxapi.log('feed', JSON.stringify(feed))
const entry = vtecxapi.getEntry('/registration')
vtecxapi.log('entry', JSON.stringify(entry))


try {
	const request = { feed : { entry : [{ userinfo: { id: 1, email: 'foo@bar.com' }, favorite: { food: '牛たん', music: 'J−ポップ' }, hobby: [{ type: '屋外', name: 'テニス' }, { type: '屋内', name: '卓球' }], link: [{ ___href: '/registration/101', ___rel: 'self' }] }] } }
	vtecxapi.post(request)
} catch (e) {
	vtecxapi.log('post', e.message)    
}

try {
	const request = { feed: { entry: [{ userinfo: { id: 1, email: 'foo@bar.com' }, favorite: { food: '牛たこ', music: 'J−ポップ' }, hobby: [{ type: '屋外', name: 'テニス' }, { type: '屋内', name: '卓球' }] }] } }
	vtecxapi.post(request,'/registration')
} catch (e) {
	vtecxapi.log('post2', e.message)    
}


try {
	const request = { feed : { entry : [{ userinfo: { id: 1, email: 'foo@bar.com' }, favorite: { food: '牛たえ', music: 'J−ポップ' }, hobby: [{ type: '屋外', name: 'テニス' }, { type: '屋内', name: '卓球' }], link: [{ ___href: '/registration/101', ___rel: 'self' }] }] } }
	vtecxapi.put(request)
} catch (e) {
	vtecxapi.log('put', e.message)    
}

vtecxapi.delete('/registration/101')
try {
	vtecxapi.deleteFolder('/registration/101')
} catch (e) {
	vtecxapi.log('delete', e.message)    
}

//vtecxapi.setids('/registration',1)
const ids = vtecxapi.addids('/registration',0) // 1
vtecxapi.log('ids', ids)    
const ids2 = vtecxapi.addids('/registration',1)   // 2
vtecxapi.log('ids2', ids2)    

const allocids = vtecxapi.allocids('/registration',10) // 3,4,5,6,7,8,9,10,11,12
vtecxapi.log('allocids', allocids)    

vtecxapi.rangeids('/registration','1-15') 
const allocids2 = vtecxapi.allocids('/registration',10) // 3,4,5,6,7,8,9,10,11,12
vtecxapi.log('allocids', allocids2)    

const count = vtecxapi.count('/registration')
vtecxapi.log('count', count)    

const request = vtecxapi.getRequest()
vtecxapi.log('request', JSON.stringify(request))    

const cookies = vtecxapi.getCookies()
vtecxapi.log('cookies', JSON.stringify(cookies))    

const headers = vtecxapi.getHeaders()
vtecxapi.log('headers', JSON.stringify(headers))    

const uid = vtecxapi.uid()
vtecxapi.log('uid', uid)    

const httpmethod = vtecxapi.httpmethod()
vtecxapi.log('httpmethod', httpmethod)    

const settingvalue = vtecxapi.getSettingValue('console.log')
vtecxapi.log('settingvalue', settingvalue)    

console.log('console.log test')
console.warn('console.log test warn')
console.error('console.log test error')

const html = vtecxapi.getHtml('index.html')
vtecxapi.log('html', html)    

const content = vtecxapi.getContent('/_settings/template')
vtecxapi.log('content', content)    

vtecxapi.setStatus(201)
const rc = vtecxapi.getStatus()
vtecxapi.setHeader('aaa','bbb')
vtecxapi.sendMessage(rc, 'test')


/* 
vtecxapi.sendError(200, 'OK')
vtecxapi.sendError(400)
vtecxapi.sendRedirect('index.html')
vtecxapi.saveFiles(prop)
vtecxapi.getMail()
vtecxapi.getCsv()
vtecxapi.doResponseCsv()
*/




