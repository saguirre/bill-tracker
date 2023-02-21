import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = app.get(ConfigService).get<string>('PORT');
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('Bill Tracker API')
    .setDescription('Simple API for tracking bills')
    .setVersion('1.0')
    .addTag('billtracker')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  Logger.log(
    `\n\n[================================]\n\n   Server running on port: ${port}\n\n[================================]\n`,
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
