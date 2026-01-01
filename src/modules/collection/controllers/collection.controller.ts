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
} from '@nestjs/common';
import { CollectionService } from '../services/collection.service';
import { CollectionDTO } from '../dtos/collection.dto';
import { APIResponse, EmptyAPIResponse } from '@shared/dto';

@Controller('collection')
export class CollectionController {
    private readonly logger = new Logger(CollectionController.name);

    constructor(private readonly collectionService: CollectionService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() collectionDTO: CollectionDTO,
    ): Promise<APIResponse<CollectionDTO>> {
        const newCollection = await this.collectionService.create(collectionDTO);
        return new APIResponse<CollectionDTO>().SuccessResult(newCollection, 'Collection created successfully');
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(
        @Param('id') id: string,
    ): Promise<APIResponse<CollectionDTO>> {
        const collection = await this.collectionService.findById(id);
        return new APIResponse<CollectionDTO>().SuccessResult(collection, 'Collection fetched successfully');
    }

    @Get('org/:org_id')
    @HttpCode(HttpStatus.OK)
    async findByOrgId(
        @Param('org_id') org_id: string,
    ): Promise<APIResponse<CollectionDTO[]> | APIResponse<EmptyAPIResponse>> {
        const collections = await this.collectionService.findByOrgId(org_id);
        return new APIResponse<CollectionDTO[]>().SuccessResult(collections, 'Collections fetched successfully');
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateCollectionDTO: CollectionDTO,
    ): Promise<APIResponse<CollectionDTO>> {
        const collection = await this.collectionService.update(id, updateCollectionDTO);
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
