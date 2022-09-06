import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport'
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {

	// if get decorator is left with no parameters it will use the one in @controller
	// something like @Get('test') would work for 'GET /users/test'
	// if controller had nothing, an empty @Get() would catch it at '/'
	@UseGuards(JwtGuard)
	@Get('me')
	getMe(@GetUser() user: User) {
		return user
	}

	@UseGuards(JwtGuard)
	@Get('me/name')
	async getMyName(@GetUser() user: User) {
		const userFound = await retrieveMe(user)
		return userFound?.name
	}
}

const retrieveMe = async (user: User) => {
	const config = new ConfigService()
	const prisma = new PrismaService(config)
	const userFound = await prisma.user.findUnique({
		where: {
			id: user.id
		}
	})
	return userFound
}
