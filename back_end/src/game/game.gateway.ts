import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { GameService } from './game.service';
import { Status } from '../user/enums/status.enum';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
		namespace: "game"
		// cors: {
		// 	origin: "http://localhost:3000",
		// 	credentials: true
		// },
})
export class GameGateway  {
	//constructor(private jwt: JwtService, private GameService: GameService) {}

	// @WebSocketServer()
	// server: Server;

	// onModuleInit() {
	// 	this.server.on('connection', (socket) => {
	// 		console.log('socket: %s\nConnected', socket.id)
	// 	});
	// }

	@SubscribeMessage('new')
	handleConnection(@MessageBody() body: any) {
		console.log('hi');
		// this.server.emit('onGameConnection', {
		// 	msg: 'a user has connected'
		// })

	// 	const payload = await this.GameService.authAndExtract(socket)
	// 	if (!payload) {
	// 		socket.disconnect()
	// 	}

	// 	if (payload) {
	// 		await this.GameService.setUserStatus(payload.sub, Status.ONLINE)
	// 		const userData = await global.prisma.user.findUnique({
	// 			where: {
	// 				id: payload.sub
	// 			}
	// 		})

	// 		for (let i = 0; i < userData.channels.length; i++) {
	// 			socket.join(userData.channels[i])
	// 		}
	// 	}

	// 	socket.on('disconnect', () => {
	// 		console.log("a user disconnected")

	// 		if (payload) {
	// 			this.GameService.setUserStatus(payload.sub, Status.OFFLINE)
	// 		}
	// 	})
	}
}
