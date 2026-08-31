export interface AuthPayload {
  id: number;
  email: string;
  jti?: string;
  iat?: number;
  exp?: number;
}
