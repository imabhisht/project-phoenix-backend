import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { MediaRepository } from '../repository/media.repository';
import { Media, MediaBucketType } from '@modules/media/domain/entities/media.scheme';
import { FileTypeEnum } from '../domain/enums/fileTypes.enum';
import { FirebaseUser } from '@shared/interfaces';
import { MediaDTO } from '../dtos/media.dto';
import { FirebaseService } from '@modules/firebase/firebase.service';

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor(
        private readonly mediaRepository: MediaRepository,
        private readonly firebaseService: FirebaseService,
    ) { }

    async uploadFile(file: Express.Multer.File, user: FirebaseUser): Promise<MediaDTO> {

        const fileExtension = this.getFileExtension(file.originalname);
        if (!this.isValidFileType(fileExtension)) {
            throw new BadRequestException(
                `Invalid file type. Allowed types: ${Object.values(FileTypeEnum).join(', ')}`
            );
        }

        // Upload file to Firebase Storage and get file_key and file_url
        const { file_key, file_url } = await this.firebaseService.uploadFile(
            file,
            user.organization_id
        );

        const mediaData: Partial<Media> = {
            org_id: user.organization_id,
            bucket_type: MediaBucketType.FIREBASE_STORAGE,
            file_key: file_key,
            file_name: file.originalname,
            file_type: fileExtension as FileTypeEnum,
            file_size: file.size,
            is_deleted: false,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const createdMedia = await this.mediaRepository.create(mediaData);

        // Pass the file_url to fromSchema to send it to frontend
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
