  
import React from 'react'
import ReactDOM from 'react-dom'
// 外部にある唯一の状態オブジェクト
const user = { name: '', age: 25, consent: false }

const change = event => {
	const target = event.target
	const value = target.type === 'checkbox' ? target.checked : target.value
	user[target.name] = value // 外部の状態を変更して、
	render() // 新しいデータでざっくり再描画
}

const submit = () => {
  /* userは最新版のフォームの状態を常に反映している！*/
	alert(`${user.name}さん、登録ありがとう!`)
}

const isValidUser = () => (user.name.length > 0 && user.age >= 20 && user.consent)

// コンポーネント定義 
const UserForm = () => <div>
    <p>名前: <input name="name" type="text" value={user.name} onChange={change} /></p>
    <p>年齢: <input name="age" type="number" value={user.age} onChange={change} /></p>
    <p><input name="consent" type="checkbox" checked={user.consent} onChange={change} /> 規約読みました</p>
    <button onClick={submit} disabled={!isValidUser()}>20歳以上なので登録</button>
    <pre>{JSON.stringify(user)}</pre>
</div>

const render = () => {
	ReactDOM.render(<UserForm user={user} />, document.getElementById('container'))
}

render()
