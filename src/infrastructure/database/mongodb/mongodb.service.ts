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

            // Build connection string with parameters
            let connectionString = mongoConfig.host;

            // Parse existing connection string to check if it already has parameters
            const hasParams = connectionString.includes('?');
            const separator = hasParams ? '&' : '?';

            // Add connection parameters to the connection string for better cloud compatibility
            const params = new URLSearchParams();

            // Set retry settings for better reliability
            params.append('retryWrites', 'true');
            params.append('w', 'majority');

            // Set maxIdleTimeMS
            if (mongoConfig.options.maxIdleTimeMS) {
                params.append('maxIdleTimeMS', mongoConfig.options.maxIdleTimeMS.toString());
            }

            // Append parameters to connection string
            const paramString = params.toString();
            if (paramString) {
                connectionString = `${connectionString}${separator}${paramString}`;
            }

            // Build minimal client options
            const clientOptions: any = {
                // Let the driver handle TLS automatically based on the connection string
                serverSelectionTimeoutMS: 30000, // 30 seconds timeout
                socketTimeoutMS: 45000, // 45 seconds socket timeout
            };

            this.client = new MongoClient(connectionString, clientOptions);

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
