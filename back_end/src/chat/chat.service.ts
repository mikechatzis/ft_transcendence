import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as cookie from 'cookie'
import { ConfigService } from '@nestjs/config';
import passport from 'passport';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

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
