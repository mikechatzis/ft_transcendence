import React from 'react'
import { useState, useContext, useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Avatar from "@mui/material/Avatar"
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Toolbar from '@mui/material/Toolbar'
import Typography from "@mui/material/Typography"
import CircleIcon from '@mui/icons-material/Circle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MoreVertIcon from "@mui/icons-material/MoreVert"
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import GroupsIcon from "@mui/icons-material/Groups"
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { UserContext } from '../context/UserContext'
import { UrlContext } from '../context/UrlContext'
import SearchBar from './SearchBar'
import { RerenderContext } from '../context/RerenderContext'
import { Status } from "../enum/status"

const drawerWidth = 360

interface MenuProps {
	handleToggle: React.ButtonHTMLAttributes<HTMLButtonElement> ["onClick"]
}

const MenuBar: React.FC<MenuProps> = ({handleToggle}) => {
	const [anchorElem, setAnchorElem] = useState<null | HTMLElement>(null)
	const [smallAnchorEl, setSmallAnchorEl] = useState<null | HTMLElement>(null)
	const [avatar, setAvatar] = useState<any>(null)
	const [friends, setFriends] = useState<any[]>([])
	const [friendsOpen, setFriendsOpen] = useState(false)
	const [openEl, setOpenEl] = useState<null | string>(null)
	const navigate = useNavigate()
	const theme = useTheme()
	const {rerender, setRerender} = useContext(RerenderContext)
	const {context, setContext} = useContext(UserContext)
	const baseUrl = useContext(UrlContext)

	//this is stupid and i hate it but at least it works
	useEffect(() => {
		setAvatar(<Avatar src={baseUrl + `users/me/profileImg?${Date.now()}`} />)
	}, [rerender, context])

	useEffect(() => {
		axios.get(baseUrl + 'users/me/friends', {withCredentials: true}).then((response) => {
			setFriends(response.data)
			console.log(response.data)
		}).catch((e) => {
			console.log(e)
		})
	}, [baseUrl, context])

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElem(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorElem(null)
	}

	const handleSmallClose = () => {
		setOpenEl(null)
	}

	const handleClick = (elem: any) => (event: React.MouseEvent<HTMLElement>) => {
		setOpenEl(elem.name)
		setSmallAnchorEl(event.currentTarget)
	}

	const handleDm = (user: any) => () => {
		navigate(`/dm/${user.id}`)
		handleSmallClose()
		setFriendsOpen(false)
	}

	return (
		<Box sx={{flexGrow: 1}}>
			<AppBar position="relative" style={{
				zIndex: theme.zIndex.drawer + 1
			}}>
				<Toolbar>
					<Box display="flex" justifyContent="left" alignItems="center" width="12%">
						<IconButton sx={{mr: 2}} onClick={handleToggle} color="inherit">
							{theme.palette.mode === "dark" ? (
								<Brightness7Icon />
								) : (
								<Brightness4Icon />
								)}
						</IconButton>
					</Box>
					<Box display="flex" justifyContent="center" alignItems="center" flex={1}>
						<Button color="inherit" onClick={() => (navigate("/"))}>Home</Button>
						<Button color="inherit" onClick={() => (navigate("/play"))}>Play</Button>
						<Button color="inherit" onClick={() => (navigate("/chat-list"))}>Chat</Button>
					</Box>
					<Box>
						<SearchBar />
					</Box>
					{context &&
					<Box>
						<IconButton
							onClick={() => setFriendsOpen(!friendsOpen)}
						>
							<GroupsIcon />
						</IconButton>
						<Drawer
							sx={{
								width: drawerWidth,
								flexShrink: 0,
								'& .MuiDrawer-paper': {
									width: drawerWidth,
									boxSizing: 'border-box',
								},
							}}
							anchor='right'
							open={friendsOpen}
							onClose={() => setFriendsOpen(false)}
						>
							<Toolbar />
							<List>
								{friends.map((user: any, index: number) => {
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
													anchorEl={smallAnchorEl}
													open={openEl === user.name}
													onClose={handleSmallClose}
												>
													<MenuItem onClick={() => {
														navigate(`/users/${user.name}`)
														handleSmallClose()
														setFriendsOpen(false)
													}}>
														<Typography>
															View profile
														</Typography>
													</MenuItem>
													<MenuItem onClick={handleDm(user)} >
														<Typography>
															Direct Message
														</Typography>
													</MenuItem>
													<MenuItem>
														<Typography>
															Block
														</Typography>
													</MenuItem>
													<MenuItem>
														<Typography>
															Invite to play
														</Typography>
													</MenuItem>
												</Menu>
											</ListItem>
											<hr />
										</Fragment>
									)
								})}
							</List>
						</Drawer>
					</Box>}
					<Box>
						<IconButton
							onClick={handleMenu}
							size="small"
							sx={{ ml: 2 }}
							aria-controls={Boolean(anchorElem) ? 'account-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={Boolean(anchorElem) ? 'true' : undefined}
						>
							{context ? avatar : <Avatar /> }
						</IconButton>
						<Menu anchorEl={anchorElem}
							id="account-menu"
							open={Boolean(anchorElem)}
							onClose={handleClose}
							PaperProps={{
								elevation: 0,
								sx: {
									backgroundColor: '#333333'
								},
							}}
							anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
						>
							{!context && <MenuItem onClick={() => {
								handleClose()
								navigate("/login")
							}} >
								Sign in
							</MenuItem>}
							{context && <MenuItem onClick={() => {
								handleClose()
								navigate("/account")
							}} >
								Account
							</MenuItem>}
							{context && <MenuItem onClick= {() => {
								handleClose()
								navigate("/settings")
							}}>
								Settings
							</MenuItem>}
							{context && <MenuItem onClick={() => {
								let config = {
									withCredentials: true
								}
								handleClose()
								axios.get(baseUrl + "auth/signout", config).then(() => {
									setContext?.(false)
									navigate("/")
								}).catch((error) => {
									setContext?.(false)
									navigate("/")
								})
							}}>
								Sign out
							</MenuItem>}
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	)
}

export default MenuBar