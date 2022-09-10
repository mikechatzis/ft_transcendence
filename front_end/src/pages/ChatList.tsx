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


const ChatList: React.FC = () => {
	const baseUrl = useContext(UrlContext)
	const socket = useContext(ChatContext)
	const [chatRooms, setChatRooms] = useState<object[]>([])
	const [message, setMessage] = useState<string | null>(null)
	const [rerender, setRerender] = useState(1)
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
	}, [rerender])

	const channelList = chatRooms.map((room: any, index: any) => (
		<Fragment key={index}>
		<ListItem>
			<ListItemText primary={room.name} />
			<Button onClick={() => {
				axios.post(baseUrl + `chat/join/${room.name}`, "", {withCredentials: true}).then(() => {
					socket.emit('join', {room: room.name})
					navigate(`/chat/${room.name}`)
				}).catch((error) => {
					if (error?.response?.status === 401) {
						navigate("/login")
					}
					else {
						console.log(error)
					}
				})
			}}>
				Join
			</Button>
		</ListItem>
		<hr/>
		</Fragment>
	))

	const handleCreate = (values: any) => {
		axios.post(baseUrl + "chat/new", {name: values.name}, {withCredentials: true}).then(() => {
			// disgusting hack to retrieve the rooms without repeating code
			// setTimeout(() => {
				setRerender(rerender + 1)
			// }, 1000)
		}).catch((error) => {
			if (error.response.status === 401) {
				navigate("/login")
			}
			else {
				setMessage(error.response.data.message)
				// console.log(error.response)
				setTimeout(() => {
					setMessage(null)
				}, 5000)
			}
		})
	}

	return (
		<>
		{/* <Button style={{
				margin: "auto",
				width: "100%",
			}}
			onClick={() => {
			axios.post(baseUrl + "chat/new", {name: "frongus"}, {withCredentials: true}).then(() => {
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
			})
		}}>
			Create
		</Button> */}
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