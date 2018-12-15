import '../styles/index.css'
import '../styles/application.sass'
import axios from 'axios'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import * as vtecxauth from 'vtecxauth'
import PasswordStrength from './password_strength'
import { Form, Col, FormGroup, Button, HelpBlock, ControlLabel, FormControl } from 'react-bootstrap'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
  //hello: string
}

/* コンポーネントのStateの型宣言 */
interface ComponentState {
  isError: any
  isForbidden: boolean
  isAlreadyRegistered: boolean
  isIllegalPassword: boolean
  isUnmatchReinput: boolean
  captchaValue: string
  passLength: number
  isCompleted: boolean
}

class ChangePassword extends React.Component<ComponentProps, ComponentState> {
  constructor(props: ComponentProps) {
    super(props)
    this.state = {
      isError: null,
      isForbidden: false,
      isAlreadyRegistered: false,
      isIllegalPassword: false,
      isUnmatchReinput: false,
      captchaValue: '',
      passLength: 0,
      isCompleted: false
    }
  }

  capchaOnChange(value: string): void {
    this.setState({ captchaValue: value })
  }

  passwordOnChange(state: any): void {
    this.setState({ passLength: state.password.length })
  }

  handleSubmit(e: any): void {
    e.preventDefault()
    const password = e.target.password.value

    //パスワードのバリデーションチェックを行う
    if (!password.match('^(?=.*?[0-9])(?=.*?[a-zA-Z])(?=.*?[!-/@_])[A-Za-z!-9@_]{8,}$')) {
      this.setState({ isIllegalPassword: true })
    } else {
      if (password && e.target.re_password.value && password === e.target.re_password.value) {
        const hashpass = vtecxauth.getHashpass(password)
        const reqData = {
          feed: { entry: [{ contributor: [{ uri: 'urn:vte.cx:auth:,' + hashpass + '' }] }] }
        }

        const captchaOpt = '&g-recaptcha-response=' + this.state.captchaValue

        axios({
          url: '/d/?_changephash' + captchaOpt,
          method: 'put',
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: reqData
        })
          .then(() => {
            this.setState({ isCompleted: true })
          })
          .catch((error: any) => {
            if (error.response && error.response.status === 403) {
              this.setState({ isForbidden: true })
            } else {
              this.setState({ isError: true })
            }
          })
      } else {
        this.setState({ isUnmatchReinput: true })
      }
    }
  }

  render() {
    const App = (
      <div className="vtecx-from">
        <div className="vtecx-from-container">
          <div className="vtecx-from-content">
            <h2>
              <img src="../img/logo.svg" alt="有限会社バーチャルテクノロジー" height="24px" />
              <span>パスワード変更</span>
            </h2>
            {this.state.isCompleted ? (
              <Form>
                <h5 className="text-center">パスワード変更を完了しました</h5>
                <FormGroup>
                  <Col sm={12}>
                    <div className="text-center">
                      <a href="index.html">トップページへ戻る</a>
                    </div>
                  </Col>
                </FormGroup>
              </Form>
            ) : (
              <Form horizontal onSubmit={(e: any) => this.handleSubmit(e)}>
                <FormGroup controlId="password">
                  <Col sm={12}>
                    <ControlLabel>パスワード</ControlLabel>

                    <PasswordStrength
                      className="customClass"
                      minLength={8}
                      minScore={3}
                      scoreWords={['弱', '弱', '中', '強', '最強']}
                      tooShortWord="短い"
                      changeCallback={(e: any) => this.passwordOnChange(e)}
                      inputProps={{
                        name: 'password',
                        autoComplete: 'off',
                        className: 'form-control'
                      }}
                    />

                    <HelpBlock>
                      （8文字以上で、かつ数字・英字・記号を最低1文字含む必要があります。パスワード強度は「強」以上がお薦めです）
                    </HelpBlock>
                  </Col>
                </FormGroup>

                <FormGroup controlId="re_password">
                  <Col sm={12}>
                    <ControlLabel>パスワード確認</ControlLabel>
                    <FormControl type="password" placeholder="" />
                  </Col>
                </FormGroup>

                <FormGroup>
                  <div className="login_form__recaptcha">
                    <ReCAPTCHA
                      sitekey="6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19"
                      onChange={(value: string) => this.capchaOnChange(value)}
                    />
                  </div>
                </FormGroup>

                {this.state.isIllegalPassword && (
                  <FormGroup>
                    <Col sm={12}>
                      <div className="alert alert-danger">
                        パスワードは8文字以上、かつ数字・英字・記号を最低1文字含む必要があります。
                      </div>
                    </Col>
                  </FormGroup>
                )}

                {this.state.isUnmatchReinput && (
                  <FormGroup>
                    <Col sm={12}>
                      <div className="alert alert-danger">
                        入力されたパスワードが不正です。確認用パスワードと一致していない可能性があります。
                      </div>
                    </Col>
                  </FormGroup>
                )}

                {this.state.isForbidden && (
                  <FormGroup>
                    <Col sm={12}>
                      <div className="alert alert-danger">
                        <a href="index.html">ログイン</a>を行ってから実行してください。
                      </div>
                    </Col>
                  </FormGroup>
                )}

                {this.state.isError && (
                  <FormGroup>
                    <Col sm={12}>
                      <div className="alert alert-danger">パスワード変更に失敗しました。</div>
                    </Col>
                  </FormGroup>
                )}
                <FormGroup>
                  <Col sm={12}>
                    <Button type="submit" className="btn btn-lg login_form__btn--submit">
                      パスワード変更実行
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            )}
          </div>
        </div>
      </div>
    )
    return (
      <div>
        <header>
          <div className="contents_in">
            <a href="http://reflexworks.jp/contact.html#company">
              <img src="../img/logo_vt.svg" alt="有限会社バーチャルテクノロジー" />
            </a>
          </div>
        </header>
        <div id="wrapper">{App}</div>
        <div id="footer">
          <p className="copyright">
            Copyrights&copy;2018 Virtual Technology,Ltd. ALL Rights Reserved.
          </p>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<ChangePassword />, document.getElementById('container'))
