import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbModule } from '@infrastructure/database/mongodb';
import { TenantsRepository } from './repository/tenants.repository';
import { Tenant, TenantSchema } from './domain/entities/tenant.scheme';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
        MongodbModule
    ],
    providers: [TenantsRepository],
    exports: [TenantsRepository],
})
export class TenantsModule { }
