import { IsEmail, IsNotEmpty, IsString, Length, IsNumberString } from 'class-validator';

export class RequestOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    // Length should be 12 and only contain numbers
    @IsNotEmpty()
    @Length(12, 12)
    @IsNumberString()
    org_id: string;
}
