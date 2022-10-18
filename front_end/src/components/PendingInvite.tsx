import CircularProgress from "@mui/material/CircularProgress"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Typography from "@mui/material/Typography"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { GameContext } from "../context/GameContext"

const PendingInvite: React.FC<{open: boolean}> = ({open}) => {
	const gameSocket = useContext(GameContext)
	const navigate = useNavigate()

	useEffect(() => {
		gameSocket.on('invite-start', () => {
			navigate("/multi-def")
		})
	})

	return (
		<>
		<Dialog open={open}>
			<DialogTitle sx={{fontSize: 40}}>Waiting for response...&nbsp;&nbsp;<CircularProgress size={40} /></DialogTitle>
		</Dialog>
		</>
	)
}

export default PendingInvite