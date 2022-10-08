import Drawer from "@mui/material/Drawer"
import axios from "axios"
import React, { Fragment, useContext, useEffect, useState } from "react"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import CircleIcon from '@mui/icons-material/Circle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { UrlContext } from "../context/UrlContext"
import { ListItemIcon } from "@mui/material"
import { Status } from "../enum/status"
import { useNavigate } from "react-router-dom"
import { Socket } from "socket.io-client"
import { ChatContext } from "../context/ChatContext"

const drawerWidth = 360

const UserList: React.FC<{channel: string}> = ({channel}) => {
	const [channelMembers, setChannelMembers] = useState<any[] | null>(null)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [isAdmin, setIsAdmin] = useState(false)
	const [openEl, setOpenEl] = useState<null | string>(null)
	const navigate = useNavigate()
	const [open, setOpen] = useState(Boolean(anchorEl))
	const baseUrl = useContext(UrlContext)
	const socket = useContext(ChatContext)

	useEffect(() => {
		axios.get(baseUrl + `chat/${channel}/users`, {withCredentials: true}).then((response) => {
			setChannelMembers(response.data)
		})
	}, [baseUrl, channel, anchorEl])

	useEffect(() => {
		axios.get(baseUrl + `users/me`, {withCredentials: true}).then((response) => {
			axios.get(baseUrl + `chat/${channel}/admins`, {withCredentials: true}).then((resp2) => {
				if (resp2.data.includes(response.data.id)) {
					setIsAdmin(true)
				}
			}).catch((error) => {
				console.log(error)
			})
		}).catch((error) => {
			console.log(error)
		})
	}, [baseUrl, anchorEl, channel])

	const handleMute = (user: any) => () => {
		let muteUser = {...user}

		axios.post(baseUrl + `chat/${channel}/mute`, muteUser, {withCredentials: true}).catch((error) => {
			console.log(error)
		})
		handleClose()
	}

	const handleClick = (elem: any) => (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
		setOpenEl(elem.name)
		console.log(elem)
	}

	const handleClose = () => {
		setAnchorEl(null)
		setOpenEl(null)
	}

	const handleKick = (user: any) => {
		let kickUser = {...user}

		socket.emit('kick', {room: channel, user: kickUser})
		handleClose()
	}
	
	const handlePermaBan = (user: any) => () => {
		let banUser = {...user}

		axios.post(baseUrl + `chat/${channel}/permaban`, banUser, {withCredentials: true}).catch((error) => {
			console.log(error)
		})
		handleKick(user)
		handleClose()
	}

	const handleBan = (user: any) => () => {
		let banUser = {...user}

		axios.post(baseUrl + `chat/${channel}/ban`, banUser, {withCredentials: true}).catch((error) => {
			console.log(error)
		})
		handleKick(user)
		handleClose()
	}

	return (
		<>
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
			variant="permanent"
			anchor="right"
		>
			<Toolbar />
			<List>
				{channelMembers?.map((user: any, index: number) => {
					return (
						<Fragment key={index}>
							<ListItem>
								<ListItemText primary={user.name} />
								<ListItemIcon>
									{(user.status === Status.ONLINE) ? <CircleIcon style={{color: "green"}} fontSize="small" /> : <RadioButtonUncheckedIcon style={{color: "grey"}} fontSize="small" />}
								</ListItemIcon>
								<IconButton
									id="long-button"
									onClick={handleClick(user)}
								>
									<MoreVertIcon />
								</IconButton>
								<Menu
									id="long-menu"
									anchorEl={anchorEl}
									open={openEl === user.name}
									onClose={handleClose}
								>
									{isAdmin &&
									[<MenuItem key={0}>
										<Typography>
											Make admin
										</Typography>
									</MenuItem>,
									<MenuItem onClick={handleMute(user)} key={1}>
										<Typography>
											Mute for 15 minutes
										</Typography>
									</MenuItem>,
									<MenuItem onClick={() => {handleKick(user)}} key={2}>
										<Typography>
											Kick
										</Typography>
									</MenuItem>,
									<MenuItem onClick={handleBan(user)}key={3}>
										<Typography>
											Ban for 15 minutes
										</Typography>
									</MenuItem>,
									<MenuItem onClick={handlePermaBan(user)} key={4}>
										<Typography>
											Ban permanently
										</Typography>
									</MenuItem>]}
									<MenuItem key={5}>
										<Typography>
											View profile
										</Typography>
									</MenuItem>
									<MenuItem key={6}>
										<Typography>
											Invite to play
										</Typography>
									</MenuItem>
								</Menu>
							</ListItem>
							<hr />
						</Fragment>
					)
}				)}
			</List>
		</Drawer>
		</>
	)
}

export default UserList