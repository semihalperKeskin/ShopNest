import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UsePipes } from "@nestjs/common";
import { createUserDto, createUserSchema } from "./dto/create.dto";
import { ZodValidationPipe } from "../common/pipes/zod.validation";
import { loginUserDto, loginUserSchema } from "./dto/login.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  @UsePipes(new ZodValidationPipe(createUserSchema))
  create(@Body() createUser: createUserDto) {
    return this.userService.create(createUser);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(loginUserSchema))
  login(@Body() loginUser: loginUserDto) {
    return this.userService.login(loginUser);
  }
}
