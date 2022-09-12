import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { Jwt2faGuard } from '../auth/guard';
import { ChatService } from './chat.service';
import { ChannelDto } from './dto/channel.dto';

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
	async createNewChannel(@Req() req, @Body() body: ChannelDto) {
		await this.chatService.createNewChannel(req, body)
	}

	@UseGuards(Jwt2faGuard)
	@Post('join/:name')
	async joinChannel(@Req() req, @Param('name') name, @Body() body) {
		await this.chatService.joinChannel(req, name, body.password)
	}

	@UseGuards(Jwt2faGuard)
	@Post('leave/:name')
	async leaveChannel(@Req() req, @Param('name') name) {
		await this.chatService.leaveChannel(req, name)
	}

	@UseGuards(Jwt2faGuard)
	@Post('delete/:name')
	async deleteChannel(@Req() req, @Param('name') name) {
		await this.chatService.deleteChannel(req, name)
	}
}
