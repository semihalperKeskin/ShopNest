import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user";
import { AuthController, AuthModule, AuthService } from "./auth";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductModule } from "./product/product.module";

@Module({
  imports: [AuthModule, UserModule, PrismaModule, ProductModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
