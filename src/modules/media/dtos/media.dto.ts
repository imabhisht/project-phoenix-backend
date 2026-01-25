import { IsNotEmpty, IsString, IsUUID, Matches, Length, IsNumberString } from 'class-validator';
import { Media, MediaBucketType } from '../domain/entities/media.scheme';
import { ApiProperty } from '@nestjs/swagger';


export class MediaDTO {
    @ApiProperty()
    id: string;
    @ApiProperty()
    org_id: string;
    @ApiProperty()
    bucket_type: MediaBucketType;
    @ApiProperty()
    file_key: string;
    @ApiProperty()
    file_name: string;
    @ApiProperty()
    file_type: string;
    @ApiProperty()
    file_size: number;
    @ApiProperty()
    file_url: string;
    @ApiProperty()
    created_at: Date;
    @ApiProperty()
    updated_at: Date;

    static fromSchema(media: Media, file_url: string): MediaDTO {
        return {
            id: media._id,
            org_id: media.org_id,
            bucket_type: media.bucket_type,
            file_key: media.file_key,
            file_name: media.file_name,
            file_type: media.file_type,
            file_size: media.file_size,
            file_url: file_url,
            created_at: media.created_at,
            updated_at: media.updated_at,
        };
    }
}
