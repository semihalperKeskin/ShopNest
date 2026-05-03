import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProduct, CreateProductSchema } from "./dto/create-product.dto";
import { UpdateProduct, UpdateProductSchema } from "./dto/update-product.dto";
import { ZodValidationPipe } from "src/common/pipes/zod.validation";
import z from "zod";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  create(@Body() createProduct: CreateProduct) {
    return this.productService.create(createProduct);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", new ZodValidationPipe(z.uuid())) id: string) {
    return this.productService.findOne(id);
  }

  @Patch(":id")
  @UsePipes(new ZodValidationPipe(UpdateProductSchema))
  update(@Param("id") id: string, @Body() updateProduct: UpdateProduct) {
    return this.productService.update(id, updateProduct);
  }

  @Delete(":id")
  remove(@Param("id", new ZodValidationPipe(z.uuid())) id: string) {
    return this.productService.remove(id);
  }
}
