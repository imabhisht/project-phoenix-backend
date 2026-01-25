import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection } from 'mongodb';
import { MongodbService } from '@infrastructure/database/mongodb';
import { User as UserSchema, UserDocument } from '../domain/entities/user.scheme';
import { User } from '@modules/user/domain/entities/user.scheme';
import { UserOtp } from '../domain/interfaces/user-otp.interface';

@Injectable()
export class UserRepository implements OnModuleInit {
    private readonly logger = new Logger(UserRepository.name);
    private otpCollection: Collection<UserOtp>;
    private readonly OTP_COLLECTION_NAME = 'user_otp';
    private readonly OTP_EXPIRY_MINUTES = 10; // OTP expires after 10 minutes

    constructor(
        @InjectModel(UserSchema.name)
        private readonly userModel: Model<UserDocument>,
        private readonly mongodbService: MongodbService,
    ) { }

    async onModuleInit() {
        this.otpCollection = this.mongodbService
            .getDb()
            .collection<UserOtp>(this.OTP_COLLECTION_NAME);

        // Create TTL index to automatically delete documents after 10 minutes
        try {
            await this.otpCollection.createIndex(
                { created_at: 1 },
                { expireAfterSeconds: this.OTP_EXPIRY_MINUTES * 60 }, // Convert minutes to seconds
            );
            this.logger.log(`${this.OTP_COLLECTION_NAME} collection initialized with TTL index (${this.OTP_EXPIRY_MINUTES} minutes)`);
        } catch (error) {
            this.logger.error('Failed to create TTL index', error);
            throw error;
        }
    }

    // ==================== User Methods ====================

    async findById(id: string): Promise<User | undefined> {
        return await this.userModel.findById(id).lean();
        
    }

    async findByUsername(username: string): Promise<User | undefined> {
        return await this.userModel.findOne({ username }).lean();
        
    }

    async findByOrganizationAndEmail(organizationId: string, email: string): Promise<User | undefined> {
        return await this.userModel.findOne({
            org_id: organizationId,
            email: email
        }).lean();
        
    }

    async create(userData: {
        _id: string;
        name: string;
        org_id: string;
        email: string;
        username: string;
        role: string;
    }): Promise<User> {
        return await this.userModel.create(userData);
    }

    // ==================== OTP Methods ====================

    /**
     * Check if OTP has expired based on created_at timestamp
     */
    private isOtpExpired(createdAt: Date): boolean {
        const now = new Date();
        const diffInMs = now.getTime() - createdAt.getTime();
        const diffInMinutes = diffInMs / (1000 * 60);
        return diffInMinutes > this.OTP_EXPIRY_MINUTES;
    }

    /**
     * Store OTP in MongoDB
     * Deletes all existing OTPs for this email/org before creating new one
     */
    async createOtp(email: string, org_id: string, otp: string): Promise<void> {
        try {
            // Delete all existing OTPs for this email/org combination
            await this.otpCollection.deleteMany({
                email,
                org_id,
            });

            // Insert new OTP
            await this.otpCollection.insertOne({
                email,
                org_id,
                otp,
                created_at: new Date(),
            });

            this.logger.log(`OTP created for email: ${email}, org_id: ${org_id}`);
        } catch (error) {
            this.logger.error('Failed to create OTP', error);
            throw error;
        }
    }

    /**
     * Find OTP for verification (returns null if expired)
     */
    async findOtp(email: string, org_id: string): Promise<UserOtp | null> {
        try {
            const otpDoc = await this.otpCollection.findOne({
                email,
                org_id,
            });

            if (!otpDoc) {
                return null;
            }

            // Check if OTP has expired (application-level check)
            if (this.isOtpExpired(otpDoc.created_at)) {
                this.logger.log(`OTP expired for email: ${email}, org_id: ${org_id}`);
                return null;
            }

            return otpDoc;
        } catch (error) {
            this.logger.error('Failed to find OTP', error);
            throw error;
        }
    }

    /**
     * Delete OTP after successful verification
     */
    async deleteOtp(email: string, org_id: string): Promise<void> {
        try {
            await this.otpCollection.deleteMany({
                email,
                org_id,
            });

            this.logger.log(`OTP deleted for email: ${email}, org_id: ${org_id}`);
        } catch (error) {
            this.logger.error('Failed to delete OTP', error);
            throw error;
        }
    }

    /**
     * Clean up expired OTPs (optional - can be called periodically via cron job)
     * Note: TTL index handles automatic cleanup, this is for manual cleanup if needed
     */
    async cleanupExpiredOtps(): Promise<number> {
        try {
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() - this.OTP_EXPIRY_MINUTES);

            const result = await this.otpCollection.deleteMany({
                created_at: { $lt: expiryDate },
            });

            if (result.deletedCount > 0) {
                this.logger.log(`Cleaned up ${result.deletedCount} expired OTPs`);
            }

            return result.deletedCount;
        } catch (error) {
            this.logger.error('Failed to cleanup expired OTPs', error);
            throw error;
        }
    }
}
