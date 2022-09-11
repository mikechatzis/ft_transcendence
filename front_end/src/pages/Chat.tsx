import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import TextField from "@mui/material/TextField"
import Paper from "@mui/material/Paper"
import SendIcon from "@mui/icons-material/Send"
import { useContext, useEffect, useRef, useState } from "react"
import { Typography } from "@mui/material"
import { ChatContext } from "../context/ChatContext"
import { io } from "socket.io-client"
import Notification from "../components/Notification"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"

const Chat: React.FC = () => {
	const enterKeyCode = 13

	const [messages, setMessages] = useState<string[]>([])
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const scrollBottomRef = useRef<any>(null)
	const {context, setContext} = useContext(UserContext)
	const socket = useContext(ChatContext)
	const channel = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		socket.on('message', ({data, room}: any) => {
			if (room === channel.name) {
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
	}, [messages])

	useEffect(() => {
			scrollBottomRef.current?.scrollIntoView({behavior: "smooth"})
	}, [messages])

	useEffect(() => {
		if (!context) {
			navigate("/login")
		}
	})

	const handleMessageSend = () => {
		socket.emit('message', {data: message, id: socket.id, room: channel.name})

		setMessage('')
	}

	const listChatMessages = messages.map((msg, index) => (
		<ListItem key={index}>
			<ListItemText primary={msg} />
		</ListItem>
	))

	const handleEnterKey = (event: any) => {
		if (event.keyCode === enterKeyCode) {
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
					<Paper elevation={5}>
						<Box p={3}>
							<Typography variant="h4" gutterBottom>
								You can discuss frogs here
							</Typography>
							<Divider />
							<Grid container spacing={4} alignItems="center">
								<Grid xs={12} item style={{
									height: "20rem"
								}}>
									<List style={{
										height: "18rem",
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
											variant="outlined" />
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

export default Chat