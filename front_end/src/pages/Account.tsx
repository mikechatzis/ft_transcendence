import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Avatar from '@mui/material/Avatar'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const Account: React.FC = () => {
	const [name, setName] = useState('')

	const getName = () => {
		let config = {
			// headers: {
			// 	Authorization: 'Bearer ' + sessionStorage.getItem('jwt')
			// }
			withCredentials: true
		}

		axios.get("http://localhost:3333/users/me/name", config).then(response => setName(response.data)).catch((error) => console.log(error))
	}

	useEffect(getName, [])

	return (
		<div>
			{<Container>
				<Grid container spacing={10}>
					<Grid item xs={6}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Typography variant="h1">Hello</Typography>
						</Box>
					</Grid>
					<Grid item xs={6}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Typography variant="h1">World</Typography>
						</Box>
					</Grid>
					<Grid item>
						<Typography variant="h1">
							{`Your username is ${name}`}
						</Typography>
					</Grid>
				</Grid>
			</Container>}
		</div>
	)
}

export default Account