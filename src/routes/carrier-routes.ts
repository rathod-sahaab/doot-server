import { Router } from "express";
import { getConnection } from "typeorm";
import { Message } from "../entity/Message";
import { SentMessagesData } from "../models/MessageID.model";
const carrierRoutes = Router();

carrierRoutes.get("/messages", async (_, res) => {
  const dbConnection = getConnection();

  const unsentMessages = (
    await dbConnection.getRepository(Message).find()
  ).filter((message) => message.sent == false);

  res.json({
    success: true,
    messages: unsentMessages,
  });
});

carrierRoutes.put("/sent", async (req, res) => {
  const data = req.body as SentMessagesData;

  const dbConnection = getConnection();
  const repository = dbConnection.getRepository(Message);

  const unsentMessages = await repository.findByIds(data.ids, { sent: false });
  unsentMessages.map(async (message) => {
    message.sent = true;
    await repository.save(message);
  });

  res.statusCode = 200;
  res.end();
});

export default carrierRoutes;
