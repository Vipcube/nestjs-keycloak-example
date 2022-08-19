import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  KEYCLOAK_CONNECT_OPTIONS,
  KEYCLOAK_LOGGER,
  KeycloakConnectConfig,
  META_UNPROTECTED,
  PolicyEnforcementMode,
} from 'nest-keycloak-connect';
import { extractRequest } from 'nest-keycloak-connect/util';
import { META_TOKEN_SCOPES } from '../decorators/token-scopes.decorator';

@Injectable()
export class TokenScopesGuard implements CanActivate {
  constructor(
    @Inject(KEYCLOAK_CONNECT_OPTIONS)
    private keycloakOpts: KeycloakConnectConfig,
    @Inject(KEYCLOAK_LOGGER)
    private logger: Logger,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract request/response
    const [request] = extractRequest(context);

    // if is not an HTTP request ignore this guard
    if (!request) {
      return true;
    }

    const isUnprotected = this.reflector.getAllAndOverride<boolean>(
      META_UNPROTECTED,
      [context.getClass(), context.getHandler()],
    );

    // If unprotected is set skip Keycloak authentication
    if (isUnprotected) {
      return true;
    }

    const tokenScopes = this.reflector.getAllAndMerge<string[]>(
      META_TOKEN_SCOPES,
      [context.getClass(), context.getHandler()],
    );

    // Default to permissive
    const pem =
      this.keycloakOpts.policyEnforcement || PolicyEnforcementMode.PERMISSIVE;
    const shouldAllow = pem === PolicyEnforcementMode.PERMISSIVE;

    // No scopes given, check policy enforcement mode
    if (!tokenScopes) {
      if (shouldAllow) {
        this.logger.verbose(
          `Route has no @TokenScopes defined, request allowed due to policy enforcement`,
        );
      } else {
        this.logger.verbose(
          `Route has no @TokenScopes defined, request denied due to policy enforcement`,
        );
      }
      return shouldAllow;
    }

    if (!request.user || !request.accessTokenJWT) {
      this.logger.verbose(`Route has no user, and accessTokenJWT`);
      return false;
    }

    const scopes: string[] = request.user.scope;
    const isAllowed = tokenScopes.every((scope) => scopes.includes(scope));

    // If statement for verbose logging only
    if (!isAllowed) {
      this.logger.verbose(`Token scopes denied`);
    } else {
      this.logger.verbose(`Token scopes granted`);
    }

    return isAllowed;
  }
}
