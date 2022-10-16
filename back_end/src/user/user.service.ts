import { Injectable, ForbiddenException, NotFoundException, BadRequestException, NotAcceptableException } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { userInfo } from "os";
import { use } from "passport";

@Injectable()
export class UserService {
	constructor() {}

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		await global.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				twoFactorSecret: secret
			}
		})
	}

	async turnOnTwoFactorAuthentication(userId: number) {
		await global.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				twoFactorAuth: true
			}
		})
	}

	async setName(user: User, body: any) {
		try {
			const userUpdated = await global.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					name: body.name
				}
			})
			return userUpdated
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new ForbiddenException("That username is already taken")
				}
			}
			throw error
		}
	}

	async setAvatar(user: User, avatar: string){
		const userUpdated = await global.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				avatar: avatar
			}
		})
		return userUpdated
	}

	//04/10/2022, set score and update user's rank
	async setScoreAndRank(user: User, score: number){
		if (score < 0)
			throw "score cannot be negative"
		switch (true) {
			case score <= 1000: {
				const userUpdated = await global.prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						score: score,
						rank: "hatchling"
					}
				})
				return userUpdated
			}
			case score <= 2000: {
				const userUpdated = await global.prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						score: score,
						rank: "tadpole"
					}
				})
				return userUpdated
			}
			case score <= 3000: {
				const userUpdated = await global.prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						score: score,
						rank: "lake strider"
					}
				})
				return userUpdated
			}
			case score <= 4000: {
				const userUpdated = await global.prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						score: score,
						rank: "frog"
					}
				})
				return userUpdated
			}
			case score > 4000: {
				const userUpdated = await global.prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						score: score,
						rank: "bull frog"
					}
				})
				return userUpdated
			}
		}
	}
	//code end

	async findById(id: number) {
		const user = await global.prisma.user.findUnique({
			where: {
				id
			}
		})

		if (!user) {
			throw new NotFoundException("This user doesn't exist")
		}

		delete user.hash
		delete user.twoFactorSecret

		return user
	}

	async findByName(name: string) {
		if (!name)
			throw BadRequestException
		const user = await global.prisma.user.findUnique({
			where: {
				name
			}
		})

		if (!user) {
			throw new NotFoundException("This user doesn't exist")
		}

		delete user.hash
		delete user.twoFactorSecret

		return user
	}

	async blockUser(req, body) {
		const user = await global.prisma.user.findUnique({
			where: {
				id: req.user.id
			}
		})

		const blockedUser = await global.prisma.user.findUnique({
			where: {
				id: body.block
			}
		})

		if (user.friends.includes(body.block)) {
			const index = user.friends.indexOf(body.block)
			user.friends.splice(index, 1)
			await global.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					friends: user.friends
				}
			})
		}

		if (blockedUser.friends.includes(user.id)) {
			const index = blockedUser.friends.indexOf(user.id)
			blockedUser.friends.splice(index, 1)
			await global.prisma.user.update({
				where: {
					id: blockedUser.id
				},
				data: {
					friends: blockedUser.friends
				}
			})
		}

		if (!user.blocked.includes(body.block)) {
			await global.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					blocked: [...user.blocked, body.block]
				}
			})
		}

		if (user.channels.includes(`${user.id} ${blockedUser.id}`)) {
			const index = user.channels.indexOf(`${user.id} ${blockedUser.id}`)

			user.channels.splice(index, 1)
			await global.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					channels: user.channels
				}
			})

			await global.prisma.channel.delete({
				where: {
					name: `${user.id} ${blockedUser.id}`
				}
			})
		}

		if (user.channels.includes(`${blockedUser.id} ${user.id}`)) {
			const index = user.channels.indexOf(`${blockedUser.id} ${user.id}`)

			user.channels.splice(index, 1)
			await global.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					channels: user.channels
				}
			})

			await global.prisma.channel.delete({
				where: {
					name: `${blockedUser.id} ${user.id}`
				}
			})
		}

		if (blockedUser.channels.includes(`${user.id} ${blockedUser.id}`)) {
			const index = blockedUser.channels.indexOf(`${user.id} ${blockedUser.id}`)

			blockedUser.channels.splice(index, 1)
			await global.prisma.user.update({
				where: {
					id: blockedUser.id
				},
				data: {
					channels: blockedUser.channels
				}
			})
		}

		if (blockedUser.channels.includes(`${blockedUser.id} ${user.id}`)) {
			const index = blockedUser.channels.indexOf(`${blockedUser.id} ${user.id}`)

			blockedUser.channels.splice(index, 1)
			await global.prisma.user.update({
				where: {
					id: blockedUser.id
				},
				data: {
					channels: blockedUser.channels
				}
			})
		}
	}

	async addFriend(req, body) {
		const user = await global.prisma.user.findUnique({
			where: {
				id: req.user.id
			}
		})

		const friendUser = await global.prisma.user.findUnique({
			where: {
				id: body.friend
			}
		})

		if (user.blocked.includes(body.friend)) {
			throw new ForbiddenException("You have blocked that user!")
		}

		if (friendUser.blocked.includes(user.id)) {
			throw new ForbiddenException("You are blocked by that user!")
		}

		if (!user.friends.includes(body.friend)) {
			await global.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					friends: [...user.friends, body.friend],
					channels: [...user.channels, `${user.id} ${body.friend}`]
				}
			})

			await global.prisma.channel.create({
				data: {
					name: `${user.id} ${body.friend}`,
					admins: [user.id, body.friend],
					messages: [],
					isDmChannel: true,
					isPrivate: false,
					muted: [],
					blocked: []
				}
			})
		}

		if (!friendUser.friends.includes(user.id)) {
			await global.prisma.user.update({
				where: {
					id: friendUser.id
				},
				data: {
					friends: [...friendUser.friends, user.id],
					channels: [...friendUser.channels, `${user.id} ${body.friend}`]
				}
			})
		}
	}
}