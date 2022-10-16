import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Avatar from '@mui/material/Avatar'
import Button from "@mui/material/Button"
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { UrlContext } from '../context/UrlContext'
import {DataGrid, GridRowsProp, GridColDef} from '@mui/x-data-grid'

import './styles/AccountStyles.css'

const Account: React.FC = () => {
	const [user, setUser] = useState<any>(null)
	const {context, setContext} = useContext(UserContext)
	const baseUrl = useContext(UrlContext)

	const navigate = useNavigate()

	const getName = () => {
		let config = {
			withCredentials: true
		}

		axios.get(baseUrl + "users/me", config).then(response => {
			setUser(response.data)
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

	const columns: GridColDef[] = [{
		field: "col1",
		headerName: "Username",
		width: 170
	},
	{
		field: "col2",
		headerName: "Score",
		width: 170
	},
	{
		field: "col3",
		headerName: "Rank",
		width: 170
	}]

	const rows = [{
		id: 1,
		col1: user?.name,
		col2: user?.score,
		col3: user?.rank
	}]

	return (
		<div>
			{<Container>
				<Grid className='container' container spacing={10}>
					<Grid item >
						<Box className='profileImg' component="img" alt="profile" src={baseUrl + "users/me/profileImg"}/>
					</Grid>
				</Grid>
				<div className='grid'>
					<DataGrid rows={rows} columns={columns} hideFooter disableColumnSelector/>
				</div>
			</Container>}
		</div>
	)
}

export default Account