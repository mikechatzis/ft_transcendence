import React from 'react'
import Container from "@mui/material/Container"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {styled} from '@mui/material/styles'
import { useState } from 'react'

var loc1 = 400
var loc2 = 400

enum Keys{
	W = 'w',
	S = 's',
	ArrowUp = 'ArrowUp',
	ArrowDown = 'ArrowDown'
}

const GameBox = styled("div")(({ theme }) => ({
	position: "relative",
	margin: 'auto',
	marginTop: 40,
	marginBottom: 40,
	width: "70%",
	height: 900,
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	background: 'black',
	border: "10px solid white",
}))

const DottedLine = styled('div')(({}) => ({
	position: "absolute",
	width: 10,
	height: "100%",
	left: "50%",
	borderLeft: "10px dotted"

}))

const LeftPaddle = styled('div')(({}) => ({
	width: 20,
	height: 100,
	left: "3%",
	background:'grey'
}))

const RightPaddle = styled('div')(({}) => ({
	width: 20,
	height: 100,
	left: '95%',
	background:'grey'
}))


const Game: React.FC = () => {
	const [dist1, setTopDist1] = useState(loc1);
	const [dist2, setTopDist2] = useState(loc2);

	function HandleKeyPress(e: any){
		if (e.key == Keys.W){
			if(loc1 - 20 <= 0)
				setTopDist1(5)
			else
				setTopDist1(loc1-=20)
		}
		else if (e.key == Keys.S){
			if(loc1 + 20 >= 780)
				setTopDist1(775)
			else
				setTopDist1(loc1+=20)
		}
		else if (e.key == Keys.ArrowUp){
			if(loc2 - 20 <= 0)
				setTopDist2(5)
			else
				setTopDist2(loc2-=20)
		}
		else if (e.key == Keys.ArrowDown){
			if(loc2 + 20 >= 780)
				setTopDist2(775)
			else
				setTopDist2(loc2+=20)
		}
}
	

	return (
		<Box style={{color: 'white', display: 'flex', flexFlow: 'column noWrap', marginTop: 20}}>
			<Typography style={{alignSelf: 'center'}} variant='h2'>Ping Pong</Typography>
		<GameBox>
			<LeftPaddle tabIndex={0} onKeyDown={(e) => HandleKeyPress(e)} style={{position:'absolute', top:dist1}}></LeftPaddle>
			<RightPaddle tabIndex={0} onKeyDown={(e) => HandleKeyPress(e)} style={{position:'absolute', top:dist2}}></RightPaddle>
			<DottedLine></DottedLine>
		</GameBox>
		</Box>
	)
}

export default Game