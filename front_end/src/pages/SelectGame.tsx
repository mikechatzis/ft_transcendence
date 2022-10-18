import React, { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import {styled} from '@mui/material/styles'
import DataTable from '../components/DataTable'
import { useNavigate } from 'react-router-dom';
import { setSelectionRange } from '@testing-library/user-event/dist/utils';
import { GameContext } from '../context/GameContext';
import Queue from '../components/Queue';
import { UserContext } from '../context/UserContext';

const images = [
	{
	  url: "https://www.esrb.org/wp-content/uploads/2020/04/V1_ESRB_blog_Playing-Multiplayer-Games_Artboard-2-1024x538.jpg",
	  title: "DEFAULT",
	  width: "50%",
	  path: "/",
	},

	{
		url: "https://www.esrb.org/wp-content/uploads/2020/04/V1_ESRB_blog_Playing-Multiplayer-Games_Artboard-2-1024x538.jpg",
		title: "MODDED",
		width: "50%",
		path: "/",
	  },
];

const Image = styled("span")(({ theme }) => ({
	position: "absolute",
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	color: theme.palette.common.white
}))

const ImageBackdrop = styled("span")(({ theme }) => ({
	position: "absolute",
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundColor: theme.palette.common.black,
	opacity: 0.4,
	transition: theme.transitions.create("opacity")
}))

const ImageMarked = styled("span")(({ theme }) => ({
	height: 3,
	width: 18,
	backgroundColor: theme.palette.common.white,
	position: "absolute",
	bottom: -2,
	left: "calc(50% - 9px)",
	transition: theme.transitions.create("opacity")
}))

const ImageSrc = styled("span")({
	position: "absolute",
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundSize: "cover",
	backgroundPosition: "center 40%"
})

const ImageButton = styled(ButtonBase)(({ theme }) => ({
	position: "relative",
	height: 250,
	[theme.breakpoints.down("sm")]: {
		width: "100% !important",
		height: 100
	},
	"&:hover, &.Mui-focusVisible": {
		zIndex: 1,
		"& .MuiImageMarked-root": {
			opacity: 0
		},
		"& .MuiImageBackdrop-root": {
			opacity: 0.15
		},
		"& .MuiTypography-root": {
			border: "4px solid currentColor"
		}
	}
}))

const SelectGame: React.FC = () => {
	const [openQueue, setOpenQueue] = useState(false)
	const navigate = useNavigate()
	const {context, setContext} = useContext(UserContext)
	const socket = useContext(GameContext)

	useEffect(() => {
		socket.on('start-def', () => {
			setOpenQueue(false)
			navigate("/multi-def")
		})
	}, [])

	useEffect(() => {
		if (!context) {
			navigate("/login")
		}
	})

	const openPage = (image: any) => {
		if (image === "DEFAULT")
		{
			socket.emit('queue-def', {})
			setOpenQueue(true)
		}
		else if (image === "MODDED")
			navigate("/multmodd");
	  };

	return (
		<div>
			<Queue open={openQueue} />
			<Container>
				<Box display="flex" justifyContent="center" alignItems="center" minHeight='15vh'>
					<Typography variant="h3">Choose Gamemode</Typography>
				</Box>
				<Box display="flex" flexWrap="wrap" minWidth={300} width="100%">
					{images.map((image) => (
						<ImageButton focusRipple key={image.title} onClick={() => {
							openPage(image.title)
						}} style={{width: image.width}}
						>
							<ImageSrc style={{backgroundImage: `url(${image.url})`}} />
							<ImageBackdrop className="MuiImageBackdrop-root" />
							<Image>
								<Typography component="span" variant="subtitle1" color="inherit" sx={{
									position: "relative",
									p: 4,
									pt: 2,
									pb: (theme) => `calc(${theme.spacing(1)} + 6px)`
								}}
								>
									{image.title}
									<ImageMarked className="MuiImageMarked-root" />
								</Typography>
							</Image>
						</ImageButton>
					))}
				</Box>
			</Container>
		</div>
	)
}

export default SelectGame