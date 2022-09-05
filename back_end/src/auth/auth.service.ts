import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from 'argon2'
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { Request } from "express";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signup(dto: AuthDto) {
		// generate password hash
		const hash = await argon.hash(dto.password)
		// save new user in the db
		try {
			const user = await this.prisma.user.create({
				data: {
					name: dto.name,
					hash: hash
				}
			})

			return this.signToken(user.id, user.name)
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				// if tried to create new record with violated unique field (that name already exists)
				if (error.code === "P2002") {
					throw new ForbiddenException("Credentials taken")
				}
			}
			throw error
		}
	}

	async signin(dto: AuthDto) {
		// find user by name, throw exception if name not found
		const user = await this.prisma.user.findUnique({
			where: {
				name: dto.name
			}
		})
		if (!user) {
			throw new ForbiddenException("Credentials incorrect")
		}
		// compare password, throw exception if incorrect
		const pwMatches = await argon.verify(user.hash, dto.password)
		if (!pwMatches) {
			throw new ForbiddenException("Credentials incorrect")
		}
		return this.signToken(user.id, user.name)
	}

	async signToken(userId: number, name: string): Promise<{access_token: string}> {
		const payload = {
			sub: userId,
			name
		}

		const secret = this.config.get('JWT_SECRET')

		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret
		})

		return {
			access_token: token
		}
	}

	async getUser(user: any) {
		const found = await this.prisma.user.findUnique({
			where: {
				intraName: user.name
			}
		})

		return found
	}

	async addIntraUser(user: any) {
		const newUser = await this.prisma.user.create({
			data: {
				intraName: user.name,
				name: ''
			}
		})
		return newUser
	}

	async singUpIntra(req: Request) {
		let newUser = await this.addIntraUser(req.user)
		newUser = await this.prisma.user.update({
			where: {
				intraName: newUser.intraName,
			},
			data: {
				name: `${newUser.id}`
			}
		})
		return newUser
	}
}