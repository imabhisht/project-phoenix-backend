import {
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Logger,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../services/media.service';
import { MediaDTO } from '../dtos/media.dto';
import { CurrentUser } from '@shared/decorators';
import { FirebaseUser } from '@shared/interfaces';
import { FirebaseAuthGuard } from '@shared/guards';
import { APIResponse, EmptyAPIResponse } from '@shared/dto';

@Controller('media')
export class MediaController {
    private readonly logger = new Logger(MediaController.name);

    constructor(private readonly mediaService: MediaService) { }

    @Post('upload')
    @UseGuards(FirebaseAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.CREATED)
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: FirebaseUser,
    ): Promise<APIResponse<MediaDTO> | APIResponse<EmptyAPIResponse>> {
        try {
            if (!file) {
                throw new BadRequestException('No file provided');
            }
            return new APIResponse<MediaDTO>().SuccessResult(await this.mediaService.uploadFile(file, user));
        } catch (error) {
            this.logger.error('Failed to upload file', error);
            return new APIResponse<MediaDTO>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to upload file',
                `Error uploading file: ${error.message || 'Unknown error'}`,
            );
        }
    }
}
