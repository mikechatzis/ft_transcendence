import React from 'react'
import {useState} from 'react'

const Login: React.FC = () => {
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')

	return (
		<form>
			<div>
				Login: <input value={login} onChange={(event) => setLogin(event.target.value)} />
			</div>
			<div>
				Password: <input value={"*".repeat(password.length)} onChange={(event) => setPassword(event.target.value)} />
			</div>
		</form>
	)
}

export default Login