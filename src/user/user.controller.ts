import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UsePipes } from "@nestjs/common";
import { createUserDto, createUserSchema } from "./dto/create.dto";
import { ZodValidationPipe } from "../common/pipes/zod.validation";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  create(@Body() userDto: createUserDto) {
    return this.userService.create(userDto);
  }
}
