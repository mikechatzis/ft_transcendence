import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
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

		if (!cookies.jwt) {
			return
		}

		
		const payload = this.jwt.verify(cookies.jwt, {publicKey: this.config.get('JWT_SECRET'), ignoreExpiration: true})
		
		return payload
	}


	bounceBall = (state) => {
		const nextPosX = state.ballpos.left + state.deltaX
		const nextPosY = state.ballpos.top + state.deltaY
		if (nextPosY <= -200 || nextPosY >= 700 - 220) {
			state.deltaY = -state.deltaY
			state.ballpos.top -= state.deltaY
		}
		if (nextPosX <= 10 || nextPosX >= 1380) {
			state.deltaX = -state.deltaX
			state.ballpos.left -= state.deltaX
		}
		if (nextPosX === 20 && (nextPosY >= state.p1pos && nextPosY <= state.p1pos)) {
			console.log('yep')
			state.deltaX = -state.deltaX
			state.ballpos.left -= state.deltaX
		}
		if (nextPosX === 1340 && (nextPosY >= state.p2pos && nextPosY <= state.p2pos)) {
			state.deltaX = -state.deltaX
			state.ballpos.left -= state.deltaX
		}
		
		// state.ballpos.left += state.deltaX
		// state.ballpos.top += state.deltaY
		return state
	}
}
