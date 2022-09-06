import { Typography } from "@mui/material"
import Box from "@mui/material/Box"

const Notification: React.FC<{message: string | null}> = ({message}) => {
	return (
		<Box color="red" padding="10px" display="flex" justifyContent="center" alignItems="center">
			<Typography variant="h5">{message}</Typography>
		</Box>
	)
}

export default Notification