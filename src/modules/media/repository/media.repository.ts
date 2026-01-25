import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Collection, Model } from 'mongoose';
import { Media, MediaDocument } from '@modules/media/domain/entities/media.scheme';

@Injectable()
export class MediaRepository {
    private readonly logger = new Logger(MediaRepository.name);

    constructor(
        @InjectModel(Media.name)
        private readonly mediaModel: Model<MediaDocument>,
    ) { }

    async create(media: Partial<Media>): Promise<Media> {
        return this.mediaModel.create(media);
    }

    async findById(id: string): Promise<Media | null> {
        return this.mediaModel.findById(id);
    }

    async findByOrgId(org_id: string): Promise<Media[]> {
        return this.mediaModel.find({ org_id, is_deleted: false });
    }

    async update(id: string, updateData: Partial<Media>): Promise<Media> {
        return this.mediaModel.findByIdAndUpdate(id, { ...updateData, updated_at: new Date() }, { new: true });
    }

    async delete(id: string): Promise<Media> {
        return this.mediaModel.findByIdAndUpdate(id, { is_deleted: true, updated_at: new Date() }, { new: true });
    }
}
