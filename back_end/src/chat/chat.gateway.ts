import { JwtService } from '@nestjs/jwt';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets'
import * as cookie from 'cookie'

@WebSocketGateway({
	namespace: "chat",
	cors: {
		origin: "http://localhost:3000",
		credentials: true
	},
})
export class ChatGateway {
	constructor(private jwt: JwtService) {}

	// starts a socket server on current api port
	@WebSocketServer()
	server;

	@SubscribeMessage('message')
	async handleMessage(@MessageBody() message) {
		const sockets = await this.server.fetchSockets()

		let i = 0

		for (i = 0; i < sockets.length; i++) {
			if (sockets[i].id === message.id) {
				break
			}
		}

		const cookies_raw = sockets[i].handshake.headers.cookie

		if (!cookies_raw) {
			throw new WsException("401")
		}
		const cookies = cookie.parse(cookies_raw)

		const token_decrypt = this.jwt.decode(cookies.jwt)

		this.server.emit('message', {data: `${token_decrypt['name']}: ${message.data}`})
	}
}