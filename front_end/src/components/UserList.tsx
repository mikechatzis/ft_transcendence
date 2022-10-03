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

const drawerWidth = 360

const UserList: React.FC<{channel: string}> = ({channel}) => {
	const [channelMembers, setChannelMembers] = useState<any[] | null>(null)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [isAdmin, setIsAdmin] = useState(false)
	const open = Boolean(anchorEl)
	const baseUrl = useContext(UrlContext)

	useEffect(() => {
		axios.get(baseUrl + `chat/${channel}/users`, {withCredentials: true}).then((response) => {
			setChannelMembers(response.data)
		})
	}, [baseUrl, channel])

	useEffect(() => {
	})

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
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
									aria-label="more"
									id="long-button"
									aria-controls={open ? 'long-menu' : undefined}
									aria-expanded={open ? 'true' : undefined}
									aria-haspopup="true"
									onClick={handleClick}
								>
									<MoreVertIcon />
								</IconButton>
								<Menu
									id="long-menu"
									MenuListProps={{
										'aria-labelledby': 'long-button'
									}}
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
								>
									<MenuItem onClick={handleClose}>
										<Typography>
											Make admin
										</Typography>
									</MenuItem>
									<MenuItem onClick={handleClose}>
										<Typography>
											Mute
										</Typography>
									</MenuItem>
									<MenuItem onClick={handleClose}>
										<Typography>
											Kick
										</Typography>
									</MenuItem>
									<MenuItem onClick={handleClose}>
										<Typography>
											Ban
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