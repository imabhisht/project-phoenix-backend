import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    Logger,
    UseGuards,
    Query
} from '@nestjs/common';
import { CollectionService } from '../services/collection.service';
import { CollectionDTO } from '../dtos/collection.dto';
import { APIResponse, EmptyAPIResponse } from '@shared/dto';
import { JwtAuthGuard } from '@shared/guards';
import { CurrentUser } from '@shared/decorators';
import { JwtUser } from '@shared/interfaces/jwt-user.interface';

@Controller('collection')
export class CollectionController {
    private readonly logger = new Logger(CollectionController.name);

    constructor(private readonly collectionService: CollectionService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() collectionDTO: CollectionDTO,
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<CollectionDTO>> {
        const newCollection = await this.collectionService.create(user, collectionDTO);
        return new APIResponse<CollectionDTO>().SuccessResult(newCollection, 'Collection created successfully');
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findByOrgId(
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<CollectionDTO[]> | APIResponse<EmptyAPIResponse>> {
        const collections = await this.collectionService.getCollectionsByOrgId(user.org_id);
        return new APIResponse<CollectionDTO[]>().SuccessResult(collections, 'Collections fetched successfully');
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateCollectionDTO: CollectionDTO,
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<CollectionDTO>> {
        const collection = await this.collectionService.update(user, id, updateCollectionDTO);
        return new APIResponse<CollectionDTO>().SuccessResult(collection, 'Collection updated successfully');
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Param('id') id: string,
    ): Promise<APIResponse<CollectionDTO>> {
        const collection = await this.collectionService.delete(id);
        return new APIResponse<CollectionDTO>().SuccessResult(collection, 'Collection deleted successfully');
    }
}
