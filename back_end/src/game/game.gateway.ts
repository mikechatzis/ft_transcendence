import { JwtService } from "@nestjs/jwt";
import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { emit } from "process";
import { GameService } from "./game.service";

@WebSocketGateway({
	namespace: "game",
	cors: {
		origin: "http://localhost:3000",
		credentials: true
	}
})
export class GameGateway {
	constructor(private jwt: JwtService, private gameService: GameService) {
		this.interval = setInterval(() => {
			this.state = this.gameService.bounceBall(this.state, this.interval)
			this.server.emit('data', {data: this.state})
		}, 2)
	}

	interval = null

	state = {
		player1: null,
		player2: null,
		p1pos: null,
		p2pos: null,
		ballpos: {left: 700, top: 175},
		deltaX: -1,
		deltaY: -1,
		ballSpeed: 2,
		p1score: 0,
		p2score: 0
	}

	@WebSocketServer()
	server;

	@SubscribeMessage('connection')
	async handleConnection(socket) {
		console.log("user connected to game server")

		try {
			const player = this.gameService.authAndExtract(socket)
			if (!this.state.player1) {
				this.state.player1 = player.name
			}
			else if (!this.state.player2 && player.name != this.state.player1) {
				this.state.player2 = player.name
			}
		}
		catch (e) {
			socket.disconnect()
		}

		socket.on('disconnect', () => {
			const player = this.gameService.authAndExtract(socket)
			if (this.state.player1 === player.name) {
				this.state.player1 = null
			}
			else if (this.state.player2 === player.name) {
				this.state.player2 = null
			}
			console.log("user disconnected from game socket")
		})
	}

	@SubscribeMessage('position')
	async changePos(socket, data) {
		try {
			const player = this.gameService.authAndExtract(socket)
			if (!player) {
				throw new WsException("fuck off")
			}

			if (player.name === this.state.player1) {
				this.state.p1pos = data.pos
			}
			else if (player.name === this.state.player2) {
				this.state.p2pos = data.pos
			}

			this.server.emit('data', {data: this.state})
		}
		catch (e) {
			console.log(e)
		}
	}
}
