import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateProduct } from "./dto/create-product.dto";
import { UpdateProduct } from "./dto/update-product.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "src/generated/prisma/client";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProduct: CreateProduct) {
    try {
      await this.prisma.product.create({
        data: { ...createProduct },
      });

      return { message: "Ürün başarılı bir şekilde kaydedildi!" };
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException(
        "Ürün kaydedilirken sunucu kaynaklı bir hata oluştu.",
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.product.findMany();
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException(
        "Ürünler getirilirken bir hata oluştu.",
      );
    }
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException("Ürün bulunamadı.");
    }

    return product;
  }

  async update(id: string, updateProduct: UpdateProduct) {
    try {
      await this.prisma.product.update({
        where: { id: id },
        data: { ...updateProduct },
      });

      return { message: "Ürün başarıyla güncellendi." };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException("Güncellenmek istenen ürün bulunamadı.");
      }
      throw new InternalServerErrorException(
        "Ürün güncellenirken beklenmedik bir hata oluştu.",
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({
        where: { id: id },
      });

      return { message: "Ürün başarıyla silindi." };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException("Silinmek istenen ürün bulunamadı.");
      }
      throw new InternalServerErrorException(
        "Ürün silinirken beklenmedik bir hata oluştu.",
      );
    }
  }
}
