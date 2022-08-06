export class JwtPayload {
  id: number;
  username: string;
  isRefreshToken?: boolean;
  scope?: {
    resetPassword: boolean;
  };
}
