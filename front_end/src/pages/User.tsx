import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { UrlContext } from "../context/UrlContext"
import { Status } from "../enum/status"

const User: React.FC = () => {
	const [user, setUser] = useState<any>(null)
	const { name } = useParams()
	const baseUrl = useContext(UrlContext)
	const navigate = useNavigate()

	useEffect(() => {
		axios.get(baseUrl + `users/user/${name}`, {withCredentials: true}).then((response) => {
			setUser(response.data)
		}).catch((error) => {
			if (error.response.status === 404) {
				navigate("/404")
			}
			else if (error.response.status === 401) {
				navigate("/401")
			}
		})
	}, [baseUrl, name, navigate])

	const getStatus = () => {
		if (user?.status === Status.OFFLINE) {
			return 'offline'
		}
		else if (user?.status === Status.ONLINE) {
			return 'online'
		}
	}

	return (
		<>
			<Typography variant="h3">
				Username: {user?.name}
			</Typography>
			<Typography variant="h3">
				Status: {getStatus()}
			</Typography>
			<Box component="img" alt="profile" src={baseUrl + `users/${user?.id}/profileImg`} />
		</>
	)
}

export default User