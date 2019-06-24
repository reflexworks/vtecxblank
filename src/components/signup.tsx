import '../styles/index.css'
import * as vtecxauth from 'vtecxauth'
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
  CommonLink,
  CommonText,
  CommonCheckbox,
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

  // 仮登録ボタン判定
  const [is_regist_btn, setIsRegistBtn]: any = useState(true)
  const isRegistBtn = () => {
    const email = state.data.email
    const password = state.data.password
    const password_re = state.data.password_re
    const terms1 = state.data.terms1
    const is_email_error = email ? commonValidation('email', email).error : true
    const is_password_error = password ? commonValidation('password', password).error : true
    const is_password_re_error = password !== password_re

    if (!is_email_error && !is_password_error && !is_password_re_error && terms1) {
      setIsRegistBtn(false)
    } else {
      setIsRegistBtn(true)
    }
  }

  // 仮登録ボタン押下処理
  const [is_completed, setIsCompleted]: any = useState(false)
  const [active_step, setActiveStep]: any = useState(0)
  const handleSubmit = async (_e: any) => {
    _e.preventDefault()

    const req = [
      {
        contributor: [
          {
            uri:
              'urn:vte.cx:auth:' +
              state.data.email +
              ',' +
              vtecxauth.getHashpass(state.data.password) +
              ''
          }
        ]
      }
    ]
    const captchaOpt = '&g-recaptcha-token=' + captcha_value

    setRequiredCaptcha(false)

    try {
      await commonAxios(states, '/d/?_adduser' + captchaOpt, 'post', req)
      setIsCompleted(true)
      setActiveStep(1)
    } catch (_error) {
      setRequiredCaptcha(true)
      if (_error.response) {
        if (_error.response.data.feed.title.indexOf('Duplicated key. account = ') !== -1) {
          dispatch({
            type: '_show_error',
            message: 'そのアカウントは既に登録済みです。'
          })
        } else if (_error.response.data.feed.title.indexOf('Mail setting is required') !== -1) {
          dispatch({
            type: '_show_error',
            message: 'アカウント登録を実行するには事前にメール設定をする必要があります。'
          })
        } else {
          dispatch({
            type: '_show_error',
            message:
              'アカウント登録に失敗しました。アカウントまたはパスワードが使用できない可能性があります。'
          })
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
    setRequiredCaptcha(true)
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=' + _sitekey
    document.body.appendChild(script)
  }, [])

  return (
    <CommonGrid>
      <CommonText title>アカウント登録</CommonText>
      <CommonStepper
        activeStep={active_step}
        steps={['仮登録', '仮登録完了', '本登録完了']}
      />
      {!is_completed && (
        <CommonForm>
          <CommonText style={{ marginBottom: -30 }}>
            まずは仮登録を行います。以下の入力フォームで必要な項目を入力してください。
          </CommonText>
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
            <CommonText caption color="secondary">
              ここで入力するメールアドレスは、ログインIDとして使用します。
            </CommonText>
          </CommonStep>
          <CommonStep number={2} title="パスワードを入力してください。">
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
            <CommonText caption color="secondary">
              ご入力頂いたパスワードは本登録後、当サービスをご利用いただくために必要になります。
            </CommonText>
            <CommonText caption>メモを取るなどし、忘れないようにご注意ください。</CommonText>
          </CommonStep>
          <CommonStep number={3} title="利用規約に同意の上、仮登録ボタンを押下してください。">
            <CommonCheckbox
              name="terms1"
              onChange={() => {
                isRegistBtn()
              }}
            >
              <CommonText>
                「<CommonLink href="user_terms.html">利用規約</CommonLink>」に同意します。
              </CommonText>
            </CommonCheckbox>
            <CommonText style={{ marginTop: 20 }}>
              上記メールアドレスに本登録用のメールを送信します。メールが届きましたら、
              <b>本文のリンクをクリックして本登録を完了</b>してください。
            </CommonText>
            <CommonButton
              color="primary"
              size="large"
              style={{ width: '100%', height: '50px' }}
              disabled={is_regist_btn}
              onClick={(_e: any) => handleSubmit(_e)}
            >
              アカウントの仮登録をする
            </CommonButton>
            {required_captcha && (
              <ReCaptcha
                sitekey={sitekey}
                verifyCallback={(value: string) => capchaOnChange(value)}
                action="login"
              />
            )}
          </CommonStep>
        </CommonForm>
      )}
      {is_completed && (
        <CommonBox>
          <CommonBox top={2} bottom={4} align="center">
            <CommonText>仮登録が完了しました。</CommonText>
          </CommonBox>
          <CommonBox bottom={4} align="center">
            <CommonText>入力したメールアドレスに本登録用のメールを送信しました。</CommonText>
          </CommonBox>
          <CommonBox bottom={4} align="center">
            <CommonText>メール本文のリンクをクリックし、本登録に移行してください。</CommonText>
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
