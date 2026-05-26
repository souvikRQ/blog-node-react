import { UserModel } from '../users/user.model.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { signToken } from '../../utils/jwt.js';
import { AppError } from '../../middleware/error.middleware.js';
import { RegisterRequest, LoginRequest } from '@blog/shared-types';

export class AuthService {
  async register(data: RegisterRequest) {
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await hashPassword(data.password!);
    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: 'author', // Default role for registering users
    });

    const token = signToken({ userId: user.id, role: user.role });
    return { user, token };
  }

  async login(data: LoginRequest) {
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isMatch = await comparePassword(data.password!, user.passwordHash);
    if (!isMatch) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = signToken({ userId: user.id, role: user.role });
    return { user, token };
  }

  async getMe(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }
}
export const authService = new AuthService();
