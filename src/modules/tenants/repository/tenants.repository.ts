import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantSchema, TenantDocument } from '../domain/entities/tenant.scheme';

@Injectable()
export class TenantsRepository {
  private readonly logger = new Logger(TenantsRepository.name);

  constructor(
    @InjectModel(Tenant.name)
    private readonly tenantModel: Model<TenantDocument>,
  ) { }

  async findById(id: string): Promise<Tenant | undefined> {
    return await this.tenantModel.findById(id).lean();
  }
}
