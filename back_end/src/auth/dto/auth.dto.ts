import {IsEmail, IsString, IsNotEmpty} from 'class-validator'

export class AuthDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	password: string;
}