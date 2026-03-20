import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { createUserDto } from "./dto/create.dto";
import { loginUserDto } from "./dto/login.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUser: createUserDto) {
    return this.prisma.user.create({
      data: {
        email: createUser.email,
        name: createUser.name,
        password: createUser.password,
      },
    });
  }

  async login(loginUser: loginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: loginUser.email },
    });

    if (!user) return;

    if (loginUser.password !== user.password) {
      return { message: "password error" };
    }

    return true;
  }
}
