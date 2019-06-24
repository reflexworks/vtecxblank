import '../styles/index.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ReCaptcha from './ReCaptcha'

import { useEffect, useContext, useState } from 'react'
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
  CommonBox
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

  // メール送信ボタン判定
  const [is_regist_btn, setIsRegistBtn]: any = useState(true)
  const isRegistBtn = () => {
    const email = state.data.email
    const is_email_error = email ? commonValidation('email', email).error : true

    if (!is_email_error) {
      setIsRegistBtn(false)
    } else {
      setIsRegistBtn(true)
    }
  }

  // メール送信ボタン押下処理
  const [is_completed, setIsCompleted]: any = useState(false)
  const [active_step, setActiveStep]: any = useState(0)
  const handleSubmit = async (_e: any) => {
    _e.preventDefault()

    const req = [
      {
        contributor: [
          {
            uri: 'urn:vte.cx:auth:' + state.data.email
          }
        ]
      }
    ]
    const captchaOpt = '&g-recaptcha-token=' + captcha_value

    setRequiredCaptcha(false)

    try {
      await commonAxios(states, '/d/?_passreset' + captchaOpt, 'post', req)
      setIsCompleted(true)
      setActiveStep(1)
    } catch (_error) {
      setRequiredCaptcha(true)
      dispatch({
        type: '_show_error',
        message: 'メールの送信に失敗しました。画面をリロードしてもう一度実行してください。'
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
          <CommonBox bottom={6}>
            <CommonText>
              ご本人確認のため、登録されているメールアドレスを入力してください。
            </CommonText>
            <CommonText>
              入力されたアドレスへメール送信されますので、メールに記載されているURLへアクセスしてください。
            </CommonText>
            <CommonText>
              アクセスされたページにて新しいパスワードを入力して登録が完了です。
            </CommonText>
          </CommonBox>
          <CommonStep number={1} title="メールアドレスを入力してください。">
            <CommonInputText
              label="メールアドレス"
              placeholder="メールアドレス"
              type="email"
              name="email"
              autoComplete="email"
              variant="outlined"
              value=""
              //error={isError}
              validation={(_value: string) => {
                return commonValidation('email', _value)
              }}
              onChange={() => isRegistBtn()}
              transparent
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
                メールを送信する
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
            <CommonText>メールを送信しました。</CommonText>
          </CommonBox>
          <CommonBox bottom={4} align="center">
            <CommonText>入力したメールアドレスにメールを送信しました。</CommonText>
          </CommonBox>
          <CommonBox bottom={4} align="center">
            <CommonText>メールに記載されているURLへアクセスしてください。</CommonText>
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
