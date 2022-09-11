import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
	constructor(private jwt: JwtService, private config: ConfigService) {}

	async getAllChannels() {
		const channels = await global.prisma.channel.findMany()

		for (let i = 0; i < channels.length; i++) {
			delete channels[0].hash
		}
		return channels
	}

	async createNewChannel(req, body) {
		try {
			let userId = req.user.sub
			let hash = null
			if (!userId) {
				userId = req.user.id
			}

			const user = await global.prisma.user.findUnique({
				where: {
					id: userId
				}
			})

			const channel = await global.prisma.channel.create({
				data: {
					name: body.name,
					admins: [user.id],
					isDmChannel: false,
					isPrivate: false
				}
			})

			if (body.password) {
				hash = await argon.hash(body.password)

				await global.prisma.channel.update({
					where: {
						name: body.name
					},
					data: {
						hash,
						isPrivate: true
					}
				})
			}
			const newArr = [...user.channels, body.name]

			await global.prisma.user.update({
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

	async joinChannel(req, channel, password) {
		let userId = req.user.sub
		if (!userId) {
			userId = req.user.id
		}
		const user = await global.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		const channelData = await global.prisma.channel.findUnique({
			where: {
				name: channel
			}
		})

		if (channelData.isPrivate) {
			const pwMatches = await argon.verify(channelData.hash, password)

			if (!pwMatches) {
				throw new ForbiddenException("Invalid password")
			}
		}

		if (!user.channels.includes(channel)) {
			const newArr = [...user.channels, channel]
			await global.prisma.user.update({
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
		const user = await global.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (user.channels.includes(channel)) {
			const index = user.channels.indexOf(channel)
			user.channels.splice(index, 1)
			await global.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					channels: user.channels
				}
			})

			const currChannel = await global.prisma.channel.findUnique({
				where: {
					name: channel
				}
			})

			if (currChannel.admins.includes(userId)) {
				const adminIndex = currChannel.admins.indexOf(userId)
				currChannel.admins.splice(adminIndex, 1)
				const updated = await global.prisma.channel.update({
					where: {
						name: channel
					},
					data: {
						admins: currChannel.admins
					}
				})

				if (updated.admins.length === 0) {
					await global.prisma.channel.delete({
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
		const user = await global.prisma.user.update({
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
