import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginUser } from "./dto/login.dto";
import { RegisterUser } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginUser: LoginUser) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUser.email },
    });

    if (!user) throw new UnauthorizedException("E-posta veya şifre hatalı.");

    const passwordCompare = await bcrypt.compare(
      loginUser.password,
      user.password,
    );

    if (!passwordCompare) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    const refreshToken = await this.jwtService.signAsync(payload);

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: "1h",
    });

    return {
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }

  async register(registerUser: RegisterUser) {
    const existing = await this.prisma.user.findUnique({
      where: { email: registerUser.email },
    });

    if (existing) throw new ConflictException("Email already in use");

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      registerUser.password,
      saltOrRounds,
    );
    await this.prisma.user.create({
      data: {
        email: registerUser.email,
        name: registerUser.name,
        password: hashedPassword,
      },
    });

    return { message: "Kayıt başarılı!" };
  }

  async refresh(sub: string) {
    try {
      const payload = { sub: sub };

      const refreshToken = await this.jwtService.signAsync(payload);
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: "1h",
      });

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
