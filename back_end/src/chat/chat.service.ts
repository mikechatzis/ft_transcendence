import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import bodyParser from 'body-parser';

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
					owner: user.id,
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

		if (!channelData) {
			throw new ForbiddenException("This channel was deleted by an admin")
		}

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

					const users = await global.prisma.user.findMany()
					const n = users.length

					for (let i = 0; i < n; i++) {
						if (users[i].channels.includes(channel)) {
							const index = users[i].channels.indexOf(channel)
							users[i].channels.splice(index, 1)
							await global.prisma.user.update({
								where: {
									id: users[i].id
								},
								data: {
									channels: users[i].channels
								}
							})
						}
					}
				}
			}
		}
	}

	async deleteChannel(req, channel) {
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

		if (channelData.owner === userId) {
			await global.prisma.channel.delete({
				where: {
					name: channel
				}
			})

			const users = await global.prisma.user.findMany()
			const n = users.length

			for (let i = 0; i < n; i++) {
				if (users[i].channels.includes(channel)) {
					const index = users[i].channels.indexOf(channel)
					users[i].channels.splice(index, 1)

					await global.prisma.user.update({
						where: {
							id: users[i].id
						},
						data: {
							channels: users[i].channels
						}
					})
				}
			}
		}
		else {
			throw new ForbiddenException("You are not this channel's administrator")
		}
	}

	async changePassword(req, channel, body) {
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

		if (channelData.owner === userId) {
			if (body.password) {
				const hash = await argon.hash(body.password)

				await global.prisma.channel.update({
					where: {
						name: channel
					},
					data: {
						isPrivate: true,
						hash
					}
				})
			}
			else {
				await global.prisma.channel.update({
					where: {
						name: channel
					},
					data: {
						isPrivate: false,
						hash: null
					}
				})
			}
		}
		else {
			throw new ForbiddenException("You are not this channel's administrator")
		}
	}

	async getChannelMembers(channel) {
		const channelData = await global.prisma.channel.findUnique({
			where: {
				name: channel
			}
		})

		if (!channel) {
			throw new ForbiddenException("There's no channel with that name")
		}

		let members = []

		const users = await global.prisma.user.findMany()

		for (let i = 0; i < users.length; i++) {
			if (users[i].channels.includes(channel)) {
				members = [...members, users[i]]
			}
		}

		return members
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

		if (!cookies.jwt) {
			return
		}

		const payload = this.jwt.verify(cookies.jwt, {publicKey: this.config.get('JWT_SECRET'), ignoreExpiration: true})

		return payload
	}

	authAndExtractRaw(cookies_raw) {
		const cookies = cookie.parse(cookies_raw)

		const payload = this.jwt.verify(cookies.jwt, {publicKey: this.config.get('JWT_SECRET'), ignoreExpiration: true})

		return payload
	}

	async handleMute(req, name, body) {
		const channel = await global.prisma.channel.findUnique({
			where: {
				name
			}
		})

		if (channel.admins.includes(req.user.id)) {
			await global.prisma.channel.update({
				where: {
					name
				},
				data: {
					muted: [...channel.muted, body.id]
				}
			})

			setTimeout(async () => {
				const channel = await global.prisma.channel.findUnique({
					where: {
						name
					}
				})

				const index = channel.muted.indexOf(body.id)
				if (index > -1) {
					channel.blocked.splice(index, 1)
					await global.prisma.channel.update({
						where: {
							name
						},
						data: {
							muted: channel.muted
						}
					})
				}
			}, 900000)
		}
		else {
			throw new ForbiddenException("Not an admin")
		}
	}

	async handleBan(req, name, body) {
		const channel = await global.prisma.channel.findUnique({
			where: {
				name
			}
		})

		if (channel.admins.includes(body.id)) {
			throw new ForbiddenException("Can't block an admin")
		}
		if (channel.admins.includes(req.user.id)) {
			await global.prisma.channel.update({
				where: {
					name
				},
				data: {
					blocked: [...channel.blocked, body.id]
				}
			})
		}
		else {
			throw new ForbiddenException("Not an admin")
		}
	}

	async makeAdmin(req, name, body) {
		const channel = await global.prisma.channel.findUnique({
			where: {
				name
			}
		})

		if (channel.owner === req.user.id) {
			await global.prisma.channel.update({
				where: {
					name
				},
				data: {
					admins: [...channel.admins, body.id]
				}
			})
		}
	}
}
