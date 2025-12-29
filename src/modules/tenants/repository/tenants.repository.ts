import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { tenants } from '../../prisma/generated';
import { Tenant } from '../domain/entities/tenant.entity';

@Injectable()
export class TenantsRepository {
  constructor(private readonly prisma: PrismaService) { }


  // Here "id" is 12 characters long number unique id for each tenant
  async findById(id: string): Promise<Tenant | undefined> {
    return Tenant.fromDatabase(
      await this.prisma.tenants.findUnique({
        where: { id },
      }));
  }

  // Here "firebase_tenant_id" is firebase tenant id
  async findByFirebaseTenantId(firebaseTenantId: string): Promise<Tenant | undefined> {
    return Tenant.fromDatabase(
      await this.prisma.tenants.findUnique({
        where: { firebase_tenant_id: firebaseTenantId },
      }));
  }
}
