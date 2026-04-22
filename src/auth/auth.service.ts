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
    const user = await this.prisma.user.findFirst({
      where: { email: loginUser.email },
    });

    if (!user) throw new UnauthorizedException();

    const passwordCompare = await bcrypt.compare(
      loginUser.password,
      user.password,
    );

    if (!passwordCompare) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    const refreshToken = await this.jwtService.signAsync(payload);

    const accessToken = await this.jwtService.signAsync(
      { email: user.email },
      { expiresIn: "1h" },
    );

    return {
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }

  async register(registerUser: RegisterUser) {
    console.log("user", registerUser);
    const existing = await this.prisma.user.findUnique({
      where: { email: registerUser.email },
    });

    if (existing) throw new ConflictException("Email already in use");

    const saltOrRounds = 10;
    const password = await bcrypt.hash(registerUser.password, saltOrRounds);
    return this.prisma.user.create({
      data: {
        email: registerUser.email,
        name: registerUser.name,
        password: password,
      },
    });
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(refreshToken);

      if (!payload) throw new UnauthorizedException();

      const newRefreshToken = await this.jwtService.signAsync({
        sub: payload.sub,
        email: payload.email,
      });

      return newRefreshToken;
    } catch {
      return new UnauthorizedException();
    }
  }
}
