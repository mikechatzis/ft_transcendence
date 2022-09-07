import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Notification from '../components/Notification'
import { UrlContext } from '../context/UrlContext'


const Settings: React.FC = () => {
	const [name, setName] = useState('')
	const [message, setMessage] = useState<string | null>(null)
	const [qrUrl, setQrUrl] = useState('')
	const [code, setCode] = useState('')
	const [qrDisplayed, setQrDisplayed] = useState(false)
	const baseUrl = useContext(UrlContext)
	const navigate = useNavigate()

	const handleNameChange = () => {
		axios.post(baseUrl + "users/me/name", {name}, {withCredentials: true}).then(() => {
			navigate("/account")
		}).catch((error) => {
			setMessage(error.response.data.message)
			setTimeout(() => {
				setMessage(null)
			}, 5000)
		})
	}

	return (
		<div>
			<Notification message={message} />
			<Container maxWidth="sm">
				<Grid container
					spacing={2}
					direction="column"
					justifyContent="center"
					style={{minHeight: "80vh"}}
				>
					<Paper elevation={2} sx={{padding: 5}}>
						<form>
							<Grid container direction="column" spacing={2}>
								<Grid item>
									<TextField fullWidth
										label="New username"
										placeholder="Username"
										variant="outlined"
										required
										onChange={(e) => {setName(e.target.value)}}
									/>
								</Grid>
								<Grid item>
									<Button fullWidth variant="contained" onClick={handleNameChange}>
										Change username
									</Button>
								</Grid>
								{!qrDisplayed && <Grid item>
									<Button fullWidth onClick={() => {
										axios.get(baseUrl + "auth/2fa/generate", {withCredentials: true}).then((response) => {
											console.log(response.data)
											setQrUrl(response.data)
											setQrDisplayed(true)
										})
									}}>
										Enable Google authenticator
									</Button>
								</Grid>}
								{qrDisplayed && <Grid item>
									<Box display="flex" justifyContent="center" alignItems="center" flex={1}>
										<img src={qrUrl} />
									</Box>
								</Grid>}
								{qrDisplayed && <Grid item>
									<TextField fullWidth
										label="Google Authenticator code"
										placeholder="code"
										variant="outlined"
										required
										onChange={(e) => {setCode(e.target.value)}}
									/>
								</Grid>}
								{qrDisplayed && <Grid item>
									<Button fullWidth variant="contained" onClick={() => {
										axios.post(baseUrl + "auth/2fa/turn-on", {twoFactorAuthenticationCode: code}, {withCredentials: true}).then(() => console.log("frorg"))
									}}>
										Submit code
									</Button>
								</Grid>}
							</Grid>
						</form>
					</Paper>
				</Grid>
			</Container>
		</div>
	)
}

export default Settings