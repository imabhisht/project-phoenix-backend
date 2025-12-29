import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { FirebaseModule } from '@modules/firebase/firebase.module';
import { MongodbModule } from '@infrastructure/database/mongodb';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repository/user.repository';
import { UserOtpRepository } from './repository/user-otp.repository';
import { TenantsRepository } from '@modules/tenants/repository/tenants.repository';

@Module({
    imports: [PrismaModule, FirebaseModule, MongodbModule],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        UserOtpRepository,
        TenantsRepository,
    ],
    exports: [UserService],
})
export class UserModule { }
