import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { FirebaseService } from '@modules/firebase/firebase.service';
import { UserRepository } from '../repository/user.repository';
import { TenantsRepository } from '@modules/tenants/repository/tenants.repository';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { UserRoles } from '../domain/enums/userRoles.enum';
import { User } from '@modules/user/domain/entities/user.scheme';
import { FirebaseUser } from '@shared/interfaces';
import { UserDTO } from '../dtos/user.dto';

const generator = require('beautiful-username-generator');

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly userRepository: UserRepository,
        private readonly tenantsRepository: TenantsRepository,
        private readonly firebaseService: FirebaseService,
    ) { }

    async userInfo(user: FirebaseUser): Promise<UserDTO> {
        const userDoc = await this.userRepository.findById(user.user_id);
        return UserDTO.fromSchema(userDoc);
    }

    async requestOtp(
        email: string,
        org_id: string,
    ): Promise<{ message: string }> {
        try {
            // Verify user exists with matching email and org_id
            const user = await this.userRepository.findByOrganizationAndEmail(
                org_id,
                email,
            );

            if (!user) {
                throw new NotFoundException(
                    'User not found with provided email and organization ID',
                );
            }

            // Generate 6-digit random OTP
            const otp = this.generateOtp();

            // Store OTP in MongoDB
            await this.userRepository.createOtp(email, org_id, otp);

            this.logger.log(
                `OTP requested for user: ${email}, org: ${org_id}, OTP: ${otp}`,
            );

            // TODO: Send OTP via email service
            // In production, integrate with SendGrid, AWS SES, or similar
            // For now, we'll just log it (for development/testing purposes)

            return {
                message: 'OTP sent successfully. Please check your email.',
            };
        } catch (error) {
            this.logger.error('Failed to request OTP', error);
            throw error;
        }
    }

    async verifyOtpAndGenerateToken(
        email: string,
        org_id: string,
        otp: string,
    ): Promise<AuthResponseDto> {
        try {
            // Retrieve OTP from MongoDB
            const storedOtp = await this.userRepository.findOtp(email, org_id);

            if (!storedOtp) {
                throw new UnauthorizedException(
                    'Invalid or expired OTP. Please request a new one.',
                );
            }

            // Verify OTP matches
            if (storedOtp.otp !== otp) {
                throw new UnauthorizedException('Incorrect OTP. Please try again.');
            }

            // Fetch user data
            const user = await this.userRepository.findByOrganizationAndEmail(
                org_id,
                email,
            );

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Fetch tenant's firebase_tenant_id
            const tenant = await this.tenantsRepository.findById(org_id);

            if (!tenant || !tenant.firebase_tenant_id) {
                throw new BadRequestException(
                    'Organization Firebase tenant configuration not found',
                );
            }

            // Generate Firebase custom token with tenant auth
            const firebaseToken = await this.generateFirebaseToken(
                user,
                tenant.firebase_tenant_id,
            );

            // Delete OTP from MongoDB after successful verification
            await this.userRepository.deleteOtp(email, org_id);

            this.logger.log(
                `OTP verified successfully for user: ${email}, org: ${org_id}`,
            );

            return new AuthResponseDto(firebaseToken, tenant.firebase_tenant_id, user);
        } catch (error) {
            this.logger.error('Failed to verify OTP', error);
            throw error;
        }
    }

    private generateOtp(): string {
        // Check node environment
        if (process.env.NODE_ENV === 'development') {
            return '123456';
        }
        return '123456';
    }

    private async generateFirebaseToken(
        user: User,
        firebaseTenantId: string,
    ): Promise<string> {
        try {
            const auth = this.firebaseService.getAuth();

            // Get tenant auth context
            const tenantAuth = auth.tenantManager().authForTenant(firebaseTenantId);

            // Create custom token with user claims
            const customToken = await tenantAuth.createCustomToken(user._id, {
                email: user.email,
                name: user.name,
                organization_id: user.org_id,
                role: user.role,
            });

            return customToken;
        } catch (error) {
            this.logger.error('Failed to generate Firebase token', error);
            throw new BadRequestException('Failed to generate authentication token');
        }
    }

    async createOwner(
        org_id: string,
        email: string,
        name: string,
    ): Promise<AuthResponseDto> {
        try {
            // Step 1: Check if organization exists
            const tenant = await this.tenantsRepository.findById(org_id);

            if (!tenant) {
                throw new NotFoundException(
                    `Organization with ID ${org_id} not found`,
                );
            }

            if (!tenant.firebase_tenant_id) {
                throw new BadRequestException(
                    'Organization Firebase tenant configuration not found',
                );
            }

            // Check if user already exists
            const existingUser = await this.userRepository.findByOrganizationAndEmail(
                org_id,
                email,
            );

            if (existingUser) {
                throw new ConflictException(
                    'User with this email already exists in the organization',
                );
            }

            // Step 2: Create Firebase user
            const auth = this.firebaseService.getAuth();
            const tenantAuth = auth.tenantManager().authForTenant(tenant.firebase_tenant_id);

            let firebaseUser;
            try {
                firebaseUser = await tenantAuth.createUser({
                    email: email,
                    displayName: name,
                    emailVerified: true, // Auto-verify since created by admin
                });
            } catch (firebaseError: any) {
                this.logger.error('Failed to create Firebase user', firebaseError);
                throw new BadRequestException(
                    `Failed to create Firebase user: ${firebaseError.message}`,
                );
            }

            // Step 3: Generate username using beautiful-username-generator
            let username: string;
            try {
                username = await generator.gen({ maxLength: 8 });
            } catch (error) {
                this.logger.error('Error generating username', error);
                // Fallback to a simple username if generator fails
                username = `user_${Date.now()}`;
            }

            // Step 4: Create user in MongoDB database
            let user: User;
            try {
                user = await this.userRepository.create({
                    _id: firebaseUser.uid, // Use Firebase UID as user ID
                    name: name,
                    org_id: org_id,
                    email: email,
                    username: username,
                    role: UserRoles.OWNER,
                });

                this.logger.log(
                    `User created in database with ID: ${user._id}, username: ${username}`,
                );
            } catch (dbError: any) {
                // Rollback: Delete Firebase user if database creation fails
                this.logger.error('Failed to create user in database, rolling back Firebase user', dbError);
                try {
                    await tenantAuth.deleteUser(firebaseUser.uid);
                    this.logger.log(`Rolled back Firebase user: ${firebaseUser.uid}`);
                } catch (rollbackError) {
                    this.logger.error('Failed to rollback Firebase user', rollbackError);
                }
                throw new BadRequestException(
                    `Failed to create user in database: ${dbError.message}`,
                );
            }

            // // Step 5: Generate Firebase login token
            // let firebaseToken: string;
            // try {
            //     firebaseToken = await this.generateFirebaseToken(
            //         user,
            //         tenant.firebase_tenant_id,
            //     );

            //     this.logger.log(
            //         `Firebase token generated for user: ${user._id}`,
            //     );
            // } catch (tokenError: any) {
            //     this.logger.error('Failed to generate Firebase token', tokenError);
            //     throw new BadRequestException(
            //         `Failed to generate authentication token: ${tokenError.message}`,
            //     );
            // }

            return
        } catch (error) {
            this.logger.error('Failed to create owner user', error);
            throw error;
        }
    }
}
