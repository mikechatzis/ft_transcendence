import React from 'react'
import Avatar from '@mui/material/Avatar'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const Account: React.FC = () => {
	return (
		<div>
			<Container>
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
				</Grid>
			</Container>
		</div>
	)
}

export default Account