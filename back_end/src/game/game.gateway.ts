import { JwtService } from "@nestjs/jwt";
import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { throws } from "assert";
import { emit } from "process";
import { Status } from "src/user/enums/status.enum";
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
		// this.interval = setInterval(() => {
		// 	this.state = this.gameService.bounceBall(this.state, this.interval)
		// 	this.server.emit('data', {data: this.state})
		// }, 2)
	}

	// interval = null

	// state = {
	// 	player1: null,
	// 	player2: null,
	// 	p1pos: null,
	// 	p2pos: null,
	// 	ballpos: {left: 700, top: 175},
	// 	deltaX: -1,
	// 	deltaY: -1,
	// 	ballSpeed: 2,
	// 	p1score: 0,
	// 	p2score: 0
	// }

	@WebSocketServer()
	server;

	@SubscribeMessage('connection')
	async handleConnection(socket) {
		console.log("user connected to game server")

		try {
			const player = this.gameService.authAndExtract(socket)
			if (!player) {
				socket.disconnect()
			}
			// if (!this.state.player1) {
			// 	this.state.player1 = player.name
			// }
			// else if (!this.state.player2 && player.name != this.state.player1) {
			// 	this.state.player2 = player.name
			// }
		}
		catch (e) {
			socket.disconnect()
		}

		socket.on('disconnect', () => {
			const player = this.gameService.authAndExtract(socket)
			// if (this.state.player1 === player.name) {
			// 	this.state.player1 = null
			// }
			// else if (this.state.player2 === player.name) {
			// 	this.state.player2 = null
			// }
			this.gameService.handleDisconnect(player, socket, this.server)
			console.log("user disconnected from game socket")
		})
	}

	@SubscribeMessage('position')
	async changePos(socket, data) {
			const player = this.gameService.authAndExtract(socket)
			if (!player) {
				throw new WsException("fuck off")
			}

			this.gameService.updatePlayerPos(data, player)

			// if (player.name === this.state.player1) {
			// 	// this.state.p1pos = data.pos
			// }
			// else if (player.name === this.state.player2) {
			// 	// this.state.p2pos = data.pos
			// }

			// this.server.emit('data', {data: this.state})
	}

	@SubscribeMessage('queue-def')
	queuePlayer(socket) {
		console.log(socket)
		this.gameService.addToQueue(socket, this.server)
	}

	@SubscribeMessage('spectate')
	spectate(socket, data) {
		const room = this.gameService.getRoomByUser(data.name)
		if (!room) {
			throw new WsException("bruh unlucky")
		}
		socket.join(room)
	}

	@SubscribeMessage('invite')
	async invite(socket, data) {
		const sockets = await this.server.fetchSockets()

		let i = 0;
		for (i = 0; i < sockets.length; i++) {
			const decrypt = await this.gameService.authAndExtract(sockets[i])
			if (decrypt.id === data.id || decrypt.sub === data.id) {
				break ;
			}
		}

		if (i < sockets.length) {
			const token_decrypt = await this.gameService.authAndExtract(socket)

			let userId = token_decrypt['sub']

			if (!userId) {
				userId = token_decrypt['id']
			}

			const userData = await global.prisma.user.findUnique({
				where: {
					id: userId
				}
			})

			await global.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					status: Status.QUEUE
				}
			})

			this.server.to(sockets[i].id).emit('invite', {user: userData.name, id: userData.id})
		}
	}

	@SubscribeMessage('invite-response')
	async inviteResponse(socket, data) {
		const sockets = await this.server.fetchSockets()

		let i = 0;
		for (i = 0; i < sockets.length; i++) {
			const decrypt = await this.gameService.authAndExtract(sockets[i])
			if (decrypt.id === data.id || decrypt.sub === data.id) {
				break ;
			}
		}

		if (i < sockets.length) {
			const token_decrypt = await this.gameService.authAndExtract(socket)

			let userId = token_decrypt['sub']

			if (!userId) {
				userId = token_decrypt['id']
			}

			const userData = await global.prisma.user.findUnique({
				where: {
					id: userId
				}
			})

			if (!data.accept) {
				const other = await this.gameService.authAndExtract(sockets[i])
				let otherId = other.sub
				if (!otherId) {
					otherId = other.id
				}
				await global.prisma.user.update({
					where: {
						id: otherId
					},
					data: {
						status: Status.ONLINE
					}
				})
				this.server.to(sockets[i].id).emit('refuse')
			}
			else {
				await this.gameService.createCustomRoom(socket, sockets[i], this.server)
			}
		}
	}
}
