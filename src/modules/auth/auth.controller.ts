import {
  Body,
  Controller,
  Delete,
  HttpException,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService, JwtTokenResponse } from './auth.service';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AccessTokenGuard } from './guards/access-token.guard';
import { Roles } from './decorators/roles.decorator';
import { RoleGuard } from './guards/role.guard';
import { CreateUserDto } from '../users/dto/user/create-user.dto';
import { UserRole } from '../users/enum/user.enum';
import { AuthDto } from './dto/create-auth.dto';
import { CreateRecruiterProfileDto } from '../recruiters/dto/create-recruiter.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signup(@Body() body: CreateUserDto, @Req() request: Request) {
    try {
      const existedTokenCookie = request.user;
      if (existedTokenCookie)
        throw new UnauthorizedException('You are already logged in!');
      await this.authService.signUp(body);
      return {
        message: 'Success!, Please check your email for the verification link',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Something Went Wrong',
        error.status || 500,
      );
    }
  }
  @Post('recruiter-signup')
  async recruiterSignup(
    @Body() body: CreateRecruiterProfileDto,
    @Req() request: Request,
  ) {
    try {
      const existedTokenCookie = request.user;
      if (existedTokenCookie)
        throw new UnauthorizedException('You are already logged in!');
      await this.authService.signUpAsRecruiter(body);
      return {
        message: 'Success!, Please check your email for the verification link',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Something Went Wrong',
        error.status || 500,
      );
    }
  }

  @Post('verify')
  async verifyEmailTokenThroughLink(
    @Query('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.verifyEmailToken({
          token,
        });
      if (accessToken && refreshToken)
        response.cookie('refreshToken', refreshToken, {
          sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
          secure: process.env.NODE_ENV !== 'development',
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        });
      return { message: 'Email verified successfully', data: { accessToken } };
    } catch (error) {
      throw new HttpException(
        error.message || 'Something Went Wrong',
        error.status || 500,
      );
    }
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() { email }: { email: string },
    @Req() request: Request,
  ) {
    const user = request.user;
    if (user)
      throw new UnauthorizedException(
        `You are already logged in! Please logout first.`,
      );
    return await this.authService.forgotPassword(email);
  }
  @Post('resend-verification')
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.MEMBER)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async resendVerification(@Body() body: { email: string }) {
    return await this.authService.resendVerification(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: AuthDto, @Query('token') token: string) {
    try {
      return await this.authService.changePassword({
        token,
        newPassword: body.newPassword,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Something Went Wrong',
        error.status || 500,
      );
    }
  }

  @Post('signin')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() body: { email: string; password: string },
    @Req() request: Request,
  ) {
    const existedTokenCookie = request.cookies.refreshToken;
    const user = await this.authService.decodeToken(existedTokenCookie);
    if (user) throw new UnauthorizedException('You are already logged in!');
    const { accessToken, refreshToken } = await this.authService.signIn(body);
    if (accessToken && refreshToken)
      response.cookie('refreshToken', refreshToken, {
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
    return {
      message: 'Successfully signed in',
      data: { accessToken },
    };
  }

  @Delete('signout')
  async signout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', {
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
    });
    return await this.authService.signout();
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshTokens(
    @Req() request: Request,
  ): Promise<Omit<JwtTokenResponse, 'refreshToken'>> {
    const userId = (request as any).user.sub;
    const tokens = await this.authService.refreshToken(userId);
    return {
      accessToken: tokens.accessToken,
    };
  }
}
