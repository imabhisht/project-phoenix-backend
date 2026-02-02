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
import { FirebaseAuthGuard } from '@shared/guards';
import { CurrentUser } from '@shared/decorators';
import { FirebaseUser } from '@shared/interfaces';
import { CollectionOverviewDTO } from '../dtos/collectionOverview.dto';

@Controller('collection')
export class CollectionController {
    private readonly logger = new Logger(CollectionController.name);

    constructor(private readonly collectionService: CollectionService) { }

    @Post()
    @UseGuards(FirebaseAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() collectionDTO: CollectionDTO,
        @CurrentUser() user: FirebaseUser,
    ): Promise<APIResponse<CollectionDTO>> {
        const newCollection = await this.collectionService.create(user, collectionDTO);
        return new APIResponse<CollectionDTO>().SuccessResult(newCollection, 'Collection created successfully');
    }

    @Get("overview")
    @HttpCode(HttpStatus.OK)
    async getCollectionOverview(
        @Query('id') id: string,
    ): Promise<APIResponse<CollectionOverviewDTO>> {
        const collection = await this.collectionService.getCollectionOverview(id);
        return new APIResponse<CollectionOverviewDTO>().SuccessResult(collection, 'Collection overview fetched successfully');
    }

    @Get()
    @UseGuards(FirebaseAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findByOrgId(
        @CurrentUser() user: FirebaseUser,
    ): Promise<APIResponse<CollectionDTO[]> | APIResponse<EmptyAPIResponse>> {
        const collections = await this.collectionService.getCollectionsByOrgId(user.organization_id);
        return new APIResponse<CollectionDTO[]>().SuccessResult(collections, 'Collections fetched successfully');
    }

    @Put(':id')
    @UseGuards(FirebaseAuthGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateCollectionDTO: CollectionDTO,
        @CurrentUser() user: FirebaseUser,
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
