import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { configuration } from '@core/config/configuration';
import { HealthModule } from '@modules/health';
import { FirebaseModule } from '@modules/firebase';
import { PrismaModule } from '@modules/prisma';
import { MongodbModule } from '@infrastructure/database/mongodb';
import { UserModule } from '@modules/user/user.module';
import { AllExceptionsFilter } from '@core/exceptions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    MongodbModule,
    PrismaModule,
    FirebaseModule,
    UserModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule { }
