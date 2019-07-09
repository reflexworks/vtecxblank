import '../styles/index.css'
import * as vtecxauth from 'vtecxauth'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ReCaptcha from './ReCaptcha'

import { useEffect, useContext, useState /*, useRef*/ } from 'react'
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
import { commonAxios, commonValidation } from './common'

export const Signup = (_props: any) => {
  const { state, dispatch }: any = useContext(ReducerContext)
  const states = { state, dispatch }

  // キャプチャ関連
  const [required_captcha, setRequiredCaptcha]: any = useState(false)
  const [captcha_value, setCaptchaValue]: any = useState('')
  const [sitekey, setSitekey]: any = useState('')
  const capchaOnChange = (value: string): void => {
    setCaptchaValue(value)
  }

  // パスワード変更ボタン判定
  const [is_regist_btn, setIsRegistBtn]: any = useState(true)
  const isRegistBtn = () => {
    const password = state.data.password
    const password_re = state.data.password_re
    const is_password_error = password ? commonValidation('password', password).error : true
    const is_password_re_error = password !== password_re

    if (!is_password_error && !is_password_re_error) {
      setIsRegistBtn(false)
    } else {
      setIsRegistBtn(true)
    }
  }

  // パスワード変更ボタン押下処理
  const [is_completed, setIsCompleted]: any = useState(false)
  const [active_step, setActiveStep]: any = useState(2)
  const handleSubmit = async (_e: any) => {
    _e.preventDefault()

    const req = [
      {
        contributor: [
          {
            uri: 'urn:vte.cx:auth:' + ',' + vtecxauth.getHashpass(state.data.password) + ''
          }
        ]
      }
    ]
    const captchaOpt = '&g-recaptcha-token=' + captcha_value

    setRequiredCaptcha(false)

    try {
      await commonAxios(states, '/d/?_changephash' + captchaOpt, 'put', req)
      setIsCompleted(true)
      setActiveStep(3)
    } catch (_error) {
      setRequiredCaptcha(true)
      dispatch({
        type: '_show_error',
        message: 'パスワード変更に失敗しました。もう一度画面をリロードして実行してください。'
      })
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
    setRequiredCaptcha(true)
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=' + _sitekey
    document.body.appendChild(script)
  }, [])

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
              ご使用するパスワードは
              <b>8文字以上で、かつ数字・英字・記号を最低1文字含む</b>必要があります。
            </CommonText>
            <CommonInputText
              type="password"
              label="パスワード入力"
              placeholder="パスワード"
              name="password"
              style={{ marginTop: 10 }}
              variant="outlined"
              value=""
              validation={(_value: string) => {
                return commonValidation('password', _value)
              }}
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
              validation={(_value: string) => {
                if (state.data.password === _value) {
                  return {
                    error: false,
                    message: ''
                  }
                } else {
                  return {
                    error: true,
                    message: 'パスワードと一致させてください'
                  }
                }
              }}
              onChange={() => {
                isRegistBtn()
              }}
            />
          </CommonStep>
          <CommonGrid>
            <CommonGrid item justify="center">
              <CommonButton
                color="primary"
                size="large"
                disabled={is_regist_btn}
                onClick={(_e: any) => handleSubmit(_e)}
              >
                パスワードを変更する
              </CommonButton>
            </CommonGrid>
          </CommonGrid>
          {required_captcha && (
            <ReCaptcha
              sitekey={sitekey}
              verifyCallback={(value: string) => capchaOnChange(value)}
              action="login"
            />
          )}
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
const App: any = () => {
  return (
    <CommonProvider>
      <Signup />
    </CommonProvider>
  )
}
ReactDOM.render(<App />, document.getElementById('container'))
