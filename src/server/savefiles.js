import reflexcontext from 'reflexcontext' 

const param = new Object()
param.picture1 = reflexcontext.getQueryString('key1')
param.picture2 = reflexcontext.getQueryString('key2')

reflexcontext.saveFiles(param)
