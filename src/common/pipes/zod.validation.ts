import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodType } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.safeParse(value);
      return parsedValue.data;
    } catch {
      throw new BadRequestException("Validation failed");
    }
  }
}
