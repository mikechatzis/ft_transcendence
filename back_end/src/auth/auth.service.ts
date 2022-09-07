import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from 'argon2'
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { Request, Response } from "express";
import { User } from "@prisma/client";
import { authenticator } from "otplib";
import { toDataURL } from "qrcode";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService, private userService: UserService) {}

	async signup(dto: AuthDto) {
		// generate password hash
		const hash = await argon.hash(dto.password)
		// save new user in the db
		try {
			const user = await this.prisma.user.create({
				data: {
					name: dto.name,
					hash: hash,
					twoFactorAuth: false
				}
			})

			return this.signToken({
				sub: user.id,
				name: user.name,
				twoFactorAuthEnabled: !!user.twoFactorAuth,
			})
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
		return this.signToken({
			sub: user.id,
			name: user.name,
			twoFactorAuthEnabled: !!user.twoFactorAuth,

		})
	}

	async signToken(payload: any, options: any = {}) {
		return this.jwt.sign(payload, options)
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
				name: '',
				twoFactorAuth: false
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

	async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret()
		console.log(secret)

		const otpauthUrl = authenticator.keyuri(user.id.toString(), 'ft_transcendence', secret)

		await this.userService.setTwoFactorAuthenticationSecret(secret, user.id)

		return {
			secret,
			otpauthUrl
		}
	}

	async generateQrCodeDataUrl(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl)
	}

	isTwoFactorAuthenticationCodeValid(code: string, user: any) {
		return authenticator.verify({
			token: code,
			secret: user.twoFactorSecret
		})
	}

	// Partial makes all elements of User optional here
	async login2fa(user: User) {
		const payload = {
			name: user.name,
			sub: user.id,
			// the '!!' is a double negation - making sure twoFactorAuth will be a boolean
			twoFactorAuthEnabled: !!user.twoFactorAuth,
			isAuthenticated: true
		}

		return {
			name: payload.name,
			access_token: this.jwt.sign(payload)
		}
	}
}
