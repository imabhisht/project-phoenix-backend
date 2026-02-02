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
import { CollectionMediaService } from '../services/collection_media.service';
import { CollectionMediaDTO } from '../dtos/collection_media.dto';
import { APIResponse, EmptyAPIResponse } from '@shared/dto';
import { FirebaseAuthGuard } from '@shared/guards';
import { CurrentUser } from '@shared/decorators';
import { FirebaseUser } from '@shared/interfaces';

@Controller('collection_media')
export class CollectionMediaController {
    private readonly logger = new Logger(CollectionMediaController.name);

    constructor(private readonly collectionMediaService: CollectionMediaService) { }

    @Post()
    @UseGuards(FirebaseAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() collectionMediaDTO: CollectionMediaDTO,
        @CurrentUser() user: FirebaseUser,
    ): Promise<APIResponse<CollectionMediaDTO>> {
        const newCollectionMedia = await this.collectionMediaService.createCollectionMedia(collectionMediaDTO);
        return new APIResponse<CollectionMediaDTO>().SuccessResult(newCollectionMedia, 'CollectionMedia created successfully');
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getCollectionMediasByCollectionSourceId(
        @Query('collection_source_id') collection_source_id: string,
    ): Promise<APIResponse<CollectionMediaDTO[]>> {
        const collectionMedias = await this.collectionMediaService.getUsingCollectionSourceId(collection_source_id);
        return new APIResponse<CollectionMediaDTO[]>().SuccessResult(collectionMedias, 'CollectionMedias fetched successfully');
    }

    // @Get()
    // @HttpCode(HttpStatus.OK)
    // async getCollectionMediaOverview(
    //     @Query('id') id: string,
    // ): Promise<APIResponse<CollectionMediaOverviewDTO>> {
    //     const collectionmedia = await this.collectionmediaService.getCollectionMediaOverview(id);
    //     return new APIResponse<CollectionMediaOverviewDTO>().SuccessResult(collectionmedia, 'CollectionMedia overview fetched successfully');
    // }

    // @Get()
    // @UseGuards(FirebaseAuthGuard)
    // @HttpCode(HttpStatus.OK)
    // async findByOrgId(
    //     @CurrentUser() user: FirebaseUser,
    // ): Promise<APIResponse<CollectionMediaDTO[]> | APIResponse<EmptyAPIResponse>> {
    //     const collectionmedias = await this.collectionmediaService.findByOrgId(user.organization_id);
    //     return new APIResponse<CollectionMediaDTO[]>().SuccessResult(collectionmedias, 'CollectionMedias fetched successfully');
    // }

    // @Put(':id')
    // @UseGuards(FirebaseAuthGuard)
    // @HttpCode(HttpStatus.OK)
    // async update(
    //     @Param('id') id: string,
    //     @Body() updateCollectionMediaDTO: CollectionMediaDTO,
    //     @CurrentUser() user: FirebaseUser,
    // ): Promise<APIResponse<CollectionMediaDTO>> {
    //     const collectionmedia = await this.collectionmediaService.update(user, id, updateCollectionMediaDTO);
    //     return new APIResponse<CollectionMediaDTO>().SuccessResult(collectionmedia, 'CollectionMedia updated successfully');
    // }

    // @Delete(':id')
    // @HttpCode(HttpStatus.OK)
    // async delete(
    //     @Param('id') id: string,
    // ): Promise<APIResponse<CollectionMediaDTO>> {
    //     const collectionmedia = await this.collectionmediaService.delete(id);
    //     return new APIResponse<CollectionMediaDTO>().SuccessResult(collectionmedia, 'CollectionMedia deleted successfully');
    // }
}
