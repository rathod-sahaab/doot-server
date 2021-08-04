import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";

import { createConnection } from "typeorm";
import { Carrier, CarrierMailer, Mailer, Message } from "./entity";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import {
  MailerCrudResolver,
  MailerMessagesResolver,
  MailerRelationsResolver,
} from "./resolvers/mailer";
import {
  CarrierCrudResolver,
  CarrierRelationsResolver,
  CarrierMessagesResolver,
} from "./resolvers/carrier";
import { formatApolloError } from "./utils/functions/formatApolloError";
import { mailerJwtMiddleware } from "./middlewares/mailerJwt.middleware";
import { carrierJwtMiddleware } from "./middlewares/carrierJwt.middleware";

const app = express();

async function main() {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [Carrier, CarrierMailer, Mailer, Message],
  });

  const mailerGraphqlSchema = await buildSchema({
    resolvers: [
      MailerCrudResolver,
      MailerMessagesResolver,
      MailerRelationsResolver,
    ],
  });
  const carrierGraphqlSchema = await buildSchema({
    resolvers: [
      CarrierCrudResolver,
      CarrierRelationsResolver,
      CarrierMessagesResolver,
    ],
  });

  const mailerApolloServer = new ApolloServer({
    schema: mailerGraphqlSchema,
    formatError: formatApolloError,
    context: ({ req, res }: any) => ({
      req,
      res,
    }),
  });
  const carrierApolloServer = new ApolloServer({
    schema: carrierGraphqlSchema,
    formatError: formatApolloError,
    context: ({ req, res }: any) => ({
      req,
      res,
    }),
  });

  app.use(express.json());
  app.use(cookieParser());

  app.use("/mailer", mailerJwtMiddleware);
  app.use("/carrier", carrierJwtMiddleware);

  mailerApolloServer.applyMiddleware({ app, path: "/mailer" });
  carrierApolloServer.applyMiddleware({ app, path: "/carrier" });

  app.get("/", (_, res) => res.send("Hello! from typescript server!"));

  const PORT = process.env.SEVER_PORT || 3000;
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
}

main();
