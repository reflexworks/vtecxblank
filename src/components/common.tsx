import * as React from 'react'
import axios from 'axios'

export const MAX_BROWSER_SIZE = '1050px'
export const MIN_BROWSER_SIZE = '650px'

const ua = navigator.userAgent
export const commonIsMobile =
  ua.indexOf('iPhone') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)

export const commoninitialState = {
  data: {},
  cash: {},
  indicator: false,
  error: {
    is_open: false,
    message: ''
  },
  document_title: null
}
export const commonReducer = (state: any, action: any) => {
  const { type, key, value, message } = action
  let { indicator, data, cash, error, document_title } = state

  switch (type) {
    case '_indicator':
      indicator = value
      return {
        ...state,
        indicator
      }
    case '_show_error':
      error.is_open = true
      error.message = message
      return {
        ...state,
        error: error
      }
    case '_hide_error':
      error.is_open = false
      error.message = ''
      return {
        ...state,
        error: error
      }
    case '_save_data':
      data[key] = value
      return {
        ...state,
        data: data
      }
    case '_cash_data':
      cash[key] = value
      return {
        ...state,
        cash: cash
      }
    case '_save_document_title':
      document_title = value
      return {
        ...state,
        document_title: document_title
      }
    case '_reset':
      return commoninitialState

    default:
      return state
  }
}

/**
 * 共通：通信処理
 */
export function commonAxios(
  _states: any,
  _url: string,
  _method: string,
  _data?: any,
  _headers?: any,
  _is_file?: boolean
) {
  return new Promise((resolve, reject) => {
    const headers = _headers ? _headers : {}
    headers['X-Requested-With'] = 'XMLHttpRequest'

    let param: any = {
      url: _url,
      method: _method,
      headers: headers
    }
    if (_data) param.data = _data
    if (_is_file) {
      param.dataType = 'json'
      param.processData = false
      param.contentType = false
    }

    let retryCount = 0
    const maxRetryCount = 30

    if (_states) {
      _states.dispatch({ type: '_indicator', value: true })
    }

    const get = () => {
      axios(param).then(
        _response => {
          if (_states) {
            _states.dispatch({ type: '_indicator', value: false })
          }
          resolve(_response)
        },
        _error => {
          console.error(_error)
          if (_states) {
            _states.dispatch({ type: '_indicator', value: false })
          }
          if (
            (_error.response && _error.response.status === 401) ||
            (_error.response && _error.response.status === 403)
          ) {
            console.log('認証エラー')
            reject(_error)
          } else {
            if (_error.response && _error.response.data && _error.response.data.feed) {
              const title = _error.response.data.feed.title
              if (title === 'Please make a pagination index in advance.') {
                if (retryCount < maxRetryCount) {
                  retryCount++
                  setTimeout(() => {
                    get()
                  }, 1000)
                  return false
                } else {
                  //this.showFixAlert(<span>一覧のindex作成に取得に失敗しました。<br /><br />{title}</span>)
                  alert(
                    <span>
                      一覧のindex作成に取得に失敗しました。
                      <br />
                      <br />
                      {title}
                    </span>
                  )
                }
              }
            }
            reject(_error)
          }
        }
      )
    }
    get()
  })
}

/**
 * 共通：バリデーションチェック
 * @param _type
 * @param _value
 * @return true=エラーあり、false=エラーなし
 */
export const commonValidation = (_type: string, _value: string) => {
  const res = {
    error: false,
    message: ''
  }

  if (_type === 'required') {
    res.error = _value ? false : true
    if (res.error) {
      res.message = '必須項目です。'
    }
  }

  if (!_value) return res

  if (_type === 'email') {
    const regexp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    res.error = !regexp.test(_value)
    if (res.error) {
      //res.message = 'メールアドレスの形式が不正です。正しいメールアドレスを入力してください。'
    }
  }

  if (_type === 'password') {
    const regexp = /^(?=.*?[0-9])(?=.*?[a-zA-Z])(?=.*?[!-/@_])[A-Za-z!-9@_]{8,}$/
    res.error = !regexp.test(_value)
    if (res.error) {
      res.message = '安全なパスワードではありません。'
    }
  }

  return res
}

/**
 * ローカルストレージ機能
 */
const _commonStrageKey = '__VTECX'
const _commonParseStorage = () => {
  let ss: any = sessionStorage.getItem(_commonStrageKey)
  if (ss) {
    ss = JSON.parse(ss)
  } else {
    ss = {}
  }
  return ss
}
export const commonSessionStorage = {
  get: (_key: string) => {
    const ss = _commonParseStorage()
    const value = ss[_key]
    return value || null
  },
  set: (_key: string, _value: any) => {
    const ss = _commonParseStorage()
    ss[_key] = _value
    sessionStorage.setItem(_commonStrageKey, JSON.stringify(ss))
  },
  clear: () => {
    sessionStorage.removeItem(_commonStrageKey)
  }
}

export const commonFileUpload = async (_states: any, _name: string, _url: string) => {
  const unique_key = 'common-file-'
  const froms: any = document.getElementById(unique_key + 'form-' + _name)
  if (froms && froms.children && froms.children[0] && froms.children[0].value) {
    let file_name: string = ''
    froms.children[0].value.split('\\').map((value: string) => {
      file_name = value
    })
    const form_data = new FormData(froms)
    try {
      const res = await commonAxios(
        _states,
        '/s/post-file?url=' +
          _url +
          '/' +
          encodeURIComponent(file_name) +
          '&name=' +
          unique_key +
          _name,
        'post',
        form_data,
        null,
        true
      )
      return res
    } catch (_e) {
      throw _e
    }
  }
}
export const commonPrefectures = [
  '北海道',
  '青森',
  '秋田',
  '山形',
  '岩手',
  '宮城',
  '福島',
  '東京',
  '神奈川',
  '埼玉',
  '千葉',
  '栃木',
  '茨城',
  '群馬',
  '愛知',
  '岐阜',
  '静岡',
  '三重',
  '新潟',
  '山梨',
  '長野',
  '石川',
  '富山',
  '福井',
  '大阪',
  '兵庫',
  '京都',
  '滋賀',
  '奈良',
  '和歌山',
  '岡山',
  '広島',
  '鳥取',
  '島根',
  '山口',
  '香川',
  '徳島',
  '愛媛',
  '高知',
  '福岡',
  '佐賀',
  '長崎',
  '熊本',
  '大分',
  '宮崎',
  '鹿児島',
  '沖縄'
]

export const commonLocationHref = (_link: string) => {
  location.href = _link
}
export const commonSetEntryValue = (_entry: any) => {
  return JSON.stringify(_entry)
}
export const commonGetEntryValue = (_entry: string) => {
  return JSON.parse(_entry)
}
export const commonScrollTop = () => {
  window.scrollTo(0, 0)
}
export const commonIconList = {
  required: 'error',
  any: 'remove_circle',
  add: 'add',
  edit: 'edit',
  preview: 'remove_red_eye',
  release: 'open_in_browser',
  back: 'keyboard_backspace',
  delete: 'delete_forever',
  close: 'close',
  search: 'search'
}

let _commonIntervalInputValue: any
export const commonIntervalInput = (_callbak: any) => {
  if (_commonIntervalInputValue) {
    clearTimeout(_commonIntervalInputValue)
  }
  _commonIntervalInputValue = setTimeout(_callbak, 400)
}
