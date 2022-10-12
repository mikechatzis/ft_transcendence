import React from 'react'
import Container from "@mui/material/Container"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {styled} from '@mui/material/styles'

enum Keys{
	UP = 'w',
	DOWN = 's'
}

const GameBox = styled("div")(({ theme }) => ({
	position: "relative",
	margin: 'auto',
	marginTop: 30,
	marginBottom: 30,
	width: 1420,
	height: 1000,
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	background: 'black',
	border: "10px solid white",
}))

export const LeftPaddle = styled('div')(({}) => ({
	id: 1,
	position: "absolute",
	width: 20,
	height: 100,
	left: 25,
	right: 0,
	top: 400,
	bottom: 0,
	background: 'white',
}))

const RightPaddle = styled('div')(({}) => ({
	position: "absolute",
	width: 20,
	height: 100,
	left: 1360,
	top: 400,
	bottom: 0,
	background: 'white',
}))

const DottedLine = styled('div')(({}) => ({
	position: "absolute",
	width: 10,
	height: "100%",
	left: "50%",
	borderLeft: "10px dotted"

}))


const Game: React.FC = () => {

	const handleKeyDown = (event: any) => {
		// let tmp = document.getElementById("LeftPaddle");
		if (event.key == Keys.UP)
			// console.log(tmp.)
		// if (event.key == Keys.DOWN)
			console.log("down");
	}

	return (
		<Box style={{color: 'white', display: 'flex', flexFlow: 'column noWrap', marginTop: 20}}>
			<Typography style={{alignSelf: 'center'}} variant='h2'>Ping Pong</Typography>
		<GameBox tabIndex={0} onKeyDown={handleKeyDown}>
			<DottedLine></DottedLine>
			<LeftPaddle></LeftPaddle>
			<RightPaddle></RightPaddle>
		</GameBox>
		</Box>
	)
}

export default Game