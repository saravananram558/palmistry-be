


import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { ConfigService } from "@nestjs/config";

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  

  const express = require("express");

  const configService: ConfigService = app.get(ConfigService);

  

  app.enableCors({ credentials: true, origin: true });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.setGlobalPrefix("api");


  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("trans")
    .setDescription("The governstein API description")
    .setVersion("1.0")
    .addTag("trans")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
  SwaggerModule.setup("apidoc", app, document);
  // await app.listen(process.env.PORT);
  await app.listen(5000);
  
}
bootstrap();
