import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user";
import { AuthController, AuthModule, AuthService } from "./auth";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
