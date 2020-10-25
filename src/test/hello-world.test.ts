import axios, { AxiosResponse } from 'axios'
const confy = require('confy')

describe('サンプルテスト', () => {
  let accesstoken: string
  let path: string

  // テスト全体で最初に実行
  beforeAll(() => {
    confy.get('$default', (err: any, result: any) => {
      if (result) {
        console.log('Service currently logged in:' + result.service)
        confy.get(result.service, (err: any, result: any) => {
          accesstoken = result.accesstoken
          path = result.path
          if (err) {
            console.log(err)
          }
        })
      } else {
        console.log('Please login. ' + err)
      }
    })
    axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
    axios.defaults.headers['Authorization'] = 'Token ' + accesstoken
  })

  test('Hello Worldテスト', async () => {
    try {
      const res: AxiosResponse = await axios.get(path + '/s/hello-world')
      expect(res.data.feed.title).toBe('hello,world')
    } catch (e) {
      console.log(e)
    }
  })
})
