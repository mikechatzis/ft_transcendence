import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie'

@Injectable()
export class GameService {
	constructor(private jwt: JwtService, private config: ConfigService) {}

	authAndExtract(socket) {
		const cookies_raw = socket.handshake.headers.cookie

		if (!cookies_raw) {
			return
		}

		const cookies = cookie.parse(cookies_raw)

		const payload = this.jwt.verify(cookies.jwt, {publicKey: this.config.get('JWT_SECRET')})

		return payload
	}

	authAndExtractRaw(cookies_raw) {
		const cookies = cookie.parse(cookies_raw)

		const payload = this.jwt.verify(cookies.jwt, {publicKey: this.config.get('JWT_SECRET')})

		return payload
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
}
