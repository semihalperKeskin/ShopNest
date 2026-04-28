import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUser } from "./dto/update.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findById(id: string) {
    try {
      return this.prisma.user.findUnique({
        where: { id: id },
        omit: {
          id: true,
          password: true,
        },
      });
    } catch {
      throw new NotFoundException("Kullanıcı bulunamadı.");
    }
  }

  async update(id: string, userData: UpdateUser) {
    try {
      await this.prisma.user.update({
        where: { id: id },
        data: { name: userData.name },
      });

      return { message: "Kullanıcı bilgileri güncellendi!" };
    } catch {
      throw new NotFoundException("Güncellenecek kullanıcı bulunamadı.");
    }
  }
}
