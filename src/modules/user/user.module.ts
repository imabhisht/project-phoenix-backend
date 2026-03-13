import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantsModule } from '@modules/tenants/tenants.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repository/user.repository';
import { JwtAuthGuard, RolesGuard } from '@shared/guards';
import { User, UserSchema } from './domain/entities/user.scheme';
import { TokenModule } from '@modules/token/token.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        TenantsModule,
        TokenModule,
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        JwtAuthGuard,
        RolesGuard,
    ],
    exports: [UserService, UserRepository, JwtAuthGuard, RolesGuard],
})
export class UserModule { }
