import Phone from "./Phone";

export class MailerRegisterData {
  username: string;
}

export class BroadcastMessage {
  phones: Phone[];
  text: string;
}

export class SendMessageData {
  phone: Phone;
  text: string;
}
