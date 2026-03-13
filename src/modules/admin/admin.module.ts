import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { UserModule } from '@modules/user/user.module';
import { TenantsModule } from '@modules/tenants/tenants.module';
import { TokenModule } from '@modules/token/token.module';

@Module({
    imports: [
        UserModule,
        TenantsModule,
        TokenModule,
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
