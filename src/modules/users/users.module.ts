import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccessControlService } from '../auth/shared/access-control.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  providers: [UsersService, AccessControlService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
