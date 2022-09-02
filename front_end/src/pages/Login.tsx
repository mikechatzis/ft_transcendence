import React from 'react'
import {useState} from 'react'
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

const baseUrl = "http://localhost:3333"

const Login: React.FC = () => {
	const [values, setValues] = useState({
		username:'',
		password: '',
		showPassword: false
	})

	const handleVisibility = () => {
		setValues({
			...values,
			showPassword: !values.showPassword,
		});
	};

	const handleSignUp = () => {
		axios.post(baseUrl + "/auth/signup", {
			email: values.username,
			password: values.password
		}).then((response) => {
			console.log(response)
			console.log(values)
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
									<Button fullWidth variant="contained">
										Sign In
									</Button>
								</Grid>
								<Grid item>
									<Button fullWidth variant="contained" onClick={handleSignUp}>
										Sign Up
									</Button>
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