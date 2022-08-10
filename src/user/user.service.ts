import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UserService {
  private readonly users: User[];

  constructor() {
    this.users = [];
    this.users.push(new User('bard', 18), new User('tom', 14));
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUsersByName(name: string): Promise<User[]> {
    return this.users.filter((user) => user.name === name);
  }
}
