import Phone from "./Phone";

export class MailerRegisterData {
  username: string;
}

export class BroadcastMessage {
  mailerId: number;
  phones: Phone[];
  text: string;
}

export class SendMessageData {
  mailerId: number;
  phone: Phone;
  text: string;
}
