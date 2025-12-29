import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOwnerDto {
    @IsNotEmpty()
    @IsString()
    org_id: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;
}
