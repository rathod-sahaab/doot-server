import "reflect-metadata";
import express from "express";

import { createConnection } from "typeorm";
import { Mailer } from "./entity/Mailers";
import { Carrier } from "./entity/Carrier";
import { Message } from "./entity/Message";
// import mailerRoutes from "./routes/mailer-routes";
// import carrierRoutes from "./routes/carrier-routes";
import { CarrierMailer } from "./entity/CarrierMailer";
import { Query, Resolver, buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";

const app = express();

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello World!";
  }
}

async function main() {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [Carrier, CarrierMailer, Mailer, Message],
  });

  const graphqlSchema = await buildSchema({ resolvers: [HelloResolver] });
  const apolloServer = new ApolloServer({ schema: graphqlSchema });

  const PORT = process.env.SEVER_PORT || 3000;
  app.use(express.json());

  app.get("/", (_, res) => res.send("Hello! from typescript server!"));

  // app.use("/mailer", mailerRoutes);
  // app.use("/carrier", carrierRoutes);
  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
}

main();
