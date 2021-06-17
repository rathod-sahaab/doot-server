import { Router } from "express";
import { getConnection } from "typeorm";
import { Carrier } from "../entity/Carrier";
import { CarrierMailer, CarrierMailerRelation } from "../entity/CarrierMailer";
import { Mailer } from "../entity/Mailers";
import { Message } from "../entity/Message";

const carrierRoutes = Router();

export class CarrierRegisterData {
  username: string;
}
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

export class CarrierAddMailerData {
  id: number;
  mailerUsername: string;
}
carrierRoutes.put("/mailer", async (req, res) => {
  const data = req.body as CarrierAddMailerData;

  if (!data.mailerUsername || !data.id) {
    res.sendStatus(400);
    return;
  }

  const mailer = await Mailer.findOne({
    username: data.mailerUsername,
  });

  if (!mailer) {
    res.sendStatus(400);
    return;
  }
  const carrier = await Carrier.findOne({ id: data.id });
  if (!carrier) {
    res.sendStatus(400);
    return;
  }

  try {
    const createdConnection = await CarrierMailer.create({
      carrierId: carrier.id,
      mailerId: mailer.id,
      relationStatus: CarrierMailerRelation.REQUEST_BY_CARRIER,
    }).save();
    res
      .status(200)
      .json({
        carrierId: createdConnection.carrierId,
        mailerId: createdConnection.mailerId,
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

class GetMessagesData {
  id: number;
}
carrierRoutes.get("/messages", async (req, res) => {
  const data = req.body as GetMessagesData;
  if (!data.id) {
    res.sendStatus(400);
    return;
  }

  res.json({
    success: true,
    messages: [],
  });
});

export class SentMessagesData {
  ids: number[];
}
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
