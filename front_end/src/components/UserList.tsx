import Drawer from "@mui/material/Drawer"
import axios from "axios"
import React, { Fragment, useContext, useEffect, useState } from "react"
import Avatar from "@mui/material/Avatar"
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
	const [me, setMe] = useState<any>(null)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [isAdmin, setIsAdmin] = useState(false)
	const [openEl, setOpenEl] = useState<null | string>(null)
	const navigate = useNavigate()
	const baseUrl = useContext(UrlContext)
	const socket = useContext(ChatContext)

	useEffect(() => {
		axios.get(baseUrl + `chat/${channel}/users`, {withCredentials: true}).then((response) => {
			setChannelMembers(response.data)
		})
	}, [baseUrl, channel, anchorEl])

	useEffect(() => {
		axios.get(baseUrl + `users/me`, {withCredentials: true}).then((response) => {
			setMe(response.data)
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

	const makeAdmin = (user: any) => () => {
		let adminUser = {...user}

		axios.post(baseUrl + `chat/${channel}/makeAdmin`, adminUser, {withCredentials: true}).catch((error) => {
			console.log(error)
		})
		handleClose()
	}

	const handleView = (user: any) => () => {
		let viewUser = {...user}

		navigate(`/users/${user.name}`)
		handleClose()
	}

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

	const handleBlock = (user: any) => () => {
		let blockUser = {...user}

		axios.post(baseUrl + 'users/block', {block: blockUser.id}, {withCredentials: true}).catch((e) => {
			console.log(e)
		})
		handleClose()
	}

	const handleFriend = (user: any) => () => {
		let friendUser = {...user}

		axios.post(baseUrl + 'users/addFriend', {friend: friendUser.id}, {withCredentials: true}).then(() => {
			socket.emit('join', {room: `${me.id} ${friendUser.id}`})
		})
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
								<Avatar src={baseUrl + `users/${user.id}/profileImg`} />
								<ListItemText primary={user.name} style={{padding: 10}} />
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
									[<MenuItem onClick={makeAdmin(user)} key={0}>
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
									{!me?.blocked.includes(user.id) && <MenuItem onClick={handleBlock(user)} key={5}>
										<Typography>
											Block user
										</Typography>
									</MenuItem>}
									{(!me?.friends.includes(user.id) && !me?.blocked.includes(user.id)) && <MenuItem onClick={handleFriend(user)} key={6}>
										<Typography>
											Add friend
										</Typography>
									</MenuItem>}
									<MenuItem onClick={handleView(user)} key={7}>
										<Typography>
											View profile
										</Typography>
									</MenuItem>
									<MenuItem key={8}>
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