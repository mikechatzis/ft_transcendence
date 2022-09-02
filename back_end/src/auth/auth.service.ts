import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

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
			delete user.hash
			return user
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
		delete user.hash
		return user
	}
}