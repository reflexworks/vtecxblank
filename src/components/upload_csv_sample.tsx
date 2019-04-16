import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios, { AxiosError } from 'axios'
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {}
/* コンポーネントのStateの型宣言 */
interface ComponentState {}

class UploadCsvForm extends React.Component<ComponentProps, ComponentState> {
  constructor(props: ComponentProps) {
    super(props)
    this.state = {}
  }

  handleSubmit(e: React.FormEvent<any>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    // 画像は、/d/registration/{key} としてサーバに保存されます
    axios({
      url: '/s/getcsv',
      method: 'post',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      data: formData
    })
      .then(() => {
        alert('success')
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          alert('error=' + JSON.stringify(error.response))
        } else {
          alert('error')
        }
      })
  }

  render() {
    return (
      <Form horizontal onSubmit={e => this.handleSubmit(e)}>
        <FormGroup>
          <FormControl type="file" name="csv" />
        </FormGroup>
        <FormGroup>
          <Button type="submit" className="btn btn-primary">
            登録
          </Button>
        </FormGroup>
      </Form>
    )
  }
}

ReactDOM.render(<UploadCsvForm />, document.getElementById('container'))
