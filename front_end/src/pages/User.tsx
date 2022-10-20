import Box from "@mui/material/Box"
// import Typography from "@mui/material/Typography"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { UrlContext } from "../context/UrlContext"
import { UserContext } from "../context/UserContext"
// import { Status } from "../enum/status"
import MatchHistoryUser from "../components/MatchHistoryUser"
import Notification from '../components/Notification'
import { Button } from "@mui/material"

const User: React.FC = () => {
	const [user, setUser] = useState<any>(null)
	const [owner, setOwner] = useState<any>(null)
	const { name } = useParams()
	const baseUrl = useContext(UrlContext)
	const {context, setContext} = useContext(UserContext)
	const navigate = useNavigate()
	const [message, setMessage] = useState<string | null>(null)

	const handleFriend = (user: any) => () => {
		if (user?.d === owner?.id) {
			console.log('here')
			return
		}
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

	const getName = () => {
		let config = {
			withCredentials: true
		}

		axios.get(baseUrl + "users/me", config).then(response => {
			setOwner(response.data)
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

	useEffect(getName, [baseUrl, navigate, user])


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
					<div className="btn btn-one">
						{!(user?.id === owner?.id) && <Button  onClick={handleFriend(user)} className="btn btn-one"
						style={{'pointerEvents': (user?.id === owner?.id) ? 'none' : 'auto', 'cursor':  'auto' }}>Add Friend</Button>}	
					</div>
					<div className='emptySpace'></div>
					<img src={baseUrl + `users/me/profileImg?${Date.now()}`} alt="" className="profile-pic"></img>
					<h1 className="heading">Username: {user?.name}</h1>
					{user?.intraName && <h1 className="sub">Intra Name: {user?.intraName ? user?.intraName : 'not used'}</h1>} 
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
			<Box maxWidth={'90%'} paddingLeft='10vw' paddingBottom={'2vh'} fontWeight='bold' textAlign={'center'} alignContent='center' fontSize='4vh'>
			{user?.name}'s match history
					<MatchHistoryUser />
			</Box>
		</section>
	)
}

export default User