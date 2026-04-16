import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  app.enableCors({
    origin: "http://localhost:5173",
    Credential: true,
  });
  app.use(cookieParser());
  console.log(`🚀 Uygulama şu adreste çalışıyor: http://localhost:${port}`);
}
bootstrap();
