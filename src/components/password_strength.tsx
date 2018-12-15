import '../styles/password-strength.css'
import * as React from 'react'
import * as zxcvbn from 'zxcvbn'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
  changeCallback: any
  className: string
  minLength: number
  minScore: number
  scoreWords: string[]
  tooShortWord: string
  inputProps: any
  defaultValue?: string
  userInputs?: string[]
  style?: object
}

interface DefaultProps {
  changeCallback: any
  className: string
  defaultValue: string
  minLength: number
  minScore: number
  scoreWords: object
  tooShortWord: string
  userInputs: string[]
}

//type PropsWithDefaults = ComponentProps & DefaultProps

/* コンポーネントのStateの型宣言 */
interface ComponentState {
  score: number
  isValid: boolean
  password: string
}

const isTooShort: any = (password: string, minLength: number) => password.length < minLength

export default class PasswordStrength extends React.Component<ComponentProps, ComponentState> {
  reactPasswordStrengthInput: any

  constructor(props: ComponentProps) {
    super(props)
    this.state = {
      score: 0,
      isValid: false,
      password: ''
    }
  }

  public static defaultProps: DefaultProps = {
    changeCallback: null,
    className: '',
    defaultValue: '',
    minLength: 5,
    minScore: 2,
    scoreWords: ['weak', 'weak', 'okay', 'good', 'strong'],
    tooShortWord: 'too short',
    userInputs: []
  }

  componentDidMount() {
    const { defaultValue } = this.props

    if (defaultValue && defaultValue.length > 0) {
      this.setState({ password: defaultValue }, this.handleChange)
    }
  }

  clear = () => {
    const { changeCallback } = this.props

    this.setState(
      {
        score: 0,
        isValid: false,
        password: ''
      },
      () => {
        this.reactPasswordStrengthInput.value = ''

        if (changeCallback !== null) {
          changeCallback(this.state)
        }
      }
    )
  }

  handleChange = () => {
    const { changeCallback, minScore, userInputs, minLength } = this.props
    const password = this.reactPasswordStrengthInput.value

    let score: number = 0
    let result: any = null

    // always sets a zero score when min length requirement is not met
    // avoids unnecessary zxcvbn computations (CPU intensive)
    if (isTooShort(password, minLength) === false) {
      result = zxcvbn(password, userInputs)
      score = result.score
    }

    this.setState(
      {
        isValid: score >= minScore,
        password,
        score
      },
      () => {
        if (changeCallback !== null) {
          changeCallback(this.state, result)
        }
      }
    )
  }

  render() {
    const { score, password, isValid } = this.state
    const { scoreWords, inputProps, className, style, tooShortWord, minLength } = this.props

    const inputClasses = ['ReactPasswordStrength-input']
    const wrapperClasses = [
      'ReactPasswordStrength',
      className ? className : '',
      password.length > 0 ? `is-strength-${score}` : ''
    ]
    const strengthDesc = isTooShort(password, minLength) ? tooShortWord : scoreWords[score]

    if (isValid === true) {
      inputClasses.push('is-password-valid')
    } else if (password.length > 0) {
      inputClasses.push('is-password-invalid')
    }

    if (inputProps && inputProps.className) {
      inputClasses.push(inputProps.className)
    }

    return (
      <div className={wrapperClasses.join(' ')} style={style}>
        <input
          type="password"
          {...inputProps}
          className={inputClasses.join(' ')}
          onChange={this.handleChange}
          ref={ref => (this.reactPasswordStrengthInput = ref)}
          value={password}
        />

        <div className="ReactPasswordStrength-strength-bar" />
        <span className="ReactPasswordStrength-strength-desc">{strengthDesc}</span>
      </div>
    )
  }
}
