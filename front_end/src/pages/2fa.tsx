import { useState, useContext } from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UrlContext } from '../context/UrlContext'
import { UserContext } from '../context/UserContext'
import Notification from '../components/Notification'

const TwoFactor: React.FC = () => {
	const [code, setCode] = useState('')
	const [message, setMessage] = useState<string | null>(null)
	const {context, setContext} = useContext(UserContext)
	const baseUrl = useContext(UrlContext)
	const navigate = useNavigate()

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
						<Grid container direction="column" spacing={2}>
							<Grid item>
								<TextField fullWidth
									label="Google Authenticator code"
									placeholder="Code"
									variant="outlined"
									required
									onChange={(e) => setCode(e.target.value)} />
							</Grid>
							<Grid item>
								<Button fullWidth variant="contained" onClick={() => {
									axios.post(baseUrl + "auth/2fa/authenticate", {twoFactorAuthenticationCode: code}, {withCredentials: true}).then(() => {
										setContext?.(true)
										navigate("/account")
									}).catch((error) => {
										setMessage("Authentication code invalid")
										setTimeout(() => {setMessage(null)}, 5000)
									})
								}} >
									Submit
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Container>
		</div>
	)
}

export default TwoFactor