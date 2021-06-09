# Doot SMS server

This server enables you to send SMS through your phone from using a simple REST API.

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
