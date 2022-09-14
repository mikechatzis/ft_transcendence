import { JwtService } from '@nestjs/jwt';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets'
import { ChatService } from './chat.service';
import * as cookie from 'cookie'
import { Status } from '../user/enums/status.enum';
import { Socket } from 'socket.io';
import { ForbiddenException } from '@nestjs/common';

@WebSocketGateway({
	namespace: "chat",
	cors: {
		origin: "http://localhost:3000",
		credentials: true
	},
})
export class ChatGateway {
	constructor(private jwt: JwtService, private chatService: ChatService) {}

	// starts a socket server on current api port
	@WebSocketServer()
	server;

	@SubscribeMessage('connection')
	async handleConnection(socket) {
		console.log("a user connected")

		const payload = await this.chatService.authAndExtract(socket)
		if (!payload) {
			socket.disconnect()
		}

		if (payload) {
			await this.chatService.setUserStatus(payload.sub, Status.ONLINE)
			const userData = await global.prisma.user.findUnique({
				where: {
					id: payload.sub
				}
			})

			for (let i = 0; i < userData.channels.length; i++) {
				socket.join(userData.channels[i])
			}
		}

		socket.on('disconnect', () => {
			console.log("a user disconnected")

			if (payload) {
				this.chatService.setUserStatus(payload.sub, Status.OFFLINE)
			}
		})

	}

	@SubscribeMessage('message')
	async handleMessage(socket, data) {

		const sockets = await this.server.fetchSockets()

		let i = 0

		for (i = 0; i < sockets.length; i++) {
			if (sockets[i].id === data.id) {
				break
			}
		}

		if (i < sockets.length) {
			const cookies_raw = sockets[i].handshake.headers.cookie
	
			if (!cookies_raw) {
				throw new WsException("401")
			}

			const cookies = cookie.parse(cookies_raw)
	
			const token_decrypt = await this.chatService.authAndExtract(socket)

			const userId = token_decrypt['sub']

			if (!userId) {
				const userId = token_decrypt['id']
			}

			const userData = await global.prisma.user.findUnique({
				where: {
					id: userId
				}
			})

			if (!userData.channels.includes(data.room)) {
				throw new WsException("User is not part of this room")
			}
	
			this.server.to(data.room).emit('message', {data: `${userData.name}: ${data.data}`, room: data.room})
		}

	}

	@SubscribeMessage('join')
	handleJoin(socket, data) {
		socket.join(data.room)
	}

	@SubscribeMessage('leave')
	handleLeave(socket, data) {
		socket.leave(data.room)
	}

	@SubscribeMessage('delete')
	handleDelete(socket, data) {
		this.server.socketsLeave(data.room)
	}
}
