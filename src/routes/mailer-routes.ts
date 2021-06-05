import { Router } from "express";
import { getConnection } from "typeorm";
import { Message } from "../entity/Message";
import { Phone } from "../entity/Phone";
import { BroadcastMessage, SendMessageData } from "../models/MailerTypes";

const mailerRoutes = Router();

mailerRoutes.post("/message", async (req, res) => {
  const data = req.body as SendMessageData;

  if (!data.phone || !data.phone.num || !data.phone.country || !data.text) {
    res.statusCode = 400;
    res.end();
  }

  const dbConnection = getConnection();

  const message = new Message();
  message.phone = new Phone();

  message.phone.num = data.phone.num;
  message.phone.country = data.phone.country;
  message.text = data.text;

  await dbConnection.manager.save(message);

  res.statusCode = 200;
  res.json({
    success: true,
    data: data,
  });
});

mailerRoutes.post("/broadcast", async (req, res) => {
  const data = req.body as BroadcastMessage;

  const dbConnection = getConnection();

  const text = data.text;

  data.phones.map(async (phone: Phone) => {
    const message = new Message();

    data.phones as Phone[];
    message.phone = new Phone();

    message.phone.num = phone.num;
    message.phone.country = phone.country;

    message.text = text;

    await dbConnection.manager.save(message);
  });

  res.json({
    success: true,
    data: data,
  });
});

export default mailerRoutes;
