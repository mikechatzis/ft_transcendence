import { useState } from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const CreateChannel: React.FC<{handleCreate: (values: any) => void}> = ({handleCreate}) => {
	const [open, setOpen] = useState(false)
	const [values, setValues] = useState({
		name:'',
		password: '',
		showPassword: false
	})

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setValues({
			name:'',
			password: '',
			showPassword: false
		})
		setOpen(false)
	}

	const handleVisibility = () => {
		setValues({
			...values,
			showPassword: !values.showPassword,
		});
	};

	const handleSubmit = () => {
		handleCreate(values)
		handleClose()
	}

	return (
		<>
		<Button variant="outlined" onClick={handleClickOpen}
			style={{
				margin: "auto",
				width: "100%"
			}}
		>
			Create channel
		</Button>
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Create channel</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Enter your channel name, and optionally password
				</DialogContentText>
				<TextField type="username"
					fullWidth
					label="Enter channel name"
					placeholder="Name"
					variant="outlined"
					required
					style={{
						padding: 5
					}}
					onChange={(e) => {
						setValues({...values, name: e.target.value})
					}}
				/>
				<TextField
					type={values.showPassword ? "text" : "password"}
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
									{values.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
								</IconButton>
							</InputAdornment>
						)
					}}
					onChange={(e) => {
						setValues({...values, password: e.target.value})
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleSubmit}>Create</Button>
			</DialogActions>
		</Dialog>
		</>
	)
}

export default CreateChannel