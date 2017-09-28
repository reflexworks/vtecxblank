import reflexcontext from 'reflexcontext' 

reflexcontext.log('Test OK')
reflexcontext.log('title','Test OK')
reflexcontext.log('title','subtitle','TestOK')

const querystring1 = reflexcontext.getQueryString()
reflexcontext.log('querystring1',querystring1)
const querystring2 = reflexcontext.getQueryString('param')
reflexcontext.log('querystring2',querystring2)
const uriquerystring = reflexcontext.getUriAndQuerystring()
reflexcontext.log('uriquerystring',uriquerystring)
const pathinfo = reflexcontext.getPathinfo()
reflexcontext.log('uriquerystring', pathinfo)
const contenttype = reflexcontext.getContentType()
reflexcontext.log('contenttype', contenttype)
const feed = reflexcontext.getFeed('/registration')
reflexcontext.log('feed', JSON.stringify(feed))
const entry = reflexcontext.getEntry('/registration')
reflexcontext.log('entry', JSON.stringify(entry))


try {
	const request = { feed : { entry : [{ userinfo: { id: 1, email: 'foo@bar.com' }, favorite: { food: '牛たく', music: 'J−ポップ' }, hobby: [{ type: '屋外', name: 'テニス' }, { type: '屋内', name: '卓球' }], link: [{ ___href: '/registration/101', ___rel: 'self' }] }] } }
	reflexcontext.post(request)
} catch (e) {
	reflexcontext.log('post', e.message)    
}

try {
	const request = { feed: { entry: [{ userinfo: { id: 1, email: 'foo@bar.com' }, favorite: { food: '牛たし', music: 'J−ポップ' }, hobby: [{ type: '屋外', name: 'テニス' }, { type: '屋内', name: '卓球' }] }] } }
	reflexcontext.post(request,'/registration')
	reflexcontext.post(request,'/registration',true)
} catch (e) {
	reflexcontext.log('post2', e.message)    
}

try {
	const request = { feed : { entry : [{ userinfo: { id: 1, email: 'foo@bar.com' }, favorite: { food: '牛たえ', music: 'J−ポップ' }, hobby: [{ type: '屋外', name: 'テニス' }, { type: '屋内', name: '卓球' }], link: [{ ___href: '/registration/101', ___rel: 'self' }] }] } }
	reflexcontext.put(request)
	reflexcontext.put(request,true)
} catch (e) {
	reflexcontext.log('put', e.message)    
}

reflexcontext.delete('/registration/101')
try {
	reflexcontext.deleteFolder('/registration/101')
} catch (e) {
	reflexcontext.log('delete', e.message)    
}

//reflexcontext.setids('/registration',1)
const ids = reflexcontext.addids('/registration',0) // 1
reflexcontext.log('ids', ids)    
const ids2 = reflexcontext.addids('/registration',1)   // 2
reflexcontext.log('ids2', ids2)    

const allocids = reflexcontext.allocids('/registration',10) // 3,4,5,6,7,8,9,10,11,12
reflexcontext.log('allocids', allocids)    

reflexcontext.rangeids('/registration','1-15') 
const allocids2 = reflexcontext.allocids('/registration',10) // 3,4,5,6,7,8,9,10,11,12
reflexcontext.log('allocids', allocids2)    

const count = reflexcontext.count('/registration')
reflexcontext.log('count', count)    

const request = reflexcontext.getRequest()
reflexcontext.log('request', JSON.stringify(request))    

const cookies = reflexcontext.getCookies()
reflexcontext.log('cookies', JSON.stringify(cookies))    

const headers = reflexcontext.getHeaders()
reflexcontext.log('headers', JSON.stringify(headers))    

const uid = reflexcontext.uid()
reflexcontext.log('uid', uid)    

const httpmethod = reflexcontext.httpmethod()
reflexcontext.log('httpmethod', httpmethod)    

const settingvalue = reflexcontext.getSettingValue('console.log')
reflexcontext.log('settingvalue', settingvalue)    

console.log('console.log test')
console.warn('console.log test warn')
console.error('console.log test error')

const html = reflexcontext.getHtml('index.html')
reflexcontext.log('html', html)    

const content = reflexcontext.getContent('/_settings/template')
reflexcontext.log('content', content)    

reflexcontext.setStatus(201)
const rc = reflexcontext.getStatus()
reflexcontext.setHeader('aaa','bbb')
reflexcontext.sendMessage(rc, 'test')


/* 
reflexcontext.sendError(200, 'OK')
reflexcontext.sendError(400)
reflexcontext.sendRedirect('index.html')
reflexcontext.saveFiles(prop)
reflexcontext.getMail()
reflexcontext.getCsv()
reflexcontext.doResponseCsv()
*/




