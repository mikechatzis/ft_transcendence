import { Injectable, ForbiddenException, NotFoundException, BadRequestException, NotAcceptableException } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { userInfo } from "os";

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
}