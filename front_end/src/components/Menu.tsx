import React from 'react';
import {useNavigate} from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import IconButton from "@mui/material/IconButton"
import Toolbar from '@mui/material/Toolbar'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import AccountCircle from '@mui/icons-material/AccountCircle'
import {useTheme} from '@mui/material/styles'

interface MenuProps {
	handleToggle: React.ButtonHTMLAttributes<HTMLButtonElement> ["onClick"]
}

const Menu: React.FC<MenuProps> = ({handleToggle}) => {
	const navigate = useNavigate()
	const theme = useTheme()

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
						<Button color="inherit" onClick={() => (navigate("/login"))}>Login</Button>
						<Button color="inherit" onClick={() => (navigate("/account"))}>Account</Button>
					</Box>
					<Box>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	)
}

export default Menu