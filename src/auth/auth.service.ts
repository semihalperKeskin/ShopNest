import { Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";

const saltOrRounds = 10;
@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    const password = loginDto.password;

    const hash = await bcrypt.hash(password, saltOrRounds);

    return {
      username: loginDto.username,
      password: hash,
    };
  }

  register(registerDto: RegisterDto) {
    return registerDto;
  }
}
