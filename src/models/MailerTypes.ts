import Phone from "./Phone";

export class MailerRegisterData {
  username: string;
  email: string;
  password: string;
}

export class BroadcastMessage {
  phones: Phone[];
  text: string;
}

export class SendMessageData {
  phone: Phone;
  text: string;
}
