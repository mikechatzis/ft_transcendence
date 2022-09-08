import { Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { Jwt2faGuard, JwtGuard } from '../auth/guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { UsernameDto } from './dto/username.dto';

@Controller('users')
export class UserController {

	constructor(private userService: UserService) {}

	// if get decorator is left with no parameters it will use the one in @controller
	// something like @Get('test') would work for 'GET /users/test'
	// if controller had nothing, an empty @Get() would catch it at '/'
	@UseGuards(Jwt2faGuard)
	@Get('me')
	getMe(@GetUser() user: User) {
		delete user.hash
		return user
	}

	@UseGuards(Jwt2faGuard)
	@Get('me/name')
	getMyName(@GetUser() user: User) {
		return user.name
	}

	@UseGuards(Jwt2faGuard)
	@Post('me/name')
	async setMyName(@GetUser() user: User, @Body() body: UsernameDto) {
		const userUpdated = await this.userService.setName(user, body)
	}
}

