import React from 'react';
import {useNavigate} from 'react-router-dom'
import Button from '@mui/material/Button'

const Menu: React.FC = () => {
	const navigate = useNavigate()
	return (
		<div>
			<Button onClick={() => (navigate("/"))}>Home</Button>
			<Button onClick={() => (navigate("/login"))}>Login</Button>
		</div>
	)
}

export default Menu