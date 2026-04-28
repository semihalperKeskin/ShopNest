import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from "express";
import { UpdateUser, UpdateUserSchema } from "./dto/update.dto";
import { ZodValidationPipe } from "src/common/pipes/zod.validation";
import { AuthenticatedRequest } from "src/types/request.type";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;

    if (!userId) throw new UnauthorizedException("Kimlik doğrulanamadı!");

    return await this.userService.findById(userId);
  }

  @Patch("me")
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  async updateUser(
    @Req() req: AuthenticatedRequest,
    @Body() userData: UpdateUser,
  ) {
    const userId = req.user?.sub;

    if (!userId) throw new UnauthorizedException("Kimlik doğrulanamadı!");

    return await this.userService.update(userId, userData);
  }
}
