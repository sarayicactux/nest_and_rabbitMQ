import * as jwt from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  signer(tokenValues: any, secretKey: string, expiresIn = null) {
    const token = jwt.sign(tokenValues, secretKey, {
      algorithm: 'HS256',
      expiresIn: expiresIn || 60 * 60 * 24,
    });
    return token;
  }
  verifier(token: string, secretKey: string) {
    try {
      const tokenValues = jwt.verify(token, secretKey);
      return tokenValues;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
