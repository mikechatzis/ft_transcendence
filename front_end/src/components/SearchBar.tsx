import { Fragment, useContext, useEffect, useState } from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import TextField from "@mui/material/TextField"
import axios from "axios"
import { UrlContext } from "../context/UrlContext"

const SearchBar: React.FC = () => {
	const [users, setUsers] = useState<any[]>([])
	const baseUrl = useContext(UrlContext)

	useEffect(() => {
		axios.get(baseUrl + "users/all", {withCredentials: true}).then((response) => {
			setUsers(response.data)
			console.log(typeof response.data)
			console.log(response.data)
		})
	}, [baseUrl])

	return (
		<>
			<TextField 
				variant="outlined"
				fullWidth
				label="search"
				style={{
					width: "20rem"
				}}
			/>
			<List>
				{users?.map((user, index) => {
					return (
						<Fragment key={index}>
							<ListItem>
								<ListItemText primary={user.name} />
							</ListItem>
							<hr />
						</Fragment>
					)
				})}
			</List>
		</>
	)
}

export default SearchBar