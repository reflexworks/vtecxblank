import '../styles/index.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
	Form,
	Col,
	FormGroup
} from 'react-bootstrap'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
	//hello: string
}

class CompletedForm extends React.Component<ComponentProps> {

	constructor(props: ComponentProps) {
		super(props)
	}

	render() {
		return (
			<div>
				<header>
					<div className="contents_in">
						<a href="http://reflexworks.jp/contact.html#company"><img src="../img/logo_vt.svg" alt="有限会社バーチャルテクノロジー" /></a>
					</div>
				</header>
				<div id="wrapper">
					<div className="vtecx-from">
						<div className="vtecx-from-container">
							<div className="vtecx-from-content">
								<h2>
									<img src="../img/logo.svg" alt="有限会社バーチャルテクノロジー" height="24px" />
									<span>本登録完了</span>
								</h2>
								<Form>
									<FormGroup>
										<Col sm={12}>
											仮登録から本登録の手続きが完了しました。<br /><br />
											<a href="index.html">トップページ</a>
										</Col>
									</FormGroup>
								</Form>
							</div>
						</div>
					</div>
				</div>
				<div id="footer">
					<p className="copyright">Copyrights&copy;2018 Virtual Technology,Ltd. ALL Rights Reserved.</p>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<CompletedForm />, document.getElementById('container'))