import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    org_id: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    otp: string;
}
