import "reflect-metadata";
import express from "express";

import { createConnection } from "typeorm";
import { Mailer } from "./entity/Mailers";
import { Carrier } from "./entity/Carrier";
import { Message } from "./entity/Message";
import mailerRoutes from "./routes/mailer-routes";
import carrierRoutes from "./routes/carrier-routes";

const app = express();

async function main() {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [Mailer, Carrier, Message],
  });

  app.use(express.json());

  app.get("/", (_, res) => res.send("Hello! from typescript server!"));

  app.use("/mailer", mailerRoutes);
  app.use("/carrier", carrierRoutes);

  const PORT = process.env.SEVER_PORT || 3000;
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
}

main();
