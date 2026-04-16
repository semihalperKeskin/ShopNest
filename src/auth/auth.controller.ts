import { Body, Controller, Post, Req, Res, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUser, LoginUserSchema } from "./dto/login.dto";
import { RegisterUser, RegisterUserSchema } from "./dto/register.dto";
import { ZodValidationPipe } from "src/common/pipes/zod.validation";
import { Public } from "./decorators/public.decorator";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

    return {
      mesaj: "Giriş başarılı!",
    };
  }

  @Public()
  @Post("register")
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  async register(@Body() registerUser: RegisterUser) {
    console.log("registerUser controller", registerUser);
    const user = await this.authService.register(registerUser);

    return {
      message: "Kayıt başarılı!",
      user: user,
    };
  }

  @Post("refresh")
  refresh(@Req() req: Request) {
    return this.authService.refresh(req);
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
