import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    org_id: string;
}
