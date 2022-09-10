import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async getAllChannels() {
		const channels = await this.prisma.channel.findMany()

		return channels
	}

	async createNewChannel(req, body) {
		try {
			let userId = req.user.sub
			if (!userId) {
				userId = req.user.id
			}
			const user = await this.prisma.user.findUnique({
				where: {
					id: userId
				}
			})

			const channel = await this.prisma.channel.create({
				data: {
					name: body.name,
					admins: [user.id],
					isDmChannel: false
				}
			})

			const newArr = [...user.channels, body.name]

			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					channels: newArr
				}
			})
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new ForbiddenException("channel with that name already exists")
				}
			}
			else {
				throw error
			}
		}
	}

	async joinChannel(req, channel) {
		let userId = req.user.sub
		if (!userId) {
			userId = req.user.id
		}
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!user.channels.includes(channel)) {
			const newArr = [...user.channels, channel]
			await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					channels: newArr
				}
			})
		}
	}

	async leaveChannel(req, channel) {
		let userId = req.user.sub
		if (!userId) {
			userId = req.user.id
		}
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (user.channels.includes(channel)) {
			const index = user.channels.indexOf(channel)
			const newArr = user.channels.splice(index, 1)
			await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					channels: newArr
				}
			})

			const currChannel = await this.prisma.channel.findUnique({
				where: {
					name: channel
				}
			})
			if (currChannel.admins.includes(userId)) {
				const adminIndex = currChannel.admins.indexOf(userId)
				const newAdmins = currChannel.admins.splice(adminIndex, 1)
				const updated = await this.prisma.channel.update({
					where: {
						name: channel
					},
					data: {
						admins: newAdmins
					}
				})

				if (updated.admins.length === 0) {
					this.prisma.channel.delete({
						where: {
							name: channel
						}
					})
				}
			}
		}
	}

	async deleteChannel(req, channel) {
	}

	async setUserStatus(userId: number, userStatus: number) {
		const user = await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				status: userStatus
			}
		})
	}

	authAndExtract(socket) {
		const cookies_raw = socket.handshake.headers.cookie

		if (!cookies_raw) {
			return
		}

		const cookies = cookie.parse(cookies_raw)

		const payload = this.jwt.verify(cookies.jwt, {publicKey: this.config.get('JWT_SECRET')})

		return payload
	}
}
