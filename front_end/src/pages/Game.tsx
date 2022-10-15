import React from 'react'
import { useState } from 'react'
import * as ReactDOM from 'react-dom/client'
import { unmountComponentAtNode, render } from "react-dom";
import { CommentsDisabledOutlined, CompressOutlined, ThirtyFpsSelect, ThumbsUpDownOutlined } from '@mui/icons-material';
import { gridColumnVisibilityModelSelector } from '@mui/x-data-grid';

const OPPONENT = 0;
const PLAYER = 1;
const BALL = 2;

const PLAYER_UP   = 38
const PLAYER_DOWN = 40
const PAUSE       = 32

const canv = {
	height: 700,
	width: 1400,
	backgroundColor: "grey",
	marginLeft: '10%',
	marginTop: 50,
	border: '2px solid white'
};

var opponentStyle = {
	left: canv.width-20,
	top: 500,
	height: 100,
	width: 20,
	justifyContent: "center",
	backgroundColor : "blue",
};

var playerStyle = {
	position: 'relative',
	left: 20,
	top: 300,
    height: 100,
    width: 20,
    justifyContent: "center",
    backgroundColor : "black",
};

var ballStyle = {
	position: 'relative',
	left: canv.width/2,
	top: canv.height/3,
	height: 20,
	width: 20,
	display: "block",
	backgroundColor: "yellow",
	justifyContent: "center",
	borderRadius: "100%",
};

const getStyle = (val: number) => {
	if(val === OPPONENT)
		return opponentStyle;
	else if (val === PLAYER)
		return playerStyle;
	return ballStyle;
}

const InitState = () =>{
	return {
		player: 0, 
		opponent: 0,

		ball: canv.width/2 + canv.height/3,
		ballSpeed: 2,
		deltaY: -1,
		deltaX: -1,

		pause: true,

		opponentSpeed: 150,
        opponentDir: false,

		playerScore: 0,
		opponentScore: 0,
	}
}

class Pong extends React.Component <any, any>{
	constructor(props: any){
		super(props);
		this.state = InitState();
	}

	resetGame = () => {
		ballStyle = {...ballStyle, top: canv.height/3}
		ballStyle = {...ballStyle, left: canv.width/2}
		this.setState({ball: ballStyle})
	}

	touchingEdge = (pos: number) => {
		if(pos <= 150 || pos >= 750)
			return true
		return false
	}

	ballTouchingHorEdge = (pos: number) => {
		const nextPosY = ballStyle.top + pos;

		if((nextPosY <= -97) || (nextPosY >= canv.height - 120))
			return true
		return false
	}

	ballTouchingVertEdge = (pos: number) => {
		const nextPosX = ballStyle.left + pos;

		if(nextPosX >= canv.width - 20)
			return true
		return false
	}

	ballTouchPaddle = () => {
		const nextPosX = ballStyle.left + this.state.deltaX;
		const nextPosY = ballStyle.top + this.state.deltaY;

		if((nextPosX === playerStyle.left + 20) && (nextPosY >= playerStyle.top -125 && nextPosY <= playerStyle.top + 25))
			return true
		return false
	}

	moveBoard = (pos: number) => {
		
		if(!this.touchingEdge(pos))
			playerStyle = {...playerStyle, top: pos - 150}
		return playerStyle.top
	}

	playerMove = ({keyCode}: any) => {
		switch (keyCode) {
            case PAUSE:
                this.setState({pause: true})
                break;
        }
	}

	isScore = () => {
		if(ballStyle.left <= 10)
			return true
		return false
	}

	bounceBall = () => {
		if(this.ballTouchingVertEdge(this.state.deltaX) || this.ballTouchPaddle())
		{
			this.setState({deltaX: -this.state.deltaX});
			ballStyle = {...ballStyle, left: ballStyle.left - this.state.deltaX}
		}
		if(this.ballTouchingHorEdge(this.state.deltaY))
		{
			this.setState({deltaY: -this.state.deltaY});
			ballStyle = {...ballStyle, top: ballStyle.top - this.state.deltaY}
		}
		if (!(this.ballTouchingVertEdge(this.state.deltaX) || this.ballTouchPaddle()) && !(this.ballTouchingHorEdge(this.state.deltaY)))
		{
			ballStyle = {...ballStyle, top: ballStyle.top + this.state.deltaY}
			ballStyle = {...ballStyle, left: ballStyle.left + this.state.deltaX}
		}

		this.setState({ball: ballStyle})

		if(this.isScore()){
			this.setState({opponentScore: this.state.opponentScore+1})
			this.resetGame();
		}
	}

	componentDidMount() {

		setInterval(() => {
            if (!this.state.pause)
                this.bounceBall();
		}, this.state.ballSpeed);

		document.addEventListener("mousemove", (event) => {
			let mousex = event.clientX;
			let mousey = event.clientY;
			const movedPlayer = this.moveBoard(mousey);
			this.setState({player: movedPlayer, pause: false})
		});
        document.onkeydown = this.playerMove;
        document.title = "ping-pong"
    }

	render() {
		// const paddle = () => {
		// 	let val = BACKGROUND;
		// 	if(this.state.player !== -1 || this.state.opponent !== -1)
		// 		val = PLAYER;
		// 	return <Board name={val}/>
		// }
		return (
			<div style={ canv }>
				<div style={getStyle(OPPONENT)}/>
				<div style={getStyle(PLAYER)}/>
				<div style={getStyle(BALL)}/>
			</div>
			
		)
	}
}

export default Pong