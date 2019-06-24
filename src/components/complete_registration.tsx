import '../styles/index.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {
  CommonProvider,
  CommonStepper,
  CommonGrid,
  CommonBox,
  CommonText,
} from './common-dom'

export const CompleteRegistration = (_props: any) => {

  return (
    <CommonGrid>
      <CommonStepper
        activeStep={2}
        steps={['仮登録', '仮登録完了', '本登録完了']}
      />

      <CommonBox>
          <CommonBox top={2} bottom={4} align="center">
            <CommonText>本登録が完了しました。</CommonText>
          </CommonBox>
        </CommonBox>

      </CommonGrid>

  )
}
const App: any = () => {
  return (
    <CommonProvider>
      <CompleteRegistration />
    </CommonProvider>
  )
}
ReactDOM.render(<App />, document.getElementById('container'))
