import { IsNotEmpty, IsString, IsUUID, Matches, Length, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../domain/entities/user.scheme';
import { UserRoles } from '../domain/enums/userRoles.enum';
export class UserDTO {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    organization_id: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    role: UserRoles;
    @ApiProperty()
    created_at: Date;
    @ApiProperty()
    updated_at: Date;

    static fromSchema(user: User): UserDTO {
        return {
            id: user._id,
            organization_id: user.organization_id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
}
