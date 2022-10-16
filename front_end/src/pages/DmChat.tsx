import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import TextField from "@mui/material/TextField"
import Paper from "@mui/material/Paper"
import SendIcon from "@mui/icons-material/Send"
import { useContext, useEffect, useRef, useState } from "react"
import { Icon, Typography } from "@mui/material"
import { ChatContext } from "../context/ChatContext"
import Notification from "../components/Notification"
import { useNavigate, useParams } from "react-router-dom"
import UserList from "../components/UserList"
import { UrlContext } from "../context/UrlContext"
import { Status } from "../enum/status"
import CircleIcon from '@mui/icons-material/Circle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import axios from "axios"

const DmChat: React.FC = () => {
	const enterKeyCode = 13

	const [messages, setMessages] = useState<string[]>([])
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [otherUser, setOtherUser] = useState<any>(null)
	const [channelName, setChannelName] = useState<string | null>(null)
	const scrollBottomRef = useRef<any>(null)
	const socket = useContext(ChatContext)
	const baseUrl = useContext(UrlContext)
	const channel = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		axios.get(baseUrl + `chat/dmChannel/${channel.id}`, {withCredentials: true}).then((response) => {
			setChannelName(response.data.channel)
			console.log('channel:', response.data)
		}).catch((e) => {
			setError(e.message)
				setTimeout(() => {
					setError('')
				}, 5000)
		})
	}, [baseUrl])

	useEffect(() => {
		socket.on('message', ({data, room}: any) => {
			if (room === channelName) {
				const newArr = messages.concat(data)
				setMessages(newArr)
			}
		})

		socket.on('exception', (exception: any) => {

			if (exception.message === "401") {
				navigate("/login")
			}
			else {
				setError(exception.message)
				setTimeout(() => {
					setError('')
				}, 5000)
			}
		})
	})

	useEffect(() => {
		axios.get(baseUrl + `users/${channel.id}`, {withCredentials: true}).then((response) => {
			setOtherUser(response.data)
		}).catch((e) => {
			console.log(e)
		})
	}, [baseUrl, channel])

	useEffect(() => {
		if (channelName) {
			axios.get(baseUrl + `chat/${channelName}/messages`, {withCredentials: true}).then((response) => {
				let newArr: string[] = []
				for (let i = 0; i < response.data.length; i++) {
					newArr = [...newArr, response.data[i].message]
				}
				setMessages(newArr)
			}).catch((error) => {
				if (error.response.status === 401) {
					navigate("/login")
				}
				else {
					console.log(error)
				}
			})
		}
	}, [baseUrl, channelName])

	useEffect(() => {
		scrollBottomRef.current?.scrollIntoView({behavior: "smooth"})
	}, [messages])

	const handleMessageSend = () => {
		socket.emit('message', {data: message, id: socket.id, room: channelName})

		setMessage('')
	}

	const listChatMessages = messages.map((msg, index) => (
		<ListItem key={index}>
			<ListItemText primary={msg} primaryTypographyProps={{style: {overflowWrap: "break-word"}}} />
		</ListItem>
	))

	const handleEnterKey = (event: any) => {
		if (event.keyCode === enterKeyCode) {
			event.preventDefault()
			handleMessageSend()
		}
	}

	return (
		<>
			<Notification message={error} />
			<Container>
				<Grid container
					spacing={2}
					direction="column"
					justifyContent="center"
					style={{minHeight: "80vh"}}
				>
					<Paper elevation={5} style={{width: "75rem", height: "50rem"}}>
						<Box p={3}>
							<List style={{paddingTop: 0}}>
								<ListItem>
									<Avatar src={baseUrl + `users/${otherUser?.id}/profileImg`} />
									<ListItemText primary={<Typography variant="h5">{otherUser?.name}</Typography>} style={{paddingLeft: 15}} />
									<ListItemIcon>
										{(otherUser?.status === Status.ONLINE) ? <CircleIcon style={{color: "green"}} fontSize="small" /> : <RadioButtonUncheckedIcon style={{color: "grey"}} fontSize="small" />}
									</ListItemIcon>
								</ListItem>
							</List>
							<Divider />
							<Grid container spacing={4} alignItems="center">
								<Grid xs={12} item style={{
									height: "40rem"
								}} zeroMinWidth>
									<List style={{
										height: "39rem",
										overflow: "auto"
									}}>
										{listChatMessages}
										<ListItem ref={scrollBottomRef} />
									</List>
								</Grid>
								<Grid xs={11} item>
									<FormControl fullWidth>
										<TextField onChange={(event) => {
											setMessage(event.target.value)
										}} onKeyDown={handleEnterKey}
											value={message}
											label="Message"
											variant="outlined"
											multiline={true} 
										/>
									</FormControl>
								</Grid>
								<Grid xs={1} item>
									<IconButton onClick={handleMessageSend}
										aria-label="send"
										color="primary"
									>
										<SendIcon />
									</IconButton>
								</Grid>
							</Grid>
						</Box>
					</Paper>
				</Grid>
			</Container>
		</>
	)
}

export default DmChat