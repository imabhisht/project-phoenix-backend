import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { MediaRepository } from '../repository/media.repository';
import { Media, MediaBucketType } from '@modules/media/domain/entities/media.scheme';
import { FileTypeEnum } from '../domain/enums/fileTypes.enum';
import { JwtUser } from '@shared/interfaces/jwt-user.interface';
import { MediaDTO } from '../dtos/media.dto';

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor(
        private readonly mediaRepository: MediaRepository,
    ) { }

    async findById(id: string): Promise<Media | null> {
        return this.mediaRepository.findById(id);
    }

    async uploadFile(file: Express.Multer.File, user: JwtUser): Promise<MediaDTO> {
        const fileExtension = this.getFileExtension(file.originalname);
        if (!this.isValidFileType(fileExtension)) {
            throw new BadRequestException(
                `Invalid file type. Allowed types: ${Object.values(FileTypeEnum).join(', ')}`
            );
        }

        // Placeholder: Since Firebase is removed, implementing a real storage backend 
        // (like S3 or local storage) should be done in a separate task.
        const file_key = `placeholder_${Date.now()}_${file.originalname}`;
        const file_url = `http://localhost:3000/placeholder/${file_key}`;

        this.logger.warn(`File upload placeholder triggered for ${file.originalname}. Firebase is removed.`);

        const mediaData: Partial<Media> = {
            org_id: user.org_id,
            bucket_type: MediaBucketType.FIREBASE_STORAGE, // Keep enum for now to avoid breaking schema
            file_key: file_key,
            file_name: file.originalname,
            file_type: fileExtension as FileTypeEnum,
            file_size: file.size,
            is_deleted: false,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const createdMedia = await this.mediaRepository.create(mediaData);
        return MediaDTO.fromSchema(createdMedia, file_url);
    }

    private getFileExtension(filename: string): string {
        const parts = filename.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    }

    private isValidFileType(extension: string): boolean {
        return Object.values(FileTypeEnum).includes(extension as FileTypeEnum);
    }
}
