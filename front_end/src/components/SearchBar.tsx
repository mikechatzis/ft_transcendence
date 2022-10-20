import { useContext, useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import axios from "axios"
import { UrlContext } from "../context/UrlContext"
import { useNavigate } from "react-router-dom"
import { GameContext } from "../context/GameContext"

const SearchBar: React.FC = () => {
	const [users, setUsers] = useState<any[]>([])
	const [rerender, setRerender] = useState(false)
	const [value, setValue] = useState('')
	const baseUrl = useContext(UrlContext)
	const gameSocket = useContext(GameContext)
	const navigate = useNavigate()

	useEffect(() => {
		axios.get(baseUrl + "users/all", {withCredentials: true}).then((response) => {
			setUsers(response.data)
		})
	}, [baseUrl, rerender])

	return (
		<Autocomplete
			value={value}
			freeSolo
			id="search-bar"
			options={users.map((user) => user.name)}
			renderInput={(params) => {
				return (
					<TextField {...params} label="Search" />
				)
			}}
			onChange={(e, value) => {
				e.preventDefault()
				axios.get(baseUrl + `users/user/${value}`, {withCredentials: true}).then(() => {
					gameSocket?.disconnect()
					gameSocket?.connect()
					navigate(`/users/${value}`)
				}).catch()
				
			}}
			// disableClearable
			style={{width: 250}}
		/>
	)
}

export default SearchBar