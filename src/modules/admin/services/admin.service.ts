import {
    Injectable,
    Logger,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '@modules/user/repository/user.repository';
import { TenantsRepository } from '@modules/tenants/repository/tenants.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRoles } from '@modules/user/domain/enums/userRoles.enum';
import { User } from '@modules/user/domain/entities/user.scheme';

const generator = require('beautiful-username-generator');

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        private readonly userRepository: UserRepository,
        private readonly tenantsRepository: TenantsRepository,
    ) { }

    async createUser(dto: CreateUserDto): Promise<User> {
        try {
            // 1. Verify organization exists
            const tenant = await this.tenantsRepository.findById(dto.org_id);
            if (!tenant) {
                throw new NotFoundException(`Organization with ID ${dto.org_id} not found`);
            }

            // 2. Check if user already exists in this org
            const existingUser = await this.userRepository.findByOrganizationAndEmail(
                dto.org_id,
                dto.email,
            );
            if (existingUser) {
                throw new ConflictException('User with this email already exists in the organization');
            }

            // 3. Hash password
            const passwordHash = await bcrypt.hash(dto.password, 12);

            // 4. Generate beautiful username
            let username: string;
            try {
                username = await generator.gen({ maxLength: 8 });
            } catch (error) {
                this.logger.error('Error generating username', error);
                username = `user_${Date.now().toString().slice(-6)}`;
            }

            // 5. Create user in database
            const user = await this.userRepository.create({
                name: dto.name,
                org_id: dto.org_id,
                email: dto.email,
                username: username,
                role: dto.role || UserRoles.USER,
                password_hash: passwordHash,
            });

            this.logger.log(`[ADMIN] User created: ${user.email} (org: ${user.org_id}, role: ${user.role})`);
            return user;
        } catch (error) {
            this.logger.error('Failed to create user as admin', error);
            throw error;
        }
    }
}
