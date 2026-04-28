import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUser, LoginUserSchema } from "./dto/login.dto";
import { RegisterUser, RegisterUserSchema } from "./dto/register.dto";
import { ZodValidationPipe } from "src/common/pipes/zod.validation";
import { Public } from "./decorators/public.decorator";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/types/request.type";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post("login")
  @UsePipes(new ZodValidationPipe(LoginUserSchema))
  async login(
    @Body() loginUser: LoginUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginUser);

    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
    res.cookie("accessToken", tokens.accessToken, { httpOnly: true });

    return { message: "Giriş işlemi başarılı!" };
  }

  @Public()
  @Post("register")
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  register(@Body() registerUser: RegisterUser) {
    return this.authService.register(registerUser);
  }

  @Public()
  @Post("refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.cookies["refreshToken"] as string | undefined;

      if (!refreshToken)
        throw new UnauthorizedException("Refresh token bulunamadı.");

      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);

      const tokens = await this.authService.refresh(payload.sub);

      res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
      res.cookie("accessToken", tokens.accessToken, { httpOnly: true });

      return { message: "Oturum yenilendi!" };
    } catch {
      throw new UnauthorizedException(
        "Geçersiz veya süresi dolmuş refresh token! Tekrar giriş yapın.",
      );
    }
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return {
      message: "Çıkış başarılı!",
    };
  }
}
