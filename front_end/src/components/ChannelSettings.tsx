import axios from "axios"
import { useContext, useEffect, useState } from "react"
import Button from '@mui/material/Button'
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
import { UrlContext } from "../context/UrlContext"

const ChannelSettings: React.FC<{handleSubmit: () => void, url: string, handleError: (error: any) => void}> = ({handleSubmit, url, handleError}) => {
	const [userData, setUserData] = useState<any>(null)
	const [password, setPassword] = useState<string>('')
	const [showPassword, setShowPassword] = useState(false)
	const [open, setOpen] = useState(false)
	const baseUrl = useContext(UrlContext)

	useEffect(() => {
		axios.get(baseUrl + "users/me", {withCredentials: true}).then((response) => {
			setUserData(response.data)
		})
	}, [baseUrl])

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

	const handleSubmitLocal = () => {
		if (password !== '') {
			axios.post(url, {password}, {withCredentials: true}).then(() => {
				handleSubmit()
				handleClose()
			}).catch(handleError)
		}
	}

	const handleRemovePass = () => {
		axios.post(url, {}, {withCredentials: true}).then(() => {
			handleSubmit()
			handleClose()
		}).catch(handleError)
	}

	return (
		<>
		<Button onClick={handleClickOpen}>
			Settings
		</Button>
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Channel settings</DialogTitle>
			<DialogContent>
				<DialogContentText>Enter new password</DialogContentText>
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
				<Button onClick={handleSubmitLocal}>Change password</Button>
				<Button onClick={handleRemovePass}>Remove password</Button>
			</DialogActions>
		</Dialog>
		</>
	)
}

export default ChannelSettings