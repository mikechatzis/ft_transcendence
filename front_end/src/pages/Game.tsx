import React from 'react'

const OPPONENT = 0;
const PLAYER = 1;
const BALL = 2;

const PAUSE       = 32


let defaultColor = 'grey'


let ballDTop = '15vw';
let ballDLeft = '33vw';

class Pong extends React.Component <any, any>{
	constructor(props: any){
		super(props);
		this.state = this.InitState();
	}

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
		top: '10vw',
		left: '68vw',
		height: 'calc(20vw * 6 / 19)',
		width: '1vw',
		backgroundColor : "yellow",
	} as const;
	
	playerStyle = {
		position: 'absolute',
		top: '10vw',
		left: '1vw',
		height: 'calc(20vw * 6 / 19)',
		width: '1vw',
		backgroundColor : "yellow",
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
			deltaY: -0.2,
			deltaX: -0.2,
	
			pause: false,
	
			opponentSpeed: 5,
			opponentStep: 2,
			opponentDir: false,
	
			playerScore: 0,
			opponentScore: 0,
		}
	}

	resetGame = () => {
		this.ballStyle = {...this.ballStyle, top: '15vw'}
		this.ballStyle = {...this.ballStyle, left:  '33vw'}
		this.setState({ball: this.ballStyle})
	}

	touchingEdge = (pos: number) => {
		let y = parseFloat(this.ballStyle.top) + this.state.deltaY + 'vw';
		// if(pos <= 200 || pos >= this.canv.height + 100)
			// return true
		return false
	}

	ballTouchingHorEdge = (pos: number) => {
		// const nextPosY = this.ballStyle.top + pos;

		// if((nextPosY <= -200) || (nextPosY >= this.canv.height - 220))
			// return true
		return false
	}

	ballTouchPaddle = () => {
		// const nextPosX = this.ballStyle.left + this.state.deltaX;
		// const nextPosY = this.ballStyle.top + this.state.deltaY;

		// if((nextPosX === this.playerStyle.left + 20) && (nextPosY >= this.playerStyle.top -225 && nextPosY <= this.playerStyle.top - 115))
		// 	return true
		// if((nextPosX === this.opponentStyle.left - 20) && (nextPosY >= this.opponentStyle.top - 225 && nextPosY <= this.opponentStyle.top -115))
			// return true
		return false
	}

	moveBoard = (pos: number) => {
		
		// if(!this.touchingEdge(pos))
		// 	this.playerStyle = {...this.playerStyle, top: pos - 200}
		// return this.playerStyle.top
	}

	playerMove = ({keyCode}: any) => {
		switch (keyCode) {
            case PAUSE:
                this.setState({pause: false})
                break;
        }
	}

	isScore = () => {
		// if(this.ballStyle.left <= 10 || this.ballStyle.left >= this.canv.width - 20)
			// return true
		return false
	}

	bounceBall = () => {
		// console.log(parseInt(this.ballStyle.top))
		if(this.ballTouchPaddle())
		{
			this.setState({deltaX: -this.state.deltaX});
			// this.ballStyle = {...this.ballStyle, left: this.ballStyle.left - this.state.deltaX}
		}
		if(this.ballTouchingHorEdge(this.state.deltaY))
		{
			this.setState({deltaY: -this.state.deltaY});
			// this.ballStyle = {...this.ballStyle, top: this.ballStyle.top - this.state.deltaY}
		}
		if (!(this.ballTouchPaddle()) && !(this.ballTouchingHorEdge(this.state.deltaY)))
		{

			let y = parseFloat(this.ballStyle.top) + this.state.deltaY + 'vw';
			let x = parseFloat(this.ballStyle.left) + this.state.deltaX + 'vw';
			
			this.ballStyle = {...this.ballStyle, top: y}
			this.ballStyle = {...this.ballStyle, left: x}
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
		// if((this.opponentStyle.top + this.state.opponentStep <= 10) || (this.opponentStyle.top + this.state.opponentStep >= this.canv.height - 130))
		// 	this.setState({opponentStep: -this.state.opponentStep});
		// this.opponentStyle = {...this.opponentStyle, top: this.opponentStyle.top + this.state.opponentStep}
		// this.setState({opponent: this.opponentStyle.top})
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
			let mousey = event.clientY;
			const movedPlayer = this.moveBoard(mousey);
			this.setState({player: movedPlayer, pause: false})
		});
        document.onkeydown = this.playerMove;
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
				{/* <div style={{position:'absolute'}}>Player Score: {this.state.playerScore}</div>
				<div style={{position:'absolute', marginTop: 20}}>AI Score: {this.state.opponentScore}</div>
				<button style={{position:'absolute', backgroundColor:'red', marginTop:this.canv.height + 10, marginLeft:'45%'}} onClick={this.changeColor("red")}>R</button>
				<button style={{position:'absolute', backgroundColor:'green', marginTop:this.canv.height + 10, marginLeft:'50%'}} onClick={this.changeColor('green')}>G</button>
				<button style={{position:'absolute', backgroundColor:'blue', marginTop:this.canv.height + 10, marginLeft:'55%'}} onClick={this.changeColor('blue')}>B</button> */}
				<div style={this.getStyle(PLAYER)}></div>
				<div style={this.getStyle(OPPONENT)}></div>
				<div style={this.getStyle(BALL)}></div>
			</div>
			
		)
	}
}

export default Pong