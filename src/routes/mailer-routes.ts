import { Router } from "express";
import { getConnection } from "typeorm";
import { Message } from "../entity/Message";
import { Phone } from "../entity/embed/Phone";
import {
  BroadcastMessage,
  MailerRegisterData,
  SendMessageData,
} from "../models/MailerTypes";
import { Mailer } from "../entity/Mailers";

const mailerRoutes = Router();

mailerRoutes.post("/", async (req, res) => {
  const data = req.body as MailerRegisterData;
  if (!data.username) {
    res.statusCode = 400;
    res.json({
      error: "No username field in request.",
    });
  }

  const dbConnection = getConnection();
  const repository = dbConnection.getRepository(Mailer);

  try {
    // where username = :username or email = :email
    const existingMailer = await repository.findOne({
      where: [{ username: data.username }],
    });

    if (existingMailer) {
      res.statusCode = 400;

      if (existingMailer.username === data.username) {
        res.json({ error: "Username already taken" });
      }
      // TODO: Add email
    }
  } catch (err) {
    res.sendStatus(500);
  }

  const mailer = new Mailer();
  mailer.username = data.username;

  try {
    await dbConnection.manager.save(mailer);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

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
