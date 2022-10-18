import CircularProgress from "@mui/material/CircularProgress"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Typography from "@mui/material/Typography"

const Queue: React.FC<{open: boolean}> = ({open}) => {
	return (
		<>
		<Dialog open={open}>
			<DialogTitle sx={{fontSize: 40}}>Waiting for an opponent...&nbsp;&nbsp;<CircularProgress size={40} /></DialogTitle>
		</Dialog>
		</>
	)
}

export default Queue