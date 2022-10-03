import { Body, Controller, ForbiddenException, Get, Param, Post, Req, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { Jwt2faGuard, JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { UsernameDto } from './dto/username.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { of, Observable } from 'rxjs';
import path = require('path');

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
		delete user.twoFactorSecret
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

	//code 28/9/2022, upload image in "destination" path (create if non existent), then save path as user.avatar: string
	//needs testing with valid login key
	@UseGuards(Jwt2faGuard)
	@Post('me/profileImg')
	@UseInterceptors(FileInterceptor('file', 
		{
			storage: diskStorage({
				destination: './images/avatars',
				filename: (req, file, cb) => {
					const filename: string = path.parse(file.originalname).name.replace(/\s/g, ' ') + uuidv4();
					const extension: string = path.parse(file.originalname).ext;

					cb(null, `${filename}${extension}`)
				}
			})
		}))
	uploadFile(@UploadedFile() file, @Request() req): Observable<object> {
		const user: User = req.user.user;
		if (user.avatar){
			const fs = require('fs')
			try {
				fs.unlinkSync(user.avatar)
				console.log("previous profile img: %s, of user: %s removed succesfully", user.avatar, user.name)
			}
			catch(err){
				console.error(err)
			}
		}
		const userUpdated = this.userService.setAvatar(user, file.path);
		console.log(user);
		return of({imagePath: file.path});
	}
	//end code

	// @UseGuards(Jwt2faGuard)
	@Get('all')
	async getAllUsers() {
		const users = await global.prisma.user.findMany()

		for (let i = 0; i < users.length; i++) {
			delete users[i].hash
			delete users[i].twoFactorSecret
		}
		return users
	}

	@UseGuards(Jwt2faGuard)
	@Get(':id')
	async getById(@Param('id') id) {
		const user = await this.userService.findById(parseInt(id))

		return user
	}

	@UseGuards(Jwt2faGuard)
	@Get('user/:name')
	async getByName(@Param('name') name) {
		const user = await this.userService.findByName(name)

		return user
	}
}

