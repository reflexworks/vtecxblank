import * as React from 'react'

declare global {
  interface Window {
    grecaptcha: any
  }
}

const isReady = () => typeof window !== 'undefined' && typeof window.grecaptcha !== 'undefined'

let readyCheck: any

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
  sitekey: string
  verifyCallback: Function
  action: any
}

interface ComponentState {
  ready: boolean
}

export default class ReCaptcha extends React.Component<ComponentProps, ComponentState> {
  constructor(props: ComponentProps) {
    super(props)
    this.execute = this.execute.bind(this)
    this.state = {
      ready: isReady()
    }

    if (!this.state.ready) {
      readyCheck = setInterval(this._updateReadyState.bind(this), 1000)
    }
  }

  componentDidMount() {
    if (this.state.ready) {
      this.execute()
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    prevProps
    if (this.state.ready && !prevState.ready) {
      this.execute()
    }
  }

  componentWillUnmount() {
    clearInterval(readyCheck)
  }

  execute() {
    const { ready } = this.state
    const { sitekey, verifyCallback, action } = this.props

    if (ready) {
      window.grecaptcha.execute(sitekey, { action }).then(function(token: string) {
        verifyCallback(token)
      })
    }
  }

  _updateReadyState() {
    if (isReady()) {
      this.setState({ ready: true })
      clearInterval(readyCheck)
    }
  }

  render() {
    if (this.state.ready) {
      return <div data-verifycallbackname="verifyCallback" />
    } else {
      return <div className="g-recaptcha" />
    }
  }
}
