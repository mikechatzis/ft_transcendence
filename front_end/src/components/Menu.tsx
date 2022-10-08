import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Avatar from "@mui/material/Avatar"
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from "@mui/material/IconButton"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { UserContext } from '../context/UserContext'
import { UrlContext } from '../context/UrlContext'
import SearchBar from './SearchBar'

interface MenuProps {
	handleToggle: React.ButtonHTMLAttributes<HTMLButtonElement> ["onClick"]
}

const MenuBar: React.FC<MenuProps> = ({handleToggle}) => {
	const [anchorElem, setAnchorElem] = useState<null | HTMLElement>(null)
	const navigate = useNavigate()
	const theme = useTheme()
	const {context, setContext} = useContext(UserContext)
	const baseUrl = useContext(UrlContext)

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElem(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorElem(null)
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
					<Box>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							color="inherit"
							onClick={handleMenu}
						>
							{context ? <Avatar src={baseUrl + "users/me/profileImg"} /> : <Avatar /> }
						</IconButton>
						<Menu id="menu-appbar"
							anchorEl={anchorElem}
							anchorOrigin={{vertical: "top", horizontal: "right"}}
							keepMounted
							transformOrigin={{vertical: "top", horizontal: "right"}}
							open={Boolean(anchorElem)}
							onClose={handleClose}
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