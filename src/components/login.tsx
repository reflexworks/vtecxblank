// login.tsx
import '../styles/index.css'
import * as vtecxauth from '@vtecx/vtecxauth'
import React, { useEffect, useContext, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { ReCaptchaProvider, useReCaptcha } from 'react-enterprise-recaptcha'

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
import { commonFetch, commonSessionStorage } from './common'

// =====================
// Login コンポーネント
// =====================
export const Login = (_props: any) => {
  const { state, dispatch }: any = useContext(ReducerContext)
  const states = { state, dispatch }

  const [requiredCaptcha, setRequiredCaptcha]: any = useState(false)
  const [isError, setIsError]: any = useState(false)

  // 送信時にトークンを取得
  const { executeRecaptcha } = useReCaptcha()

  async function handleSubmit(_e: any, _data: any) {
    _e.preventDefault()

    const authToken = vtecxauth.getAuthToken(_data['user.email'], _data['user.password'])

    // requiredCaptcha が true のときだけトークンを付与
    let captchaOpt = ''
    try {
      if (requiredCaptcha) {
        const token = await executeRecaptcha('login') // ← 指定の action=login
        captchaOpt = '&g-recaptcha-token=' + encodeURIComponent(token)
      }
    } catch (err) {
      // reCAPTCHA が取得できない場合はサーバーに行かずリトライさせる
      dispatch({
        type: '_show_error',
        message: 'セキュリティ確認に失敗しました。しばらくしてから再度お試しください。'
      })
      return
    }

    try {
      await commonFetch(states, '/d/?_login' + captchaOpt, 'get', null, {
        'X-WSSE': authToken
      })
      const prev_location = commonSessionStorage.get('prev_location')
      if (prev_location) {
        location.href = prev_location.href
      } else {
        location.href = 'index.html'
      }
    } catch (_error: any) {
      if (_error?.response) {
        dispatch({
          type: '_show_error',
          message: 'ログインに失敗しました。メールアドレスまたはパスワードに誤りがあります。'
        })
        setIsError(true)
        // サーバーが「次回はCaptcha必須」と返した場合にフラグを立てる
        if (_error.response.data?.feed?.title === 'Captcha required at next login.') {
          setRequiredCaptcha(true)
        }
      }
    }
  }

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

// =====================
// App ルート: Provider で包む
// =====================
const App: React.FC = () => {
  // 旧コードの sitekey 切り替えロジックを Provider に転用
  const [siteKey, setSiteKey] = useState<string>()

  useEffect(() => {
    const key =
      typeof location !== 'undefined' && location.hostname.includes('localhost')
        ? '6LfCvngUAAAAAJssdYdZkL5_N8blyXKjjnhW4Dsn'
        : '6LdUGHgUAAAAAOU28hR61Qceg2WP_Ms3kcuMHmmR'
    setSiteKey(key)
  }, [])

  if (!siteKey) return null // 初期化待ち

  return (
    // Enterprise ライブラリの Provider
    //    defaultAction に「login」を設定（RECAPTCHA_ACTION 相当）
    <ReCaptchaProvider reCaptchaKey={siteKey} language="ja" defaultAction="login">
      <CommonProvider>
        <Login />
      </CommonProvider>
    </ReCaptchaProvider>
  )
}

createRoot(document.getElementById('content')!).render(<App />)
