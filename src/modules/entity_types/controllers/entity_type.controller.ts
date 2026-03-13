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
import { EntityTypeService } from '../services/entity_type.service';
import { EntityTypeDTO } from '../dtos/entity_type.dto';
import { APIResponse } from '@shared/dto';
import { JwtAuthGuard } from '@shared/guards';
import { CurrentUser } from '@shared/decorators';
import { JwtUser } from '@shared/interfaces/jwt-user.interface';

@Controller('entity-type')
@UseGuards(JwtAuthGuard)
export class EntityTypeController {
    private readonly logger = new Logger(EntityTypeController.name);

    constructor(private readonly entityTypeService: EntityTypeService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() dto: EntityTypeDTO,
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<EntityTypeDTO>> {
        const entityType = await this.entityTypeService.create(
            user.org_id,
            dto,
        );
        return new APIResponse<EntityTypeDTO>().SuccessResult(
            entityType,
            'Entity type created successfully',
        );
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findByCollectionId(
        @Query('collection_id') collection_id: string,
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<EntityTypeDTO[]>> {
        const entityTypes = await this.entityTypeService.findByCollectionId(
            user.org_id,
            collection_id,
        );
        return new APIResponse<EntityTypeDTO[]>().SuccessResult(
            entityTypes,
            'Entity types fetched successfully',
        );
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    async update(
        @Query('id') id: string,
        @Body() dto: EntityTypeDTO,
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<EntityTypeDTO>> {
        const entityType = await this.entityTypeService.update(
            user.org_id,
            id,
            dto,
        );
        return new APIResponse<EntityTypeDTO>().SuccessResult(
            entityType,
            'Entity type updated successfully',
        );
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async delete(
        @Query('id') id: string,
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<EntityTypeDTO>> {
        const entityType = await this.entityTypeService.delete(
            user.org_id,
            id,
        );
        return new APIResponse<EntityTypeDTO>().SuccessResult(
            entityType,
            'Entity type deleted successfully',
        );
    }
}
