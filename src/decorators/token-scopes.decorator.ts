import { SetMetadata } from '@nestjs/common';

export const META_TOKEN_SCOPES = 'scopes';

/**
 * Keycloak Token Scopes.
 * @param scopes - scopes that are associated with the token
 */
export const TokenScopes = (...scopes: string[]) =>
  SetMetadata(META_TOKEN_SCOPES, scopes);
