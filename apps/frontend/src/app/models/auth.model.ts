export interface User {
  id: number;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
}
