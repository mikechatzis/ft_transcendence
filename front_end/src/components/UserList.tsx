import Drawer from "@mui/material/Drawer"
import axios from "axios"
import { Fragment, useContext, useEffect, useState } from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Toolbar from "@mui/material/Toolbar"
import CircleIcon from '@mui/icons-material/Circle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { UrlContext } from "../context/UrlContext"
import { ListItemIcon } from "@mui/material"
import { Status } from "../enum/status"

const drawerWidth = 360

const UserList: React.FC<{channel: string}> = ({channel}) => {
	const [channelMembers, setChannelMembers] = useState<any[] | null>(null)
	const baseUrl = useContext(UrlContext)

	useEffect(() => {
		axios.get(baseUrl + `chat/${channel}/users`, {withCredentials: true}).then((response) => {
			setChannelMembers(response.data)
		})
	}, [baseUrl, channel])
	
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