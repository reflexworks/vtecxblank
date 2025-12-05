import '../styles/index.css'
import * as vtecxauth from '@vtecx/vtecxauth'
import React, { useEffect, useContext, useState } from 'react'
import { createRoot } from 'react-dom/client'

import {
  ReducerContext,
  CommonProvider,
  CommonGrid,
  CommonStepper,
  CommonStep,
  CommonInputText,
  CommonButton,
  CommonText,
  CommonForm,
  CommonBox,
  CommonLink
} from './common-dom'
import { commonFetch, commonValidation } from './common'

type AuthStatus = 'checking' | 'ok' | 'invalid'

export const ChangePassword = (_props: any) => {
  const { state, dispatch }: any = useContext(ReducerContext)
  const states = { state, dispatch }

  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking')
  const [passresetToken, setPassresetToken] = useState<string | undefined>(undefined)

  // パスワード変更ボタン判定
  const [is_regist_btn, setIsRegistBtn] = useState(true)
  const isRegistBtn = () => {
    const password = state.data.password
    const password_re = state.data.password_re
    const is_password_error = password ? commonValidation('password', password).error : true
    const is_password_re_error = password !== password_re
    setIsRegistBtn(!(!is_password_error && !is_password_re_error))
  }

  // 送信
  const [is_completed, setIsCompleted] = useState(false)
  const [active_step, setActiveStep] = useState(2)
  const handleSubmit = async (_e: any) => {
    _e.preventDefault()
    const req = [
      {
        contributor: [
          { uri: 'urn:vte.cx:auth:' + ',' + vtecxauth.getHashpass(state.data.password) },
          { uri: 'urn:vte.cx:passreset_token:' + passresetToken }
        ]
      }
    ]
    try {
      await commonFetch(states, '/d/?_changephash', 'put', req)
      setIsCompleted(true)
      setActiveStep(3)
    } catch (_error) {
      dispatch({
        type: '_show_error',
        message: 'パスワード変更に失敗しました。もう一度画面をリロードして実行してください。'
      })
    }
  }

  // 認証リンク検証（hash と query の両方をサポート）
  useEffect(() => {
    const url = new URL(window.location.href)
    const hash = url.hash.startsWith('#/?') ? url.hash.slice(3) : ''
    const params = new URLSearchParams(hash || url.search.slice(1))

    const rxid = params.get('_RXID') || ''
    const token = params.get('_passreset_token') || ''

    if (!rxid || !token) {
      setAuthStatus('invalid')
      return
    }

    commonFetch(null, '/d/?_uid&_RXID=' + encodeURIComponent(rxid), 'get')
      .then(() => {
        setPassresetToken(token)
        setAuthStatus('ok')
      })
      .catch((err: any) => {
        const title = err?.response?.data?.feed?.title || ''
        const status = err?.response?.status
        // ワンタイムIDを既に使用済みでも token があれば続行可
        if (
          (status === 401 || status === 403) &&
          title.includes('RXID has been used more than once.')
        ) {
          setPassresetToken(token)
          setAuthStatus('ok')
        } else {
          setAuthStatus('invalid')
        }
      })
  }, [])

  // --- 表示分岐 ---
  if (authStatus === 'checking') {
    return (
      <CommonGrid>
        <CommonText title>パスワード変更</CommonText>
        <CommonText>リンクを検証しています…</CommonText>
      </CommonGrid>
    )
  }

  if (authStatus === 'invalid') {
    return (
      <CommonGrid>
        <CommonText title>パスワード変更</CommonText>
        <CommonBox top={2} bottom={4}>
          <CommonText color="red">このリンクは無効か、有効期限が切れています。</CommonText>
          <CommonText>
            お手数ですが、<CommonLink href="forgot_password.html">パスワード再発行</CommonLink>から
            新しいメールを受け取ってください。
          </CommonText>
        </CommonBox>
      </CommonGrid>
    )
  }

  // authStatus === 'ok'
  return (
    <CommonGrid>
      <CommonText title>パスワード変更</CommonText>
      <CommonStepper
        activeStep={active_step}
        steps={['本人確認用メール送信', 'メール送信完了', 'パスワード変更', 'パスワード変更完了']}
      />
      {!is_completed && (
        <CommonForm>
          <CommonStep number={1} title="新しいパスワードを入力してください。">
            <CommonText>
              ご使用するパスワードは<b>8文字以上で、かつ数字・英字・記号を最低1文字含む</b>
              必要があります。
            </CommonText>
            <CommonInputText
              type="password"
              label="パスワード入力"
              placeholder="パスワード"
              name="password"
              style={{ marginTop: 10 }}
              variant="outlined"
              value=""
              validation={(v: string) => commonValidation('password', v)}
              onChange={() => {
                state.data.password_re = ''
                isRegistBtn()
              }}
              transparent
            />
            <CommonText>確認のためにもう一度入力してください。</CommonText>
            <CommonInputText
              type="password"
              label="パスワード入力（確認用）"
              placeholder="パスワード"
              name="password_re"
              transparent
              style={{ marginTop: 10 }}
              variant="outlined"
              value={state.data.password_re}
              validation={(v: string) =>
                state.data.password === v
                  ? { error: false, message: '' }
                  : { error: true, message: 'パスワードと一致させてください' }
              }
              onChange={() => isRegistBtn()}
            />
          </CommonStep>

          <CommonGrid>
            <CommonGrid item justify="center">
              <CommonButton
                color="primary"
                size="large"
                disabled={is_regist_btn}
                onClick={handleSubmit}
              >
                パスワードを変更する
              </CommonButton>
            </CommonGrid>
          </CommonGrid>
        </CommonForm>
      )}

      {is_completed && (
        <CommonBox>
          <CommonBox top={2} bottom={4} align="center">
            <CommonText>新しいパスワードへの変更が完了しました。</CommonText>
          </CommonBox>
          <CommonBox bottom={4} align="center">
            <CommonText>ログイン画面からログインしてください。</CommonText>
          </CommonBox>
          <CommonBox bottom={4} align="center">
            <CommonLink href="login.html">ログイン画面へ戻る</CommonLink>
          </CommonBox>
        </CommonBox>
      )}
    </CommonGrid>
  )
}

const App: React.FC = () => (
  <CommonProvider>
    <ChangePassword />
  </CommonProvider>
)

createRoot(document.getElementById('content')!).render(<App />)
