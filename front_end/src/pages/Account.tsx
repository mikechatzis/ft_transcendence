import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Avatar from '@mui/material/Avatar'
import Button from "@mui/material/Button"
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Input from "@mui/material/Input"
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { UrlContext } from '../context/UrlContext'

const Account: React.FC = () => {
	const [name, setName] = useState('')
	const [selectedFile, setSelectedFile] = useState<any>(null)
	const {context, setContext} = useContext(UserContext)
	const baseUrl = useContext(UrlContext)

	const navigate = useNavigate()

	const handleSubmit = (event: any) => {
		event.preventDefault()
		const formData = new FormData()
		formData.append('file', selectedFile)

		console.log(selectedFile)
		
		axios.post(baseUrl + 'users/me/profileImg', formData, {withCredentials: true, headers: {
			'Content-Type': 'multipart/form-data'
		  } }).catch((error) => {console.log(error)})
	}

	const handleFileSelect = (event: any) => {
		setSelectedFile(event.target.files[0])
	}

	const getName = () => {
		let config = {
			withCredentials: true
		}

		axios.get(baseUrl + "users/me/name", config).then(response => {
			setName(response.data)
		}).catch((error) => {
			if (error.response.status === 401) {
				setContext?.(false)
				navigate("/login")
			}
			else {
				console.log(error)
			}
		})
	}

	useEffect(getName, [])

	return (
		<div>
			{<Container>
				<Grid container spacing={10}>
					<Grid item xs={6}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Typography variant="h1">Hello</Typography>
						</Box>
					</Grid>
					<Grid item xs={6}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Typography variant="h1">World</Typography>
						</Box>
					</Grid>
					<Grid item>
						<Typography variant="h1">
							{`Your username is ${name}`}
						</Typography>
					</Grid>
					<Grid item>
						<form onSubmit={handleSubmit}>
							<Button component="span">
								<Input type="file" onChange={handleFileSelect} />
							</Button>
							<Input type="submit" value="Upload file" />
						</form>
					</Grid>
				</Grid>
			</Container>}
		</div>
	)
}

export default Account