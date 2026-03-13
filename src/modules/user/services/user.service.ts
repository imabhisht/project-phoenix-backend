import {
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { JwtUser } from '@shared/interfaces/jwt-user.interface';
import { UserDTO } from '../dtos/user.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async userInfo(user: JwtUser): Promise<UserDTO> {
        const userDoc = await this.userRepository.findById(user.sub);
        if (!userDoc) {
            throw new NotFoundException('User not found');
        }
        return UserDTO.fromSchema(userDoc);
    }
}
