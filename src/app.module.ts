import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { configuration } from '@core/config/configuration';
import { HealthModule } from '@modules/health';
import { MongodbModule } from '@infrastructure/database/mongodb';
import { MongooseDbModule } from '@infrastructure/database/mongoose';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AdminModule } from '@modules/admin/admin.module';
import { TokenModule } from '@modules/token/token.module';
import { CollectionModule } from '@modules/collections/collection.module';
import { CollectionSourceModule } from '@modules/collection_source/collection_source.module';
import { AllExceptionsFilter } from '@core/exceptions';
import { AppController } from './app.controller';
import { MediaModule } from '@modules/media/media.module';
import { CollectionMediaModule } from '@modules/collection_media/collection_media.module';
import { EntityTypesModule } from '@modules/entity_types/entity_types.module';
import { EntityPropertiesModule } from '@modules/entity_properties/entity_properties.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    MongodbModule,
    MongooseDbModule,
    UserModule,
    AuthModule,
    AdminModule,
    TokenModule,
    CollectionModule,
    CollectionSourceModule,
    CollectionMediaModule,
    EntityTypesModule,
    EntityPropertiesModule,
    HealthModule,
    MediaModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule { }
