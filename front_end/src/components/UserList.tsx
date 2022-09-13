import Drawer from "@mui/material/Drawer"
import axios from "axios"
import { Fragment, useContext, useEffect, useState } from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Toolbar from "@mui/material/Toolbar"
import { UrlContext } from "../context/UrlContext"

const drawerWidth = 360

const UserList: React.FC<{channel: string}> = ({channel}) => {
	const [channelMembers, setChannelMembers] = useState<number[] | null>(null)
	const baseUrl = useContext(UrlContext)

	useEffect(() => {
		axios.get(baseUrl + `chat/${channel}/users`, {withCredentials: true}).then((response) => {
			setChannelMembers(response.data)
		})
	}, [])
	
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
							</ListItem>
						</Fragment>
					)
}				)}
			</List>
		</Drawer>
		</>
	)
}

export default UserList