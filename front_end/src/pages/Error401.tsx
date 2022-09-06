import React from 'react'
import Container from "@mui/material/Container"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const Error401: React.FC = () => {
	return (
		<Container>
			<Box display="flex" justifyContent="center" alignItems="center" padding={10}>
				<Typography variant="h3">
					Uh oh... seems like you do not have access to this page
				</Typography>
			</Box>
			<Box display="flex" justifyContent="center" alignItems="center">
				<img src="https://http.cat/401" alt="401cat" />
			</Box>
		</Container>
	)
}

export default Error401