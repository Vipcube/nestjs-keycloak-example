import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  ResourceGuard,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // KeycloakConnectModule.register({
    //   authServerUrl: 'http://localhost:9003/auth',
    //   realm: 'nodejs-example',
    //   clientId: 'nestjs-app',
    //   secret: 'SYSfyOCnzV9VRiIxsfAPqWIkVWtmuB8C',
    //   public: false,
    //   policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
    //   tokenValidation: TokenValidation.ONLINE,
    // }),
    // Use Keycloak.json
    KeycloakConnectModule.register('./keycloak.json', {
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // This adds a global level authentication guard,
    // you can also have it scoped if you like.
    // Will return a 401 unauthorized when it is unable to verify the JWT token or Bearer header is missing.
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // This adds a global level resource guard, which is permissive.
    // Only controllers annotated with @Resource and methods with @Scopes are handled by this guard.
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // New in 1.1.0
    // This adds a global level role guard, which is permissive.
    // Used by `@Roles` decorator with the
    // optional `@AllowAnyRole` decorator for allowing any
    // specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
