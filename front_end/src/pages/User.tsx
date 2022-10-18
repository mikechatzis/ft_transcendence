import Box from "@mui/material/Box"
// import Typography from "@mui/material/Typography"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { UrlContext } from "../context/UrlContext"
import { UserContext } from "../context/UserContext"
import { Status } from "../enum/status"
import MatchHistoryUser from "../components/MatchHistoryUser"
import Notification from '../components/Notification'

const User: React.FC = () => {
	const [user, setUser] = useState<any>(null)
	const { name } = useParams()
	const baseUrl = useContext(UrlContext)
	const {context, setContext} = useContext(UserContext)
	const navigate = useNavigate()
	const [message, setMessage] = useState<string | null>(null)

	const handleFriend = (user: any) => () => {
		let friendUser = {...user}

		axios.post(baseUrl + 'users/addFriend', {friend: friendUser.id}, {withCredentials: true}).then(() => {
			setMessage(`user ${friendUser.name} added to your friendlist`) 
		}).catch((error) => {
				console.log(error) 
			})
	}

	useEffect(() => {
		axios.get(baseUrl + `users/user/${name}`, {withCredentials: true}).then((response) => {
			setUser(response.data)
		}).catch((error) => {
			if (error.response.status === 404) {
				navigate("/404")
			}
			if (error.response.status === 401) {
				setContext?.(false)
				navigate("/login")
			}
		})
		const timeout = setTimeout(() => {
			setMessage('')
		}, 2000)

		return () => clearTimeout(timeout)
	}, [baseUrl, name, navigate, message])


	// const getStatus = () => {
	// 	if (user?.status === Status.OFFLINE) {
	// 		return 'offline'
	// 	}
	// 	else if (user?.status === Status.ONLINE) {
	// 		return 'online'
	// 	}
	// }


	return (
		<section className="profile">
			<Notification message={message} />
			<Box className="header">
				<div className="details">
					<div className="btn btn-one" onClick={handleFriend(user)}>
						<span className="btn btn-one">Add Friend</span>
					</div>
					<div className='emptySpace'></div>
					<img src={baseUrl + `users/me/profileImg?${Date.now()}`} alt="" className="profile-pic"></img>
					<h1 className="heading">Username: {user?.name}</h1>
					<h1 className="sub">Intra Name: {user?.intraName ? user?.intraName : 'not used'}</h1>
					<div className="stats">
						<div className="col-4">
							<h4>Score</h4>
							<p>{user?.score}</p>
						</div>
						<div className="col-4">
							<h4>Rank</h4>
							<p>{user?.rank}</p>
						</div>
					</div>
				</div>
			</Box>
			<Box maxWidth={'90%'} paddingLeft='10vw' paddingBottom={'2vh'} fontWeight='bold' textAlign={'center'} fontSize='4vh'>
			Match History
					<MatchHistoryUser />
			</Box>
		</section>
	)
}

export default User