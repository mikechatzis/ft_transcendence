import React from 'react'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from "@mui/material/IconButton"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import AccountCircle from '@mui/icons-material/AccountCircle'
import {useTheme} from '@mui/material/styles'

interface MenuProps {
	handleToggle: React.ButtonHTMLAttributes<HTMLButtonElement> ["onClick"]
}

const MenuBar: React.FC<MenuProps> = ({handleToggle}) => {
	const [anchorElem, setAnchorElem] = useState<null | HTMLElement>(null)
	const navigate = useNavigate()
	const theme = useTheme()

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElem(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorElem(null)
	}

	return (
		<Box sx={{flexGrow: 1}}>
			<AppBar position="static">
				<Toolbar>
					<Box display="flex" justifyContent="center" alignItems="center">
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
							<AccountCircle />
						</IconButton>
						<Menu id="menu-appbar"
							anchorEl={anchorElem}
							anchorOrigin={{vertical: "top", horizontal: "right"}}
							keepMounted
							transformOrigin={{vertical: "top", horizontal: "right"}}
							open={Boolean(anchorElem)}
							onClose={handleClose}
						>
							<MenuItem onClick={() => {
								handleClose()
								navigate("/login")
							}} >
								Sign in
							</MenuItem>
							<MenuItem onClick={() => {
								handleClose()
								navigate("/account")
							}} >
								Account
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	)
}

export default MenuBar