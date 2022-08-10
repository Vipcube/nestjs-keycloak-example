import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user';
import { Resource, Scopes, Unprotected } from 'nest-keycloak-connect';

// 1. This annotation need enable Authorization Enabled.
// 2. Create resource with annotation Key at Authorization Tabs → Resources Tabs.
// 3. Create resource Scope need with @Scopes annotation Key at Authorization Tabs → Authorization Scopes Tabs.
// 4. Assigning Scopes to resource.
// PS: This resource scopes not token scope.
@Resource(User.name)
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.service.getUsers();
  }

  @Get('/scope')
  @Scopes('basic')
  async getUsersScope(): Promise<User[]> {
    return this.service.getUsers();
  }

  @Get('/public')
  @Unprotected()
  async getUsersPublic(): Promise<User[]> {
    return this.service.getUsers();
  }
}
