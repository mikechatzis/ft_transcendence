import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as cookie from 'cookie'
import {v4 as uuidv4} from 'uuid'
import { Server, Socket } from "socket.io";
import { Room } from "./interfaces/room.interface"
import { WsException } from "@nestjs/websockets";
import { Status } from "../user/enums/status.enum";

const BALL_SPEED = (1000/60)
const DELTA = -0.3

let BALL_LEFT = '33vw'
let BALL_TOP = '15vw'

let PLAYER_TOP1 = '10vw'
let PLAYER_TOP2 = '10vw'

@Injectable()
export class GameService {
	constructor(private jwt: JwtService, private config: ConfigService) {}

	rooms: Room[] = []
	queue: Socket[] = []

	authAndExtract(socket) {
		const cookies_raw = socket.handshake.headers.cookie

		if (!cookies_raw) {
			return
		}

		const cookies = cookie.parse(cookies_raw)

		if (!cookies.jwt) {
			return
		}
		const payload = this.jwt.verify(cookies.jwt, {publicKey: this.config.get('JWT_SECRET'), ignoreExpiration: true})
		
		return payload
	}

	getRoomByUser(user) {
		for (let i = 0; i < this.rooms.length; i++) {
			if (this.rooms[i].player1 === user || this.rooms[i].player2 === user) {
				return this.rooms[i].room
			}
		}
		return null
	}

	async createCustomRoom(p1: Socket, p2: Socket, server: Server) {
		const user1 = this.authAndExtract(p1)
		const user2 = this.authAndExtract(p2)
		const roomUUID = uuidv4()
		p1.join(roomUUID)
		p2.join(roomUUID)

		const room: Room = {
			room: roomUUID,
			player1: user1.name,
			player2: user2.name,
			ballPos: {left: BALL_LEFT, top: BALL_TOP},
			player1Pos: PLAYER_TOP1,
			player2Pos: PLAYER_TOP2,
			deltaX: DELTA,
			deltaY: DELTA,
			p1Score: 0,
			p2Score: 0,
			winner: "",
			interval: null
		}

		this.rooms.push(room)
		server.to(room.room).emit('invite-start')
		await global.prisma.user.update({
			where: {
				name: room.player1
			},
			data: {
				status: Status.GAME
			}
		})

		await global.prisma.user.update({
			where: {
				name: room.player2
			},
			data: {
				status: Status.GAME
			}
		})

		room.interval = setInterval(() => {
			let room_state = null
			for (let i = 0; i < this.rooms.length; i++) {
				if (this.rooms[i].room === room.room) {
					room_state = this.rooms[i]
				}
			}
			this.gameProcess(room.room)
			server.to(room.room).emit('data', {data: room_state})
			if (room.p1Score >= 15 || room.p2Score >= 15) {
				clearInterval(room.interval)
				this.handleEndGame(room_state, server)
			}
		}, BALL_SPEED)

	}

	handleDisconnect = async (player, socket, server) => {
		console.log(this.queue.length)
		let room = null
		for (let i = 0; i < this.rooms.length; i++) {
			if (player?.name === this.rooms[i].player1) {
				this.rooms[i].winner = this.rooms[i].player2
				room = this.rooms[i]
				break ;
			}
			else if (player?.name === this.rooms[i].player2) {
				this.rooms[i].winner = this.rooms[i].player1
				room = this.rooms[i]
				break ;
			}
		}
		if (room) {
			const p1 = await global.prisma.user.findUnique({
				where: {
					name: room.player1
				}
			})
			const p2 = await global.prisma.user.findUnique({
				where: {
					name: room.player2
				}
			})
			const winnerId = p1.name === room.winner ? p1.id : p2.id
			await global.prisma.user.update({
				where: {
					name: room.player1
				},
				data: {
					matchHistory: {
						create: [
							{opponentId: p2.id, winner: winnerId}
						]
					},
					status: p1.name === room.winner ? Status.ONLINE : Status.OFFLINE
				}
			})

			await global.prisma.user.update({
				where: {
					name: room.player2
				},
				data: {
					matchHistory: {
						create: [
							{opponentId: p1.id, winner: winnerId}
						]
					},
					status: p2.name === room.winner ? Status.ONLINE : Status.OFFLINE
				}
			})

			const index = this.rooms.indexOf(room)
			clearInterval(room.interval)

			server.to(room.room).emit('end')
			server.socketsLeave(room.room)
			this.rooms.splice(index, 1)
		}

		if (this.queue.includes(socket)) {
			const index = this.queue.indexOf(socket)
			const user = this.authAndExtract(socket)
			await global.prisma.user.update({
				where: {
					name: user.name
				},
				data: {
					status: Status.OFFLINE
				}
			})
			this.queue.splice(index, 1)
		}

	}
	
