import React from 'react';
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import {styled} from '@mui/material/styles'
import DataTable from '../components/DataTable'
import { useNavigate } from 'react-router-dom';

const images = [
	{
	  url: "https://www.researchgate.net/profile/Niels-Henze/publication/238504468/figure/fig3/AS:298952734855187@1448287294969/PONGs-game-elements.png",
	  title: "ONE PLAYER",
	  width: "25%",
	  path: "/",
	},
	{
	  url: "https://www.esrb.org/wp-content/uploads/2020/04/V1_ESRB_blog_Playing-Multiplayer-Games_Artboard-2-1024x538.jpg",
	  title: "TWO PLAYERS",
	  width: "25%",
	  path: "/",
	},
	{
	  url: "https://images.unsplash.com/photo-1474514644473-acc8f56361f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8c3BlY3RhdG9yfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
	  title: "SPECTATOR",
	  width: "25%",
	  path: "/",
	},
	{
	  url: "https://previews.123rf.com/images/shadowalice/shadowalice1504/shadowalice150400221/38321576-message-icons-set-great-for-any-use.jpg",
	  title: "CHAT",
	  width: "25%",
	  path: "/chat-list",
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

const Home: React.FC = () => {
	const navigate = useNavigate()
	const OpenPage = (image: any) => {
		if (image == "ONE PLAYER")
			navigate("/game");
		if (image == "CHAT")
			navigate("/chat-list");
	  };

	return (
		<div>
			<Container>
				<Box display="flex" justifyContent="center" alignItems="center" minHeight='15vh'>
					<Typography variant="h3">Home</Typography>
				</Box>
				<Box display="flex" flexWrap="wrap" minWidth={300} width="100%">
					{images.map((image) => (
						<ImageButton focusRipple key={image.title} onClick={() => {
							OpenPage(image.title)
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
				<Box display="flex" justifyContent="center" alignItems="center" minHeight="12vh" paddingTop="2vh">
					<Typography variant="h4">Leaderboard</Typography>
				</Box>
				<Box display="flex" justifyContent="center" alignItems="center" minHeight='30vh'>
					<DataTable />
				</Box>
			</Container>
		</div>
	)
}

export default Home