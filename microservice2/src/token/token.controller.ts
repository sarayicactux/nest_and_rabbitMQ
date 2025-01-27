import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TokenService } from './token.service';
import {
  SignTokenInterface,
  VerifyTokenInterface,
} from '../interfaces/token.interface';
import ResultInterface from '../interfaces/result.interface';

@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern('sign_token')
  async registerUser(signToken: SignTokenInterface): Promise<ResultInterface> {
    const { tokenValues, secretKey, expiresIn } = signToken;
    try {
      const newToken = await this.tokenService.signer(
        tokenValues,
        secretKey,
        expiresIn,
      );
      return { status: 200, data: { token: newToken } };
    } catch (error) {
      console.log(error);
      return { status: 400, error };
    }
  }

  @MessagePattern('verify_token')
  async loginUser(
    verifyTokenInterface: VerifyTokenInterface,
  ): Promise<ResultInterface> {
    const { token, secretKey } = verifyTokenInterface;
    const tokenValues = await this.tokenService.verifier(token, secretKey);
    if (!tokenValues) {
      return { status: 403, error: 'Invalid Token', data: null };
    }
    return { status: 200, data: tokenValues };
  }
}
