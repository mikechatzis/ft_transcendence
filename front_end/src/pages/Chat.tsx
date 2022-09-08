import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Paper from "@mui/material/Paper"
import io from "socket.io-client"
import { useState } from "react"
import { Typography } from "@mui/material"

const Chat: React.FC = () => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<string[]>([])
	const socket = io("http://localhost:3333/chat")

	socket.on('message', ({data}) => {
		const newArr = messages?.concat(data)

		if (newArr)  {
			setMessages(newArr)
		}
	})

	return (
		<div>
			<Container>
				<Grid container
					spacing={2}
					direction="column"
					justifyContent="center"
					alignItems="center"
				>
					<Grid item>
						{messages?.map((m) => (
							<Paper elevation={2} borderRadius={2}>
							<Typography>{m}</Typography>
						</Paper>
						))}
					</Grid>
				</Grid>
				<Grid container
					spacing={2}
					direction="column"
					justifyContent="flex-end"
					alignItems="center"
				>
					<Grid item style={{
                boxShadow: "none",
                borderRadius: "0px",
                position: 'absolute',
                bottom: 40
              }}>
						<Grid container direction="column" spacing={2}>
							<Grid item>
								<TextField placeholder="Message"
									fullWidth
									variant="outlined"
									style={{
										width: "40vw"
									}}
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									/>
							</Grid>
							<Grid item>
								<Button fullWidth variant="contained" style={{
									width: "40vw"
								}}
								onClick={() => {
									socket.emit('message', {data: message, namespace: 'chat'})
									// str=''
									setMessage('')
								}}
								>
									Send Message
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</div>
	)
}

export default Chat