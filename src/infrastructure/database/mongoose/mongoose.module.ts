import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { EnvObjects, MongoOptions } from '@core/config/configuration';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const mongoConfig = configService.get<MongoOptions>(
                    EnvObjects.MONGO_OPTIONS,
                );

                if (!mongoConfig?.host) {
                    throw new Error('MongoDB configuration is missing or invalid');
                }

                return {
                    uri: mongoConfig.host,
                    dbName: mongoConfig.options.dbName,
                    retryWrites: true,
                    w: 'majority',
                };
            },
            inject: [ConfigService],
        }),
    ],
    exports: [MongooseModule],
})
export class MongooseDbModule { }
