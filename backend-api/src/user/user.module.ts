import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { CognitoService } from './services/cognito.service';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { UserCenterService } from '../center/services/user-center.service';
import { UserCenter } from '../center/entities/user-center.entity';
import { Center } from '../center/entities/center.entity';
import { S3Service } from '../aws/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserCenter, Center]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('TOKEN_EXPIRY') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, UserCenterService, CognitoService, AuthService, S3Service] ,
  exports: [UserService, CognitoService, AuthService],
})
export class UserModule {}
