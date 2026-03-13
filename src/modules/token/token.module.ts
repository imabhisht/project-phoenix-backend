import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './services/token.service';

/**
 * TokenModule encapsulates JWT signing and verification.
 * It is marked as @Global() so TokenService is available project-wide (guards, controllers, etc.)
 */
@Global()
@Module({
    imports: [
        ConfigModule,
        // We do NOT bind a global secret here — TokenService handles access vs refresh secrets separately
        JwtModule.register({}),
    ],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule { }
