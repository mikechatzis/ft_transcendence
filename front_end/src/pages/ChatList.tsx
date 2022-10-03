import axios from "axios"
import { useContext, useEffect, useState, Fragment } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import { ChatContext } from "../context/ChatContext"
import { UrlContext } from "../context/UrlContext"
import CreateChannel from "../components/CreateChannel"
import Notification from "../components/Notification"
import JoinPrivate from "../components/JoinPrivate"
import ChannelSettings from "../components/ChannelSettings"


const ChatList: React.FC = () => {
	const baseUrl = useContext(UrlContext)
	const socket = useContext(ChatContext)
	const [chatRooms, setChatRooms] = useState<object[]>([])
	const [message, setMessage] = useState<string | null>(null)
	const [rerender, setRerender] = useState(1)
	const [userData, setUserData] = useState<any>(null)
	const navigate = useNavigate()

	useEffect(() => {
		axios.get(baseUrl + "chat/channels", {withCredentials: true}).then((response) => {
			setChatRooms(response.data)
		}).catch((error) => {
			if (error.response.status === 401) {
				navigate("/login")
			}
			else {
				console.log(error)
			}
		})
	}, [rerender, baseUrl, navigate])

	useEffect(() => {
		axios.get(baseUrl + "users/me", {withCredentials: true}).then((response) => {
			setUserData(response.data)
		}).catch((error) => {
			if (error.response.status === 401) {
				navigate("/login")
			}
			else {
				setMessage(error.response.message)
				setTimeout(() => {
					setMessage(null)
				}, 5000)
			}
		})
	}, [rerender, baseUrl, navigate])

	const handleError = (error: any) => {
		if (error?.response?.status === 401) {
			navigate("/login")
		}
		else {
			setMessage(error.response.data.message)
			setTimeout(() => {
				setMessage(null)
			}, 5000)
		}
	}
	
	const channelList = chatRooms.map((room: any, index: any) => {
		const handleJoin = () => {
			socket.emit('join', {room: room.name})
			navigate(`/chat/${room.name}`)
		}

		const handleLeave = () => {
			axios.post(baseUrl + `chat/leave/${room.name}`, "", {withCredentials: true}).then(() => {
				socket.emit('leave', {room: room.name})
				setRerender(rerender + 1)
			}).catch(handleError)
		}

		const handleDelete = () => {
			axios.post(baseUrl + `chat/delete/${room.name}`, "", {withCredentials: true}).then(() => {
				socket.emit('delete', {room: room.name})
				setRerender(rerender + 1)
			})
		}

		const handleChangePass = () => {
			setRerender(rerender + 1)
		}

		const isUserInRoom = userData?.channels.includes(room.name)

		const isUserAdmin = room.admins.includes(userData?.id)

		if (room.isPrivate && !room.isDmChannel) {
			return (
				<Fragment key={index}>
				<ListItem>
					<ListItemText primary={room.name} />
					<JoinPrivate handleError={handleError} url={baseUrl + `chat/join/${room.name}`} handleJoin={handleJoin} />
					{(isUserInRoom && isUserAdmin) && <ChannelSettings handleSubmit={handleChangePass} url={baseUrl + `chat/change-pass/${room.name}`} handleError={handleError} />}
					{isUserInRoom && <Button style={{
						backgroundColor: "red",
						color: "white"
					}} onClick={handleLeave}>Leave</Button> }
					{(isUserInRoom && isUserAdmin) && <Button style={{
						backgroundColor: "red",
						color: "white"
					}} onClick={handleDelete}>Delete</Button>}
				</ListItem>
				<hr/>
				</Fragment>
			)
		}
		else if (!room.isDmChannel) {
			return (
				<Fragment key={index}>
				<ListItem>
					<ListItemText primary={room.name} />
					<Button onClick={() => {
						axios.post(baseUrl + `chat/join/${room.name}`, "", {withCredentials: true}).then(handleJoin).catch(handleError)
					}}>
						Join
					</Button>
					{(isUserInRoom && isUserAdmin) && <ChannelSettings handleSubmit={handleChangePass} url={baseUrl + `chat/change-pass/${room.name}`} handleError={handleError} />}
					{isUserInRoom && <Button style={{
						backgroundColor: "red",
						color: "white"
					}} onClick={handleLeave}>Leave</Button> }
					{(isUserInRoom && isUserAdmin) && <Button style={{
						backgroundColor: "red",
						color: "white"
					}} onClick={handleDelete}>Delete</Button>}
				</ListItem>
				<hr/>
				</Fragment>
			)
		}
		else {
			//do stuff for dm channels
		}
	})

	const handleCreate = (values: any) => {
		if (values.password !== '') {
			axios.post(baseUrl + "chat/new", {name: values.name, password: values.password}, {withCredentials: true}).then(() => {
				// disgusting hack to retrieve the rooms without repeating code
				setRerender(rerender + 1)
			}).catch((error) => {
				if (error.response.status === 401) {
					navigate("/login")
				}
				else {
					setMessage(error.response.data.message)
					console.log(error.response)
					setTimeout(() => {
						setMessage(null)
					}, 5000)
				}
			})
		}
		else {
			// no password, send only name to avoid server-side error in validation
			axios.post(baseUrl + "chat/new", {name: values.name}, {withCredentials: true}).then(() => {
				setRerender(rerender + 1)
			}).catch((error) => {
				if (error.response.status === 401) {
					navigate("/login")
				}
				else {
					setMessage(error.response.data.message)
					setTimeout(() => {
						setMessage(null)
					}, 5000)
				}
			})
		}
	}

	return (
		<>
		<Notification message={message} />
		<CreateChannel handleCreate={handleCreate}/>
		<hr />
		<List style={{
			height: "50rem",
			overflow: "auto",
		}}>
			{channelList}
		</List>
		</>
	)
}

export default ChatList