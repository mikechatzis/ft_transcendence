import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { GameContext } from "../context/GameContext"

const GameInvite: React.FC<{open: boolean, user: string, id: number, handleClose: any}> = ({open, user, id, handleClose}) => {
	const gameSocket = useContext(GameContext)
	const navigate = useNavigate()

	useEffect(() => {
		gameSocket.on('invite-start', () => {
			navigate("/multi-def")
			handleClose()
		})
	})

	const handleAcccept = () => {
		gameSocket.emit('invite-response', {accept: true, id})
		handleClose()
	}

	const handleRefuse = () => {
		gameSocket.emit('invite-response', {accept: false, id})
		handleClose()
	}
	
	return (
		<>
		<Dialog open={open}>
			<DialogTitle>{`${user} challenges you to a game of pong!`}</DialogTitle>
			<DialogActions>
				<Button onClick={handleAcccept}>Accept</Button>
				<Button onClick={handleRefuse}>Refuse</Button>
			</DialogActions>
		</Dialog>
		</>
	)
}

export default GameInvite