import { Router } from "express";
import { getConnection } from "typeorm";
import { Carrier } from "../entity/Carrier";
import { Message } from "../entity/Message";
import { CarrierRegisterData } from "../models/CarrierTypes";
import { SentMessagesData } from "../models/MessageID.model";
const carrierRoutes = Router();

carrierRoutes.post("/", async (req, res) => {
  const data = req.body as CarrierRegisterData;
  if (!data.username) {
    res.status(400).json({
      error: "No username field in request.",
    });
  }

  const dbConnection = getConnection();
  const repository = dbConnection.getRepository(Carrier);

  let existingCarrier: Carrier | undefined;
  try {
    // where username = :username or email = :email
    existingCarrier = await repository.findOne({
      where: [{ username: data.username }],
    });
  } catch (err) {
    res.sendStatus(500);
  }

  if (existingCarrier) {
    res.statusCode = 400;

    if (existingCarrier.username === data.username) {
      res.json({ error: "Username already taken" });
    }
  }

  const carrier = new Carrier();
  carrier.username = data.username;

  try {
    const savedCarrier = await dbConnection.manager.save(carrier);
    res.status(200).json({ id: savedCarrier.id });
  } catch (err) {
    res.sendStatus(500);
  }
});

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
