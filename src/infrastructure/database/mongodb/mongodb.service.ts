import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';
import { EnvObjects, MongoOptions } from '@core/config/configuration';

@Injectable()
export class MongodbService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(MongodbService.name);
    private client: MongoClient;
    private db: Db;

    constructor(private readonly configService: ConfigService) { }

    async onModuleInit() {
        try {
            const mongoConfig = this.configService.get<MongoOptions>(
                EnvObjects.MONGO_OPTIONS,
            );

            if (!mongoConfig?.host) {
                throw new Error('MongoDB configuration is missing or invalid');
            }

            this.logger.log('Initializing MongoDB connection...');

            // Build MongoDB client options
            const clientOptions: any = {
                maxIdleTimeMS: mongoConfig.options.maxIdleTimeMS,
                tls: mongoConfig.options.tls,
                ...(mongoConfig.options.tlsCAFile && {
                    tlsCAFile: mongoConfig.options.tlsCAFile,
                }),
            };

            // Only add auth if username and password are provided separately
            // (connection string may already contain credentials)
            if (mongoConfig.options.auth?.username && mongoConfig.options.auth?.password) {
                clientOptions.auth = {
                    username: mongoConfig.options.auth.username,
                    password: mongoConfig.options.auth.password,
                };
                // Specify authSource for proper authentication
                clientOptions.authSource = 'admin';
            }

            this.client = new MongoClient(mongoConfig.host, clientOptions);

            await this.client.connect();

            this.db = this.client.db(mongoConfig.options.dbName);

            // Ping database to verify connection
            await this.db.command({ ping: 1 });

            this.logger.log('MongoDB connection established successfully');
        } catch (error) {
            this.logger.error('Failed to establish MongoDB connection', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        try {
            if (this.client) {
                await this.client.close();
                this.logger.log('MongoDB connection closed');
            }
        } catch (error) {
            this.logger.error('Error closing MongoDB connection', error);
            throw error;
        }
    }

    /**
     * Get the MongoDB client instance
     */
    getClient(): MongoClient {
        if (!this.client) {
            throw new Error('MongoDB client is not initialized');
        }
        return this.client;
    }

    /**
     * Get the MongoDB database instance
     */
    getDb(): Db {
        if (!this.db) {
            throw new Error('MongoDB database is not initialized');
        }
        return this.db;
    }
}
