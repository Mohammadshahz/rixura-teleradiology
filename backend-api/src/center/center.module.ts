import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Center } from './entities/center.entity';
import { UserCenter } from './entities/user-center.entity';
import { CenterService } from './services/center.service';
import { UserCenterService } from './services/user-center.service';
import { CenterController } from './controllers/center.controller';
import { UserCenterController } from './controllers/user-center.controller';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from 'src/user/services/user.service';
import { CognitoService } from 'src/user/services/cognito.service';
import { S3Service } from 'src/aws/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Center, UserCenter, User]),
  ],
  controllers: [CenterController, UserCenterController],
  providers: [CenterService, UserService,CognitoService,UserCenterService, S3Service],
  exports: [CenterService, UserCenterService, TypeOrmModule],
})
export class CenterModule {}
