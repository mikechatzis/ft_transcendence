import { Controller, ForbiddenException, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { Request } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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
	getMyName(@GetUser() user: User) {
		return user.name
	}

	@UseGuards(JwtGuard)
	@Post('me/name')
	async setMyName(@GetUser() user: User, @Req() req: Request) {
		const userUpdated = await setName(user, req)
	}
}

const setName = async (user: User, req: Request) => {
	const config = new ConfigService()
	const prisma = new PrismaService(config)
	try {
		const userUpdated = await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				name: req.body.name
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
