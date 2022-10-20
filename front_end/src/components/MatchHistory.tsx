import React, { useContext, useEffect, useState } from 'react'
import {DataGrid, GridRowsProp, GridColDef} from '@mui/x-data-grid'
import { UrlContext } from '../context/UrlContext'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

var rowsId = 1

const singleRow = (id, nameVS, date, status) => {
	return {
		id: id,
		col1: nameVS,
		col2: date,
		col3: status
	}
}

const MatchHistory = () => {
	const [user, setUser] = useState<any>(null)
	const [opponents, setOpponents] = useState<any>([])
	const {context, setContext} = useContext(UserContext)
	const baseUrl = useContext(UrlContext)
	const navigate = useNavigate()

	let rows = [{ id:0, col1: 'looks like', col2: 'you have not played', col3: 'any games yet'}];

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
		// getOpponent()
	}

	const getOpponent = () => {
		let config = {
			withCredentials: true
		}
		for (let i = 0; i < user?.matchHistory.length; i++) {
			axios.get(baseUrl + `users/${user?.matchHistory[i]?.opponentId}`, config).then(response => {
				setOpponents((prevOpponents) => [...prevOpponents, response.data])
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
	}

	function makeArray() {
		if (user && opponents) {
			for (let i = 0; i < opponents.length; i++) {
				let name;
				for (let j = 0; j < opponents.length; j++) {
					if (opponents[j].id === user?.matchHistory[i]?.opponentId) {
						name = opponents[j].name
						break
					}
				}
				if (user?.matchHistory[i]?.date)
					rows.push(singleRow(rowsId++, name, new Date(user?.matchHistory[i]?.date).toLocaleString(), user?.matchHistory[i]?.winner == user?.id ? "victory" : "defeat"))
			}
			if (rows.length > 1) {
				rows.shift()
			}
			// rows.sort((a, b) => parseInt(a.col2) - parseInt(b.col2))
			rows.reverse()
		}
	 }
	
	useEffect(getName, [baseUrl, navigate, opponents])
	useEffect(getOpponent, [baseUrl, navigate, user])
	makeArray()
	



	const columns: GridColDef[] = [{
		field: "col1",
		headerName: "VS",
		width: 170
	},
	{
		field: "col2",
		headerName: "Played on",
		width: 200
	},
	{
		field: "col3",
		headerName: "Status",
		width: 170
	}]
	
	return (
		<div style={{"height": (rows.length + 1) * 81, "width": '100%'}}>
			<DataGrid rows={rows} columns={columns} />
		</div>
	)
}

export default MatchHistory