	handleEndGame = async (room: Room, server: Server) => {
		const p1 = await global.prisma.user.findUnique({
			where: {
				name: room.player1
			}
		})
		const p2 = await global.prisma.user.findUnique({
			where: {
				name: room.player2
			}
		})
		let winnerId = null

		if (room.p1Score >= 15) {
			winnerId = p1.id
		}
		else if (room.p2Score >= 15) {
			winnerId = p2.id
		}

		await global.prisma.user.update({
			where: {
				name: room.player1
			},
			data: {
				matchHistory: {
					create: [
						{opponentId: p2.id, winner: winnerId}
					]
				},
				status: Status.ONLINE
			}
		})

		await global.prisma.user.update({
			where: {
				name: room.player2
			},
			data: {
				matchHistory: {
					create: [
						{opponentId: p1.id, winner: winnerId}
					]
				},
				status: Status.ONLINE
			}
		})
		const index = this.rooms.indexOf(room)
		server.to(room.room).emit('end')
		server.socketsLeave(room.room)
		this.rooms.splice(index, 1)
	}

	bounceBall = (room: Room) => {
		if (parseFloat(room.ballPos.top) <= 0 || parseFloat(room.ballPos.top) >= 30.5) {
			room.deltaY = -room.deltaY
		}
		if (parseFloat(room.ballPos.left) <= 1 ||  parseFloat(room.ballPos.left) >= 68) {
			if (room.deltaX === -1) {
				room.p2Score += 1
			}
			else {
				room.p1Score += 1
			}
			room.ballPos = {left: BALL_LEFT, top: BALL_TOP}
		}
		if ((parseFloat(room.ballPos.left) <= 2 && parseFloat(room.ballPos.left) >= 1.5) && (parseFloat(room.ballPos.top) >= parseFloat(room.player1Pos) - 1 && parseFloat(room.ballPos.top) <= parseFloat(room.player1Pos) + 6)) {
			room.deltaX = -room.deltaX
			room.ballPos.left = parseFloat(room.ballPos.left) + room.deltaX + 'vw';
		}
		if ((parseFloat(room.ballPos.left) >= 66.5 && parseFloat(room.ballPos.left) >= 67 ) && (parseFloat(room.ballPos.top) >= parseFloat(room.player2Pos) - 1 && parseFloat(room.ballPos.top) <= parseFloat(room.player2Pos) + 6)) {
			room.deltaX = -room.deltaX
			room.ballPos.left = parseFloat(room.ballPos.left) + room.deltaX + 'vw';
		}

		let y = parseFloat(room.ballPos.top) + room.deltaY + 'vw';
		let x = parseFloat(room.ballPos.left) + room.deltaX + 'vw';
		room.ballPos = {...room.ballPos, top: y}
		room.ballPos = {...room.ballPos, left: x}

		return room
	}
	
	addToQueue = async (socket: Socket, server: Server) => {
		this.queue.push(socket)
		console.log('add to queue')

		if (this.queue.length >= 2) {
			console.log('queue pops')
			const room = this.createRoom()
			this.queue.splice(0, 2)
			server.to(room.room).emit('start-def')

			await global.prisma.user.update({
				where: {
					name: room.player1
				},
				data: {
					status: Status.GAME
				}
			})

			await global.prisma.user.update({
				where: {
					name: room.player2
				},
				data: {
					status: Status.GAME
				}
			})

			room.interval = setInterval(() => {
				let room_state = null
				for (let i = 0; i < this.rooms.length; i++) {
					if (this.rooms[i].room === room.room) {
						room_state = this.rooms[i]
					}
				}
				this.gameProcess(room.room)
				server.to(room.room).emit('data', {data: room_state})
				if (room.p1Score >= 15 || room.p2Score >= 15) {
					clearInterval(room.interval)
					this.handleEndGame(room_state, server)
				}
			}, BALL_SPEED)
		}
		else {
			const user = this.authAndExtract(socket)
			await global.prisma.user.update({
				where: {
					name: user.name
				},
				data: {
					status: Status.QUEUE
				}
			})
		}
	}

	updatePlayerPos = (data: any, player: any) => {
		let room = null
		for (let i = 0; i < this.rooms.length; i++) {
			if (this.rooms[i].room === data.room) {
				room = this.rooms[i]
			}
		}

		if (!room) {
			throw new WsException("???? this room does not exist")
		}

		if (player.name === room.player1) {
			room.player1Pos = data.pos
		}
		else if (player.name === room.player2) {
			room.player2Pos = data.pos
		}

		for (let i = 0; i < this.rooms.length; i++) {
			if (this.rooms[i].room === data.room) {
				this.rooms[i] = room
			}
		}
	}

	gameProcess = (roomUUID) => {
		let room = null
		for (let i = 0; i < this.rooms.length; i++) {
			if (this.rooms[i].room === roomUUID) {
				room = this.rooms[i]
			}
		}

		room = this.bounceBall(room)
		for (let i = 0; i < this.rooms.length; i++) {
			if (this.rooms[i].room === roomUUID) {
				this.rooms[i] = room
			}
		}
	}

	createRoom = () => {
		const user1 = this.authAndExtract(this.queue[0])
		const user2 = this.authAndExtract(this.queue[1])
		const roomUUID = uuidv4()
		this.queue[0].join(roomUUID)
		this.queue[1].join(roomUUID)

		const room: Room = {
			room: roomUUID,
			player1: user1.name,
			player2: user2.name,
			ballPos: {left: BALL_LEFT, top: BALL_TOP},
			player1Pos: PLAYER_TOP1,
			player2Pos: PLAYER_TOP2,
			deltaX: DELTA,
			deltaY: DELTA,
			p1Score: 0,
			p2Score: 0,
			winner: "",
			interval: null
		}

		this.rooms.push(room)
		return room
	}
}
