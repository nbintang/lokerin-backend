import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessControlService } from './shared/access-control.service';
import { MailModule } from '../../common/mail/mail.module';
import { RecruiterModule } from '../recruiters/recruiter.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    ConfigModule,
    UsersModule,
    RecruiterModule,
    MailModule,
  ],
  providers: [
    JwtService,
    ConfigService,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessControlService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
