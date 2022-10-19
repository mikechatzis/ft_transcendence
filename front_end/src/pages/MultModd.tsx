import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

import './styles/styles.css'

const OPPONENT = 0;
const PLAYER = 1;
const BALL = 2;

let defaultColor = 'grey'

let ballDTop = '15vw';
let ballDLeft = '33vw';

let PLAYER_TOP1 = '10vw'
let PLAYER_TOP2 = '10vw'

class MultModd extends React.Component <any, any>{
	constructor(props: any){
		super(props);
		this.state = this.InitState();
	}
	
	socket: any = null

	canv = {
		position: 'relative',
		width: '70vw',
		height: 'calc(100vw * 6 / 19)',
		backgroundColor: defaultColor,
		margin: 'auto',
		marginTop: 50,
		border: '1px solid white'
	} as const;

	opponentStyle = {
		position: 'absolute',
		top: PLAYER_TOP2,
		left: '68vw',
		height: 'calc(20vw * 6 / 19)',
		width: '1vw',
		backgroundColor : "black",
	} as const;

	playerStyle = {
		position: 'absolute',
		top: PLAYER_TOP1,
		left: '1vw',
		height: 'calc(20vw * 6 / 19)',
		width: '1vw',
		backgroundColor : "black",
	} as const;

	ballStyle = {
		position: 'absolute',
		left: ballDLeft,
		top: ballDTop,
		height: '1vw',
		width: '1vw',
		display: "block",
		backgroundColor: "yellow",
		borderRadius: "100%",
		
	} as const;

	moveEvent = (event: any) => {
		let mousey = event.clientY / window.innerHeight * 100 - 25;
		if (mousey <= 1) {
			mousey = 1
		}
		else if (mousey >= 24) {
			mousey = 24
		}
		let newPos = mousey + 'vw';
		this.socket?.emit('position', {pos: newPos, room: this.state.room})
	}
	
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
			
			ball: 0,
			ballSpeed: 1000/60,
			deltaY: -1,
			deltaX: -1,
			
			pause: true,
			
			opponentSpeed: 5,
			opponentStep: 2,
			opponentDir: false,
			
			playerScore: 0,
			opponentScore: 0,

			p1name: "",
			p2name: "",
			room: "",
			finished: false
		}
	}

	moveElements = (data: any) => {
		this.playerStyle = {...this.playerStyle, top: data.player1Pos }
		this.opponentStyle = {...this.opponentStyle, top: data.player2Pos}
		this.ballStyle = {...this.ballStyle, top: data.ballPos.top, left: data.ballPos.left}
		this.setState({player: this.playerStyle, opponent: this.opponentStyle})
	}
	
	componentDidMount() {
		
		this.socket = this.context
		
		this.socket?.on('data', ({data}: any) => {
			this.moveElements(data)
			this.setState({p1name: data.player1, p2name: data.player2, playerScore: data.p1Score, opponentScore: data.p2Score, room: data.room})
		})

		this.socket?.on('end', () => {
			this.setState({finished: true})
			window.removeEventListener("mousemove", this.moveEvent)
		})

		this.socket?.on('exception', (data: any) => {
			if (data?.message === "???? this room does not exist") {
				this.setState({finished: true})
				window.removeEventListener("mousemove", this.moveEvent)
			}
		})	
		setTimeout(() => {window.addEventListener("mousemove", this.moveEvent)}, 500)
	}
		
	changeColor = (color: string) => () => {
		switch (color){
			case "red": {
				if(this.canv.backgroundColor === 'red')
				this.canv = {...this.canv, backgroundColor: defaultColor}
				else
				this.canv = {...this.canv, backgroundColor: 'red'}
				break;
			}
			case 'green': {
				if(this.canv.backgroundColor === 'green')
				this.canv = {...this.canv, backgroundColor: defaultColor}
				else
				this.canv = {...this.canv, backgroundColor: 'green'}
				break;
			}
			case 'blue': {
				if(this.canv.backgroundColor === 'blue')
				this.canv = {...this.canv, backgroundColor: defaultColor}
				else
				this.canv = {...this.canv, backgroundColor: 'blue'}
			}
		}
	}
			
	render() {
		return (
			<div style={ this.canv }>
				{this.state.finished && <Navigate to="/selectgamemode" replace={true} />}
				<div style={{position:'absolute', marginLeft: 10}}>{`${this.state.p1name} Score: ${this.state.playerScore}`}</div>
				<div style={{position:'absolute', marginTop: 20, marginLeft: 10}}>{`${this.state.p2name} Score: ${this.state.opponentScore}`}</div>
				<div style={this.getStyle(OPPONENT)}></div>
				<div style={this.getStyle(PLAYER)}></div>
				<div style={this.getStyle(BALL)}></div>
				<button className='redButton' onClick={this.changeColor("red")}></button>
				<button className='greenButton' onClick={this.changeColor('green')}></button>
				<button className='blueButton' onClick={this.changeColor('blue')}></button>
			</div>
		)
	}
}

MultModd.contextType = GameContext

export default MultModd