import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { createUserDto } from "./dto/create.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(userDto: createUserDto) {
    return this.prisma.user.create({
      data: {
        email: userDto.email,
        name: userDto.name,
        password: userDto.password,
      },
    });
  }
}
