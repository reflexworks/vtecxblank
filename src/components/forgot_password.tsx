import '../styles/index.css'
import React, { useEffect, useContext, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ReCaptchaProvider, useReCaptcha } from 'react-enterprise-recaptcha'

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
import { commonFetch, commonValidation } from './common'

export const ForgotPassword = (_props: any) => {
  const { state, dispatch }: any = useContext(ReducerContext)
  const states = { state, dispatch }

  const [required_captcha, setRequiredCaptcha] = useState<boolean>(true)
  const { executeRecaptcha } = useReCaptcha()

  const [is_regist_btn, setIsRegistBtn] = useState<boolean>(true)
  const isRegistBtn = () => {
    const email = state?.data?.email
    const is_email_error = email ? commonValidation('email', email).error : true
    setIsRegistBtn(!!is_email_error)
  }

  const [is_completed, setIsCompleted] = useState<boolean>(false)
  const [active_step, setActiveStep] = useState<number>(0)

  const handleSubmit = async (_e: any) => {
    _e.preventDefault()

    const req = [{ contributor: [{ uri: 'urn:vte.cx:auth:' + state.data.email }] }]

    let captchaOpt = ''
    try {
      if (required_captcha) {
        const token = await executeRecaptcha('passreset')
        captchaOpt = '&g-recaptcha-token=' + encodeURIComponent(token)
      }
    } catch {
      dispatch({
        type: '_show_error',
        message: 'Security check failed. Please try again.'
      })
      return
    }

    setRequiredCaptcha(false)
    try {
      await commonFetch(states, '/d/?_passreset' + captchaOpt, 'post', req)
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
              validation={(v: string) => commonValidation('email', v)}
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
                onClick={(e: any) => handleSubmit(e)}
              >
                メールを送信する
              </CommonButton>
            </CommonGrid>
          </CommonGrid>
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

const App: React.FC = () => {
  const [siteKey, setSiteKey] = useState<string>()

  useEffect(() => {
    const key =
      typeof location !== 'undefined' && location.hostname.includes('localhost')
        ? '6LfCvngUAAAAAJssdYdZkL5_N8blyXKjjnhW4Dsn'
        : '6LdUGHgUAAAAAOU28hR61Qceg2WP_Ms3kcuMHmmR'
    setSiteKey(key)
  }, [])

  if (!siteKey) return null

  return (
    <ReCaptchaProvider reCaptchaKey={siteKey} language="ja" defaultAction="passreset">
      <CommonProvider>
        <ForgotPassword />
      </CommonProvider>
    </ReCaptchaProvider>
  )
}

createRoot(document.getElementById('content')!).render(<App />)
