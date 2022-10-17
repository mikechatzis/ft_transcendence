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


class Pong extends React.Component <any, any>{
	constructor(props: any){
		super(props);
		this.state = this.InitState();
	}

	canv = {
		position: 'relative',
		height: 700,
		width: 1400,
		backgroundColor: "grey",
		margin: 'auto',
		marginTop: 50,
		border: '1px solid white'
	} as const;
	
	opponentStyle = {
		position: 'relative',
		left: this.canv.width - 40,
		top: this.canv.height/4,
		height: 100,
		width: 20,
		backgroundColor : "black",
	} as const;
	
	playerStyle = {
		position: 'relative',
		top: this.canv.height/4,
		left: 20,
		height: 100,
		width: 20,
		backgroundColor : "black",
	} as const;
	
	ballStyle = {
		position: 'relative',
		left: this.canv.width/2,
		top: this.canv.height/4,
		height: 20,
		width: 20,
		display: "block",
		backgroundColor: "yellow",
		borderRadius: "100%",
		
	} as const;
	
	getStyle = (val: number) => {
		if(val === OPPONENT)
			return this.opponentStyle;
		else if (val === PLAYER)
			return this.playerStyle;
		return this.ballStyle;
	}
	
	InitState = () =>{
		return {
			player: 0, 
			opponent: 0,
	
			ball: this.canv.width/2 + this.canv.height/4,
			ballSpeed: 2,
			deltaY: -1,
			deltaX: -1,
	
			pause: true,
	
			opponentSpeed: 2,
			opponentDir: false,
	
			playerScore: 0,
			opponentScore: 0,
		}
	}

	resetGame = () => {
		this.ballStyle = {...this.ballStyle, top: this.canv.height/4}
		this.ballStyle = {...this.ballStyle, left: this.canv.width/2}
		this.setState({ball: this.ballStyle})
	}

	touchingEdge = (pos: number) => {
		if(pos <= 200 || pos >= this.canv.height + 100)
			return true
		return false
	}

	ballTouchingHorEdge = (pos: number) => {
		const nextPosY = this.ballStyle.top + pos;

		if((nextPosY <= -200) || (nextPosY >= this.canv.height - 220))
			return true
		return false
	}

	ballTouchPaddle = () => {
		const nextPosX = this.ballStyle.left + this.state.deltaX;
		const nextPosY = this.ballStyle.top + this.state.deltaY;

		if((nextPosX === this.playerStyle.left + 20) && (nextPosY >= this.playerStyle.top -125 && nextPosY <= this.playerStyle.top + 25))
			return true
		if((nextPosX === this.opponentStyle.left - 20) && (nextPosY >= this.opponentStyle.top - 225 && nextPosY <= this.opponentStyle.top -125))
			return true
		return false
	}

	moveBoard = (pos: number) => {
		
		if(!this.touchingEdge(pos))
			this.playerStyle = {...this.playerStyle, top: pos - 300}
		return this.playerStyle.top
	}

	playerMove = ({keyCode}: any) => {
		switch (keyCode) {
            case PAUSE:
                this.setState({pause: true})
                break;
        }
	}

	isScore = () => {
		if(this.ballStyle.left <= 10 || this.ballStyle.left >= this.canv.width - 20)
			return true
		return false
	}

	bounceBall = () => {
		if(this.ballTouchPaddle())
		{
			this.setState({deltaX: -this.state.deltaX});
			this.ballStyle = {...this.ballStyle, left: this.ballStyle.left - this.state.deltaX}
		}
		if(this.ballTouchingHorEdge(this.state.deltaY))
		{
			this.setState({deltaY: -this.state.deltaY});
			this.ballStyle = {...this.ballStyle, top: this.ballStyle.top - this.state.deltaY}
		}
		if (!(this.ballTouchPaddle()) && !(this.ballTouchingHorEdge(this.state.deltaY)))
		{
			this.ballStyle = {...this.ballStyle, top: this.ballStyle.top + this.state.deltaY}
			this.ballStyle = {...this.ballStyle, left: this.ballStyle.left + this.state.deltaX}
		}

		this.setState({ball: this.ballStyle})

		if(this.isScore()){
			if(this.state.deltaX === -1)
				this.setState({opponentScore: this.state.opponentScore+1})
			else
				this.setState({playerScore: this.state.playerScore+1})
			this.resetGame();
		}
	}

	moveOpponent = () => {
		if((this.opponentStyle.top + this.state.opponentSpeed <= 10) || (this.opponentStyle.top + this.state.opponentSpeed >= this.canv.height - 130))
			this.setState({opponentSpeed: -this.state.opponentSpeed});
		this.opponentStyle = {...this.opponentStyle, top: this.opponentStyle.top + this.state.opponentSpeed}
		this.setState({opponent: this.opponentStyle.top})
    }

	componentDidMount() {

		setInterval(() => {
            if (!this.state.pause)
                this.bounceBall();
		}, this.state.ballSpeed);

		setInterval(() => {
            if (!this.state.pause)
               this.moveOpponent();
        }, 4);

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
		return (
			<div style={ this.canv }>
				<div style={{position:'absolute'}}>Player Score: {this.state.playerScore}</div>
				<div style={{position:'absolute', marginTop: 20}}>AI Score: {this.state.opponentScore}</div>
				<div style={this.getStyle(OPPONENT)}></div>
				<div style={this.getStyle(PLAYER)}></div>
				<div style={this.getStyle(BALL)}></div>
				
			</div>
			
		)
	}
}

export default Pong