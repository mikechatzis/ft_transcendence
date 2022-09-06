import React from 'react'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

const Error404: React.FC = () => {
	return (
		<Container>
			<Box display="flex" justifyContent="center" alignItems="center" padding={10}>
				<Typography variant="h3">You got lost somewhere...</Typography>
			</Box>
			<Box display="flex" justifyContent="center" alignItems="center">
				<img src="https://http.cat/404" alt="404cat" />
			</Box>
		</Container>
	)
}

export default Error404