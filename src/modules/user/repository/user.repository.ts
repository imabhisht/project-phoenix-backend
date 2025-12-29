import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { users } from '../../prisma/generated';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<User | undefined> {
        return User.fromDatabase(
            await this.prisma.users.findUnique({
                where: { id },
            }));
    }

    async findByUsername(username: string): Promise<User | undefined> {
        return User.fromDatabase(
            await this.prisma.users.findUnique({
                where: { username },
            }));
    }

    async findByOrganizationAndEmail(organizationId: string, email: string): Promise<User | undefined> {
        return User.fromDatabase(
            await this.prisma.users.findUnique({
                where: {
                    organization_id_email: {
                        organization_id: organizationId,
                        email: email
                    }
                },
            }));
    }

    async create(userData: {
        id: string;
        name: string;
        organization_id: string;
        email: string;
        username: string;
        role: string;
    }): Promise<User> {
        const createdUser = await this.prisma.users.create({
            data: userData,
        });
        return User.fromDatabase(createdUser)!;
    }
}
