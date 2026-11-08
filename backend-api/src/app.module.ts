import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { ReportModule } from './report/report.module';
import { FeedbackModule } from './feedback/feedback.module';
import { TemplateModule } from './template/template.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CenterModule } from './center/center.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ContactUsModule } from './contact-us/contact-us.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UserModule,
    PatientModule,
    ReportModule,
    FeedbackModule,
    TemplateModule,
    InvoiceModule,
    CenterModule,
    DashboardModule,
    ContactUsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('AppModule configured');
    console.log(process.env.DB_URL);
  }
}
