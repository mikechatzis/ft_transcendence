import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
import { useContext } from "react"
import { GameContext } from "../context/GameContext"

const Queue: React.FC<{open: boolean, handleClose: any}> = ({open, handleClose}) => {
	const gameSocket = useContext(GameContext)

	return (
		<>
		<Dialog open={open}>
			<DialogTitle sx={{fontSize: 40}}>Waiting for an opponent...&nbsp;&nbsp;<CircularProgress size={40} /></DialogTitle>
			<DialogActions>
				<Button sx={{color: "red"}} onClick={() => {
					gameSocket.disconnect()
					gameSocket.connect()
					handleClose()
				}}>Cancel</Button>
			</DialogActions>
		</Dialog>
		</>
	)
}

export default Queue