import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'

@WebSocketGateway({
	namespace: "chat",
	cors: {
		origin: "http://localhost:3000"
	}
})
export class ChatGateway {
	
	// starts a socket server on current api port
	@WebSocketServer()
	server;

	@SubscribeMessage('message')
	handleMessage(@MessageBody() message: string) {
		this.server.emit('message', message)
	}
}