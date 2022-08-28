import React from 'react'
import Typography from '@mui/material/Typography'

const Error404: React.FC = () => {
	return (
		<>
			<Typography variant="h3">You got lost somewhere...</Typography>
			<img src="https://http.cat/404" alt="cat" />
		</>
	)
}

export default Error404