import React from 'react';
import Typography from '@mui/material/Typography'
import DataTable from '../components/DataTable'

const Home: React.FC = () => {

	return (
		<div>
			<Typography variant="h3">Home</Typography>
			<DataTable />
		</div>
	)
}

export default Home