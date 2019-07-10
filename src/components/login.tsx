import '../styles/index.css'
import * as vtecxauth from 'vtecxauth'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ReCaptcha from './ReCaptcha'

import { useEffect, useContext, useState } from 'react'
import {
  CommonProvider,
  CommonGrid,
  CommonPaper,
  CommonForm,
  CommonInputText,
  CommonButton,
  CommonText,
  ReducerContext,
  CommonLink
} from './common-dom'
import { commonAxios, commonSessionStorage } from './common'

export const Login = (_props: any) => {
  const { state, dispatch }: any = useContext(ReducerContext)
  const states = { state, dispatch }

  const [requiredCaptcha, setRequiredCaptcha]: any = useState(false)
  const [isError, setIsError]: any = useState(false)

  const [captchaValue, setCaptchaValue]: any = useState('')
  const [sitekey, setSitekey]: any = useState('')

  const capchaOnChange = (value: string): void => {
    setCaptchaValue(value)
  }

  async function handleSubmit(_e: any, _data: any) {
    _e.preventDefault()

    const authToken = vtecxauth.getAuthToken(_data['user.email'], _data['user.password'])
    const captchaOpt = requiredCaptcha === true ? '&g-recaptcha-token=' + captchaValue : ''

    try {
      await commonAxios(states, '/d/?_login' + captchaOpt, 'get', null, {
        'X-WSSE': authToken
      })
      const prev_location = commonSessionStorage.get('prev_location')
      if (prev_location) {
        location.href = prev_location.href
      } else {
        location.href = 'index.html'
      }
    } catch (_error) {
      if (_error.response) {
        dispatch({
          type: '_show_error',
          message: 'ログインに失敗しました。メールアドレスまたはパスワードに誤りがあります。'
        })
        setIsError(true)
        if (_error.response.data.feed.title === 'Captcha required at next login.') {
          setRequiredCaptcha(true)
        }
      }
    }
  }

  useEffect(() => {
    let _sitekey: string = ''
    if (location.href.indexOf('localhost') >= 0) {
      _sitekey = '6LfCvngUAAAAAJssdYdZkL5_N8blyXKjjnhW4Dsn'
    } else {
      _sitekey = '6LdUGHgUAAAAAOU28hR61Qceg2WP_Ms3kcuMHmmR'
    }
    setSitekey(_sitekey)
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=' + _sitekey
    document.body.appendChild(script)
  }, [])

  return (
    <CommonGrid>
      <CommonGrid item>
        <CommonPaper title="ログイン" style={{ backgroundColor: '#F7F7F7' }}>
          <CommonForm onSubmit={(_e: any, _data: any) => handleSubmit(_e, _data)}>
            <CommonInputText
              type="email"
              label="メールアドレス"
              placeholder="メールアドレス"
              name="user.email"
              icon="person"
              style={{ marginTop: 10 }}
              variant="outlined"
              error={isError}
              transparent
            />
            <CommonInputText
              type="password"
              label="パスワード"
              placeholder="パスワード"
              name="user.password"
              icon="vpn_key"
              style={{ marginTop: 10 }}
              variant="outlined"
              transparent
            />
            <CommonText style={{ marginTop: 10, marginBottom: 20 }} align="right">
              <CommonLink href="forgot_password.html">パスワードをお忘れですか？</CommonLink>
            </CommonText>
            {requiredCaptcha && (
              <ReCaptcha
                sitekey={sitekey}
                verifyCallback={(value: string) => capchaOnChange(value)}
                action="login"
              />
            )}
            <CommonButton type="submit" color="primary" size="large">
              ログインする
            </CommonButton>
          </CommonForm>
        </CommonPaper>
      </CommonGrid>

      <CommonGrid item>
        <CommonGrid>
          <CommonGrid item justify="center">
            <CommonText style={{ marginTop: 10 }} align="center">
              まだvte.cxのアカウントをお持ちでない方は
              <br />
              アカウント登録をお済ませください。
            </CommonText>
            <CommonButton
              color="primary"
              href="signup.html"
              style={{ width: '90%', height: '50px', marginTop: 20 }}
              disabled={false}
            >
              まずは会員登録をする
            </CommonButton>
          </CommonGrid>
        </CommonGrid>
      </CommonGrid>
    </CommonGrid>
  )
}
const App: any = () => {
  return (
    <CommonProvider>
      <Login />
    </CommonProvider>
  )
}
ReactDOM.render(<App />, document.getElementById('container'))
