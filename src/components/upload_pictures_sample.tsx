import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios, { AxiosError } from 'axios'
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {}
/* コンポーネントのStateの型宣言 */
interface ComponentState {
  picture1: any
  picture2: any
  [propName: string]: any
}

class UploadPictureForm extends React.Component<ComponentProps, ComponentState> {
  constructor(props: ComponentProps) {
    super(props)
    this.state = { picture1: {}, picture2: {} }
  }

  handleChange(e: React.FormEvent<any>) {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files.item(0)
      if (file) {
        const key = '/_html/img/' + encodeURIComponent(file.name)
        const name = e.currentTarget.name

        // 画像以外は処理を停止
        if (!file.type.match('image.*')) {
          return
        } else {
          // 画像表示
          let reader = new FileReader()
          reader.onload = () => {
            this.setState({ [name]: { value: reader.result, key: key } })
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  handleSubmit(e: React.FormEvent<any>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const param =
      (this.state.picture1.key ? 'key1=' + this.state.picture1.key + '&' : '') +
      (this.state.picture2.key ? 'key2=' + this.state.picture2.key : '')

    // 画像は、/d/_html/img/{key} としてサーバに保存されます
    axios({
      url: '/s/savefiles?' + param,
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
        <img src={this.state.picture1.value} />
        <br />
        <img src={this.state.picture2.value} />
        <br />
        <FormGroup>
          <FormControl type="file" name="picture1" onChange={e => this.handleChange(e)} />
        </FormGroup>
        <FormGroup>
          <FormControl type="file" name="picture2" onChange={e => this.handleChange(e)} />
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

ReactDOM.render(<UploadPictureForm />, document.getElementById('container'))
