import {  IsString, IsNotEmpty, IsAlpha } from 'class-validator'

export class AuthDto {
	@IsString()
	@IsNotEmpty()
	@IsAlpha()
	name: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}