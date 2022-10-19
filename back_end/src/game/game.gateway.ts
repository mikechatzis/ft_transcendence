import { JwtService } from "@nestjs/jwt";
import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { throws } from "assert";
import { emit } from "process";
import { Status } from "../user/enums/status.enum";
import { GameService } from "./game.service";

@WebSocketGateway({
	namespace: "game",
	cors: {
		origin: "http://localhost:3000",
		credentials: true
	}
})
export class GameGateway {
	constructor(private jwt: JwtService, private gameService: GameService) {}

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
		}
		catch (e) {
			socket.disconnect()
		}

		socket.on('disconnect', () => {
			const player = this.gameService.authAndExtract(socket)
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
	}

	@SubscribeMessage('queue-def')
	async queuePlayer(socket) {
		try {
			await this.gameService.addToQueue(socket, this.server)
		}
		catch (e) {
			throw e
		}
	}

	@SubscribeMessage('queue-mod')
	async queuePlayerMod(socket) {
		try {
			await this.gameService.addToModQueue(socket, this.server)
		}
		catch(e) {
			throw e
		}
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
