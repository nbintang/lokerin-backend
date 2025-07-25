import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../common/mail/mail.service';
import { CreateUserDto } from '../users/dto/user/create-user.dto';
import { RecruitersService } from '../recruiters/recruiter.service';
import { CreateRecruiterProfileDto } from '../recruiters/dto/create-recruiter.dto';
export interface JwtTokenResponse {
  accessToken: string;
  refreshToken: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private recruiterService: RecruitersService,
  ) {}

  hashData(data: string) {
    return argon2.hash(data);
  }

  async decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  private async generateJwtTokens(
    userId: string,
    email: string,
    role: string,
    verified: boolean,
  ): Promise<JwtTokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role, verified },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '30s',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role, verified },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '1d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async confirmUserEmail(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (user.isVerified)
      throw new BadRequestException('Email already verified');
    return await this.usersService.updateVerifiedById(user.id);
  }
  compareHash(plainText: string, hash: string) {
    return argon2.verify(hash, plainText);
  }

  async signUp(createUserDto: CreateUserDto) {
    const [existingUser, existingPhone] = await Promise.all([
      this.usersService.findUserByEmail(createUserDto.email),
      this.usersService.findUserByPhone(createUserDto.phone),
    ]);
    if (existingUser || existingPhone)
      throw new BadRequestException('User already exists');
    const hashedPassword = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.createUser({
      name: createUserDto.name,
      email: createUserDto.email,
      phone: createUserDto.phone,
      avatarUrl: createUserDto.avatarUrl,
      password: hashedPassword,
    });
    if (newUser)
      await this.mailService.sendEmailConfirmation({
        email: newUser.email,
        name: newUser.name,
        id: newUser.id,
      });
  }
  async signUpAsRecruiter(createRecruiterDto: CreateRecruiterProfileDto) {
    const [existingUser, existingPhone] = await Promise.all([
      this.usersService.findUserByEmail(createRecruiterDto.email),
      this.usersService.findUserByPhone(createRecruiterDto.phone),
    ]);
    if (existingUser || existingPhone)
      throw new BadRequestException('User already exists');
    const hashedPassword = await this.hashData(createRecruiterDto.password);
    const newRecruiter = await this.recruiterService.createUserWithRecruiter({
      about: createRecruiterDto.about,
      companyName: createRecruiterDto.companyName,
      position: createRecruiterDto.position,
      website: createRecruiterDto.website,
      name: createRecruiterDto.name,
      email: createRecruiterDto.email,
      phone: createRecruiterDto.phone,
      avatarUrl: createRecruiterDto.avatarUrl,
      password: hashedPassword,
    });
    if (newRecruiter)
      await this.mailService.sendEmailConfirmation({
        email: newRecruiter.user.email,
        name: newRecruiter.user.name,
        id: newRecruiter.user.id,
      });
  }

  async verifyEmailToken({
    token,
  }: {
    token: string;
  }): Promise<JwtTokenResponse> {
    const { email } = await this.mailService.decodeConfirmationToken(token);
    const user = await this.confirmUserEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const { accessToken, refreshToken } = await this.generateJwtTokens(
      user.id,
      user.email,
      user.role,
      user.isVerified,
    );
    return { accessToken, refreshToken };
  }

  async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<JwtTokenResponse> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user)
      throw new UnauthorizedException('User is not registered with us');
    const isPasswordValid = await this.compareHash(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Password is incorrect');
    const { accessToken, refreshToken } = await this.generateJwtTokens(
      user.id,
      user.email,
      user.role,
      user.isVerified,
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  async changePassword({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) {
    const { email } = await this.mailService.decodeConfirmationToken(token);
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const hashedPassword = await this.hashData(newPassword);
    await this.usersService.updatePassword(user.id, hashedPassword);
    return {
      message: 'Password Changed Successfully',
    };
  }
  async resendVerification(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (user.isVerified)
      throw new BadRequestException('Email already verified');
    if (!user) throw new NotFoundException('User not found');
    await this.mailService.sendEmailConfirmation({
      name: user.name,
      email: user.email,
      id: user.id,
    });

    return {
      message: 'Email sent successfully',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    await this.mailService.sendPasswordReset({
      name: user.name,
      email: user.email,
      id: user.id,
    });
    return {
      message: 'Email sent successfully',
    };
  }

  async refreshToken(userId: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new ForbiddenException('Access Denied');
    const tokens = await this.generateJwtTokens(
      user.id,
      user.email,
      user.role,
      user.isVerified,
    );
    return tokens;
  }
  async signout() {
    return {
      message: 'Successfully signed out',
    };
  }
}
