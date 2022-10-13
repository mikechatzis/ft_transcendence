import React from 'react'
import { useState } from 'react'
import * as ReactDOM from 'react-dom/client'
import { unmountComponentAtNode, render } from "react-dom";

const BACKGROUND = 0;
const PLAYER = 1;
const BALL = 2;

const PLAYER_UP   = 38
const PLAYER_DOWN = 40
const PAUSE       = 32

const backgroundStyle = {
    height: "35px",
    width: "35px",
    justifyContent: "center",
    backgroundColor : "white",
    borderRadius: "2px",
}
const playerStyle = {
    height: "35px",
    width: "35px",
    justifyContent: "center",
    backgroundColor : "black",
}

const ballStyle = {
    height: "35px",
    width: "35px",
    display: "block",
    backgroundColor: "grey",
    justifyContent: "center",
    borderRadius: "100%",
}

const getStyle = (val: number) => {
	if(val === BACKGROUND)
		return {};
	if (val === PLAYER)
		return playerStyle;
	return ballStyle;
}

const Board = (props: any) =>
<div style={backgroundStyle}>
	<div style={getStyle(props.name)}/>
</div>

const PADDLE_SIZE = 3;
const PADDLE_EDGE_SPACE = 1;

const ROW_SIZE = 10
const COL_SIZE = 20
const paddle = [...Array(ROW_SIZE * COL_SIZE)]

const style = {
    width: "250px",
    heigth: "250px",
    display: "grid",
    gridTemplate: `repeat(${ROW_SIZE}, 1fr) / repeat(${COL_SIZE}, 1fr)`,

}

const inner = {
    display: "flex",
    justifyContent: "justify", 
    marginTop: 50,
	marginLeft: 1000,
    Text: "100px",
    padding: "10px"
}

const InitState = () =>{
	const paddle = [...Array(PADDLE_SIZE)].map((_, pos)=> pos);
	return {
		player: paddle.map(x => (x * COL_SIZE) + PADDLE_EDGE_SPACE),
		opponent: paddle.map(x => ((x+1) * COL_SIZE) - (PADDLE_EDGE_SPACE+1)),

		ball: Math.round((ROW_SIZE * COL_SIZE)/2) + ROW_SIZE,
		ballSpeed: 100,
		deltaY: -COL_SIZE,
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

	resetGame = () => this.setState({
		ball: Math.round((ROW_SIZE * COL_SIZE)/2) + ROW_SIZE,
	})

	moveBoard = (playerB: any, isUp: boolean) => {
		const playerEdge = isUp? playerB[0]: playerB[PADDLE_SIZE-1];

        if (!this.touchingEdge(playerEdge)) {
            const deltaY =  (isUp ? -COL_SIZE : COL_SIZE);
            /* if ball touches the edge */
            const newDir = (this.state.deltaY !== COL_SIZE !== isUp) ? -this.state.deltaY: this.state.deltaY;
            
            if (!this.touchingEdge(this.state.ball)) {
                switch (this.state.ball) {
                    case playerEdge + deltaY -1:
                        this.setState({
                            deltaY: newDir,
                            deltaX: -1,
                        })
                        break;
                    case playerEdge:
                        this.setState({
                            deltaY: newDir,
                        })
                        break;
                    case playerEdge + deltaY + 1:
                        this.setState({
                            deltaY: newDir,
                            deltaX: 1,
                        })
                        break;
                }
            }
            return playerB.map((x: any) => x + deltaY);
        }      
        return false
	}

	touchingEdge = (pos: number) => (0 <= pos && pos < COL_SIZE) || (COL_SIZE*(ROW_SIZE-1) <= pos && pos < COL_SIZE * ROW_SIZE) 

	touchingPaddle = (pos: number) => {

	}

	touchingPaddleEdge = (pos: number) => {
		
	}

	isScore = (pos: number) => (this.state.deltaX=== -1 && pos % COL_SIZE === 0) || (this.state.deltaX === 1 && (pos+1) % COL_SIZE === 0)

	bounceBall = () => {

	}

	keyInput = ({keyCode}: any) => {
		console.log(keyCode);
		switch (keyCode) {
            case PLAYER_UP:
            case PLAYER_DOWN:
                const movedPlayer = this.moveBoard(this.state.player, keyCode===PLAYER_UP); 
                if (movedPlayer) {
                    this.setState({player: movedPlayer, pause: false})
                }
                break;
            case PAUSE:
                this.setState({pause: true})
                break;
        }
	}

	moveOpponent = () => {
        const movedPlayer = this.moveBoard(this.state.opponent, this.state.opponentDir); 
        movedPlayer ? this.setState({opponent: movedPlayer}): 
            this.setState({opponentDir: !this.state.opponentDir});
    }

	componentDidMount() {
        setInterval(() => {
            if (!this.state.pause){
                this.bounceBall();
            }
        }, this.state.ballSpeed);
        setInterval(() => {
            if (!this.state.pause){
               this.moveOpponent();
            }
        }, this.state.opponentSpeed);
        
        document.onkeydown = this.keyInput;
        document.title = "ping-pong"
    }

	render() {
		const paddle = [...Array(ROW_SIZE * COL_SIZE)].map((_, pos) => {
			let val = BACKGROUND;
			if((this.state.player.indexOf(pos) !== -1) || (this.state.opponent.indexOf(pos) !== -1))
				val = PLAYER;
			else if(this.state.ball === pos )
				val = BALL;
			return <Board key={pos} name={val}/>
		})
		return (
			<div style={ inner }>
				<div style={ style }>{ paddle }</div>
			</div>
		)
	}
}

export default Pong