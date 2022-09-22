import { useContext, useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import axios from "axios"
import { UrlContext } from "../context/UrlContext"
import { useNavigate } from "react-router-dom"

const SearchBar: React.FC = () => {
	const [users, setUsers] = useState<any[]>([])
	const [rerender, setRerender] = useState(false)
	const baseUrl = useContext(UrlContext)
	const navigate = useNavigate()

	useEffect(() => {
		axios.get(baseUrl + "users/all", {withCredentials: true}).then((response) => {
			setUsers(response.data)
		})
	}, [baseUrl, rerender])

	return (
		<Autocomplete
			freeSolo
			id="search-bar"
			options={users.map((user) => user.name)}
			renderInput={(params) => {
				// setRerender(!rerender)
				return (
					<TextField {...params} label="Search" onChange={() => setRerender(!rerender)} />
				)
			}}
			onChange={(e, value) => {
				e.preventDefault()
				navigate(`/users/${value}`)
			}}
			disableClearable
			style={{width: 250}}
		/>
	)
}

export default SearchBar