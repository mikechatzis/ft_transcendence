import { Switch } from '@mui/material';
import React from 'react'

const OPPONENT = 0;
const PLAYER = 1;
const BALL = 2;

const PLAYER_UP   = 38
const PLAYER_DOWN = 40
const PAUSE       = 32

let defaultColor = 'grey'

var canv = {
	position: 'relative',
	height: 700,
	width: 1400,
	backgroundColor: defaultColor,
	margin: 'auto',
	marginTop: 50,
	border: '1px solid white'
} as const;

var opponentStyle = {
	position: 'absolute',
	left: canv.width - 40,
	top: canv.height/4,
	height: 100,
	width: 20,
	backgroundColor : "black",
} as const;

var playerStyle = {
	position: 'absolute',
	top: canv.height/4,
	left: 20,
	height: 100,
	width: 20,
	backgroundColor : "black",
} as const;

var ballStyle = {
	position: 'absolute',
	left: canv.width/2,
	top: canv.height/4,
	marginTop: 200,
	height: 20,
	width: 20,
	backgroundColor: "yellow",
	borderRadius: "100%",
	
} as const;

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

		ball: canv.width/2 + canv.height/4,
		ballSpeed: 3,
		deltaY: -1,
		deltaX: -1,

		pause: true,

		opponentStep: 1,
		opponentSpeed: 5,
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
		ballStyle = {...ballStyle, top: canv.height/4}
		ballStyle = {...ballStyle, left: canv.width/2}
		this.setState({ball: ballStyle})
	}

	touchingEdge = (pos: number) => {
		if(pos <= 200 || pos >= canv.height + 100)
			return true
		return false
	}

	ballTouchingHorEdge = (pos: number) => {
		const nextPosY = ballStyle.top + pos;

		if((nextPosY <= -200) || (nextPosY >= canv.height - 220))
			return true
		return false
	}

	ballTouchPaddle = () => {
		const nextPosX = ballStyle.left + this.state.deltaX;
		const nextPosY = ballStyle.top + this.state.deltaY;

		if((nextPosX === playerStyle.left + 20) && (nextPosY >= playerStyle.top -225 && nextPosY <= playerStyle.top - 125))
			return true
		if((nextPosX === opponentStyle.left - 20) && (nextPosY >= opponentStyle.top - 225 && nextPosY <= opponentStyle.top -125))
			return true
		return false
	}

	moveBoard = (pos: number) => {
		
		if(!this.touchingEdge(pos))
			playerStyle = {...playerStyle, top: pos - 200}
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
		if(ballStyle.left <= 10 || ballStyle.left >= canv.width - 20)
			return true
		return false
	}

	bounceBall = () => {
		if(this.ballTouchPaddle())
		{
			this.setState({deltaX: -this.state.deltaX});
			ballStyle = {...ballStyle, left: ballStyle.left - this.state.deltaX}
		}
		if(this.ballTouchingHorEdge(this.state.deltaY))
		{
			this.setState({deltaY: -this.state.deltaY});
			ballStyle = {...ballStyle, top: ballStyle.top - this.state.deltaY}
		}
		if (!(this.ballTouchPaddle()) && !(this.ballTouchingHorEdge(this.state.deltaY)))
		{
			ballStyle = {...ballStyle, top: ballStyle.top + this.state.deltaY}
			ballStyle = {...ballStyle, left: ballStyle.left + this.state.deltaX}
		}

		this.setState({ball: ballStyle})

		if(this.isScore()){
			if(this.state.deltaX === -1)
				this.setState({opponentScore: this.state.opponentScore+1})
			else
				this.setState({playerScore: this.state.playerScore+1})
			this.resetGame();
		}
	}

	moveOpponent = () => {
		if((opponentStyle.top + this.state.opponentStep <= 10) || (opponentStyle.top + this.state.opponentStep >= canv.height - 130))
			this.setState({opponentStep: -this.state.opponentStep});
		opponentStyle = {...opponentStyle, top: opponentStyle.top + this.state.opponentStep}
		this.setState({opponent: opponentStyle.top})
    }

	componentDidMount() {

		setInterval(() => {
            if (!this.state.pause)
                this.bounceBall();
		}, this.state.ballSpeed);

		setInterval(() => {
            if (!this.state.pause)
               this.moveOpponent();
        }, this.state.opponentSpeed);

		document.addEventListener("mousemove", (event) => {
			let mousex = event.clientX;
			let mousey = event.clientY;
			const movedPlayer = this.moveBoard(mousey);
			this.setState({player: movedPlayer, pause: false})
		});
        document.onkeydown = this.playerMove;
        document.title = "ping-pong"
    }

	changeColor = (color: string) => () => {
		switch (color){
			case "red": {
				if(canv.backgroundColor === 'red')
					canv = {...canv, backgroundColor: defaultColor}
				else
					canv = {...canv, backgroundColor: 'red'}
				break;
			}
			case 'green': {
				if(canv.backgroundColor === 'green')
					canv = {...canv, backgroundColor: defaultColor}
				else
					canv = {...canv, backgroundColor: 'green'}
				break;
			}
			case 'blue': {
				if(canv.backgroundColor === 'blue')
					canv = {...canv, backgroundColor: defaultColor}
				else
					canv = {...canv, backgroundColor: 'blue'}
			}

		}

	}

	render() {
		return (
			<div style={ canv }>
				<div style={{position:'absolute'}}>Player Score: {this.state.playerScore}</div>
				<div style={{position:'absolute', marginTop: 20}}>AI Score: {this.state.opponentScore}</div>
				<div style={getStyle(OPPONENT)}></div>
				<div style={getStyle(PLAYER)}></div>
				<div style={getStyle(BALL)}></div>
				<button style={{position:'absolute', backgroundColor:'red', marginTop:canv.height + 10, marginLeft:'45%'}} onClick={this.changeColor("red")}>R</button>
				<button style={{position:'absolute', backgroundColor:'green', marginTop:canv.height + 10, marginLeft:'50%'}} onClick={this.changeColor('green')}>G</button>
				<button style={{position:'absolute', backgroundColor:'blue', marginTop:canv.height + 10, marginLeft:'55%'}} onClick={this.changeColor('blue')}>B</button>
			</div>
			
		)
	}
}

export default Pong