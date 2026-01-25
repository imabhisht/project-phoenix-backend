import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from '@modules/firebase/firebase.module';
import { MongodbModule } from '@infrastructure/database/mongodb';
import { TenantsModule } from '@modules/tenants/tenants.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repository/user.repository';
import { FirebaseAuthGuard, RolesGuard } from '@shared/guards';
import { User, UserSchema } from './domain/entities/user.scheme';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        FirebaseModule,
        MongodbModule,
        TenantsModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        FirebaseAuthGuard,
        RolesGuard,
    ],
    exports: [UserService, FirebaseAuthGuard, RolesGuard],
})
export class UserModule { }
