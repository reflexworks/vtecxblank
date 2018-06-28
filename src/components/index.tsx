import * as React from 'react'
import * as ReactDOM from 'react-dom'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
	hello: string
}

/* コンポーネントのStateの型宣言 */
interface ComponentState {
	value: string
}

class Index extends React.Component<ComponentProps, ComponentState> {

	title: string
	constructor(props: ComponentProps) {
		super(props)
		this.state = {
			value: 'Hello',
		}
		this.title = 'world!'
	}

	render() {
		return (
			<div style={{ padding: '50px' }}>
				<h1>{this.state.value} {this.title}</h1>
				<h3>リンク集</h3>
				<ul>
					<li>チュートリアル（基礎編）：<a href="tutorial_1.html">こちら</a></li>
					<li>チュートリアル（応用編）：<a href="tutorial_2.html">準備中</a></li>
				</ul>
			</div>
		)
	}
}

ReactDOM.render(<Index hello="Hello" />, document.getElementById('container'))

