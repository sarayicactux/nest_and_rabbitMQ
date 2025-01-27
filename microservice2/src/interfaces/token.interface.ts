export interface SignTokenInterface {
  tokenValues: any;
  secretKey: string;
  expiresIn?: number | null;
}
export interface VerifyTokenInterface {
  token: string;
  secretKey: string;
}
