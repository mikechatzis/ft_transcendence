import React, { useContext } from 'react'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { Link } from '@mui/material'

const baseUrl = "http://localhost:3333"


const Login: React.FC = () => {
	const [values, setValues] = useState({
		username:'',
		password: '',
		showPassword: false
	})
	const {context, setContext} = useContext(UserContext)

	const navigate = useNavigate()


	const handleVisibility = () => {
		setValues({
			...values,
			showPassword: !values.showPassword,
		});
	};

	const handleSignUp = () => {
		axios.post(baseUrl + "/auth/signup", {
			name: values.username,
			password: values.password
		}).then((response) => {
			console.log(response.data)
			sessionStorage.setItem('jwt', response.data.access_token)
			setContext?.(true)
			setTimeout(() => navigate("/account"), 500)
		}).catch((error) => {
			console.log(error)
		})

	}

	const handleSignIn = () => {
		axios.post(baseUrl + "/auth/signin", {
			name: values.username,
			password: values.password
		}).then((response) => {
			console.log(response.data)
			sessionStorage.setItem('jwt', response.data.access_token)
			setContext?.(true)
			setTimeout(() => navigate("/account"), 500)
		}).catch((error) => {
			console.log(error)
		})

	}

	return (
		<div>
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
									<TextField type="username"
										fullWidth
										label="Enter your username"
										placeholder="Username"
										variant="outlined"
										required
										onChange={(e) => {setValues({...values, username: e.target.value})}} />
								</Grid>
								<Grid item>
									<TextField type={values.showPassword ? "text" : "password"}
									fullWidth
									label="Password"
									placeholder="Password"
									variant="outlined"
									required
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
									onChange={(e) => {setValues({...values, password: e.target.value})}} />
								</Grid>
								<Grid item>
									<Button fullWidth variant="contained" onClick={handleSignIn}>
										Sign In
									</Button>
								</Grid>
								<Grid item>
									<Button fullWidth variant="contained" onClick={handleSignUp}>
										Sign Up
									</Button>
								</Grid>
								<Grid item>
									<Link href="http://localhost:3333/auth/42/callback" color="inherit" marginTop={10}>
										Prefer to sign in with intra instead?
									</Link>
								</Grid>
							</Grid>
						</form>
					</Paper>
				</Grid>
			</Container>
		</div>
	)
}

export default Login