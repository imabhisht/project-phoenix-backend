import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';
import { MediaRepository } from './repository/media.repository';
import { Media, MediaSchema } from './domain/entities/media.scheme';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Media.name, schema: MediaSchema }
        ]),
    ],
    controllers: [MediaController],
    providers: [MediaService, MediaRepository],
    exports: [MediaService],
})
export class MediaModule { }
