import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
// import { OAuthGuard } from './auth/jwt.guard';
// import { JWTService } from './auth/jwt.service';  
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: {
      origin: [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'https://radiology-client.netlify.app', 
        'https://benevolent-arithmetic-081441.netlify.app',
        'https://radiology-app.netlify.app',
        'https://center-app.netlify.app',
        'https://admin.rixura.com',
        'https://radio.rixura.com',
        'https://center.rixura.com',
        'https://rixura.com',
        'https://radiology.rixura.com',
        'https://center.rixura.com',
        'https://admin.rixura.com',
        'https://radio.rixura.com',
        'https://center.rixura.com',
        'https://rixura.com',
        'https://www.rixura.com',
        'https://www.center.rixura.com',
        'https://www.radio.rixura.com',
        'https://www.admin.rixura.com',
        '*'
      ], // Add frontend origins, both local and deployed
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }
  });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT', 3000);
  // Swagger configuration

  const config = new DocumentBuilder()
    .setTitle('Radiology Service')
    .setDescription(
      'This is the Backend Service to support the Radiology Service',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const reflector = app.get(Reflector);
  // const jwtService = new JWTService();
  // const oAuthGuard = new OAuthGuard(reflector, jwtService);
  // app.useGlobalGuards(oAuthGuard);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(PORT);
}
bootstrap();