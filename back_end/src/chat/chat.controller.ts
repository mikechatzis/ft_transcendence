import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { Jwt2faGuard } from '../auth/guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@UseGuards(Jwt2faGuard)
	@Get('channels')
	async getAllChannels() {
		return await this.chatService.getAllChannels()
	}

	@UseGuards(Jwt2faGuard)
	@Post('new')
	async createNewChannel(@Req() req, @Body() body) {
		await this.chatService.createNewChannel(req, body)
	}

	@UseGuards(Jwt2faGuard)
	@Post('join/:name')
	async joinChannel(@Req() req, @Param('name') name) {
		await this.chatService.joinChannel(req, name)
	}

	@UseGuards(Jwt2faGuard)
	@Post('leave/:name')
	async leaveChannel(@Req() req, @Param('name') name) {
		this.chatService.leaveChannel(req, name)
	}
}
