import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { FileUtils } from './common/utils';

const openApiTitle = 'API documentation';
const openApiVersion = '1.0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable cors
  app.enableCors({
    origin: ['*'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
  });

  // set swagger
  const config = new DocumentBuilder()
    .setTitle(openApiTitle)
    .setVersion(openApiVersion)
    .build();

  // create new swagger document
  const document = SwaggerModule.createDocument(app, config);

  // write swagger into file
  FileUtils.write(FileUtils.apiDocDict, JSON.stringify(document));
  SwaggerModule.setup('api', app, document);

  // default port is 3000
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
