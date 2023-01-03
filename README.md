# crud-api

The "CRUD API" is a collection of APIs about users intended for consumption. These include:

- Get the list of all users
- Get the one specific user
- Add new user
- Update data of the existing user 
- Delete user

## Running locally

1. Make sure you have `.env` file. Specify variables if needed.
2. Run `npm ci` to install dependencies.
3. Run `npm run start:dev` to start project in dev mode.
4. Application will start on `http://localhost:4000`

## Running in production
```bash
npm run start:prod
```

## Horizontal scaling for with a load balancer mode
```bash
npm run start:multi
```

### Lint
```bash
npm run lint
```

### Unit tests
```bash
npm run test
```

## Environment vars

| Variable                                      | Description                                                  |
| --------------------------------------------- | ------------------------------------------------------------ |
| PORT                                          | Specific port number                                         |
