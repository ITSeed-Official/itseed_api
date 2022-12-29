export class JwtPayload {
  id: number;
  email: string;
  isRefreshToken?: boolean;
  scope?: {
    resetPassword: boolean;
  };
}
