import React from 'react';
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import DataTable from '../components/DataTable'

const Home: React.FC = () => {

	return (
		<div>
			<Container>
				<Box display="flex" justifyContent="center" alignItems="center" minHeight='15vh'>
					<Typography variant="h3">Home</Typography>
				</Box>
				<Box display="flex" justifyContent="center" alignItems="center" minHeight='35vh'>
				<DataTable />
				</Box>
			</Container>
		</div>
	)
}

export default Home