import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from 'argon2'
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { Request, Response } from "express";

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
					email: dto.email,
					hash: hash
				}
			})

			return this.signToken(user.id, user.email)
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				// if tried to create new record with violated unique field (that email already exists)
				if (error.code === "P2002") {
					throw new ForbiddenException("Credentials taken")
				}
			}
			throw error
		}
	}

	async signin(dto: AuthDto) {
		// find user by email, throw exception if email not found
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
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
		return this.signToken(user.id, user.email)
	}

	async signToken(userId: number, email: string): Promise<{access_token: string}> {
		const payload = {
			sub: userId,
			email
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

	// async fortyTwoAuthCallback(req: Request, res: Response) {
	// 	const user = await this.prisma.user.findUnique({
	// 		where: {
	// 			id: req.user.id
	// 		}
	// 	})
	// }
}