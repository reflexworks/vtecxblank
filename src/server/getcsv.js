import reflexcontext from 'reflexcontext' 

const items = ['item1','item2(int)','item3(int)']
const header = ['年月日','件数','合計']
const parent = 'order'
const skip = 1
//const encoding = 'SJIS'
const encoding = 'UTF-8'

// CSV取得
const result = reflexcontext.getCsv(header,items,parent,skip,encoding)
reflexcontext.log(JSON.stringify(result)) // {"feed":{"entry":[{"order":{"item1":"2017/7/5","item2":3,"item3":3}},{"order":{"item1":"2017/7/6","item2":5,"item3":8}},{"order":{"item1":"2017/7/7","item2":2,"item3":10}}]}}
