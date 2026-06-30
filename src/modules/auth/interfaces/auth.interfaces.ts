export interface User {
  id: number;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserResponseDto {
  id: number;
  username: string;
  createdAt: string;
}

export interface RegisterDto {
  username?: string;
  password?: string;
}

export interface LoginDto {
  username?: string;
  password?: string;
}
