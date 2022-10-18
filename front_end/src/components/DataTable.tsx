import React, { useContext, useEffect, useState } from 'react'
import {DataGrid, GridRowsProp, GridColDef} from '@mui/x-data-grid'
import { UrlContext } from '../context/UrlContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

var rowsId = 1

const singleRow = (id, name, score, rank) => {
	return {
		id: id,
		col1: name,
		col2: score,
		col3: rank
	}
}

const UsersLeaderboard = () => {
	const [users, setUsers] = useState<any>(null)
	const baseUrl = useContext(UrlContext)
	const navigate = useNavigate()

	let rows = [{ id:0, col1: 'noone has yet joined us', col2: 'we are sad', col3: 'signup button is above'}];

	useEffect(() => {
		axios.get(baseUrl + 'users/all', {withCredentials: false}).then((response) => {
			setUsers(response.data)
		}).catch((error) => {
			if (error.response.status === 404) {
				navigate("/404")
			}
			else if (error.response.status === 401) {
				navigate("/401")
			}
		})
	}, [baseUrl, navigate])
	if (users) {
		for (let i = 0; i < users.length; i++) {
			rows.push(singleRow(rowsId++, users[i].name, users[i].score, users[i].rank))
		}
		if (rows.length > 1) {
			rows.shift()
		}
		rows.sort((a, b) => parseInt(b.col2) - parseInt(a.col2))
	}


	const columns: GridColDef[] = [{
		field: "col1",
		headerName: "Player",
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
	
	return (
		<div style={{"height": (rows.length + 1) * 81, "width": '100%'}}>
			<DataGrid rows={rows.slice(0, 25)} columns={columns} />
		</div>
	)
}

export default UsersLeaderboard