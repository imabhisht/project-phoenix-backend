import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { CollectionSourceService } from '../services/collection_source.service';
import { CollectionSourceDTO } from '../dtos/collection_source.dto';
import { APIResponse } from '@shared/dto';

@Controller('collection-source')
export class CollectionSourceController {
    private readonly logger = new Logger(CollectionSourceController.name);

    constructor(private readonly collectionSourceService: CollectionSourceService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() collectionSourceDTO: CollectionSourceDTO,
    ): Promise<APIResponse<CollectionSourceDTO>> {
        const newCollectionSource = await this.collectionSourceService.create(collectionSourceDTO);
        return new APIResponse<CollectionSourceDTO>().SuccessResult(
            newCollectionSource,
            'Collection source created successfully'
        );
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(
        @Param('id') id: string,
    ): Promise<APIResponse<CollectionSourceDTO>> {
        const collectionSource = await this.collectionSourceService.findById(id);
        return new APIResponse<CollectionSourceDTO>().SuccessResult(
            collectionSource,
            'Collection source fetched successfully'
        );
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateCollectionSourceDTO: CollectionSourceDTO,
    ): Promise<APIResponse<CollectionSourceDTO>> {
        const collectionSource = await this.collectionSourceService.update(id, updateCollectionSourceDTO);
        return new APIResponse<CollectionSourceDTO>().SuccessResult(
            collectionSource,
            'Collection source updated successfully'
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Param('id') id: string,
    ): Promise<APIResponse<CollectionSourceDTO>> {
        const collectionSource = await this.collectionSourceService.delete(id);
        return new APIResponse<CollectionSourceDTO>().SuccessResult(
            collectionSource,
            'Collection source deleted successfully'
        );
    }

    // Google Drive OAuth specific endpoints
    @Get(':id/google-oauth/auth-url')
    @HttpCode(HttpStatus.OK)
    async getGoogleOAuthUrl(
        @Param('id') collectionSourceId: string,
    ): Promise<APIResponse<{ url: string }>> {
        const url = await this.collectionSourceService.initiateGoogleOAuth(collectionSourceId);
        return new APIResponse<{ url: string }>().SuccessResult(
            { url },
            'Google OAuth URL generated successfully'
        );
    }

    @Get('google-oauth/callback')
    @HttpCode(HttpStatus.OK)
    async handleGoogleOAuthCallback(
        @Query('code') code: string,
        @Query('state') state: string,
    ): Promise<APIResponse<{ message: string }>> {
        await this.collectionSourceService.handleGoogleOAuthCallback(code, state);
        return new APIResponse<{ message: string }>().SuccessResult(
            { message: 'OAuth authentication successful' },
            'Google OAuth callback processed successfully'
        );
    }
}
