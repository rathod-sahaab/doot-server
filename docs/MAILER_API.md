# MAILER API

This is meant to be used by sender, generaly servers to send SMS using your phone(s).

## Message related

### Send a Message

```graphql
mutation {
  sendMessage(
    data: { phone: { num: "1234567890", country: 91 }, text: "Hello" }
  ) {
    id
  }
}
```

### Send Broadcast Message

Send same message to multiple phones

```graphql
mutation {
  broadcast(
    data : {
      text: "This is an emergency alert!",
      phones: [
        {
          num: "1234567890",
          country: 91
        },
        {
          num: "9876543210",
          country: 91
        },
        {
          num: "1357908642",
          country: 91
        },
      ]
    }
  ) {
    id
  }
}
```

### Send Batch Messages

Works like `sendMessage` but is used to avoid many network calls if multiple numbers have to be messaged different messages.

```graphql
mutation {
  batchMessages(
    data: {
      messages: [
        { phone: { num: "1234567890", country: 91 }, text: "Hello A!" }
        { phone: { num: "7890123456", country: 91 }, text: "Hi B!" }
        { phone: { num: "1789023456", country: 91 }, text: "Hola C!" }
      ]
    }
  ) {
    id
  }
}
```


## Account/Authentication

### Register
```graphql
mutation {
  register(
    data: {
      username: "username",
      email: "email@email.com",
      password: "password"
    }
  ) {
    id
    username
    email
  }
}
```

### Login

```graphql
mutation {
  login(data: { username: "rathod", password: "rathod" }) {
    id
    username
    email
  }
}
```

### Me

```graphql
query {
  me {
    id
    username
  }
}
```

### Logout

```graphql
mutation {
  logout
}
```

### Invalidate tokens / change password

```graphql
mutation {
  invalidateTokens
}
```
