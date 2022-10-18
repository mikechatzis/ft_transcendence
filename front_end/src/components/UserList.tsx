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
import PendingIcon from '@mui/icons-material/Pending';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MoreVertIcon from "@mui/icons-material/MoreVert"
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import { UrlContext } from "../context/UrlContext"
import { ListItemIcon } from "@mui/material"
import { Status } from "../enum/status"
import { useNavigate } from "react-router-dom"
import { Socket } from "socket.io-client"
import { ChatContext } from "../context/ChatContext"
import { UserContext } from "../context/UserContext"
import { GameContext } from "../context/GameContext"
import PendingInvite from "./PendingInvite"

const drawerWidth = 360

const UserList: React.FC<{channel: string, setErr: any}> = ({channel, setErr}) => {
	const [channelMembers, setChannelMembers] = useState<any[] | null>(null)
	const [me, setMe] = useState<any>(null)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [isAdmin, setIsAdmin] = useState(false)
	const [isOwner, setIsOwner] = useState(false)
	const [invite, setInvite] = useState(false)
	const [openEl, setOpenEl] = useState<null | string>(null)
	const navigate = useNavigate()
	const {context, setContext} = useContext(UserContext)
	const baseUrl = useContext(UrlContext)
	const socket = useContext(ChatContext)
	const gameSocket = useContext(GameContext)

	useEffect(() => {
		axios.get(baseUrl + `chat/${channel}/isOwner`, {withCredentials: true}).then((response) => {
			setIsOwner(response.data.owner)
		}).catch((error) => {
			console.log(error)
			if (error.response.status === 401) {
				setContext?.(false)
				navigate("/login")
			}
		})
	}, [baseUrl, channel])

	useEffect(() => {
		gameSocket.on('refuse', (data: any) => {
			setInvite(false)
		})
	}, [gameSocket])

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
				if (error.response.status === 401) {
					setContext?.(false)
					navigate("/login")
				}
			})
		}).catch((error) => {
			console.log(error)
			if (error.response.status === 401) {
				setContext?.(false)
				navigate("/login")
			}
		})
	}, [baseUrl, anchorEl, channel])

	const makeAdmin = (user: any) => () => {
		let adminUser = {...user}

		axios.post(baseUrl + `chat/${channel}/makeAdmin`, adminUser, {withCredentials: true}).catch((error) => {
			console.log(error)
			if (error.response.status === 401) {
				setContext?.(false)
				navigate("/login")
			}
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
			if (error.response.status === 401) {
				setContext?.(false)
				navigate("/login")
			}
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

		axios.post(baseUrl + `chat/${channel}/permaban`, banUser, {withCredentials: true}).then(() => {
			handleKick(user)
		}).catch((error) => {
			console.log(error)
			console.log('here')
			if (error.response.status === 401) {
				setContext?.(false)
				navigate("/login")
			}
			else {
				setErr(error.response.data.message)
			}
		})
		handleClose()
	}

	const handleBan = (user: any) => () => {
		let banUser = {...user}

		axios.post(baseUrl + `chat/${channel}/ban`, banUser, {withCredentials: true}).then(() => {
			handleKick(user)
		}).catch((error) => {
			console.log(error)
			if (error.response.status === 401) {
				setContext?.(false)
				navigate("/login")
			}
			else {
				setErr(error.response.data.message)
			}
		})
		handleClose()
	}

	const handleBlock = (user: any) => () => {
		let blockUser = {...user}

		axios.post(baseUrl + 'users/block', {block: blockUser?.id}, {withCredentials: true}).catch((e) => {
			console.log(e)
			if (e.response.status === 401) {
				setContext?.(false)
				navigate("/login")
			}
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

	const chooseIcon = (user: any) => {
		if (user.status === Status.ONLINE) {
			return <CircleIcon style={{color: "green"}} fontSize="small" />
		}
		else if (user.status === Status.OFFLINE) {
			return <RadioButtonUncheckedIcon style={{color: "grey"}} fontSize="small" />
		}
		else if (user.status === Status.GAME) {
			return <VideogameAssetIcon style={{color: "yellow"}} fontSize="small" />
		}
		else if (user.status === Status.QUEUE) {
			return <PendingIcon style={{color: "yellow"}} fontSize="small" />
		}
	}

	const handleSpectate = (user: any) => () => {
		gameSocket.emit('spectate', {name: user.name})
		setTimeout(() => {navigate("/multi-spec")}, 500)
		handleClose()
	}

	const handleInvite = (user: any) => () => {
		gameSocket.emit('invite', {id: user?.id})
		setInvite(true)
		handleClose()
	}
	channelMembers?.sort((a,b) => a.id - b.id)
	const map = channelMembers?.map((user: any, index: number) => {
		return (
			<Fragment key={index}>
				<ListItem>
					<Avatar src={baseUrl + `users/${user.id}/profileImg`} />
					<ListItemText primary={user.name} style={{padding: 10}} />
					<ListItemIcon>
						{chooseIcon(user)}
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
						{(user.status === Status.ONLINE) && <MenuItem key={8}>
							<Typography>
								Invite to play
							</Typography>
						</MenuItem>}
						{(user.status === Status.GAME) && <MenuItem key={9}>
							<Typography>
								Spectate
							</Typography>
						</MenuItem>}
					</Menu>
				</ListItem>
				<hr />
			</Fragment>
		)
	}).sort()
	// useEffect(() => {
	// 	console.log(map!.at(0)?.key)
	// }, [map])
	// map!

	return (
		<>
		<PendingInvite open={invite} />
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
				{map}
			</List>
		</Drawer>
		</>
	)
}

export default UserList