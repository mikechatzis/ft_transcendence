import { useState } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import axios from 'axios'

const JoinPrivate: React.FC<{handleJoin: () => void, url: string, handleError: (error: any) => void}> = ({handleJoin, url, handleError}) => {
	const [open, setOpen] = useState(false)
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setPassword('')
		setOpen(false)
	}

	const handleVisibility = () => {
		setShowPassword(!showPassword)
	}

	const handleSubmit = () => {
		axios.post(url, {password}, {withCredentials: true}).then(handleJoin).catch(handleError)
		handleClose()
	}

	return (
		<>
		<Button onClick={handleClickOpen}>
			Join
		</Button>
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Join channel</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Enter channel password
				</DialogContentText>
				<TextField
					type={showPassword ? "text" : "password"}
					fullWidth
					label="Password"
					placeholder="Password"
					variant="outlined"
					style={{
						padding: 5
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={handleVisibility}
								aria-label="toggle password"
								edge="end">
									{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
								</IconButton>
							</InputAdornment>
						)
					}}
					onChange={(e) => {
						setPassword(e.target.value)
					}}
				/>
			</DialogContent>
			<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleSubmit}>Join</Button>
			</DialogActions>
		</Dialog>
		</>
	)
}

export default JoinPrivate