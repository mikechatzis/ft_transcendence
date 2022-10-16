import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { GameService } from './game.service';
import { Status } from '../user/enums/status.enum';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { json } from 'body-parser';

@WebSocketGateway({
		namespace: "game",
		cors: {
			origin: "http://localhost:3000",
			credentials: true
		},
})
export class GameGateway implements OnModuleInit {
	constructor(private jwt: JwtService, private GameService: GameService) {}

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log('socket: %s\nConnected', socket.id)
		});
	}

	@SubscribeMessage('connection')
	async handleConnection(socket) {

		const payload = await this.GameService.authAndExtract(socket)
		if (!payload) {
			console.log("user unauthorized, socket will now disconnect")
			socket.disconnect()
		}
		else {
			await this.GameService.setUserStatus(payload.sub, Status.ONLINE)
			const userData = await global.prisma.user.findUnique({
				where: {
					id: payload.sub
				}
			})

			console.log("user validated, connecting...")
		}


		socket.on('disconnect', () => {
			console.log("a user disconnected")

			if (payload) {
				this.GameService.setUserStatus(payload.sub, Status.OFFLINE)
			}
		})
	}

	@SubscribeMessage('transmitData')
	async handleDataTraffic(@MessageBody() body: string /*depending on frontend, this might change to direct JSON*/) {

		//if frontend sends JSON, omit this line
		const payload = JSON.parse(body)

		try
		{
			if (payload.player === 1) {
				this.server.emit('P1Data', {
					P2PaddlePosition: payload.P2PaddlePosition
				})
			}
			else if (payload.player === 2) {
				this.server.emit('P2Data', {
					P1PaddlePosition: payload.P1PaddlePosition
				})
			}
			else throw new Error('"player" value missing or is not 1 or 2')
		}
		catch(e) {
			console.log('Error: ', e)
		}
	}
}
