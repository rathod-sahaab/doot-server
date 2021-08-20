# Doot SMS server

This server enables you to send SMS through your phone from using a simple GraphQL API.

For a more detailed overview see [docs/OVERVIEW.md](./docs/OVERVIEW.md)

## Status

Currently, there is no mobile app that can be used with this API but, an android application
is in the works. However, you can still test out the server.

## Usage

Send a message using a simple graphql mutation

```graphql
mutation {
  sendMessage(
    data: { phone: { num: "1234567890", country: 91 }, text: "Hello" }
  ) {
    id
  }
}
```

successful response

```js
{
  "data": {
    "sendMessage": {
      "id": "9"
    }
  }
}
```

More details on usage

- [Mailer API](./docs/MAILER_API.md)

## Develop

### Requirements

- `docker`
- `docker-compose`
- `yarn`

### Docker setup

To develop locally you need to install `docker` and `docker-compose`. Then make sure docker daemon is running to enable docker daemon.

**Linux:**

```
sudo systemctl start docker
```

Look up instruction for your OS. You need to do it only once after every reboot.

### Development server

Run the command below to start development server

```
yarn develop
```

This will start a development server at `http://localhost:3000`.

On changes to code in `src` directory the nodemon will restart your server with changes.

### Experience

- To access mailer API go to `http://localhost:3000/mailer`
- To access carrier API go to `http://localhost:3000/carrier`

This will open a **GraphQL Playground** instance where you can test and perfect your `querys and mutations`.
