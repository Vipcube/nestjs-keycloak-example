# Example of Secure NestJS REST API with Keycloak

## Description

The example to test how to secure [Nest](https://github.com/nestjs/nest) framework API integrate with Keycloak OAuth 2.0.

## Installation

```bash
$ npm install
```

## Setup Keycloak

1. Startup Keycloak Server

```bash
$ docker-compose -f ./docker/docker-compose.yml up -d 
```

2. Change to `nodejs-example` realm.
3. Regenerate the client `nestjs-app` secret.
4. Update [keycloak.json](./keycloak.json) with new generate the client secret.

Example:

```json
{
  "realm": "nodejs-example",
  "auth-server-url": "http://localhost:9003/auth",
  "resource": "nestjs-app",
  "credentials": {
    "secret": "%client-secret%"
  },
  "public-client": false
}
```

## Running the app

```bash
$ npm run start
```

## Test with Secure REST API

1. Get token from Keycloak.

```bash
curl --location --request POST 'http://localhost:9003/auth/realms/nodejs-example/protocol/openid-connect/token' \
--header 'Authorization: Basic %BASIC_AUTH_BASE_ON_ID_SECRET%' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials'
```

2. Test API endpoints.

```bash
curl --location --request GET 'http://localhost:3000/users' \
--header 'Authorization: Bearer %TOKEN%'
```

3. Test API endpoints secure with resource scopes.

```bash
curl --location --request GET 'http://localhost:3000/users/scope' \
--header 'Authorization: Bearer %TOKEN%'
```

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
