import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";

import { createConnection } from "typeorm";
import { Carrier, CarrierMailer, Mailer, Message } from "./entity";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { MailerCrudResolver, MailerMessagesResolver } from "./resolvers/mailer";
import { CarrierCrudResolver } from "./resolvers/carrier";
import { formatApolloError } from "./utils/functions/formatApolloError";
import { JwtPayload, verify } from "jsonwebtoken";

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
    resolvers: [MailerCrudResolver, MailerMessagesResolver],
  });
  const graphqlCarrierSchema = await buildSchema({
    resolvers: [CarrierCrudResolver],
  });

  const apolloMailerServer = new ApolloServer({
    schema: graphqlMailerSchema,
    formatError: formatApolloError,
    context: ({ req, res }: any) => ({
      req,
      res,
    }),
  });
  const apolloCarrierServer = new ApolloServer({
    schema: graphqlCarrierSchema,
    formatError: formatApolloError,
  });

  app.use(express.json());
  app.use(cookieParser());

  app.use((req, _, next) => {
    const accessToken = req.cookies["access-token"];
    try {
      const data = verify(accessToken, process.env.MAILER_ACCESS_JWT_KEY!);
      (req as any).mailerId = (data as JwtPayload).mailerId;
    } catch {}
    next();
  });

  app.get("/", (_, res) => res.send("Hello! from typescript server!"));

  apolloMailerServer.applyMiddleware({ app, path: "/mailer" });
  apolloCarrierServer.applyMiddleware({ app, path: "/carrier" });

  const PORT = process.env.SEVER_PORT || 3000;
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
}

main();
