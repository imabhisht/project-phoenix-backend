import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Query,
    HttpCode,
    HttpStatus,
    Logger,
    UseGuards,
} from '@nestjs/common';
import { EntityPropertyService } from '../services/entity_property.service';
import { EntityPropertyDTO } from '../dtos/entity_property.dto';
import { APIResponse } from '@shared/dto';
import { JwtAuthGuard } from '@shared/guards';
import { CurrentUser } from '@shared/decorators';
import { JwtUser } from '@shared/interfaces/jwt-user.interface';

@Controller('property')
@UseGuards(JwtAuthGuard)
export class EntityPropertyController {
    private readonly logger = new Logger(EntityPropertyController.name);

    constructor(private readonly entityPropertyService: EntityPropertyService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() dto: EntityPropertyDTO,
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<EntityPropertyDTO>> {
        const property = await this.entityPropertyService.create(
            user.org_id,
            dto.collection_id,
            dto.entity_type_id,
            dto,
        );
        return new APIResponse<EntityPropertyDTO>().SuccessResult(
            property,
            'Entity property created successfully',
        );
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findByEntityTypeId(
        @Query('collection_id') collection_id: string,
        @Query('entity_type_id') entity_type_id: string,
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<EntityPropertyDTO[]>> {
        const properties = await this.entityPropertyService.findByEntityTypeId(
            user.org_id,
            collection_id,
            entity_type_id,
        );
        return new APIResponse<EntityPropertyDTO[]>().SuccessResult(
            properties,
            'Entity properties fetched successfully',
        );
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    async update(
        @Query('collection_id') collection_id: string,
        @Query('entity_type_id') entity_type_id: string,
        @Query('id') id: string,
        @Body() dto: EntityPropertyDTO,
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<EntityPropertyDTO>> {
        const property = await this.entityPropertyService.update(
            user.org_id,
            collection_id,
            entity_type_id,
            id,
            dto,
        );
        return new APIResponse<EntityPropertyDTO>().SuccessResult(
            property,
            'Entity property updated successfully',
        );
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async delete(
        @Query('collection_id') collection_id: string,
        @Query('entity_type_id') entity_type_id: string,
        @Query('id') id: string,
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<EntityPropertyDTO>> {
        const property = await this.entityPropertyService.delete(
            user.org_id,
            collection_id,
            entity_type_id,
            id,
        );
        return new APIResponse<EntityPropertyDTO>().SuccessResult(
            property,
            'Entity property deleted successfully',
        );
    }
}
