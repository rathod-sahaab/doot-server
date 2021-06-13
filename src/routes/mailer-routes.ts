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
    res.status(400).json({
      error: "No username field in request.",
    });
  }

  const dbConnection = getConnection();
  const repository = dbConnection.getRepository(Mailer);

  let existingMailer: Mailer | undefined;
  try {
    // where username = :username or email = :email
    existingMailer = await repository.findOne({
      where: [{ username: data.username }],
    });
  } catch (err) {
    res.sendStatus(500);
  }

  if (existingMailer) {
    res.statusCode = 400;

    if (existingMailer.username === data.username) {
      res.json({ error: "Username already taken" });
    }
  }

  const mailer = new Mailer();
  mailer.username = data.username;

  try {
    const savedMailer = await dbConnection.manager.save(mailer);
    res.status(200).json({ id: savedMailer.id });
  } catch (err) {
    res.sendStatus(500);
  }
});

mailerRoutes.post("/message", async (req, res) => {
  const data = req.body as SendMessageData;

  if (
    !data.phone ||
    !data.phone.num ||
    !data.phone.country ||
    !data.text ||
    !data.mailerId
  ) {
    res.sendStatus(400);
    return;
  }

  const dbConnection = getConnection();
  const mailerRepository = dbConnection.getRepository(Mailer);

  let mailer = await mailerRepository.findOne(data.mailerId);
  if (!mailer) {
    res.status(400).json({ error: "Mailer with given 'id' doesn't exist" });
    return;
  }

  const message = new Message();
  message.phone = new Phone();

  message.phone.num = data.phone.num;
  message.phone.country = data.phone.country;
  message.text = data.text;
  message.mailer = mailer;

  try {
    const createdMessage = await dbConnection.manager.save(message);
    res.status(200).json({
      id: createdMessage.id,
      phone: createdMessage.phone,
      text: createdMessage.text,
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

mailerRoutes.post("/broadcast", async (req, res) => {
  const data = req.body as BroadcastMessage;

  if (!data.mailerId || !data.phones || !data.text) {
    res.status(400).json({
      error: "Missing field(s)",
    });
  }

  const dbConnection = getConnection();
  const mailerRepository = dbConnection.getRepository(Mailer);

  let mailer = await mailerRepository.findOne(data.mailerId);
  if (!mailer) {
    res.status(400).json({ error: "Mailer with given 'id' doesn't exist" });
    return;
  }

  const text = data.text;

  data.phones.map(async (phone: Phone) => {
    const message = new Message();

    message.phone = new Phone();
    message.phone.num = phone.num;
    message.phone.country = phone.country;

    message.text = text;

    try {
      await dbConnection.manager.save(message);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  res.json({
    success: true,
    data: data,
  });
});

export default mailerRoutes;
