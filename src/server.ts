import "reflect-metadata";
import express from "express";

import { createConnection } from "typeorm";
// import mailerRoutes from "./routes/mailer-routes";
// import carrierRoutes from "./routes/carrier-routes";
import { Carrier, CarrierMailer, Mailer, Message } from "./entity";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { MailerCrudResolver } from "./resolvers/mailer";
import { CarrierCrudResolver } from "./resolvers/carrier";

const app = express();

async function main() {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [Carrier, CarrierMailer, Mailer, Message],
  });

  const graphqlMailerSchema = await buildSchema({
    resolvers: [MailerCrudResolver],
  });
  const graphqlCarrierSchema = await buildSchema({
    resolvers: [CarrierCrudResolver],
  });

  const apolloMailerServer = new ApolloServer({ schema: graphqlMailerSchema });
  const apolloCarrierServer = new ApolloServer({
    schema: graphqlCarrierSchema,
  });

  const PORT = process.env.SEVER_PORT || 3000;
  app.use(express.json());

  app.get("/", (_, res) => res.send("Hello! from typescript server!"));

  // app.use("/mailer", mailerRoutes);
  // app.use("/carrier", carrierRoutes);

  apolloMailerServer.applyMiddleware({ app, path: "/mailer" });
  apolloCarrierServer.applyMiddleware({ app, path: "/carrier" });

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
}

main();
