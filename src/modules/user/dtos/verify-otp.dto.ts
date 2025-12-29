import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches, Length, IsNumberString } from 'class-validator';

export class VerifyOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    // Length should be 12 and only contain numbers
    @IsNotEmpty()
    @Length(12, 12)
    @IsNumberString()
    org_id: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    @Matches(/^[0-9]{6}$/, { message: 'OTP must be a 6-digit number' })
    otp: string;
}
